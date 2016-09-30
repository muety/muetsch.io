## Docker Beta for Windows: Docker.Backend.HyperVException

Docker has recently released a beta version of a new Docker for Windows and Mac. It replaces Docker Machine and basically doesn’t use VirtualBox anymore, but *Hyper-V* or *xhyve* and should therefore be more performant and efficient.

I wanted to try that new Docker on my Windows 10 Pro machine (as far as I know, you will need Pro because of the Hyper-V support), so I downloaded and installed it. Once installed and restarted, it prompted me to install Hyper-V. The Docker installer did the download, but then the residual installation failed with an error text that contained ***Docker.Backend.HyperVException*** as a keyword.

A solution was to install Hyper-V “manually” through the *Turn Windows features on or off* menu in the control panel. After a reboot, Docker actually seems to work now.

To be perfectly honest, there was another problem in between. After having enabled Hyper-V (**including both the tools and the platform!**) my PC didn’t boot up anymore. It got stuck at the windows logo screen, but without the progress circle or anything. I did a hard-reset to make the automatic repair come up at the next reboot, which then failed. But now I could choose from the *Advanced boot options* to *Disable early-launch anti-malware protection*. This solved the problem for me, so that my PC was able to reboot again. In some forum posts I also read about people who had to disable USB 3.0 support (mostly in combination with Gigabyte mainboards – like mine) in their BIOS to fix the exact same problem as described above.

Good luck and have fun with the new Docker for Windows. I’m going to give it a deeper try one of the next days.