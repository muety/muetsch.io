---
title: How to receive sharing intents in Flutter?
date: 2019-03-11 06:56:28
tags:
---

# Use Case
A common use case when building an Android app is to have it handle data shared from other apps. All Android users know this little dialog that pops up when you hit the _"Share"_ button in any app. It displays a list of applications, which are registered for receiving shared data. The user has to choose one, which is then opened up to handle the shared text, URL or whatever it is. On iOS, a similar concept exists. However, this article focused on **Android only**. 

![](https://cketti.de/img/share-url-to-clipboard/screenshot_share.png)
_(Source: https://cketti.de/)_

As an example, let's imagine having a bookmark-manager written in Flutter. It is supposed to save **URLs** with their accompanying **titles**, shared from the smartphone's browser to the app, to one of your bookmark collection. This is exactly [what I just build](https://github.com/muety/anchr-android).

# Background
The official Flutter docs already give [a good example](https://flutter.dev/docs/get-started/flutter-for/android-devs#how-do-i-handle-incoming-intents-from-external-applications-in-flutter) on how to achieve that functionality. However, I found that their piece of code only works, if you share data to an app that **is still closed**. If you had opened your app before and it idles in the background, it won't receive the [sharing intent](https://www.androidcode.ninja/android-share-intent-example/) when it is [resumed](https://developer.android.com/guide/components/activities/activity-lifecycle#onresume). Therefore, I extended the example. 

# Code
## AndroidManifest.xml
First, you have to add an `intent-filter` to your `AndroidManifest.xml` in the `android/` directory to register your app as a sharing target.

```xml
...
<intent-filter>
    <action android:name="android.intent.action.SEND" />
    <category android:name="android.intent.category.DEFAULT" />
    <data android:mimeType="text/plain" />
</intent-filter>
...
```

## MainActivity.java
Secondly, you will need to add some code to `MainActivity.java` (analogously for Kotlin projects). In the `onCreate()` lifecycle hook, you have to register a `MethodCallHandler()` to act as an interface between the underlying Android app and your flutter code. In addition, you have to override the `onNewIntent()` callback, which is triggered when a new sharing intent (`Intent.ACTION_SEND`) causes your app to change its lifecycle state. Lastly, you need a method to handle the actual content shared from the external app. It consists of two fields, a URL and a title, both represented as strings in a Map. In the end, your `MainActivity` looks like something like this.

```java
private Map<String, String> sharedData = new HashMap();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        GeneratedPluginRegistrant.registerWith(this);

        // Handle intent when app is initially opened
        handleSendIntent(getIntent());

        new MethodChannel(getFlutterView(), "app.channel.shared.data").setMethodCallHandler(
            new MethodCallHandler() {
                @Override
                public void onMethodCall(MethodCall call, MethodChannel.Result result) {
                    if (call.method.contentEquals("getSharedData")) {
                        result.success(sharedData);
                        sharedData.clear();
                    }
                }
            }
        );
    }

    @Override
    protected void onNewIntent(Intent intent) {
        // Handle intent when app is resumed
        super.onNewIntent(intent);
        handleSendIntent(intent);
    }

    private void handleSendIntent(Intent intent) {
        String action = intent.getAction();
        String type = intent.getType();

        // We only care about sharing intent that contain plain text
        if (Intent.ACTION_SEND.equals(action) && type != null) {
            if ("text/plain".equals(type)) {
                sharedData.put("subject", intent.getStringExtra(Intent.EXTRA_SUBJECT));
                sharedData.put("text", intent.getStringExtra(Intent.EXTRA_TEXT));
            }
        }
    }
}
```

Note that the shared data is "cached" on the Java side of your app until is it picked up by your Flutter code.

## Your Flutter app
Eventually, you need to add a method to your Flutter code to interact with the native-Android `MethodHandler`. It will be called once during state initialization and – with the help of a listener – every time the underlying Android activity is resumed. 

```dart
class SampleAppPage extends StatefulWidget {
  SampleAppPage({Key key}) : super(key: key);

  @override
  _SampleAppPageState createState() => _SampleAppPageState();
}

class _SampleAppPageState extends State<SampleAppPage> {
    static const platform = const MethodChannel('app.channel.shared.data');
    Map<dynamic, dynamic> sharedData = Map();

    @override
    void initState() {
        super.initState();
        _init();
    }

    _init() async {
        // Case 1: App is already running in background:
        // Listen to lifecycle changes to subsequently call Java MethodHandler to check for shared data
        SystemChannels.lifecycle.setMessageHandler((msg) {
            if (msg.contains('resumed')) {
                _getSharedData().then((d) {
                    if (d.isEmpty) return;
                    // Your logic here
                    // E.g. at this place you might want to use Navigator to launch a new page and pass the shared data
                });
            }
        });

        // Case 2: App is started by the intent:
        // Call Java MethodHandler on application start up to check for shared data
        var data = await _getSharedData();
        setState(() => sharedData = data);

        // You can use sharedData in your build() method now
    }

    Future<Map> _getSharedData() async => await platform.invokeMethod('getSharedData');
}
```

Now you're good to go! Once you extracted the sharing intent's contents, you can, for instance, show a pre-filled dialog to add the new link to one of your bookmark collections, just as [I did here](https://github.com/muety/anchr-android/blob/897395528532a03ce4e1bdba00fe4b3b35f5fe43/lib/app.dart#L39).

# Conclusion
This approach might seem a little complicated, but in fact, it is the only working solution I could find. There is a plugin called [flutter-share](https://github.com/d-silveira/flutter-share), but unfortunately it did not work for me. Happy coding 😉!