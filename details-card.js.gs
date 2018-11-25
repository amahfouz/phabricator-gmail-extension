function DetailsCard(taskId) {
  this.taskId = taskId;
}

DetailsCard.prototype.build = function() {
  var card = CardService.newCardBuilder();
  var headerText = this.taskId + " details";
  card.setHeader(CardService.newCardHeader().setTitle(headerText));

  var section = CardService.newCardSection();
  
  var author = CardService.newKeyValue()
     .setTopLabel("Author")
     .setContent("dd@webalo.com");
  
  section.addWidget(author);
  
  card.addSection(section);
  return card.build();
  
}
