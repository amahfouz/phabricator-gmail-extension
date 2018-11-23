var COMMENT_INPUT_FORM_KEY = "comment_input_key";

/**
 * Returns the array of cards that should be rendered for the current
 * e-mail thread. The name of this function is specified in the
 * manifest 'onTriggerFunction' field, indicating that this function
 * runs every time the add-on is started.
 *
 * @param {Object} e data provided by the Gmail UI.
 * @return {Card[]}
 */
function buildAddOn(e) {
  
    Logger.log("Add-on invoked.");
  
    // if no connection has been established before then prompt
    // the user to configure the connection to Phabricator  
    if (! getPhabBaseUrl()) {
       return buildConnectionCard();
    }
  
    // message metadata to be read.
    var accessToken = e.messageMetadata.accessToken;
    GmailApp.setCurrentMessageAccessToken(accessToken);

    var messageId = e.messageMetadata.messageId;
    var message = GmailApp.getMessageById(messageId);
    var subject = message.getSubject();
    var sender = message.getFrom();
  
    var body = message.getBody();
    var taskIdPattern = /T\d\d\d+/g;
  
    var allBodyTasks = body.match(taskIdPattern);      
    var allSubjectTasks = subject.match(taskIdPattern);

    var allTasks = allBodyTasks.concat(allSubjectTasks);
  
    Logger.log(allTasks);
   
    // check if there are any Phabricator task references
    if (allTasks ==null || allTasks.length == 0)
      return [];
  
    // remove duplicates
    var tasks = [];
    allTasks.forEach(function(item) {
       if (tasks.indexOf(item) < 0) {
           tasks.push(item);
       }
    });
    
    var includeTaskTitleInCardTitle = tasks.length > 1;
 
    var cards = [];
    tasks.forEach(function(taskId) {
      cards.push(buildTaskCard(taskId, includeTaskTitleInCardTitle));
    });
    return cards;
}

/**
 *  Builds a card to display information about a Phabricator task.
 *
 *  @param {String} taskId task ID in the form of Tnnnn
 *  @return {Card} a card that displays thread information.
 */
function buildTaskCard(taskId, includeTitleInCardTitle) {
  var taskInfo = getTaskInfo(taskId.slice(1));
  
  var card = CardService.newCardBuilder();
  var titleSuffix = includeTitleInCardTitle 
      ? "- " + taskInfo.title 
      : "(" + taskInfo.statusName + ")";
  var headerText = taskId + " " + titleSuffix;
  card.setHeader(CardService.newCardHeader().setTitle(headerText));

  var section = CardService.newCardSection();
  
  var linkText = taskInfo.title;
  var linkHtml = createLinkToTask(taskId, linkText);
  section.addWidget(CardService.newTextParagraph()
                       .setText(linkHtml));

  var commentTextInput = CardService.newTextInput()
      .setFieldName(COMMENT_INPUT_FORM_KEY)
      .setTitle("Add Comment")
      .setHint("Comment to add")
      .setMultiline(true);
  
  section.addWidget(commentTextInput);

  var submitButton = CardService.newTextButton()
     .setText("Submit")
     .setOnClickAction(CardService.newAction()
                       .setFunctionName("handleSubmitClicked")
                       .setParameters({"taskId": taskId}));
  
  section.addWidget(submitButton);
  
  card.addSection(section);
  return card.build();
}

function createLinkToTask(taskId, title) {
   return "<a href='" + getPhabBaseUrl() + "/" + taskId + "'>" + title + "</a>";
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
     return buildInfo("Comment submitted successfully.");
  }
  catch (err) {
     return buildError(err);
  }
}
