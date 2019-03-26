import 'dart:convert';

import 'package:area/Const.dart';
import 'package:area/LoginPage.dart';
import 'package:area/ServerRequest.dart';
import 'package:area/main.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class RegisterPage extends StatefulWidget{
  @override
  _RegisterPageState createState() => new _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage>{
  TextEditingController lastname = new TextEditingController();
  TextEditingController firstname = new TextEditingController();
  TextEditingController email = new TextEditingController();
  TextEditingController password = new TextEditingController();
  TextEditingController confirmpassword = new TextEditingController();

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        appBar: new AppBar(
        title: Text("Register Page"),
    elevation: 0.0,
    backgroundColor: Colors.grey,
    ),
    body: new SingleChildScrollView(
      child: _body(),
      scrollDirection: Axis.vertical,
      ),
    );
  }

  @override
  void initState() {
    super.initState();
  }

  Widget _body() {
    return new Container(
        padding: EdgeInsets.only(right: 20.0, left: 20.0, top: 20.0),
        child: new Column(
          children: <Widget>[
            new TextField(
              controller: lastname,
              decoration: InputDecoration(
                  hintText: "LastName",
                  hintStyle: new TextStyle(color: Colors.grey.withOpacity(0.3))),
            ),
            new TextField(
              controller: firstname,
              decoration: InputDecoration(
                  hintText: "FirstName",
                  hintStyle: new TextStyle(color: Colors.grey.withOpacity(0.3))),
            ),
            new TextField(
              controller: email,
              decoration: InputDecoration(
                  hintText: "E-mail",
                  hintStyle: new TextStyle(color: Colors.grey.withOpacity(0.3))),
            ),
            new TextField(
              controller: password,
              decoration: InputDecoration(
                  hintText: "Password",
                  hintStyle: new TextStyle(color: Colors.grey.withOpacity(0.3))),
            ),
            new TextField(
              controller: confirmpassword,
              decoration: InputDecoration(
                  hintText: "ConfirmPassword",
                  hintStyle: new TextStyle(color: Colors.grey.withOpacity(0.3))),
            ),
            new Container(
              decoration: new BoxDecoration(
                border: Border.all(color: Colors.black)
              ),
              child: new ListTile(
                title: new Text(
                  "Register",
                  textAlign: TextAlign.center,
                ),
                onTap: checkRegistration,
              ),
            )
          ],
        ),
    );
  }

  checkRegistration() async {
    if  (lastname.text.length != 0 &&
        firstname.text.length != 0 &&
        email.text.length != 0 &&
        password.text.length != 0 &&
        confirmpassword.text.length != 0){
        if (password.text == confirmpassword.text) {
          final response = await Post.postRegister(firstname.text,lastname.text, email.text, password.text);
          var data = json.decode(response.body);
          if (data['code'] == 200) {
            Const.userToken = data['token'];
            Navigator.of(context).pushAndRemoveUntil(
                new MaterialPageRoute(
                    builder: (BuildContext context) => new LoginPage()),
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
                        child: new Text("OK"))
                  ],
                ));
          }
        } else {
          showDialog(
              context: context,
              barrierDismissible: false,
              child: new CupertinoAlertDialog(
                content: new Text(
                  "Password must be the same",
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
    } else {
      showDialog(
          context: context,
          barrierDismissible: false,
          child: new CupertinoAlertDialog(
            content: new Text(
              "Register field\ncan't be empty",
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
