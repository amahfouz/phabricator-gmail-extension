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
  var token = PropertiesService.getScriptProperties()
     .getProperty(ACCESS_TOKEN_PROPERTY_KEY);
  var base = PropertiesService.getScriptProperties()
     .getProperty(PHAB_URL_PROPERTY_KEY);
  var url = base + "api/maniphest.info"
  
  var formData = {
    'api.token': token,
    'task_id'  : taskId
  };
  var options = {
    'method' : 'post',
    'payload' : formData
  };
  var response = UrlFetchApp.fetch(url, options);
  Logger.log(response.getContentText());
  var json = JSON.parse(response.getContentText());
  
  return json.result.title;
}
