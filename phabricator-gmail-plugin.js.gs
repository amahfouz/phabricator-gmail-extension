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
    // message metadata to be read.
    var accessToken = e.messageMetadata.accessToken;
    GmailApp.setCurrentMessageAccessToken(accessToken);

    var messageId = e.messageMetadata.messageId;
    var message = GmailApp.getMessageById(messageId);
    var subject = message.getSubject();
    var sender = message.getFrom();
  
    var body = message.getBody();
    var tasks = body.match(/T\d\d\d+/g);

    Logger.log(tasks);
   
    // check if there are any Phabricator task references
    if (tasks ==null || tasks.length == 0)
      return null;
  
    var cards = []
    
    tasks.forEach(function(taskId) {
      cards.push(buildTaskCard(taskId));
    });
    return cards;
}


/**
 *  Builds a card to display information about a Phabricator task.
 *
 *  @param {String} taskId task ID in the form of Tnnnn
 *  @return {Card} a card that displays thread information.
 */
function buildTaskCard(taskId) {
  var card = CardService.newCardBuilder();
  card.setHeader(CardService.newCardHeader().setTitle(taskId));

  var section = CardService.newCardSection();
  section.addWidget(CardService.newTextParagraph().setText(getTaskInfo(taskId)));

  card.addSection(section);
  return card.build();
}

/**
 * Queries Phabricator for the specified task.
 */
function getTaskInfo(taskId) {
  var token = "api-fdlbq45nred63kacxr2wq26bxfoo";
//  var url = "https://team.webalo.net/api/maniphest.info"
//  + " -d api.token=" + token
//  + " -d task_id=1838";
  
  var url = "https://team.webalo.net/api/maniphest.info"
  var formData = {
    'api.token': token,
    'task_id'  : '1838'
  };
  var options = {
    'method' : 'post',
    'payload' : formData
  };
  var response = UrlFetchApp.fetch(url, options);
  Logger.log(response.getContentText());
  var json = JSON.parse(response.getContentText());
  
  return json.result.title;
}
