import { LitElement, html } from "lit";
import { connect } from "pwa-helpers/connect-mixin.js";
import { store } from "./store.js";
import { default as DeviceInfo, selectors } from "../device-info.js";

class MyTest extends connect(store)(LitElement) {
  deviceInfo = new DeviceInfo(this);

  static properties = {
    layout: { type: String },
    touch: { type: Boolean },
    vkb: { type: Boolean },
    hover: { type: Boolean },
  };

  render() {
    return html`
      Values updating through reactive controllers Layout:
      ${this.deviceInfo.layout}<br />
      Touch: ${this.deviceInfo.touch}<br />
      VKB: ${this.deviceInfo.vkb}<br />
      Hover: ${this.deviceInfo.hover}

      <br />
      <br />
      Values updating through state change Layout: ${this.layout}<br />
      Touch: ${this.touch}<br />
      VKB: ${this.vkb}<br />
      hover: ${this.hover}
    `;
  }

  stateChanged(state) {
    this.layout = selectors.layout(state);
    this.touch = selectors.touch(state);
    this.vkb = selectors.vkb(state);
    this.hover = selectors.hover(state);
  }
}

customElements.define("my-test", MyTest);