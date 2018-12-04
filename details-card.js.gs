/**
 * Shows details of the specified task.
 */
function DetailsCard(taskId) {
  this.taskId = taskId;     
  this.taskInfo = getTaskInfo(this.taskId.slice(1));  
  this.owner = getPerson(this.taskInfo.ownerPHID);
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
    projectNameString = projectNameString 
      + "<font color='" 
      +  colorNameToHex(projects.data[projectIds[i]]["color"]) 
      + "'>"
      + projectNames[i] 
      + "</font>"
      + "<br>";
  }
  return projectNameString;
}
                                         
DetailsCard.prototype.build = function() {
  var card = CardService.newCardBuilder();
  var headerText = this.taskId + " details";
  var header = CardService.newCardHeader().setTitle(headerText);
  header.setImageUrl("https://www.gstatic.com/images/icons/material/system/2x/list_alt_black_24dp.png")
  card.setHeader(header);

  var titleSection = CardService.newCardSection();
  
  var title = CardService.newKeyValue()
     .setTopLabel("Title")
     .setContent(this.taskInfo.title)
     .setMultiline(true);
  titleSection.addWidget(title);
  
  var section = CardService.newCardSection();

  var author;
  if (this.owner) {  
    var emailAction = CardService
       .newAction()
       .setFunctionName('composeEmailCallback')
       .setParameters({"to": this.owner.name, 
                       "taskId": this.taskId});
    var emailOwnerButton = CardService
       .newTextButton()
       .setText("Email")
       .setComposeAction(emailAction, 
                         CardService.ComposedEmailType.STANDALONE_DRAFT);
    
    author = CardService.newKeyValue()
       .setTopLabel("Assignee")
       .setContent(this.owner.fullName)
       .setIcon(CardService.Icon.PERSON)
       .setButton(emailOwnerButton);
  }
  else
    author = CardService.newKeyValue()
       .setTopLabel("Assignee")
       .setContent("NONE")
       .setIcon(CardService.Icon.PERSON)
      
  section.addWidget(author);
  
  var projects = CardService.newKeyValue()
     .setTopLabel("Projects")
     .setContent(this.getProjectsAsStr())
     .setMultiline(true)
     .setIcon(CardService.Icon.BOOKMARK);
  section.addWidget(projects);

  card.addSection(titleSection);  
  card.addSection(section);
  return card.build();  
}

//
// Event handling
//

function composeEmailCallback(event) {
  var recipient = event.parameters["to"] + "@webalo.com";
  var subject = "Regarding " + event.parameters["taskId"];
  var draft = GmailApp.createDraft(recipient, subject, "");
  return CardService.newComposeActionResponseBuilder()
      .setGmailDraft(draft)
      .build();
}
