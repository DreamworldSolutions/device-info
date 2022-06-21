import { isTouchDevice } from '@dreamworld/web-util';
import forEach from 'lodash-es/forEach.js';
import EventEmitter from '@dreamworld/event-emitter';
import * as actions from "./actions.js";
export * as selectors from "./selectors.js";

const mediaQueriesBylayout = {
  "small": "only screen and (max-width: 600px)",
  "medium": "only screen and (min-width: 600px) and (max-width: 999px)",
  "large": "only screen and (min-width: 1000px) and (max-width: 1299px)",
  "hd": "only screen and (min-width: 1300px) and (max-width: 1899px)",
  "fullhd": "only screen and (min-width: 1900px)"
};

var ee = new EventEmitter();

export default class DeviceInfo {
  /**
   * It initializes `layout`, `touch` and `vkb`.
   * It also start listening/managing of `layout`, `touch` and `vkb`
   */
  static {
    this.layout = this._getCurrentLayout();
    this.touch = isTouchDevice();
    this.vkb = isTouchDevice();

    //Data Structure: { $eventName: $eventHandlerFunction[] }
    this._eventHandlerMap = {};

    this._manageLayout();
    // this._manageTouch();
    // this._manageVKB();
  }

  /**
   *
   * @param {Object} store
   */
  static initRedux(store) {
    this._store = store;
    let initialState = this.info();
    this._store.dispatch({ type: actions.INIT, payload: initialState });
  }

  /**
   * Returns device info
   * @return {Object} contains { layout, touch, vkb }
   */
  static info() {
    return {
      layout: this.layout,
      touch: this.touch,
      vkb: this.vkb
    };
  }

  static _getCurrentLayout() {
    let currentLayout;

    forEach(mediaQueriesBylayout, (query, layout) => {
      if (window.matchMedia(query).matches) {
        currentLayout = layout;
        return false;
      }
    });

    return currentLayout;
  }

  /**
   * Starts to manage `layout`.
   * It invokes all of the event handlers of `layout-changed` whenever layout is changed.
   */
  static _manageLayout() {
    const mediaChangeHandler = () => {
      forEach(mediaQueriesBylayout, (query, layout) => {
        if (window.matchMedia(query).matches) {
          if(this.layout === layout) {
            return false;
          }

          this.layout = layout;
          ee.emit("change", { layout });
          this._store &&
            this._store.dispatch({ type: actions.LAYOUT_CHANGED, payload: layout });
          return false;
        }
      });
    };

    forEach(mediaQueriesBylayout, (query) => {
      window.matchMedia(query).addListener(mediaChangeHandler);
    });
  }

  /**
   * Starts to manage `touch`.
   * It invokes all of the event handlers of `touch-changed` whenever layout is changed.
   */
  static _manageTouch() {
    //TODO: detect touch changes
    ee.emit("change", { touch });
    this._store &&
      this._store.dispatch({ type: actions.TOUCH_CHANGED, payload: touch });
  }

  /**
   * Starts to manage `vkb`.
   * It invokes all of the event handlers of `vkb-changed` whenever layout is changed.
   */
  static _manageVKB() {
    //TODO: detect virtual keyboard changes
    ee.emit("change", { vkb });
    this._store &&
      this._store.dispatch({ type: actions.VKB_CHANGED, payload: vkb });
  }

  /**
   * It's used to bind event handlers of events like `layout-changed`, `touch-changed` and `vkb-changed`
   * @param {String} eventName
   * @param {Object} eventHandler
   */
  static on(eventName, eventHandler) {
    if (eventName !== "change") {
      throw `unsupported eventName=${eventName}`;
    }

    ee.on(eventName, eventHandler);
  }

  /**
   * It's used to unbind event handlers of events like `layout-changed`, `touch-changed` and `vkb-changed`
   * @param {String} eventName
   * @param {Object} eventHandler
   */
  static off(eventName, eventHandler) {
    ee.off(eventName, eventHandler);
  }

  constructor(host) {
    host && (this.host = host).addController(this);
    this.layout = this.constructor.layout;
    this.touch = this.constructor.touch;
    this.vkb = this.constructor.vkb;
    this._onChange = this._onChange.bind(this);
    this._init();
  }

  /**
   * Intialize instance
   */
  _init() {
    this.constructor.on("change", this._onChange);
  }

  /**
   * Called on `change` event
   * It updates changed properties value
   * @param {Object} details contains only properties which are changed
   */
  _onChange({ layout, touch, vkb }) {
    this.layout = layout || this.layout;
    this.touch = touch || this.touch;
    this.vkb = vkb || this.vkb;
    this.host.requestUpdate();
  }
}
