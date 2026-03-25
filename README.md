# @dreamworld/device-info

Detects and reactively tracks device characteristics — screen layout breakpoint, pointer type (touch vs. mouse), virtual keyboard presence, and hover capability — and exposes them via a plain JS static API, a Lit Reactive Controller, and an optional Redux integration.

---

## 1. User Guide

### Installation & Setup

```bash
npm install @dreamworld/device-info
```

> This is a pure ES Module (`"type": "module"`). Use a bundler or dev server that supports ESM (e.g., `@web/dev-server`, Vite, Rollup).
>
> On import, `DeviceInfo._init()` is called automatically in browser environments. No manual bootstrap is required for client-side usage.

---

### Basic Usage

#### Approach 1 — Plain JavaScript (Static API)

```javascript
import DeviceInfo from "@dreamworld/device-info";

// Read current state
const info = DeviceInfo.info();
// => { layout: "large", touch: false, vkb: false, hover: true }

// Listen for any property change
DeviceInfo.on("change", (details) => {
  // `details` contains only the properties that changed
  // e.g. { layout: "small" } or { touch: true, vkb: true }
  console.log("device changed:", details);
});

// Stop listening
DeviceInfo.off("change", handler);
```

#### Approach 2 — Lit Reactive Controller

```javascript
import { LitElement, html } from "lit";
import DeviceInfo from "@dreamworld/device-info";

class MyComponent extends LitElement {
  // On SSR, the `device` option is mandatory.
  // On the browser, `device` is ignored — live media queries are used instead.
  deviceInfo = new DeviceInfo(this, { device: "desktop" });

  render() {
    return html`
      <p>Layout: ${this.deviceInfo.layout}</p>
      <p>Touch: ${this.deviceInfo.touch}</p>
      <p>VKB: ${this.deviceInfo.vkb}</p>
      <p>Hover: ${this.deviceInfo.hover}</p>
    `;
  }
}
```

The controller registers itself with `host.addController(this)` and calls `host.requestUpdate()` whenever any property changes, so re-renders happen automatically.

#### Approach 3 — Redux

```javascript
import { default as DeviceInfo, selectors } from "@dreamworld/device-info";

// --- Client side ---
// store must expose an `addReducers` method (e.g., LazyReducerEnhancer)
DeviceInfo.initRedux(store);

// --- Server side (SSR) ---
const instance = new DeviceInfo(null, { device: "mobile" });
instance.initReduxOnServer(store);

// --- Read from state ---
const layout = selectors.layout(state);  // e.g. "small"
const touch  = selectors.touch(state);   // e.g. true
const vkb    = selectors.vkb(state);     // e.g. true
const hover  = selectors.hover(state);   // e.g. false
```

Redux state is managed at the path `device-info`.

---

### API Reference

#### Static Properties

These are set automatically by `DeviceInfo._init()` in the browser and updated in real time.

| Property | Type    | Description |
|----------|---------|-------------|
| `DeviceInfo.layout` | `string` | Current layout breakpoint. One of `small`, `medium`, `large`, `hd`, `fullhd`. |
| `DeviceInfo.touch`  | `boolean` | `true` if the primary pointer is coarse (touch). |
| `DeviceInfo.vkb`    | `boolean` | `true` if a virtual keyboard is in use. Currently always equal to `touch`. |
| `DeviceInfo.hover`  | `boolean` | `true` if any input device supports hover. |

---

#### Static Methods

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `info` | `info(device?: string)` | `{ layout, touch, vkb, hover }` | Returns current device info. Pass a `device` string (`'mobile'`, `'tablet'`, `'desktop'`) for an SSR-safe snapshot; omit on the client. |
| `initRedux` | `initRedux(store: Object)` | `void` | Registers the `device-info` reducer into `store` via `store.addReducers()` and dispatches the initial state. Client-side only. |
| `on` | `on(eventName: string, handler: Function)` | `void` | Subscribes to device change events. Only `'change'` is supported; throws otherwise. |
| `off` | `off(eventName: string, handler: Function)` | `void` | Unsubscribes a previously registered handler. Only `'change'` is supported; throws otherwise. |

---

#### Constructor

```javascript
new DeviceInfo(host, options)
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `host` | `LitElement \| null` | No | Lit host element. When provided, the instance registers itself as a Reactive Controller via `host.addController(this)`. Pass `null` when using for SSR-only Redux initialization. |
| `options.device` | `string` | **SSR only** | Device type hint for server-side rendering. Required when `isServer` is `true`. Accepted values: `'mobile'`, `'tablet'`, `'desktop'`. Throws if omitted on the server. |

On the browser, the instance reads current values from the static class properties and subscribes to `'change'` events to stay in sync.

---

#### Instance Methods

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `initReduxOnServer` | `initReduxOnServer(store: Object)` | `void` | Registers the `device-info` reducer and dispatches initial state derived from the `device` option passed to the constructor. For SSR use only. |

---

#### Instance Properties (read-only after construction)

| Property | Type | Description |
|----------|------|-------------|
| `layout` | `string` | Mirrors `DeviceInfo.layout` (client) or derived from `device` option (server). |
| `touch`  | `boolean` | Mirrors `DeviceInfo.touch` (client) or derived from `device` option (server). |
| `vkb`    | `boolean` | Mirrors `DeviceInfo.vkb` (client) or derived from `device` option (server). |
| `hover`  | `boolean` | Mirrors `DeviceInfo.hover` (client) or derived from `device` option (server). |

---

#### `selectors` Named Export

```javascript
import { selectors } from "@dreamworld/device-info";
```

All selectors read from the `device-info` key of the Redux state tree using `lodash-es/get`.

| Function | Signature | Returns | Description |
|----------|-----------|---------|-------------|
| `selectors.layout` | `layout(state: Object)` | `string \| undefined` | Returns `state["device-info"].layout`. |
| `selectors.touch`  | `touch(state: Object)`  | `boolean \| undefined` | Returns `state["device-info"].touch`. |
| `selectors.vkb`    | `vkb(state: Object)`    | `boolean \| undefined` | Returns `state["device-info"].vkb`. |
| `selectors.hover`  | `hover(state: Object)`  | `boolean \| undefined` | Returns `state["device-info"].hover`. |

---

### Configuration Options

#### Layout Breakpoints

Derived from the `mediaQueriesBylayout` constant in [device-info.js](device-info.js).

| Layout   | Media Query |
|----------|-------------|
| `small`  | `only screen and (max-width: 576px)` |
| `medium` | `only screen and (min-width: 577px) and (max-width: 768px)` |
| `large`  | `only screen and (min-width: 769px) and (max-width: 1024px)` |
| `hd`     | `only screen and (min-width: 1025px) and (max-width: 1400px)` |
| `fullhd` | `only screen and (min-width: 1401px)` |

#### SSR Device-to-Layout Mapping

When a `device` string is passed to `DeviceInfo.info(device)` or the constructor, properties are derived as follows:

| `device`    | `layout`  | `touch` | `vkb`  | `hover` |
|-------------|-----------|---------|--------|---------|
| `'mobile'`  | `'small'` | `true`  | `true` | `false` |
| `'tablet'`  | `'medium'`| `true`  | `true` | `false` |
| `'desktop'` | `'hd'`    | `false` | `false`| `true`  |

---

### Advanced Usage

#### `change` Event Payload

The handler passed to `DeviceInfo.on('change', handler)` receives an object containing **only** the properties that changed in the current event. Other properties are absent.

```javascript
DeviceInfo.on("change", (details) => {
  if (details.layout !== undefined) console.log("new layout:", details.layout);
  if (details.touch  !== undefined) console.log("touch changed:", details.touch);
  if (details.vkb    !== undefined) console.log("vkb changed:", details.vkb);
  if (details.hover  !== undefined) console.log("hover changed:", details.hover);
});
```

Note: when touch changes, `vkb` always changes with it (they are emitted together in a single event).

#### Redux Action Types

The following action type constants are exported from [actions.js](actions.js) for use in custom middleware or sagas.

| Constant | Value | Dispatched When |
|----------|-------|-----------------|
| `INIT` | `"DEVICE_INFO_INIT"` | Redux is first initialized with current device state. |
| `LAYOUT_CHANGED` | `"DEVICE_INFO_LAYOUT_CHANGED"` | Viewport crosses a breakpoint boundary. |
| `TOUCH_CHANGED` | `"DEVICE_INFO_TOUCH_CHANGED"` | Pointer type changes between coarse and fine. |
| `VKB_CHANGED` | `"DEVICE_INFO_VKB_CHANGED"` | Virtual keyboard availability changes. |
| `HOVER_CHANGED` | `"DEVICE_INFO_HOVER_CHANGED"` | Hover capability changes. |

```javascript
import { INIT, LAYOUT_CHANGED, TOUCH_CHANGED, VKB_CHANGED, HOVER_CHANGED } from "@dreamworld/device-info/actions.js";
```

#### Redux Reducer

The reducer is available as a standalone export for manual store configuration:

```javascript
import reducer from "@dreamworld/device-info/reducer.js";

// Manually register at the 'device-info' state key
store.addReducers({ "device-info": reducer });
```

State shape managed by the reducer:

```javascript
{
  "device-info": {
    layout: string,   // 'small' | 'medium' | 'large' | 'hd' | 'fullhd'
    touch:  boolean,
    vkb:    boolean,
    hover:  boolean
  }
}
```

---

## 2. Developer Guide / Architecture

### Architecture Overview

#### Design Patterns

| Pattern | Where Applied |
|---------|--------------|
| **Singleton (static state)** | All device state (`layout`, `touch`, `vkb`, `hover`) is stored as static class properties on `DeviceInfo`. A single module-level `EventEmitter` instance is shared across all consumers. `_init()` is called once at module load time in the browser. |
| **Observer** | `EventEmitter` (`@dreamworld/event-emitter`) is used internally to decouple change detection from consumers. `DeviceInfo.on` / `DeviceInfo.off` expose the subscription interface. |
| **Lit Reactive Controller** | `DeviceInfo` instances implement the Lit controller interface (`addController`, `requestUpdate`). The instance subscribes to the static EventEmitter and calls `this.host.requestUpdate()` on change, triggering a Lit re-render. |
| **Redux integration (optional)** | The library optionally integrates with a Redux store. It dispatches typed actions on state change and exposes a reducer and selectors for predictable state management. Requires the store to support `addReducers` (e.g., `LazyReducerEnhancer` from `pwa-helpers`). |

---

#### Module Responsibilities

| File | Responsibility |
|------|---------------|
| [device-info.js](device-info.js) | Core class. Detects initial state, registers media query listeners, manages static properties, emits events, and implements the Lit controller and Redux client interface. |
| [actions.js](actions.js) | Defines Redux action type string constants. |
| [reducer.js](reducer.js) | Pure reducer function. Handles `INIT`, `LAYOUT_CHANGED`, `TOUCH_CHANGED`, `VKB_CHANGED`, `HOVER_CHANGED`. |
| [selectors.js](selectors.js) | Safe accessors over the `device-info` Redux state slice using `lodash-es/get`. |

---

#### Detection Mechanism

All detection uses CSS Media Queries via `window.matchMedia`:

| Property | Media Query Used |
|----------|-----------------|
| `layout` | One of five viewport-width ranges (see breakpoints table above) |
| `touch` / `vkb` | `(pointer: coarse)` — detects coarse (touch) primary pointer |
| `hover` | `(any-hover: hover)` — true if any input device supports hover |

Each listener is registered with `addEventListener("change", ...)` on the `MediaQueryList` object, so changes are reactive without polling.

---

### Dependencies

**Production**

| Package | Version | Purpose |
|---------|---------|---------|
| `@dreamworld/event-emitter` | `^1.1.0` | EventEmitter used for the static `change` event bus. |
| `@dreamworld/pwa-helpers` | `^1.16.1` | Provides the `isServer` flag used for SSR environment detection. |
| `lodash-es` | `^4.17.21` | `forEach` (layout iteration), `get` (safe state access in selectors). |

**Development**

| Package | Purpose |
|---------|---------|
| `lit` ^2.2.6 | Used in demo components only. |
| `pwa-helpers` ^0.9.1 | `connect-mixin`, `lazy-reducer-enhancer` in demo store. |
| `redux` ^4.2.0 | Demo store. |
| `redux-thunk` ^2.4.1 | Demo store middleware. |
| `@web/dev-server` ^0.1.32 | Development server (`npm start`). |
| `semantic-release` 17.0.8 | Automated versioning and npm publish via CI. |

---

## Future Enhancements

- **`vkb` independent of `touch`:** Currently `vkb` always equals `touch`. The planned improvement is to detect virtual keyboard presence by observing viewport resize on input focus, since resizing on focus is a reliable indicator that a virtual keyboard has appeared.

- **iOS-specific `vkb` handling:** `vkb` is primarily needed because iOS handles viewport resizing differently from Android when a virtual keyboard opens. If iOS changes this behavior, `vkb` may be removed.
