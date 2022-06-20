import {
  INIT,
  LAYOUT_CHANGED,
  TOUCH_CHANGED,
  VKB_CHANGED
} from './actions.js';

export default (state, action) => {
  switch (action.type) {
    case INIT:
      return state;
      
    case LAYOUT_CHANGED:
      return state;

    case TOUCH_CHANGED:
      return state;

    case VKB_CHANGED:
      return state;

    default:
      return state;
  }
};