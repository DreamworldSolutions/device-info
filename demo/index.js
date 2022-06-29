import { default as DeviceInfo, selectors } from "../device-info.js";
import { store } from "./store.js";

let deviceInfo = DeviceInfo.info();
console.log("DeviceInfo=", deviceInfo);

// Initializes redux
DeviceInfo.initRedux(store);

const handler = (details) => {
  console.log("details changed=", details);
};

DeviceInfo.on("change", handler);
window.DeviceInfo = DeviceInfo;
