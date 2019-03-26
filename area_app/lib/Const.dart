class Const {
  static int ret;
  static var Listauth;
  static String userToken;
  static int nbArea;
  static var listArea;
  static var ipAddress;
  static LogData logData;
}

class LogData {
  bool googleNotification;
  bool slackReact;
  bool slackUpload;
  bool slackMessage;

  LogData({
    this.googleNotification,
    this.slackReact,
    this.slackUpload,
    this.slackMessage,
  });

  factory LogData.fromJson(Map<String, dynamic> parsedJson){
    return LogData(
        googleNotification: parsedJson['googlenotification_trigger'],
        slackReact : parsedJson['slack_reacttrigger'],
        slackUpload : parsedJson ['slack_uploadtrigger'],
        slackMessage: parsedJson ['slack_msgtrigger']
    );
  }
}