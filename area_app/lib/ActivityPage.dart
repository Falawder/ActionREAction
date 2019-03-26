import 'dart:convert';

import 'package:area/Const.dart';
import 'package:area/ServerRequest.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_facebook_login/flutter_facebook_login.dart';
import 'package:flutter_signin_button/button_builder.dart';
import 'package:flutter_webview_plugin/flutter_webview_plugin.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;

class Activity extends StatefulWidget {
  _ActivityState createState() => new _ActivityState();
}

class _ActivityState extends State<Activity> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: new Container(
        child: new Column(
          children: <Widget>[
            new Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget> [
                  new SignInButtonBuilder(
                    title: "Slack",
                    icon: FontAwesomeIcons.slack,
                    backgroundColor: Color(0xFF4A154B),
                    onPressed: () {
                      _Slack();
                    }
                  ),
                  _connexionButton(Const.Listauth['Slack'], context, "Slack")
                ]
            ),
            new Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget> [
                new SignInButtonBuilder(
                    title: "Facebook",
                    icon: FontAwesomeIcons.facebook,
                    backgroundColor: Color(0xFF3B5998),
                    onPressed: () {
                      initiateFacebookLogin();
                    }
                ),
                _connexionButton(Const.Listauth['Facebook'], context, "Facebook")
              ]
            ),
            new Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget> [
                  new SignInButtonBuilder(
                      title: "Google",
                      icon: FontAwesomeIcons.google,
                      backgroundColor: Color(0xFFDD4B39),
                      onPressed: () {
                        _handleSignIn();
                      }
                  ),
                  _connexionButton(Const.Listauth['Google'], context, "Google")
                ]
            ),
            new Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget> [
                new SignInButtonBuilder(
                    title: "Spotify",
                    icon: FontAwesomeIcons.spotify,
                    backgroundColor: Color(0xFF1DB954),
                    onPressed: () {
                      _spotify();
                    }
                ),
                _connexionButton(Const.Listauth['Spotify'], context, "Spotify")
              ],
            ),
            new Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget> [
                new SignInButtonBuilder(
                    title: "Discord",
                    icon: FontAwesomeIcons.discord,
                    backgroundColor: Color(0xFF7289da),
                    onPressed: () {
                      _discord();
                    }
                ),
                _connexionButton(Const.Listauth['Discord'], context, "Discord")
              ],
            ),
          ],
        ),
      ),
    );
  }

  //auth for slack
  _Slack() async {
    String url = 'https://slack.com/oauth/authorize?client_id=528553590900.535632309157&scope=incoming-webhook,channels:history,reactions:read,channels:read';
    final flutterWebviewPlugin = new FlutterWebviewPlugin();

    flutterWebviewPlugin.launch(url, hidden: false, withJavascript: true);
    flutterWebviewPlugin.onUrlChanged.listen((url) async {
      if ((url.substring(0, 39)) == 'http://localhost:8081/home/slack/?code=') {
        flutterWebviewPlugin.close();
        var code = url.substring(39, (url.length - 7));
        print(code);
        var response = await Post.postTokenService("http://${Const.ipAddress}:8080/slack/connect", Const.userToken, code);
        var data = json.decode(response.body);
        if (data['code'] == 200) {
          setState(() {
            Const.Listauth['Slack'] = true;
          });
        } else {
          setState(() {
            Const.Listauth['Slack'] = false;
          });
        }
      }
    });
  }

  //auth for spotify
  _spotify() async {
    String url = "https://accounts.spotify.com/authorize?client_id=9951a02e03e24c21bcc1de83842dbf85&response_type=code&redirect_uri=http://localhost:8081/home/spotify/&scope=user-read-private user-read-email playlist-modify-public playlist-modify-private";
    final flutterWebviewPlugin = new FlutterWebviewPlugin();
    flutterWebviewPlugin.launch(url, hidden: false, withJavascript: true, );
    flutterWebviewPlugin.onUrlChanged.listen((url) async {
      if ((url.substring(0, 35)) == 'http://localhost:8081/home/spotify/') {
        var code = url.substring(41, (url.length));
        flutterWebviewPlugin.close();
        var response = await Post.postTokenService("http://${Const.ipAddress}:8080/spotify/connect", Const.userToken, code);
        var data = json.decode(response.body);
        if (data['code'] == 200) {
          setState(() {
            Const.Listauth['Spotify'] = true;
          });
        } else {
          setState(() {
            Const.Listauth['Spotify'] = false;
          });
        }
      }
    });
  }

  //Facebook Connection
  void initiateFacebookLogin() async {
    var facebookLogin = FacebookLogin();
    var facebookLoginResult =  await facebookLogin.logInWithReadPermissions(['email']);
    switch (facebookLoginResult.status) {
      case FacebookLoginStatus.error:
        print(facebookLoginResult.errorMessage);
        break;
      case FacebookLoginStatus.cancelledByUser:
        print("CancelledByUser");
        break;
      case FacebookLoginStatus.loggedIn:
        print("LoggedIn");
        var graphResponse = await http.get(
            'https://graph.facebook.com/v2.12/me?fields=name,first_name,last_name,email&access_token=${facebookLoginResult
                .accessToken.token}');
        var profile = json.decode(graphResponse.body);
        final response = await Post.postServiceActivity("facebook", facebookLoginResult.accessToken.token, profile['id'], profile['email']);
        var data = json.decode(response.body);
        if (data['code'] == 200) {
          setState(() {
            Const.Listauth['Facebook'] = true;
          });
        } else {
          showDialog(
              context: context,
              barrierDismissible: false,
              child: new CupertinoAlertDialog(
                content: new Text(
                  data['failed'].toString(),
                  style: new TextStyle(fontSize: 16.0),
                ),
                actions: <Widget>[
                  new FlatButton(
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      child: new Text("OK")),
                ],
              ));
          break;
        }
        break;
    }
  }

  //Google connection
  GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: [
      'email',
      'https://www.googleapis.com/auth/contacts.readonly',
      'https://www.googleapis.com/auth/pubsub',
      'https://www.googleapis.com/auth/drive',
      'https://mail.google.com/',
    ],
  );

  //Google connection
  _handleSignIn() async {
    try {
      await _googleSignIn.signIn().then((result){
        result.authentication.then((googleKey) async {
          final response = await Post.postServiceActivity("google", googleKey.accessToken, googleKey.idToken, _googleSignIn.currentUser.email);
          var data = json.decode(response.body);
          if (data['code'] == 200) {
            setState(() {
              Const.Listauth['Google'] = true;
            });
          } else {
            showDialog(
                context: context,
                barrierDismissible: false,
                child: new CupertinoAlertDialog(
                  content: new Text(
                    data['failed'].toString(),
                    style: new TextStyle(fontSize: 16.0),
                  ),
                  actions: <Widget>[
                    new FlatButton(
                        onPressed: () {
                          Navigator.pop(context);
                        },
                        child: new Text("OK")),
                  ],
                ));
          }
        });
      });
    } catch (error) {
      print(error);
    }
  }

  //auth for discord
  _discord() async {
    String url = "";
    final flutterWebviewPlugin = new FlutterWebviewPlugin();

    flutterWebviewPlugin.launch(url, hidden: false, withJavascript: true, );
    flutterWebviewPlugin.onUrlChanged.listen((url) async {
      if ((url.substring(0, 34)) == 'http://localhost:8080/slack/?code=') {
        var code = url.substring(34, (url.length - 7));
        var response = await Post.postTokenService("url pour post le token de spotify", Const.userToken, code);
        var data = json.decode(response.body);
        if (data['code'] == 200) {
          setState(() {
            Const.Listauth['Discord'] = true;
          });
        } else {
          setState(() {
            Const.Listauth['Discord'] = false;
          });
        }
        flutterWebviewPlugin.close();
      }
    });
  }

  //Widget connection
  Widget _connexionButton(isCo, context, serviceName) {
    Widget child;
    if(isCo != null && isCo == true) {
      child = new SignInButtonBuilder(
        icon: FontAwesomeIcons.circle,
        title: "Connexion",
        backgroundColor: Colors.green,
        mini: true,
        onPressed: () {
          showDialog(
              context: context,
              barrierDismissible: false,
              child: new CupertinoAlertDialog(
                content: new Text(
                  "Do you want to logout from $serviceName ? ",
                  style: new TextStyle(fontSize: 16.0),
                ),
                actions: <Widget>[
                  new FlatButton(
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      child: new Text("Logout")),
                ],
              )
          );
        },
      );
    } else {
      child = new SignInButtonBuilder(
        icon: FontAwesomeIcons.circle,
        title: "Connexion",
        backgroundColor: Colors.red,
        mini: true,
        onPressed: () {
          showDialog(
              context: context,
              barrierDismissible: false,
              child: new CupertinoAlertDialog(
                content: new Text(
                  "You need to be log to logout from $serviceName",
                  style: new TextStyle(fontSize: 16.0),
                ),
                actions: <Widget>[
                  new FlatButton(
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      child: new Text("OK")),
                ],
              ));
        },
      );
    }
    return (child);
  }
}