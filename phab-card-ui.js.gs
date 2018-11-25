// Entry point

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
    
    var tasks = findTaskRefs(message);
  
    var includeTaskTitleInCardTitle = tasks.length > 1;
 
    var cards = [];
    tasks.forEach(function(taskId) {
      var taskCard = new TaskCard(taskId, includeTaskTitleInCardTitle);
      cards.push(taskCard.build());
    });
    return cards;
}

//
// Matches task IDs in the email subject and body 
//

function findTaskRefs(message) {
    var subject = message.getSubject();
  
    Logger.log(subject);
  
    var body = message.getBody();
    var taskIdPattern = /T\d\d\d+/g;
  
    var allBodyTasks = body.match(taskIdPattern);      
    var allSubjectTasks = subject.match(taskIdPattern);

    var allTasks = [];
    if (allBodyTasks)
       allTasks = allTasks.concat(allBodyTasks);
    if (allSubjectTasks)
       allTasks = allTasks.concat(allSubjectTasks);
  
    Logger.log(allTasks);
   
    // check if there are any Phabricator task references
    if (allTasks == null || allTasks.length == 0)
      return [];
  
    // remove duplicates
    var tasksNoDup = [];
    allTasks.forEach(function(item) {
       if (tasksNoDup.indexOf(item) < 0) {
           tasksNoDup.push(item);
       }
    });
   
    return tasksNoDup;
}
