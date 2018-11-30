/**
 * Shows details of the specified task.
 */
function DetailsCard(taskId) {
  this.taskId = taskId;     
  this.taskInfo = getTaskInfo(this.taskId.slice(1));  
}

DetailsCard.prototype.getProjectsAsStr = function() {
  var projectIds = this.taskInfo.projectPHIDs;
  if (! projectIds || projectIds.length == 0)
    return [];

  var projects = getProjects(projectIds);
  var projectNames = [];
  for (i = 0; i < projectIds.length; i++) {
    projectNames.push(projects.data[projectIds[i]]["name"]);
  }
  var projectNameString = "";
  for (i = 0; i < projectNames.length; i++) {
    projectNameString += projectNames[i] + " ";
  }
  return projectNameString;
}
                                         
DetailsCard.prototype.build = function() {
  var card = CardService.newCardBuilder();
  var headerText = this.taskId + " details";
  card.setHeader(CardService.newCardHeader().setTitle(headerText));

  var section = CardService.newCardSection();
  
  var title = CardService.newKeyValue()
     .setTopLabel("Title")
     .setContent(this.taskInfo.title)
     .setMultiline(true);
  section.addWidget(title);
  
  var author = CardService.newKeyValue()
     .setTopLabel("Author")
     .setContent("dd@webalo.com");
  section.addWidget(author);
  
  var projects = CardService.newKeyValue()
     .setTopLabel("Projects")
     .setContent(this.getProjectsAsStr());
  section.addWidget(projects);
  
  card.addSection(section);
  return card.build();  
}
