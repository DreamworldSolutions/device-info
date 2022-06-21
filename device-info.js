import * as actions from "./actions.js";
export * as selectors from "./selectors.js";

export default class DeviceInfo {
  /**
   * It initializes `layout`, `touch` and `vkb`.
   * It also start listening/managing of `layout`, `touch` and `vkb`
   */
  static {
    this.layout = "small"; //TODO: set initial value
    this.touch = true; //TODO: set initial value
    this.vkb = false; //TODO: set initial value

    //Data Structure: { $eventName: $eventHandlerFunction[] }
    this._eventHandlerMap = {};

    this._manageLayout();
    this._manageTouch();
    this._manageVKB();
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
      vkb: this.vkb,
    };
  }

  /**
   * Starts to manage `layout`.
   * It invokes all of the event handlers of `layout-changed` whenever layout is changed.
   */
  static _manageLayout() {
    //TODO: detect layout changes
    this._emit("change", { layout });
    this._store &&
      this._store.dispatch({ type: actions.LAYOUT_CHANGED, payload: layout });
  }

  /**
   * Starts to manage `touch`.
   * It invokes all of the event handlers of `touch-changed` whenever layout is changed.
   */
  static _manageTouch() {
    //TODO: detect touch changes
    this._emit("change", { touch });
    this._store &&
      this._store.dispatch({ type: actions.TOUCH_CHANGED, payload: touch });
  }

  /**
   * Starts to manage `vkb`.
   * It invokes all of the event handlers of `vkb-changed` whenever layout is changed.
   */
  static _manageVKB() {
    //TODO: detect virtual keyboard changes
    this._emit("change", { vkb });
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

    //TODO: register into `_eventHandlerMap`
  }

  /**
   * It's used to unbind event handlers of events like `layout-changed`, `touch-changed` and `vkb-changed`
   * @param {String} eventName
   * @param {Object} eventHandler
   */
  static off(eventName, eventHandler) {
    //TODO: unregister from `_eventHandlerMap`
  }

  /**
   * It's used by internally to emit events
   * It invokes registered event handlers in `_eventHandlerMap` for given eventName
   * @param {String} eventName
   */
  static _emit(eventName) {}

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
  }
}
