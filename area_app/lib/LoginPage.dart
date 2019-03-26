import 'dart:convert';

import 'package:area/Const.dart';
import 'package:area/main.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_facebook_login/flutter_facebook_login.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/material.dart';
import 'package:flutter_signin_button/button_builder.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;
import 'ServerRequest.dart';

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => new _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  TextEditingController email = new TextEditingController();
  TextEditingController password = new TextEditingController();

  var profileData;

  bool isLoggedIn = false;
  bool checkValue = false;

  SharedPreferences sharedPreferences;

  //Google connection
  GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: [
      'profile',
      'email',
      'https://www.googleapis.com/auth/contacts.readonly',

      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/pubsub',
      'https://mail.google.com/',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
  );

  //Google connection
  _handleSignIn() async {
    try {
      await _googleSignIn.signIn().then((result){
        result.authentication.then((googleKey) async {
          var name = _googleSignIn.currentUser.displayName.toString();
          var list = name.split(" ");
          final response = await Post.postService("google", list[0], list[1], _googleSignIn.currentUser.email, _googleSignIn.currentUser.id, googleKey.accessToken);
          var data = json.decode(response.body);
          if (data['code'] == 200) {
            //Const.logData = new LogData.fromJson(data);
            Const.Listauth['Google'] = true;
            Const.userToken = data['token'];
            Navigator.of(context).pushAndRemoveUntil(
                new MaterialPageRoute(
                    builder: (BuildContext context) => new MyHomePage()),
                    (Route<dynamic> route) => false);
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

  //Facebook connection
  void onLoginStatusChanged(bool isLoggedIn, {profileData}) {
    setState(() {
      this.isLoggedIn = isLoggedIn;
      this.profileData = profileData;
    });
  }

  //Facebook Connection
  void initiateFacebookLogin() async {
    var facebookLogin = FacebookLogin();
    var facebookLoginResult =  await facebookLogin.logInWithReadPermissions(['email']);
    switch (facebookLoginResult.status) {
      case FacebookLoginStatus.error:
        print(facebookLoginResult.errorMessage);
        onLoginStatusChanged(false);
        break;
      case FacebookLoginStatus.cancelledByUser:
        print("CancelledByUser");
        onLoginStatusChanged(false);
        break;
      case FacebookLoginStatus.loggedIn:
        print("LoggedIn");
        var graphResponse = await http.get(
            'https://graph.facebook.com/v2.12/me?fields=name,first_name,last_name,email&access_token=${facebookLoginResult
                .accessToken.token}');

        var profile = json.decode(graphResponse.body);

        final response = await Post.postService("facebook", profile['first_name'], profile['lastname'], profile['email'], profile['id'], facebookLoginResult.accessToken.token);
        var data = json.decode(response.body);
        if (data['code'] == 200) {
          Const.Listauth['Facebook'] = true;
          Const.userToken = data['token'];
          Navigator.of(context).pushAndRemoveUntil(
              new MaterialPageRoute(
                  builder: (BuildContext context) => new MyHomePage()),
                  (Route<dynamic> route) => false);
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
          onLoginStatusChanged(false);
          break;
        }
        onLoginStatusChanged(true, profileData: profile);
        break;
    }
  }

  @override
  void initState() {
    super.initState();
    getCredential();
  }

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      appBar: new AppBar(
        elevation: 0.0,
        backgroundColor: Colors.white12,
      ),
      body: new SingleChildScrollView(
        child: _body(),
        scrollDirection: Axis.vertical,
      ),
    );
  }

  //Main Container
  Widget _body(){
    return new Container(
      padding: EdgeInsets.only(right: 20.0, left: 20.0),
      child: new Column(
        mainAxisAlignment: MainAxisAlignment.start,
        children: <Widget>[
          new Container(
            margin: EdgeInsets.all(30.0),
            child: new Image.asset('asset/logoArea.png'),
            height: 100.0,
          ),
          new TextField(
            controller: email,
            decoration: InputDecoration(
                hintText: "E-mail",
                hintStyle: new TextStyle(color: Colors.grey.withOpacity(0.3))),
          ),
          new TextField(
              controller: password,
              obscureText: true,
              decoration: InputDecoration(
                  hintText: "password",
                  hintStyle:
                  new TextStyle(color: Colors.grey.withOpacity(0.3)))),
          new CheckboxListTile(
            value: checkValue,
            onChanged: _onChanged,
            title: new Text("Remember me"),
            controlAffinity: ListTileControlAffinity.leading,
          ),
          new SignInButtonBuilder(
              title: "Login",
              icon: FontAwesomeIcons.signInAlt,
              backgroundColor: Colors.brown,
              onPressed: () => _navigator(),//_navigator,
          ),
          new Container(
            margin: EdgeInsets.all(20.0),
            child: new InkWell(
              child: new Text("Register Here"),
              onTap: () {
                Navigator.pushNamed(context, '/RegisterPage');
              },
            ),
          ),
          new SignInButtonBuilder(
            title: 'Google',
            icon: FontAwesomeIcons.google,
            backgroundColor: Color(0xFFDD4B39),
            onPressed: () => _handleSignIn(),
          ),
          new SignInButtonBuilder(
            title: 'Facebook',
            icon: FontAwesomeIcons.facebookF,
            backgroundColor: Color(0xFF3B5998),
            onPressed: () => initiateFacebookLogin(),
          )
        ],
      ),
    );
  }

  //Check button remember me
  _onChanged(bool value) async {
    sharedPreferences = await SharedPreferences.getInstance();
    setState(() {
      checkValue = value;
      sharedPreferences.setBool("check", checkValue);
      sharedPreferences.setString("username", email.text);
      sharedPreferences.setString("password", password.text);
      sharedPreferences.commit();
      getCredential();
    });
  }

  //Save Shared Preferences
  getCredential() async {
    sharedPreferences = await SharedPreferences.getInstance();
    setState(() {
      checkValue = sharedPreferences.getBool("check");
      if (checkValue != null) {
        if (checkValue) {
          email.text = sharedPreferences.getString("username");
          password.text = sharedPreferences.getString("password");
        } else {
          email.clear();
          password.clear();
          sharedPreferences.clear();
        }
      } else {
        checkValue = false;
      }
    });
  }

  //Connexion not using services
  _navigator() async{
    if (email.text.length != 0 && password.text.length != 0) {
      final response = await Post.postLog("app", email.text, password.text, context);
      var data = json.decode(response.body);
      if (data['code'] == 200) {
        Const.userToken = data['token'];
        Navigator.of(context).pushAndRemoveUntil(
            new MaterialPageRoute(
                builder: (BuildContext context) => new MyHomePage()),
                (Route<dynamic> route) => false);
      }
      else {
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
                new FlatButton(
                    onPressed: () {
                      Navigator.pop(context);
                      Navigator.pushNamed(context, '/RegisterPage');
                    },
                  child: new Text("Register Here"),
                  ),
              ],
            ));
      }
    } else {
      showDialog(
          context: context,
          barrierDismissible: false,
          child: new CupertinoAlertDialog(
            content: new Text(
              "username or password\ncan't be empty",
              style: new TextStyle(fontSize: 16.0),
            ),
            actions: <Widget>[
              new FlatButton(
                  onPressed: () {
                    Navigator.pop(context);
                    },
                  child: new Text("OK"))
            ],
          ));
    }
  }
}