## Configuring library behaviour

The frontend library exposes a number of configuration options through the [Config](/Frontend/library/src/Config/Config.ts) class. The values of these options can be modified to tweak certain inbuilt behaviour of the frontend.

The following options are available in the frontend library to customize input:

|       Property       | Default | Description |
|         ---          |   ---   |     ---     |
|   HoveringMouseMode  |  false  | Determines whether or not the video element captures and locks the mouse when the player interacts with the widget. When enabled, the mouse cursor hovers over the player widget without interacting with it. In order to send the mouse movements to the input controller of the Unreal Engine application, the user needs to click and hold the left button of the mouse. Otherwise, clicking on the player widget causes it to capture and lock the mouse cursor. Any further movements of the mouse are passed immediately to the input controller in the Unreal Engine application. This typically allows the user to move and rotate the camera by simply dragging the mouse. To release the cursor from the control of the player widget, the user can press the **Esc** key. |
|  SuppressBrowserKeys |   true  | When this setting is enabled, the player widget will intercept function keys (**F1** to **F12**) and the **Tab** key, and pass those keypress events through to the Unreal Engine application rather than allowing the browser to process them normally.| This means, for example, that while this setting is active, pressing **F5** will not refresh the player page in the browser. Instead, that event is passed through to the Unreal Engine application, and has its usual function of switching the view to visualize shader complexity.
| FakeMouseWithTouches |  false  | When this option is enabled and the user is viewing the stream on a device with a touch screen such as a smartphone or tablet, this setting causes single-finger touch events to be interpreted by the Unreal Engine application as mouse clicks and drag events. Enabling this setting can provide users on mobile devices with the ability to partially control your Unreal Engine application, even when the application's input controller does not specifically handle touch input events. |
|   UseMic  |  false  | Indicates whether or not the stream should be created with a microphone track which is sent to the UE application. This microphone track can be listened to using the [`UPixelStreamingAudioComponent`](https://docs.unrealengine.com/5.0/en-US/API/Plugins/PixelStreaming/UPixelStreamingAudioComponent/). If this flag is enabled, a microphone audio track is created (if the browser settings allow for it) and is actively sending audio. For saving bandwidth or other functionality, it's possible to mute the microphone track by calling `PixelStreaming`'s `muteMicrophone`, and later re-enable it with `unmuteMicrophone`. If the `PixelStreaming` object was created without this flag, it's possible to enable it later by calling `unmuteMicrophone(true)`, which will use the `forceEnable` parameter to add the track and trigger a full reconnection (this is a heavier operation that takes a while). |
|   UseCamera  |  false  | Indicates whether or not the stream should be created with a video track which is sent to the UE application. This video track can be listened to using the `UPixelStreamingVideoComponent`. If this flag is enabled, a camera video track is created (if the browser settings allow for it) and is actively sending video. For saving bandwidth or other functionality, it's possible to mute the video track by calling `PixelStreaming`'s `muteCamera`, and later re-enable it with `unmuteCamera`. If the `PixelStreaming` object was created without this flag, it's possible to enable it later by calling `unmuteCamera(true)`, which will use the `forceEnable` parameter to add the track and trigger a full reconnection (this is a heavier operation that takes a while). |

When creating a frontend implementation, these options are visible via the [`Config`](/Frontend/library/src/Config/Config.ts) object required in order to create a [`PixelStreaming`](/Frontend/library/src/PixelStreaming/PixelStreaming.ts) stream for your frontend application. Simply set the values you want before initializing the stream object.

```typescript
	const config = new Config({ useUrlParams: true });
	config.setFlagEnabled(Flags.HoveringMouseMode, true);
	config.setFlagEnabled(Flags.FakeMouseWithTouches, true);

	const stream = new PixelStreaming(config);
```

### Disabling User Input

User input can be disabled entirely for one or more types of input device. This is controlled by the following input flags, all of which are enabled by default.

*   **MouseInput** - Allows mouse input events.
*   **KeyboardInput** - Allows keyboard input events.
*   **TouchInput** - Allows touch events on mobile devices and tablets.
*   **GamepadInput** - Allows input events from gamepad controllers.
*   **XRControllerInput** - Allows input events from XR controllers for use with AR and VR setups.

For example, you could set all of these flags to false in the `Config` object in order to block user input altogether.

```typescript
	const config = new Config({ useUrlParams: true });
	config.setFlagEnabled(Flags.MouseInput, false);
	config.setFlagEnabled(Flags.KeyboardInput, false);
	config.setFlagEnabled(Flags.TouchInput, false);
	config.setFlagEnabled(Flags.GamepadInput, false);
	config.setFlagEnabled(Flags.XRControllerInput, false);

	const stream = new PixelStreaming(config);
```

