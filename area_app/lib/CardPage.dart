import 'dart:convert';

import 'package:area/DiscoverPage.dart';
import 'package:area/ServerRequest.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class CardPage extends StatefulWidget{
  final int i;
  final List<List> list;

  CardPage(this.i, this.list);

  _CardPageState createState() => new _CardPageState(i, list);
}

class _CardPageState extends State<CardPage> {
  final int i;
  final List<List> list;
  _CardPageState(this.i, this.list);
  bool day = false;
  bool min = false;
  bool sec = false;

  var color;
  var stateMessage;
  isCardActivate(i, list){
    if (list[i][3] == 1) {
      color = Colors.greenAccent;
      stateMessage = "Desactivate";
    } else {
      color = Colors.redAccent;
      stateMessage = "Activate";
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: getCardPage(i, list),
    );
  }

  Widget getCardPage(i, list){
    isCardActivate(i, list);
    switch(list[i][0]) {
      case "spotify":
        return (fullCard(i, list, "Spotify"));
      case "google":
        return (fullCard(i, list, "Google"));
      case "facebook":
        return (fullCard(i, list, "Facebook"));
      case "discord":
        return (fullCard(i, list, "Discord"));
      case "slack":
        return (fullCard(i, list, "Slack"));
      case "time":
        return (fullCard(i, list, "time"));
    }
  }

  //Get icon to display at bottom left in the card view
  static iconService(i, serviceName){
    switch (serviceName){
      case "spotify": {
        var child = Icon(
            FontAwesomeIcons.spotify,
            size: 75,
            color: Color(0xFF1DB954)
        );
        return (child);
      }
      case "google": {
        var child = Icon(
            FontAwesomeIcons.google,
            size: 75,
            color: Colors.white
        );
        return (child);
      }
      case "facebook": {
        var child = Icon(
          FontAwesomeIcons.facebook,
          size: 75,
          color: Colors.white
        );
        return (child);
      }
      case "discord": {
        var child = Icon(
            FontAwesomeIcons.discord,
            size: 75,
            color: Colors.white
        );
        return (child);
      }
      case "slack": {
        var child = Icon(
            FontAwesomeIcons.slack,
            size: 75,
            color: Colors.white
        );
        return (child);
      }
      case "time": {
        var child = Icon(
            FontAwesomeIcons.clock,
            size: 75,
            color: Colors.white
        );
        return (child);
      }
    }
  }

  //Card for normal applet
  fullCard(i, list, service){
    var child = new Container(
      decoration: CustomCard.background(i, list),
      child: new Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <Widget>[
          Padding(
              padding: EdgeInsets.only(top: 0.0)
          ),
          iconService(i, list[i][0]),
          Text("$service",
            style: TextStyle(
                fontSize: 50,
                color: Colors.white
            ),),
          Container(
            child: new Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                ListTile(
                  title: Text(
                    list[i][2] + "\n",
                    style: TextStyle(
                        color: Colors.white,
                        fontSize: 25
                    ),
                  ),
                  contentPadding: EdgeInsets.only(bottom: 200.0),
                ),
              ],
            ),
          ),
          Padding(
              padding: EdgeInsets.only(top: 0.0)
          ),
          Container(
            child: new Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                RaisedButton(
                  child: Text("$stateMessage"),
                  color: color,
                  elevation: 4.0,
                  splashColor: Colors.blueGrey,
                  onPressed: () async {
                    var response = await Post.acarParser(i, list);
                    var data = json.decode(response.body);
                    print(data);
                    if (data['error'] == 'AREA successfully activated')
                      setState(() {
                        list[i][3] = 1;
                        color = Colors.greenAccent;
                        stateMessage = "Desactivate";
                      });
                    else if(data['error'] == 'AREA successfully deactivated')
                      setState(() {
                        list[i][3] = 0;
                        color = Colors.redAccent;
                        stateMessage = "Activate";
                      });
                  },
                ),
                Padding(
                    padding: EdgeInsets.fromLTRB(10.0, 0.0, 10.0, 0.0)
                ),
                RaisedButton(
                  child: Text('Back'),
                  color: Colors.white,
                  elevation: 4.0,
                  splashColor: Colors.blueGrey,
                  onPressed: () {
                    Navigator.pop(context);
                    print("Button pressed");
                  },
                ),
              ],
            ),
          ),
          Container(
            decoration: CustomCard.background(i, list),
            child: new Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: <Widget>[
                Text("Work with  ", style: TextStyle(color: Colors.white),),
                CustomCard.iconService(i, list[i][1]),

              ],
            ),
          )
        ],
      ),
    );
    return (child);
  }
}
