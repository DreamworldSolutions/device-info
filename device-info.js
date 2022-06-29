import EventEmitter from "@dreamworld/event-emitter";
import forEach from "lodash-es/forEach.js";
import * as actions from "./actions.js";
import reducer from "./reducer.js";
export * as selectors from "./selectors.js";

const mediaQueriesBylayout = {
  small: "only screen and (max-width: 600px)",
  medium: "only screen and (min-width: 600px) and (max-width: 999px)",
  large: "only screen and (min-width: 1000px) and (max-width: 1299px)",
  hd: "only screen and (min-width: 1300px) and (max-width: 1899px)",
  fullhd: "only screen and (min-width: 1900px)",
};

var ee = new EventEmitter();

export default class DeviceInfo {
  /**
   * It initializes `layout`, `touch` and `vkb`.
   * It also start listening/managing of `layout`, `touch` and `vkb`
   */
  static {
    this.layout = this._getCurrentLayout();
    this.touch = !window.matchMedia("(any-pointer: fine)").matches;
    this.vkb = !window.matchMedia("(any-pointer: fine)").matches;
    this.hover = window.matchMedia("(any-hover: hover)").matches;

    this._manageLayout();
    this._manageTouch();
    this._manageHover();
    this._manageVKB();
  }

  /**
   * It initializes redux state
   * @param {Object} store
   */
  static initRedux(store) {
    this._store = store;

    store.addReducers({
      "device-info": reducer,
    });

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
      hover: this.hover,
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
   * It dispatches `change` event whenever `layout` is changed.
   */
  static _manageLayout() {
    const mediaChangeHandler = () => {
      forEach(mediaQueriesBylayout, (query, layout) => {
        if (window.matchMedia(query).matches) {
          if (this.layout === layout) {
            return false;
          }

          this.layout = layout;
          ee.emit("change", { layout });
          this._store &&
            this._store.dispatch({
              type: actions.LAYOUT_CHANGED,
              payload: layout,
            });
          return false;
        }
      });
    };

    forEach(mediaQueriesBylayout, (query) => {
      window.matchMedia(query).addEventListener("change", mediaChangeHandler);
    });
  }

  /**
   * Starts to manage `touch`.
   * It dispatches `change` event whenever `touch` is changed.
   */
  static _manageTouch() {
    const changeHandler = (e) => {
      this.touch = !e.matches;
      ee.emit("change", { touch: this.touch, vkb: this.touch });
      this._store &&
        this._store.dispatch({
          type: actions.TOUCH_CHANGED,
          payload: this.touch,
        }) &&
        this._store.dispatch({
          type: actions.VKB_CHANGED,
          payload: this.touch,
        });
    };

    window
      .matchMedia("(any-pointer: fine)")
      .addEventListener("change", changeHandler);
  }

  /**
   * It starts listening on `any-hover` media query and update `hover` property
   */
  static _manageHover() {
    const changeHandler = (e) => {
      this.hover = e.matches;
      ee.emit("change", { hover: this.hover });
      this._store &&
        this._store.dispatch({
          type: actions.HOVER_CHANGED,
          payload: this.hover,
        });
    };

    window
      .matchMedia("(any-hover: hover)")
      .addEventListener("change", changeHandler);
  }

  /**
   * Starts to manage `vkb`.
   * It dispatches `change` event whenever `vkb` is changed.
   */
  static _manageVKB() {
    //Futute enhancement: Detect virtual keyboard is supported OR not. Currently it's managed by `touch` and alias of it.
  }

  /**
   * It's used to bind given eventHandler of given eventName
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
   * It's used to unbind given eventHandler of given eventName
   * @param {String} eventName
   * @param {Object} eventHandler
   */
  static off(eventName, eventHandler) {
    if (eventName !== "change") {
      throw `unsupported eventName=${eventName}`;
    }

    ee.off(eventName, eventHandler);
  }

  constructor(host) {
    host && (this.host = host).addController(this);
    this.layout = this.constructor.layout;
    this.touch = this.constructor.touch;
    this.vkb = this.constructor.vkb;
    this.hover = this.constructor.hover;
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
  _onChange({ layout, touch, vkb, hover }) {
    this.layout = this.constructor.layout;
    this.touch = this.constructor.touch;
    this.vkb = this.constructor.vkb;
    this.hover = this.constructor.hover;
    this.host.requestUpdate();
  }
}
