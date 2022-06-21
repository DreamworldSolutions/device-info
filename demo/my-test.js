import { LitElement, html } from 'lit';
import { default as DeviceInfo, selectors } from '../device-info.js';

let info = DeviceInfo.info();

class MyTest extends LitElement {

  deviceInfo = new DeviceInfo(this);

  render() {
    return html`Layout: ${this.deviceInfo.layout}
    Touch: ${this.deviceInfo.touch}
    VKB: ${this.deviceInfo.vkb}`;
  }
}

customElements.define('my-test', MyTest);