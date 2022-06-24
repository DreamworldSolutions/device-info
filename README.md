# DeviceInfo

It's used to get detail about Device like:

 - Screen Size: small, medium, large, hd and fullhd
 - Pointer Interface: Mouse vs Touch
 - Keyboard Interface: Virtual vs Physical

Many UI components need to adjust their look & feel and/or behaviours based on this detail. They can use this to get this information; and get updated when any of this information is changed.

All of the @dreamworld/* Web Components uses (are going to use) this.

## Usage pattern

- We can use this controller with 2 methods

```javascript
import DeviceInfo from "@dreamworld/device-info";

//Get info
let deviceInfo = DeviceInfo.info(); // { layout: "small", touch: true, vkb: false }
```

### Use it Globally (Plain JS)

```javascript
import DeviceInfo from "@dreamworld/device-info";

//Bind event
DeviceInfo.on("change", (details) => {
  //details contains only properties which are really changed.
});

//Unbind event
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
let isTouchEnabled = selectors.touch(state);
let isVKBEnabled = selectors.vkb(state);
```

It manages state at below path.

Path: `device-info`

| name          | data type  | description |
|---------------|----------- |-------------|
| layout        | String     | Possible values: `small`, `medium`, `large`, `hd` and `fullhd`. |
| touch         | Boolean    | `true` if device touch is enabled. `false` otherwise. |
| vkb           | Boolean    | `true` if device virtual keyboard is supported. `false` otherwise. |
 