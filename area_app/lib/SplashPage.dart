import 'package:area/Const.dart';
import 'package:area/Const.dart';
import 'package:flutter/material.dart';
import 'dart:async';
import 'package:flutter/services.dart';

class SplashPage extends StatefulWidget {
  @override
  SplashPageState createState() => SplashPageState();
}

class SplashPageState extends State<SplashPage> {
  void navigationToNextPage() {
    Const.Listauth = {'Slack': false, 'Facebook': false, 'Google': false, 'Spotify': false, 'Discord': false};
    Navigator.pushReplacementNamed(context, '/ServPage');
  }

  startSplashScreenTimer() async {
    var _duration = new Duration(seconds: 5);
    return new Timer(_duration, navigationToNextPage);
  }

  @override
  void initState() {
    super.initState();
    startSplashScreenTimer();
  }

  @override
  Widget build(BuildContext context) {

    // To make this screen full screen.
    // It will hide status bar and notch.
    SystemChrome.setEnabledSystemUIOverlays([]);

    // full screen image for splash screen.
    return Container(
        child: new Image.asset('asset/logoArea.png'));
  }
}