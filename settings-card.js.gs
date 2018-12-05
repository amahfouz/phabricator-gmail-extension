var PHAB_URL_PROPERTY_KEY="phab_url_key";
var ACCESS_TOKEN_PROPERTY_KEY="access_token_key";

/**
 * Creates the card for setting the URL and API
 * access token to connect to Phabricator.
 */
function buildConnectionCard() {
  var card = CardService.newCardBuilder();
  var header = CardService.newCardHeader();
  header.setImageUrl("https://www.gstatic.com/images/icons/material/system/2x/settings_black_24dp.png")
  card.setHeader(header.setTitle("Connect to Phabricator"));

  var section = CardService.newCardSection();
  section.addWidget
      (CardService.newTextParagraph().setText
       ("Enter <b>URL</b> for your Phabricator server and"
        + " the <b>API token</b> to use when talking to it"));
  
  // Phabricator base URL
  
  var phabAddress = CardService.newTextInput()
    .setFieldName(PHAB_URL_PROPERTY_KEY)
    .setTitle("Phabricator URL")
    .setHint("https://phabricator.example.com");  
  
  var curPhabUrl = getPhabBaseUrl();
  if (curPhabUrl)
    phabAddress.setValue(curPhabUrl);

  phabAddress.setOnChangeAction(CardService.newAction()
        .setFunctionName("handlePhabUrlChanged"));
  
  section.addWidget(phabAddress);
  
  // Phabricator API access token
  
  var accessToken = CardService.newTextInput()
    .setFieldName(ACCESS_TOKEN_PROPERTY_KEY)
    .setTitle("API Access Token")
    .setHint("api-fdlbq35nted63kbcxr2wq26bxfvo"); 
  
  var curTokenValue = getPhabApiToken();
  if (curTokenValue)
    accessToken.setValue(curTokenValue);
  
  accessToken.setOnChangeAction(CardService.newAction()
        .setFunctionName("handleAccessTokenChanged"));
  
  section.addWidget(accessToken);

  // Button  
 
  var testConnectionButton = CardService.newTextButton()
      .setText("Test Connection")
      .setOnClickAction(CardService.newAction()
                        .setFunctionName("handleTestConnection"));
  
  section.addWidget(CardService.newButtonSet()
                      .addButton(testConnectionButton));
  
  card.addSection(section);
  return card.build();
}

function getPhabBaseUrl() {
  return PropertiesService.getScriptProperties()
     .getProperty(PHAB_URL_PROPERTY_KEY);  
}

function getPhabApiToken() {
  return PropertiesService.getScriptProperties()
     .getProperty(ACCESS_TOKEN_PROPERTY_KEY);
}

//
// Event handlers
// 
// See https://developers.google.com/gmail/add-ons/concepts/actions#action_event_objects
//

/**
 * Handle the change in each of the setting textboxes.
 */
function handlePhabUrlChanged(event) {
  var phabUrlTextValue = event.formInput[PHAB_URL_PROPERTY_KEY];
  Logger.log(phabUrlTextValue);
  PropertiesService.getScriptProperties()
     .setProperty(PHAB_URL_PROPERTY_KEY, phabUrlTextValue);
}

function handleAccessTokenChanged(event) {
  var accessTokenTextValue = event.formInput[ACCESS_TOKEN_PROPERTY_KEY];
  PropertiesService.getScriptProperties()
      .setProperty(ACCESS_TOKEN_PROPERTY_KEY, accessTokenTextValue);
}

function handleTestConnection(event) {
  var err = testConnection();  
  var notificationType;
  var textMessage;
  
  if (err) {
    notificationType = CardService.NotificationType.WARNING;
    textMessage = "Connection failed: " + err;
  }
  else {
    notificationType = CardService.NotificationType.INFO;
    textMessage = "Connection succeeded!";
  }
        
  return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
          .setType(notificationType)
          .setText(textMessage))
      .build();
}

//
// Universal actions
//

/**
 * Handler of universal action as specified in the manifest.
 */
function setupConnectionUniversalHandler() {
   return CardService.newUniversalActionResponseBuilder()
       .displayAddOnCards([buildConnectionCard()])
       .build();
}