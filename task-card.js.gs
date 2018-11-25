// Card showing summary of Phabricator task info

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
  
  section.addWidget(CardService.newTextParagraph()
                       .setText(linkHtml));

  var buttonSet = CardService.newButtonSet();
  var commentButton = CardService.newTextButton()
     .setText("Comment")
     .setOnClickAction(CardService.newAction()
                       .setFunctionName("handleCommentClicked")
                       .setParameters({"taskId": this.taskId}));
  buttonSet.addButton(commentButton);
  
  section.addWidget(buttonSet);
  
  card.addSection(section);
  return card.build();
}

//
// Event handling
//

function handleCommentClicked(event) {
  var taskId = event.parameters["taskId"];
  var commentCard = new CommentCard(taskId);

  var nav = CardService.newNavigation().pushCard(commentCard.build());
  return CardService.newActionResponseBuilder()
      .setNavigation(nav)
      .build();  
}