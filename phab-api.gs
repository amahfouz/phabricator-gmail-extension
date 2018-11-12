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
    'api.token': PropertiesService.getScriptProperties().getProperty(ACCESS_TOKEN_PROPERTY_KEY),
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
    'api.token': PropertiesService.getScriptProperties().getProperty(ACCESS_TOKEN_PROPERTY_KEY),
    'transactions' : [ { 'type':'comment','value': commentText } ],
    'objectIdentifier' : taskId
  };

  doPost('maniphest.edit', JSON.stringify(formData));
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

  //formData['api.token'] = token;
  
  var options = {
    'method' : 'post',
    'muteHttpExceptions' : true,
    'payload' : formData
  };  
  
  var request = UrlFetchApp.getRequest(url, options);
  for (i in request)
     Logger.log(i + ": " + request[i]);
  
  var response = UrlFetchApp.fetch(url, options);
  Logger.log(response.getContentText());
  return JSON.parse(response.getContentText());
}
