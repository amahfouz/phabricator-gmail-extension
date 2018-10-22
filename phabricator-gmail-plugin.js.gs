var PHAB_URL_PROPERTY_KEY="phab_url_key";
var ACCESS_TOKEN_PROPERTY_KEY="access_token_key";

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

function buildConnectionCard() {
  var card = CardService.newCardBuilder();
  var header = CardService.newCardHeader();

  card.setHeader(header.setTitle("Connect to Phabricator"));

  var section = CardService.newCardSection();
  section.addWidget
      (CardService.newTextParagraph().setText
       ("Enter <b>URL</b> for your Phabricator server and"
        + " the <b>API token</b> to use when talking to it"));
  
  var phabAddress = CardService.newTextInput()
    .setFieldName(PHAB_URL_PROPERTY_KEY)
    .setTitle("Phabricator URL")
    .setHint("https://phabricator.example.com");  

  phabAddress.setOnChangeAction(CardService.newAction()
        .setFunctionName("handlePhabUrlChanged"));
  
  section.addWidget(phabAddress);
  
  var accessToken = CardService.newTextInput()
    .setFieldName(ACCESS_TOKEN_PROPERTY_KEY)
    .setTitle("API Access Token")
    .setHint("api-fdlbq35nted63kbcxr2wq26bxfvo");    
  
  section.addWidget(accessToken);
  
  card.addSection(section);
  return card.build();
}

// See https://developers.google.com/gmail/add-ons/concepts/actions#action_event_objects
function handlePhabUrlChanged(event) {
  var phabUrlTextValue = event.formInput[PHAB_URL_PROPERTY_KEY];
  Logger.log(phabUrlTextValue);
  PropertiesService.getScriptProperties()
     .setProperty(PHAB_URL_PROPERTY_KEY, phabUrlTextValue);
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
    'task_id'  : taskId
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
