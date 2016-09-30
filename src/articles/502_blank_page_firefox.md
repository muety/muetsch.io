## Blank page in Firefox using nginx with SSL

Recently I got the following problem. I have a web application running on my server and an nginx sitting in front of that to handle incoming requests as a reverse proxy. Additionally I configured my nginx to enforce HTTPS by sending a _301 Moved Permanently_ for all requests on port 80, pointing to the HTTPS URL. The config roughly looked like this:

```
server {
    listen 80;
    server_name example.org www.example.org;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name example.org www.example.org;

    ssl on;
    ssl_certificate /etc/ssl/example.bundle.crt;
    ssl_certificate_key /etc/ssl/example.key;

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://localhost:3000/;
    }
}
```

Everything worked fine with Chrome and Edge, but not with Firefox. When trying to access my page, Firefox simply displayed a blank page. In the developer tools I could find that the request wasn’t event performed. There was a request, but no response and zero processing time for that request. The nginx logs didn’t show anything as well. After some time of googling, I found out that I needed to specify the supported SSL ciphers and protocols. To be honest, I’m not too familiar with how SSL works, but adding the following three lines to the config solved the problem for me.

```
ssl_ciphers "EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384 EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH"
ssl_prefer_server_ciphers on;
ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
```