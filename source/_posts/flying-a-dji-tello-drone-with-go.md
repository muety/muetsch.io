---
title: Flying a DJI Tello Drone with Go
date: 2019-10-01 14:21:53
tags:
description: In this post, we program a DJI Tello drone using Go and control it from the command line.
---

# The Idea
A few months ago, I bought a [DJI Tello](https://amzn.to/2neAwVr) (affiliate link) drone on Amazon for ~ 80 €, which is quite an impressive price, considering that you can also pay several hundred or even thousand Euro for a DJI drone. Of course, this one is only meant for fun and tinkering, not for professional photography or so. 
Even though I was amazed by how easy it is to control the drone from your smartphone – even with windy weather conditions - the Tello started to bore me after a few weeks. I wanted to do something more interesting with the drone – I wanted to **program it**!

![](https://apps.muetsch.io/images/o:auto?image=https://muetsch.io/images/tello1.jpg)

# Using Gobot SDK
During my research on how to program drones - specifically the Tello – I found an article called ["Hello, Tello - Hacking Drones With Go"](https://gobot.io/blog/2018/04/20/hello-tello-hacking-drones-with-go/), which referenced the documentation of a robot programming toolkit called [Gobot](https://gobot.io). As it turned out, Gobot is a Go SDK to control several different micro-robots like [GoPiGo3](https://gobot.io/documentation/platforms/gopigo3/), the [Parrot Ardrone](https://gobot.io/documentation/platforms/ardrone/), any drone using the [MAVLink protocol](https://mavlink.io/en/), [Pebble smartwatches](https://gobot.io/documentation/platforms/pebble/) and many more. It also has support for different microcontrollers, including Arduino, RaspberryPi and Intel Edison as well as communication protocols like MQTT or [NATS](https://nats.io/). Gobot's API to interface with any of the supported platforms appeared to be quite straightforward and easy to understand, so I decided to give it a try.

My first goal was to just have a little program that allows me to **control the drone from my PC** instead of the [official Tello app](https://play.google.com/store/apps/details?id=com.ryzerobotics.tello). Luckily, Gobot also provides a [keyboard driver](https://godoc.org/gobot.io/x/gobot/platforms/keyboard) (there's also an Xbox360 gamepad driver) that can be used to subscribe to certain key events, etc.

# First Prototype

![](https://apps.muetsch.io/images/o:auto?image=https://muetsch.io/images/tello2.png)

After tinkering for two hours (and having my poor drone hit the wall several times), I got a basic program that:
 - **connects** to the drone
 - prints incoming **status information** (like battery state) to the console
 - handles **keyboard events** (↑↓←→ for lateral and longitudinal navigation, WASD for rotation and altitude control, spacebar to start and land)
 - runs something like a **"game loop"** with a tick rate of 10 FPS to sync the latest user commands with the drone
 - renders the drone's **video stream** to an [MPlayer](https://wiki.debian.org/MPlayer) window with 10 FPS

The program's main method is as simple as this:

```go
// tello.go
// [...]
func main() {
	// Init Gobot drivers
	keys := keyboard.NewDriver()
	drone := tello.NewDriver("8890")

	work := func() {
		// Handle keyboard inputs
		keys.On(keyboard.Key, handleKeyboardInput(drone))

		// Handle drone events
		drone.On(tello.FlightDataEvent, handleFlightData(drone))
		drone.On(tello.ConnectedEvent, handleConnected(drone))
		drone.On(tello.LandingEvent, handleLanding(drone))
		drone.On(tello.VideoFrameEvent, handleVideo(drone))
	}

	robot := gobot.NewRobot(
		"tello",
		[]gobot.Connection{},
		[]gobot.Device{keys, drone},
		work,
	)

	robot.Start()
}
// [...]
```

In addition, here's a little excerpt from the `tick()` method, that checks for the latest key input and calls the corresponding control methods.

```go
// tello.go
// [...]
if currentControl == keyboard.A {
    fmt.Println("Going left.")
    if !dry {
        drone.Left(intensity)
    }
// [...]
} else if currentControl == keyboard.ArrowRight {
    fmt.Println("Rotating clockwise.")
    if !dry {
        drone.Clockwise(intensity)
    }
} else {
    fmt.Println("Resetting steering.")
    resetSteering(drone)
}
// [...]
```

The entire code is **available on GitHub** at [muety/tello](https://github.com/muety/tello).

# Challenges
One thing that made me stuck for a while was the way API commands like `drone.Left(100)` (where the integer parameter represents the movement's "intensity" or speed) work. Once called, they are being applied continuously until manually stopped. In this case, the drone would go left with max speed until you explicitly send `drone.Left(0)`. This behavior combined with the fact that Gobot's keyboard driver only supports to communicate when a key **is pressed**, but **not when it's released** again, made it a little difficult to smoothly control the drone. To cope with that, I introduced a **debouncing logic**. When a key is pressed (e.g. ←), a flag for that key is toggled on for 250 ms before it's automatically reset again, if the key was released in the meantime. Within the `tick()` method, the only thing done is to translate the binary key states to API commands and sync them to the device. 

# Future Plans
In case I have some time to further work in this little project, I would love to add basic **"self-flying" capabilities**. How cool would it be to have the ability to set a marker on a map and have the Tello fly there autonomously, while automatically avoiding obstacles in its way? A good starting point for this might be to take a look into [GoCV](https://gocv.io/), which is a Go interface to OpenCV. Alternatively, Microsoft's [AirSim](https://github.com/Microsoft/AirSim) simulator provides explicit support for training machine learning models for self-flying drones. Very cool!