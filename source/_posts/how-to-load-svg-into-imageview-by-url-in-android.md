---
title: How to load SVG into ImageView by URL in Android
date: 2018-07-13 00:19:19
tags:
---

I am writing this short article since I had a pretty hard time figuring out on how to do what the title says: fetching an SVG from the web and displaying it in an app.

By default, Android's `ImageView` does not support SVGs (why?). After googling for a while I found a complicated solution for the above problem using [Glide](https://github.com/bumptech/glide) with a custom module in combination with [AndroidSVG](http://bigbadaboom.github.io/androidsvg/). However, the latter library is quite outdated and caused some - apparently randomly occuring - errors on API level 28. Finally I found [Pixplicity/sharp](https://github.com/Pixplicity/sharp), which seemed to be a light-weight library for almost exactly my purpose with a minimal API. The only thing I needed to add is the ability to fetch the SVG from the web instead of from a local resource. I built a small example as can be seen below.

## Code
### build.gradle
```
dependencies {
    // ...
    implementation 'com.squareup.okhttp3:okhttp:3.10.0'
    implementation 'com.pixplicity.sharp:library:1.1.0'
    // ...
}
```

### MainActivity.java
```java
    // ...
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        ImageView userAvatarView = findViewById(R.id.user_avatar);
        String userAvatarUrl = "https://avatars.dicebear.com/v2/female/anna.svg";
        Utils.fetchSvg(this, userAvatarUrl, userAvatarView);
    }
    // ...
```

### Utils.java
A simple util class with static methods that receive an Android Context. Having a static `OkHttpClient` that gets conditionally initialized from within the static methods might arguably not be the best solution, but it works for this example. Alternatives would be to have it being autowired, passed as a parameter or to make `Utils` a singleton and the http client a member variable.
```java
public class Utils {
    private static OkHttpClient httpClient;

    public static void fetchSvg(Context context, String url, final ImageView target) {
        if (httpClient == null) {
            // Use cache for performance and basic offline capability
            httpClient = new OkHttpClient.Builder()
                    .cache(new Cache(context.getCacheDir(), 5 * 1024 * 1014))
                    .build();
        }

        Request request = new Request.Builder().url(url).build();
        httpClient.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                target.setImageDrawable(R.drawable.fallback_image);
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                InputStream stream = response.body().byteStream();
                Sharp.loadInputStream(stream).into(target);
                stream.close();
            }
        });
    }
}
```

If you know a simpler solution to load SVGs, please let me know!