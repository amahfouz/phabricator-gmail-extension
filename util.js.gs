//
// Util functions
// 

function formatDate(event, msecsUtc) {
  var date = new Date(0);
  date.setUTCSeconds(msecsUtc);
    
  var locale = event.userLocale + "-" + event.userCountry; // e.g. "en-US"
  var timeZone = event.userTimezone.id; // e.g. "America/New_York"
  
  return date.toLocaleString(locale, {"timeZone": timeZone} );
}

function buildError(message) {
  return buildMessage(message, CardService.NotificationType.ERROR);    
}

function buildWarning(message) {
  return buildMessage(message, CardService.NotificationType.WARN);
}

function buildInfo(message) {
  return buildMessage(message, CardService.NotificationType.INFO);
}

function buildMessage(message, severity) {
  return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
          .setType(severity)
          .setText(message))
      .build();    
}