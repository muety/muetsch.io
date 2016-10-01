## Anchr.io Screencloud script for Windows

Some of you might already use [Screencloud](https://screencloud.net/). For the others, Screencloud is a very nice multi-platform screenshot tool which allows you to capture a selection of your screen and instantly save it to a file or upload it to Dropbox, an FTP server or few other services.  
I use this tool daily and from now on I can also use it in combination with [Anchr](https://anchr.io). I didn’t want to take the time to write a full Screencloud plugin in Python. Instead I wrote a batch script which can be used with the built-in “Shell script” plugin. To set it up do the following:

1.  Create a folder in your home directory, e.g. _C:\Users\YourUsername\screencloud_anchr_
2.  Download the cURL for Windows binary to that directory. 

    **For 32-bit Windows:** [http://www.paehl.com/open_source/?download=curl_745_0_ssl.zip](http://www.paehl.com/open_source/?download=curl_745_0_ssl.zip)

    **For 64-bit Windows:** [http://ngcobalt13.uxnr.de/mirror/curl/curl-7.33.0-win64-ssl-sspi.zip](http://ngcobalt13.uxnr.de/mirror/curl/curl-7.33.0-win64-ssl-sspi.zip)

    Any other version or mirror: [http://curl.haxx.se/download.html](http://curl.haxx.se/download.html)
3.  Download jq (a command-line JSON parser) binary to that directory.  

    **For 32-bit Windows:** [https://github.com/stedolan/jq/releases/download/jq-1.5/jq-win32.exe](https://github.com/stedolan/jq/releases/download/jq-1.5/jq-win32.exe)

    **For 64-bit Windows:** [https://github.com/stedolan/jq/releases/download/jq-1.5/jq-win64.exe](https://github.com/stedolan/jq/releases/download/jq-1.5/jq-win64.exe)
4.  Copy and paste the following code to a new file in the above directory, called plugin.bat.
    ```bash
    @SET cwd=%~dp0  
    @echo %cwd:~0,-1%  
    @"%cwd%\curl.exe" -k -X POST -H "Content-Type: multipart/form-data" -F "uploadFile=@%1" https://anchr.io/api/image | "%cwd%\jq.exe" -r .href | clipboard
    ```
5.  Open Screencloud preferences menu and tell it to capture screenshots in JPG format.  

    ![](assets/img/screencloud_1.jpg)
6.  Set up the shell script like this:  

    ![](assets/img/screencloud_2.jpg)

When capturing a screenshot now, choose to save it to the shell script. This will upload the image file to Anchr and automatically copy the hyperlink to your clipboard.