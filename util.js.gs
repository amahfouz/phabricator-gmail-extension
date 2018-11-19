//
// Util functions
// 

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