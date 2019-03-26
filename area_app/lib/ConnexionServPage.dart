import 'dart:convert';

import 'package:area/Const.dart';
import 'package:area/LoginPage.dart';
import 'package:area/ServerRequest.dart';
import 'package:area/main.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class ServPage extends StatefulWidget{
  _ServPageState createState() => new _ServPageState();
}

class _ServPageState extends State<ServPage> {
  TextEditingController ip = new TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: new SingleChildScrollView(
          child: _body(),
          scrollDirection: Axis.vertical,
        )
    );
  }

  Widget _body() {
    var child = new Container(
      margin: EdgeInsets.all(30.0),
      child: new Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Text(
            "Connection to the server",
            textAlign: TextAlign.center,
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 35,
            ),
          ),
          Container(
            margin: EdgeInsets.all(30.0),
            child: new Image.asset('asset/logoArea.png'),
            height: 100.0,
          ),
          TextField(
            controller: ip,
            decoration: InputDecoration(
                hintText: "Ip address",
                hintStyle: new TextStyle(color: Colors.grey.withOpacity(0.3))),
          ),
          RaisedButton(
              textColor: Colors.black,
              splashColor: Colors.black38,
              color: Colors.grey,
              child: new Text("Connection"),
              onPressed: () async {
                try{
                  final response = await Post.getData(ip.text.toString());
                  var data = json.decode(response.body);
                  Const.ipAddress = ip.text.toString();
                  Navigator.of(context).pushAndRemoveUntil(
                      new MaterialPageRoute(
                          builder: (BuildContext context) => new LoginPage()),
                          (Route<dynamic> route) => false);
                } on Exception{
                  print("Test");
                  error(ip);
                }
              }
          ),
        ],
      ),
    );
    return (child);
  }

  error(ip){
    var child = showDialog(
        context: context,
        barrierDismissible: false,
        child: new CupertinoAlertDialog(
          content: new Text(
            "Cannot connect to url: ${ip.text.toString()}",
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
    return(child);
  }
}