import 'dart:convert';

import 'package:area/CardPage.dart';
import 'package:area/Const.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:http/http.dart' as http;

class Discover extends StatefulWidget {
  _DiscoverPageState createState() => new _DiscoverPageState();
}

class _DiscoverPageState extends State<Discover> {
  bool isFill = false;
  List<List> AllData = [];

  @override
  void initState() {
    super.initState();
    print("InitState");
    LoadData();
  }

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        body: AllData.length == 0
            ? new Center(
          child: new CircularProgressIndicator(),
        )
            : createCards()
    );
  }

  LoadData() async {
    http.Response res = await http.get(
      Uri.encodeFull("http://${Const.ipAddress}:8080/acar?params=${Const.userToken}"),
      headers: {"Accept": "application/json"},
    );
    var data = json.decode(res.body);
    var list = data["acars"];
    list.forEach((n) =>
        AllData.add([n['actiontitle'], n['reactiontitle'], n['description'], n['isOn'], n['action'], n['reaction']])
    );
    setState(() {});
    isFill = true;
  }

  Widget createCards(){
    List<Widget> cards = new List.generate(AllData.length, (i)=>new CustomCard(i, AllData));
    var child = new Container(
        child: new ListView(
          children: cards,
        )
    );
    return child;
  }
}

class CustomCard extends StatelessWidget{
  final int i;
  final List<List> list;

  const CustomCard(this.i, this.list);

  @override
  Widget build(BuildContext context) {
    Widget card = tile(i, list, context);
    return card;
  }

  //Color background for card view
  static background(i, list){
    var service = list[i][0];
    switch(service){
      case "spotify": {
        var child = BoxDecoration(
            color: Color(0xFF121212),
        );
        return (child);
      }
      case "google": {
        var child = BoxDecoration(
            color: Color(0xFFb92f22),
        );
        return (child);
      }
      case "facebook": {
        var child = BoxDecoration(
          color: Color(0xFF3B5998)
        );
        return (child);
      }
      case "discord": {
        var child = BoxDecoration(
          color: Color(0xFF7289da)
        );
        return (child);
      }
      case "slack": {
        var child = BoxDecoration(
          color: Color(0xFF7C3085)
        );
        return (child);
      }
      case "time": {
        var child = BoxDecoration(
            color: Color(0xFFCCCCFF)
        );
        return (child);
      }
    }
  }

  //Function who return the good card
  container(i, list){
    var service = list[i][0];
    switch(service) {
      case "spotify":
        return (spotifyCard(i, list));
      case "google":
        return (googleCard(i, list));
      case "facebook":
        return (facebookCard(i, list));
      case "discord":
        return (discordCard(i, list));
      case "slack":
        return (slackCard(i, list));
      case "time":
        return (timeCard(i, list));
    }
  }

  //Widget call for card view generation in list view
  Widget tile(i, list, context){
    print(i);
    print(list);
    Widget child;
    child = GestureDetector(
      onTap: (){
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => CardPage(i, list)),
        );
      },
      child: Card(
        child: new Column(
          children: <Widget>[
            container(i, list)
          ],
        ),
      ),
    );
    return child;
  }

  //Get icon to display at bottom left in the card view
  static iconService(i, serviceName){
    switch (serviceName){
      case "spotify": {
        var child = Icon(
            FontAwesomeIcons.spotify,
            size: 35,
            color: Colors.white
        );
        return (child);
      }
      case "google": {
        var child = Icon(
            FontAwesomeIcons.google,
            size: 35,
            color: Colors.white
        );
        return (child);
      }
      case "facebook": {
        var child = Icon(
            FontAwesomeIcons.facebook,
            size: 35,
            color: Colors.white,
        );
        return (child);
      }
      case "discord": {
        var child = Icon(
            FontAwesomeIcons.discord,
            size: 35,
            color: Colors.white
        );
        return (child);
      }
      case "slack": {
        var child = Icon(
            FontAwesomeIcons.slack,
            size: 35,
            color: Colors.white
        );
        return (child);
      }
      case "time": {
        var child = Icon(
          FontAwesomeIcons.times,
          size: 35,
          color: Colors.white,
        );
        return (child);
      }
    }
  }

  //Card view for spotify
  Widget spotifyCard(i, list){
    var child = new Container(
      height: 220.0,
      decoration: background(i, list),
      child: new Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: <Widget> [
            Padding(
                padding: EdgeInsets.only(top: 0.0)
            ),
            Icon(
              FontAwesomeIcons.spotify,
              size: 50,
              color: Color(0xFF1DB954),
            ),
            ListTile(
              title: Text(
                list[i][0],
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 25
                ),
              ),
              subtitle: Text(
                list[i][2],
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 15
                ),
              ),
            ),
            Padding(
                padding: EdgeInsets.only(top: 0.0)
            ),
            Container(
                decoration: BoxDecoration(
                    color: Color(0xFF212121)
                ),
                child: new Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: <Widget>[
                    Text("Work with    ",
                      style: TextStyle(color: Colors.white,
                          fontSize: 15),
                    ),
                    iconService(i, list[i][1]),
                    Text("  ")
                  ],
                )
            )
          ]
      ),
    );
    return (child);
  }

  //Card view for google
  Widget googleCard(i, list) {
    var child = new Container(
      height: 220.0,
      decoration: background(i, list),
      child: new Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: <Widget> [
            Padding(
                padding: EdgeInsets.only(top: 0.0)
            ),
            Icon(
              FontAwesomeIcons.google,
              size: 50,
              color: Colors.white,
            ),
            ListTile(
              title: Text(
                list[i][0],
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 25
                ),
              ),
              subtitle: Text(
                list[i][2],
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 15
                ),
              ),
            ),
            Padding(
                padding: EdgeInsets.only(top: 0.0)
            ),
            Container(
                decoration: BoxDecoration(
                    color: Color(0xFFDD4B39)
                ),
                child: new Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: <Widget>[
                    Text("Work with    ",
                      style: TextStyle(color: Colors.white,
                          fontSize: 15),
                    ),
                    iconService(i, list[i][1]),
                    Text("  ")
                  ],
                )
            )
          ]
      ),
    );
    return (child);
  }

  //Card view for facebook
  Widget facebookCard(i, list){
    var child = new Container(
      height: 220.0,
      decoration: background(i, list),
        child: new Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget> [
              Padding(
                  padding: EdgeInsets.only(top: 0.0)
              ),
              Icon(
                FontAwesomeIcons.facebook,
                size: 50,
                color: Colors.white,
              ),
              ListTile(
                title: Text(
                  list[i][0],
                  style: TextStyle(
                      color: Colors.white,
                      fontSize: 25
                  ),
                ),
                subtitle: Text(
                  list[i][2],
                  style: TextStyle(
                      color: Colors.white,
                      fontSize: 15
                  ),
                ),
              ),
              Padding(
                  padding: EdgeInsets.only(top: 0.0)
              ),
              Container(
                  decoration: BoxDecoration(
                      color: Color(0xFF324b81)
                  ),
                  child: new Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: <Widget>[
                      Text("Work with    ",
                        style: TextStyle(color: Colors.white,
                            fontSize: 15),
                      ),
                      iconService(i, list[i][1]),
                      Text("  ")
                    ],
                  )
              )
            ]
        )
    );
    return (child);
  }

  Widget discordCard(i, list) {
    var child = new Container(
        height: 220.0,
        decoration: background(i, list),
        child: new Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget> [
              Padding(
                  padding: EdgeInsets.only(top: 0.0)
              ),
              Icon(
                FontAwesomeIcons.discord,
                size: 50,
                color: Colors.white,
              ),
              ListTile(
                title: Text(
                  list[i][0],
                  style: TextStyle(
                      color: Colors.white,
                      fontSize: 25
                  ),
                ),
                subtitle: Text(
                  list[i][2],
                  style: TextStyle(
                      color: Colors.white,
                      fontSize: 15
                  ),
                ),
              ),
              Padding(
                  padding: EdgeInsets.only(top: 0.0)
              ),
              Container(
                  decoration: BoxDecoration(
                      color: Color(0xFF4663ce)
                  ),
                  child: new Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: <Widget>[
                      Text("Work with    ",
                        style: TextStyle(color: Colors.white,
                            fontSize: 15),
                      ),
                      iconService(i, list[i][1]),
                      Text("  ")
                    ],
                  )
              )
            ]
        )
    );
    return (child);
  }

  //Card view for slack
  Widget slackCard(i, list) {
    var child = new Container(
      height: 220.0,
      decoration: background(i, list),
      child: new Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: <Widget> [
            Padding(
                padding: EdgeInsets.only(top: 0.0)
            ),
            Icon(
              FontAwesomeIcons.slack,
              size: 50,
              color: Colors.white,
            ),
            ListTile(
              title: Text(
                list[i][0],
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 25
                ),
              ),
              subtitle: Text(
                list[i][2],
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 15
                ),
              ),
            ),
            Padding(
                padding: EdgeInsets.only(top: 0.0)
            ),
            Container(
                decoration: BoxDecoration(
                    color: Color(0xFF4A154B)
                ),
                child: new Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: <Widget>[
                    Text("Work with    ",
                      style: TextStyle(color: Colors.white,
                          fontSize: 15),
                    ),
                    iconService(i, list[i][1]),
                    Text("  ")
                  ],
                )
            )
          ]
      ),
    );
    return (child);
  }

  //Card view for time
  Widget timeCard(i, list) {
    var child = new Container(
      height: 220.0,
      decoration: background(i, list),
      child: new Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: <Widget> [
            Padding(
                padding: EdgeInsets.only(top: 0.0)
            ),
            Icon(
              FontAwesomeIcons.clock,
              size: 50,
              color: Colors.white,
            ),
            ListTile(
              title: Text(
                list[i][0],
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 25
                ),
              ),
              subtitle: Text(
                list[i][2],
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 15
                ),
              ),
            ),
            Padding(
                padding: EdgeInsets.only(top: 0.0)
            ),
            Container(
                decoration: BoxDecoration(
                    color: Color(0xFFB7B7E5)
                ),
                child: new Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: <Widget>[
                    Padding(
                      padding: EdgeInsets.only(left: 110),
                    ),
                    Text("Work with    ",
                      style: TextStyle(color: Colors.white,
                          fontSize: 15),
                    ),
                    iconService(i, list[i][1]),
                    Text("  ")
                  ],
                )
            )
          ]
      ),
    );
    return (child);
  }
}