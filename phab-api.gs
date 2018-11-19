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
 * Queries Phabricator for the specified task.
 */
function getTaskInfo(taskId) { 
  var formData = {        
    'task_id'  : taskId
  }
  var json = doPost('maniphest.info', formData);
  return json.result;
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
