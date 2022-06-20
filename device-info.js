import * as actions from "./actions.js";
export * as selectors from "./selectors.js";

export default class DeviceInfo {
  /**
   * It initializes `layout`, `touch` and `vkb`.
   * It also start listening/managing of `layout`, `touch` and `vkb`
   */
  static init(store) {
    this.layout = "small"; //TODO: set initial value
    this.touch = false; //TODO: set initial value
    this.vkb = false; //TODO: set initial value

    //Data Structure: { $eventName: $eventHandlerFunction }
    this._eventHandlerMap = {};

    if (store) {
      this.initRedux(store);
    }

    this._manageLayout();
    this._manageTouch();
    this._manageVKB();
  }

  /**
   *
   * @param {Object} store
   */
  static initRedux(store) {
    let initialState = this.info();
    store.dispatch({ type: actions.INIT, payload: initialState });
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
    this._emit("layout-changed", layout);
    this._store &&
      this._store.dispatch({ type: actions.LAYOUT_CHANGED, payload: layout });
  }

  /**
   * Starts to manage `touch`.
   * It invokes all of the event handlers of `touch-changed` whenever layout is changed.
   */
  static _manageTouch() {
    //TODO: detect touch changes
    this._emit("touch-changed", touch);
    this._store &&
      this._store.dispatch({ type: actions.TOUCH_CHANGED, payload: touch });
  }

  /**
   * Starts to manage `vkb`.
   * It invokes all of the event handlers of `vkb-changed` whenever layout is changed.
   */
  static _manageVKB() {
    //TODO: detect virtual keyboard changes
    this._emit("vkb-changed", vkb);
    this._store &&
      this._store.dispatch({ type: actions.VKB_CHANGED, payload: vkb });
  }

  /**
   * It's used to bind event handlers of events like `layout-changed`, `touch-changed` and `vkb-changed`
   * @param {String} eventName
   * @param {Object} eventHandler
   */
  static on(eventName, eventHandler) {
    let supportedEvents = ["layout-changed", "touch-changed", "vkb-changed"];

    if (supportedEvents.indexOf(eventName) === -1) {
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
    this._onLayoutChanged = this._onLayoutChanged.bind(this);
    this._onTouchChanged = this._onTouchChanged.bind(this);
    this._onVKBChanged = this._onVKBChanged.bind(this);
    this._init();
  }

  /**
   * Intialize instance
   */
  _init() {
    this.constructor.on("layout-changed", this._onLayoutChanged);
    this.constructor.on("touch-changed", this._onLayoutChanged);
    this.constructor.on("vkb-changed", this._onVKBChanged);
  }

  /**
   * Called on `layout-changed` event
   * @param {String} layout
   */
  _onLayoutChanged(layout) {
    this.layout = layout;
  }

  /**
   * Called on `touch-changed` event
   * @param {Boolean} touch
   */
  _onTouchChanged(touch) {
    this.touch = touch;
  }

  /**
   * Called on `vkb-changed` event
   * @param {Boolean} vkb
   */
  _onVKBChanged(vkb) {
    this.vkb = vkb;
  }
}
