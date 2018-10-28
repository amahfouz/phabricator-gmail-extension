//
// Util functions
// 

function buildError(message) {
  return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
          .setType(CardService.NotificationType.ERROR)
          .setText(message))
      .build();    
}

function buildWarning(message) {
  return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
          .setType(CardService.NotificationType.WARN)
          .setText(message))
      .build();    
}