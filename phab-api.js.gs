//
// API calls to Phabricator
//

function testConnection() {
  try {
    getTaskInfo("1");
    return null;
  }
  catch(err) {
    return err;
  }
}

/**
 * Returns info about the specified object by its PHAB ID.
 */
function getPerson(phabId) {
  var formData = {
    "phids[0]" : phabId
  }

  return doPost('phid.query', formData).result[phabId];
}

/**
 * Queries Phabricator for the specified task.
 */
function getTaskInfo(taskId) { 
  var formData = {        
    'task_id'  : taskId
  }
  return doPost('maniphest.info', formData).result;
}

/**
 * Adds a comment to the specified task.
 */
function postComment(taskId, commentText) {
  var formData = {
    "objectIdentifier" : taskId,        
    'transactions[0][type]' : 'comment',
    'transactions[0][value]' : commentText   
  };

  doPost('maniphest.edit', formData);
}

function getProjects(projectIds) {
  var formData = {
  }
  for (i = 0; i < projectIds.length; i++) {
    var key = "phids[" + i +"]";
    formData[key] = projectIds[i];
  }
  return doPost('project.query', formData).result;
}

//
// Util
//

function doPost(relativeUrl, formData) {
  var token = PropertiesService.getScriptProperties()
     .getProperty(ACCESS_TOKEN_PROPERTY_KEY);
  var base = PropertiesService.getScriptProperties()
     .getProperty(PHAB_URL_PROPERTY_KEY);
  var url = base + '/api/' + relativeUrl;

  // add the api token to the form fields

  formData["api.token"] = token;
  
  var options = {
    'method' : 'post',
    'contentType': 'application/x-www-form-urlencoded',
    'payload' : formData,
  };  
  
//  var request = UrlFetchApp.getRequest(url, options);
  
  var response = UrlFetchApp.fetch(url, options);
  if (response.getResponseCode() != 200)
    throw "Failed to post comment. " + response.getContentText();
    
  return JSON.parse(response.getContentText());
}
