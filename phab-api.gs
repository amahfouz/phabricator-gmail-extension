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
    'objectIdentifier' : taskId,
    'transactions' : [ { 'type' : 'comment', 'value' : 'Gmail' } ]
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

  // add the api token to the form fields
  //formData['api.token'] = token;
  
  var options = {
    'method' : 'post',
    'payload' : formData,
  };  
  
  var request = UrlFetchApp.getRequest(url, options);
  for (i in request) {
    Logger.log(i + ": " + request[i]);
    if (i == "headers") {
      headers = request[i];
      for (h in headers) {
        Logger.log("Header " + h + ":" + headers[h]);
      }
    }
  }

  var temp = UrlFetchApp.fetch("http://httpbin.org/post", options);
  Logger.log(temp.getContentText());
  
  var response = UrlFetchApp.fetch(url, options);
    
  return JSON.parse(response.getContentText());
}
