// Card showing summary of Phabricator task info

var SHOW_MORE_BUTTON_TEXT = "Show More";
var COMMENT_BUTTON_TEXT = "Comment";

// taskId is in the form of Tnnnn
function TaskCard(taskId, hasLongTitle, event) {
  this.taskId = taskId;
  this.hasLongTitle = hasLongTitle;
  this.event = event;
}

/**
 *  Builds the card.
 */
TaskCard.prototype.build = function() {
  var taskInfo = getTaskInfo(this.taskId.slice(1));
  
  var card = CardService.newCardBuilder();
  var titleSuffix = this.hasLongTitle 
      ? "- " + taskInfo.title 
      : "";
  var headerText = this.taskId + " " + titleSuffix;
  var header = CardService.newCardHeader().setTitle(headerText);
  header.setImageUrl("https://www.gstatic.com/images/icons/material/system/2x/offline_bolt_black_24dp.png")    
  card.setHeader(header);

  var section = CardService.newCardSection();
  
  var linkText = taskInfo.title;
  var linkHtml = "<a href='" + getPhabBaseUrl() + "/" + this.taskId + "'>" + taskInfo.title + "</a>";
  
  section.addWidget(CardService.newTextParagraph().setText(linkHtml));
  
  var priority = taskInfo.priority;
  var status = taskInfo.statusName;
  var lastModified = taskInfo.dateModified;
  var dateCreated = taskInfo.dateCreated;

  section.addWidget(CardService.newKeyValue()
                      .setTopLabel("Status")
                      .setContent(status));
  
  section.addWidget(CardService.newKeyValue()
                      .setTopLabel("Priority")
                      .setContent(priority));

  section.addWidget(CardService.newKeyValue()
                      .setTopLabel("Created")
                      .setContent(formatDate(this.event, dateCreated)));  
  
  section.addWidget(CardService.newKeyValue()
                      .setTopLabel("Last Update")
                      .setContent(formatDate(this.event, lastModified)));  
  
  var buttonSection = CardService.newCardSection();
  
  var buttonSet = CardService.newButtonSet();
  
  var commentButton = createButton(this.taskId, COMMENT_BUTTON_TEXT);
  var detailsButton = createButton(this.taskId, SHOW_MORE_BUTTON_TEXT);
        
  buttonSet.addButton(commentButton);
  buttonSet.addButton(detailsButton);  
  
  buttonSection.addWidget(buttonSet);
  
  card.addSection(section);    
  card.addSection(buttonSection);
  
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
