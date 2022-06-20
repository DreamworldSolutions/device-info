# DeviceInfo

- It is used to get basic details of device like current layout, device supports touch OR not and device supports virtual keyboard OR not.

## Usage pattern

- We can use this controller with 2 methods

```javascript
import DeviceInfo from "@dreamworld/device-info";

//Initialize (Required)
DeviceInfo.init();
```

### Use it Globally (Plain JS)

```javascript
import DeviceInfo from "@dreamworld/device-info";

//Bind events
DeviceInfo.on("layout-changed", (layout) => {});
DeviceInfo.on("touch-changed", (touch) => {});
DeviceInfo.on("vkb-changed", (vkb) => {});
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

//Initialize with Redux store (Required)
DeviceInfo.init(store);

//use selectors to read from redux store

let layout = selectors.layout(state);
let isTouchEnabled = selectors.touch(state);
let isVKBEnabled = selectors.vkb(state);
```
