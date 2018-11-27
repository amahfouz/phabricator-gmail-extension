// Card showing summary of Phabricator task info

var SHOW_MORE_BUTTON_TEXT = "Show More";
var COMMENT_BUTTON_TEXT = "Comment";

// taskId is in the form of Tnnnn
function TaskCard(taskId, hasLongTitle) {
  this.taskId = taskId;
  this.hasLongTitle = hasLongTitle;
}

/**
 *  Builds the card.
 */
TaskCard.prototype.build = function() {
  var taskInfo = getTaskInfo(this.taskId.slice(1));
  
  var card = CardService.newCardBuilder();
  var titleSuffix = this.hasLongTitle 
      ? "- " + taskInfo.title 
      : "(" + taskInfo.statusName + ")";
  var headerText = this.taskId + " " + titleSuffix;
  card.setHeader(CardService.newCardHeader().setTitle(headerText));

  var section = CardService.newCardSection();
  
  var linkText = taskInfo.title;
  var linkHtml = "<a href='" + getPhabBaseUrl() + "/" + this.taskId + "'>" + taskInfo.title + "</a>";
  
  section.addWidget(CardService.newTextParagraph().setText(linkHtml));

  var buttonSet = CardService.newButtonSet();
  
  var commentButton = createButton(this.taskId, COMMENT_BUTTON_TEXT);
  var detailsButton = createButton(this.taskId, SHOW_MORE_BUTTON_TEXT);
        
  buttonSet.addButton(commentButton);
  buttonSet.addButton(detailsButton);  
  
  section.addWidget(buttonSet);
  
  card.addSection(section);
  return card.build();
}

//
// Event handling
//

function createButton(taskId, buttonText) {
  return CardService.newTextButton()
     .setText(buttonText)
     .setOnClickAction(CardService.newAction()
                       .setFunctionName("handleButtonClicked")
                       .setParameters({"taskId": taskId, 
                                       "buttonText": buttonText })); 
}

function handleButtonClicked(event) {
  var taskId = event.parameters["taskId"];
  var buttonText = event.parameters["buttonText"];
  
  var cardToPush = (buttonText == COMMENT_BUTTON_TEXT)
      ? new CommentCard(taskId)
      : (buttonText == SHOW_MORE_BUTTON_TEXT)
          ? new DetailsCard(taskId)
          : null;
  
  if (cardToPush == null)
     return buildWarning("Unexpected action!");

  var nav = CardService.newNavigation().pushCard(cardToPush.build());
  return CardService.newActionResponseBuilder()
      .setNavigation(nav)
      .build();  
}
