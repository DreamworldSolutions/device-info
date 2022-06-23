import {
  INIT,
  LAYOUT_CHANGED,
  TOUCH_CHANGED,
  VKB_CHANGED
} from './actions.js';

export default (state = {}, action) => {
  switch (action.type) {
    case INIT:
      return { ...action.payload };
      
    case LAYOUT_CHANGED:
      return { ...state, layout: action.payload };

    case TOUCH_CHANGED:
      return { ...state, touch: action.payload };

    case VKB_CHANGED:
      return { ...state, vkb: action.payload };

    default:
      return state;
  }
};