const config = {
  appid: '251026338642047',
  secret: 'a21a9422f2a77ee5a85c85db5e192d87',
  token: 'EAADkTpZBZBeH8BAEV7zpeT5gUeSuOhM6Igno58JIpcVmONvbNSc7Rdo0ZAIrkQmJz4fDXJX90uZAFPKqb6mdyKElkO5uEqKfeH2FD85ZBAk3QLfLCxAcAOWZCMVHnKeBsrlJSTqouVhWkMfh40M88ajKqJS4fy6G9fkwR20VEiRgZDZD',
  recast_token: '2890ac94f377ae50d598d4720786cd07',
}

module.exports = config;


curl -X POST -H "Content-Type: application/json" -d '{
  "setting_type":"call_to_actions",
  "thread_state":"new_thread",
  "call_to_actions":[
    {
      "payload":"new_user"
    }
  ]
}' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAADkTpZBZBeH8BAEV7zpeT5gUeSuOhM6Igno58JIpcVmONvbNSc7Rdo0ZAIrkQmJz4fDXJX90uZAFPKqb6mdyKElkO5uEqKfeH2FD85ZBAk3QLfLCxAcAOWZCMVHnKeBsrlJSTqouVhWkMfh40M88ajKqJS4fy6G9fkwR20VEiRgZDZD"