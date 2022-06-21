import { default as DeviceInfo, selectors } from '../device-info.js';

let deviceInfo = DeviceInfo.info();

console.log("DeviceInfo=", deviceInfo);

const handler = (details) => {
  console.log("details changed=", details);
};

DeviceInfo.on('change', handler);
window.DeviceInfo = DeviceInfo;