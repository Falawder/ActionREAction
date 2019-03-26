import 'package:area/ActivityPage.dart';
import 'package:area/AppletsPage.dart';
import 'package:area/CardPage.dart';
import 'package:area/ConnexionServPage.dart';
import 'package:area/LoginPage.dart';
import 'package:area/RegisterPage.dart';
import 'package:area/SplashPage.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:area/DiscoverPage.dart';
import 'package:flutter_webview_plugin/flutter_webview_plugin.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    SystemChrome.setPreferredOrientations(
        [DeviceOrientation.portraitUp, DeviceOrientation.portraitDown]);
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Area',
      theme: ThemeData(
        primarySwatch: Colors.grey,
      ),
      routes: <String, WidgetBuilder>{
        '/HomePage': (BuildContext context) => new MyHomePage(),
        '/LoginPage': (BuildContext context) => new LoginPage(),
        '/RegisterPage': (BuildContext context) => new RegisterPage(),
        '/ServPage': (BuildContext context) => new ServPage(),
        '/AppletsPage': (BuildContext context) => new Applets(),
        '/Discover': (BuildContext context) => new Discover(),
        "/webview": (_) => WebviewScaffold(
          url: 'https://slack.com/oauth/authorize?client_id=528553590900.535632309157&scope=incoming-webhook,channels:history,reactions:read,channels:read',
          appBar: AppBar(
            title: Text("WebView"),
          ),
          withJavascript: true,
          withLocalStorage: true,
        )
      },
      home: new SplashPage(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _currentIndex = 0;
  final List<Widget> _children = [
    Discover(),
    Activity(),
    Applets()
  ];

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        appBar: new AppBar(
          title: new Text('Area'),
          centerTitle: true,
        ),
        body: _children[_currentIndex],
        bottomNavigationBar: BottomNavigationBar(
          onTap: onTabTapped,
          currentIndex: _currentIndex,
          fixedColor: Colors.black,
          items:[
            BottomNavigationBarItem(
                icon: new Icon(Icons.home),
                title: new Text("Discover")
            ),
            BottomNavigationBarItem(
                icon: new Icon(Icons.calendar_today),
                title: new Text("Activity")
            ),
            BottomNavigationBarItem(
                icon: new Icon(Icons.playlist_add_check),
                title: new Text("Applets")
            )
          ],
        ),
    );
  }

  void onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }
}



