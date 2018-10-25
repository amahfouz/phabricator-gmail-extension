
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
  if (! connectionWasEstablished()) {
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
    var allTasks = body.match(/T\d\d\d+/g);

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
  
    var cards = []
    
    tasks.forEach(function(taskId) {
      cards.push(buildTaskCard(taskId));
    });
    return cards;
}

function connectionWasEstablished() {
  return PropertiesService.getScriptProperties()
     .getProperty(PHAB_URL_PROPERTY_KEY);
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
  section.addWidget(CardService.newTextParagraph()
                       .setText(getTaskInfo(taskId.slice(1))));

  card.addSection(section);
  return card.build();
}