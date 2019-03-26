import 'package:area/Const.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class Post {
  //Check if server is on
  static Future<http.Response> getData(ip) async {
    http.Response response = await http.get(
      Uri.encodeFull("http://${ip}:8080/about.json"),
      headers: {
        "Accept": "application/json"
      }
    );
    return (response);
  }

  //Post function for log with services (Slack, Spotify) and login with google facebook
  static Future<http.Response> postService(service, firstname, lastname, email, userId, accessToken) async {
    var url = "http://${Const.ipAddress}:8080/log?method=${service.toString()}";
    final response = http.post(url, headers: {"Content-Type": "application/json"},
      body: json.encode({
        "firstname": "${firstname.toString()}",
        "lastname": "${lastname.toString()}",
        "email": "${email.toString()}",
        "user_id": "${userId.toString()}",
        "token": "${accessToken.toString()}"
      })
    );
    return (response);
  }

  //Post function for log with services (Slack, Spotify-> activity) and login with google facebook
  static Future<http.Response> postServiceActivity(service, accessToken, serviceToken, mail) async {
    print(service);
    var url = "http://${Const.ipAddress}:8080/service-token?service=${service.toString()}";
    print(url);
    final response = http.post(url, headers: {"Content-Type": "application/json"},
        body: json.encode({
          "googleMail": "${mail.toString()}",
          "userId": "${serviceToken.toString()}",
          "userToken": "${accessToken.toString()}",
          "token": "${Const.userToken}"
        })
    );
    return (response);
  }

  //Post function for get activate service
  static Future<http.Response> getApplet() async {
    http.Response response = await http.get(
      Uri.encodeFull("http://${Const.ipAddress}:8080/acar?params=${Const.userToken}"),
      headers: {"Accept": "application/json"},
    );
    return (response);
  }

  //Post function for login without services (Google, Facebook, or Slack)
  static Future<http.Response> postLog(service, email, pass, context) async {
    var url = "http://${Const.ipAddress}:8080/log?method=${service.toString()}";
    final response = http.post(url, headers: {"Content-Type": "application/json"},
        body: json.encode({
          "email": "${email.toString()}",
          "pass": "${pass.toString()}"
        })
    );
    return (response);
  }

  //Post function for register without services (Google, Facebook, or Slack)
  static Future<http.Response> postRegister(firstname, lastname, email, pass) async {
    var url = "http://${Const.ipAddress}:8080/sign";
    final response = http.post(url, headers: {"Content-Type": "application/json"} ,
        body: json.encode({
          "firstname": "${firstname.toString()}",
          "lastname": "${lastname.toString()}",
          "email": "${email.toString()}",
          "pass": "${pass.toString()}"
        })
    );
    return (response);
  }

  static Future<http.Response> postTokenService(url, sessionId, serviceToken) async {
    var response = http.post(url, headers: {"Content-Type": "application/json"},
        body: json.encode({
          "token": "$sessionId",
          "code": "$serviceToken"
        })
    );
    return (response);
  }

  //Enable/Disable area
  static Future<http.Response> acarParser(i, list) async {
    var response = http.post("http://${Const.ipAddress}:8080/parser",
      headers: {"Content-Type": "application/json"},
      body: json.encode({
        "token": "${Const.userToken}",
        "actiontitle": "${list[i][0]}",
        "action": "${list[i][4]}",
        "reactiontitle": "${list[i][1]}",
        "reaction": "${list[i][5]}"
      })
    );
    return (response);
  }
}