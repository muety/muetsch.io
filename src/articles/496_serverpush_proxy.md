## HTTP/2.0 server push proxy
November 14, 2016

I just released a new, little Node project on GitHub and NPM, which is called [http2-serverpush-proxy](https://www.npmjs.com/package/http2-serverpush-proxy) and does exactly what the name suggests. It spawns a reverse proxy between a web application and its clients, that serves via HTTP/2 and automatically server-pushes assets contained in the HTML. It can be used as either standalone server or as _connect_ middleware for ExpressJS.

### How it works
Usually, websites consist of multiple assets, like CSS and JS files as well as images like PNGs, JPGs and SVGs. Traditionally, a user's browser fetches the HTML first, parses it and then downloads all linked assets. However, this is slow, since the assets can't be loaded before the HTML is completely fetched and parsed. With server push, your webserver can actively send those assets to the client browser even before it requested them. To prevent you from having to implement this functionality, _http2-serverpush-proxy_ sits as a proxy between your actual webserver and the user. In contrast to some other approaches like [http2-push-manifest](https://github.com/GoogleChrome/http2-push-manifest), where the assets to be pushed are declared statically, this library __dynamically parses the HTML__ files and extracts contained assets that should be pushed.


![](/assets/img/push_screenshot1.png)
Without server push
![](/assets/img/push_screenshot2.png)
With server push

Details on how to use this library are to be found on the [project site](https://github.com/n1try/http2-serverpush-proxy). Please feel free to give me feedback!

