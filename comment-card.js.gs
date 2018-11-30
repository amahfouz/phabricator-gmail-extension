// string key for comment form field
var COMMENT_INPUT_FORM_KEY = "comment_input_key";

//
// Class for card to add a comment
//

function CommentCard(taskId) {
  this.taskId = taskId;
  this.commentTextInput = CardService.newTextInput()
      .setFieldName(COMMENT_INPUT_FORM_KEY)
      .setTitle("Comment")
      .setMultiline(true);
}

CommentCard.prototype.build = function() {        
  var card = CardService.newCardBuilder();

  var headerText = "Add comment to " + this.taskId;
  var header = CardService.newCardHeader().setTitle(headerText);
  header.setImageUrl("https://www.gstatic.com/images/icons/material/system/2x/comment_black_24dp.png")
  header.setImageStyle(CardService.ImageStyle.SQUARE)
  card.setHeader(header);
  
  var section = CardService.newCardSection();
  section.addWidget(this.commentTextInput);

  var submitButton = CardService.newTextButton()
     .setText("Submit")
     .setOnClickAction(CardService.newAction()
                       .setFunctionName("handleSubmitClicked")
                       .setParameters({"taskId": this.taskId}));
  
  section.addWidget(submitButton);
  card.addSection(section);
  
  return card.build();
}

//
// Event handling
//

function handleSubmitClicked(event) {
  
  var comment = event.formInput[COMMENT_INPUT_FORM_KEY];
  if (! comment || comment.length == 0)
      return buildError("Comment field is empty!");
                                     
  // submit a comment
  try {
    postComment(event.parameters["taskId"], comment);
    
    var nav = CardService.newNavigation().popCard();
    return CardService.newActionResponseBuilder()
        .setNavigation(nav)
           .setNotification(CardService.newNotification()
              .setType(CardService.NotificationType.INFO)
              .setText("Comment submitted successfully."))
        .build();
  }
  catch (err) {
     return buildError(err);
  }
}

