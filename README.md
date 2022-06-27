# DeviceInfo

It's used to get detail about Device like:

- Screen Size: small, medium, large, hd and fullhd
- Pointer Interface: Mouse vs Touch
- Keyboard Interface: Virtual vs Physical

Many UI components need to adjust their look & feel and/or behaviours based on this detail. They can use this to get this information; and get updated when any of this information is changed.

All of the @dreamworld/* Web Components uses (are going to use) this.

## Usage Guide

### Use it Globally (Plain JS)

```javascript
import DeviceInfo from "@dreamworld/device-info";

//Get info
let deviceInfo = DeviceInfo.info(); // { layout: "small", touch: true, vkb: false }


//Bind event: Start listening for changes
DeviceInfo.on("change", (details) => {
  //details contains only properties which are really changed.
});

//Unbind event: Stop listening for the changes.
DeviceInfo.off("change", handler);
```

### Use it as Lit Reactive Controller

```javascript
import { LitElement, html } from "lit";
import DeviceInfo from "@dreamworld/device-info";

class MyComponent extends LitElement {
  deviceInfo = new DeviceInfo(this);

  // Use the controller in render()
  render() {
    return html`
      current layout: ${this.deviceInfo.layout} is touch enabled: ${this
        .deviceInfo.touch} is Virtual keyboard supported: ${this.deviceInfo.vkb}
    `;
  }
}
```

### Enable redux

```javascript
import { default as DeviceInfo, selectors } from "@dreamworld/device-info";

//Init redux
DeviceInfo.initRedux(store);

//use selectors to read details from redux store

let layout = selectors.layout(state);
let touchEnabled = selectors.touch(state);
let virtualKeyBoardEnabled = selectors.vkb(state);
```

It manages state at below path.

Path: `device-info`

| name          | data type  | description |
|---------------|----------- |-------------|
| layout        | String     | Possible values: `small`, `medium`, `large`, `hd` and `fullhd`. |
| touch         | Boolean    | `true` if device touch is enabled. `false` otherwise. |
| vkb           | Boolean    | `true` if device virtual keyboard is enabled. `false` otherwise. |
 
# Future Enhancements

At present `vkb` and `touch` both always has the same value. We assumed that whenver user is `touch` interface, then Virtual Keyboard will also be used. 
 
But, that's not always true. e.g. A Windows Laptop user may be using `touch` interface for pointing and though physical keyboard is being used. In future, this implementation will be enhanced to detect based on - viewport is resized when user focus into an input element. Because, if viewport is resized on input focus then it's said that virtual keyboard is used.

Note: `vkb` is mainly needed because iOS devices behave differently then the Android Devices when a virtual keyboard is opened. So, to ensure common experience on all the device we use **fit** style for the dialog when dialog's content has any input elelement. In future, iOS many change this behaviour and we may remove `vkb` also.