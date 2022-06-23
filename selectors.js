import get from 'lodash-es/get.js';

/**
 * It returns current layout of device.
 * @param {Object} state 
 * @returns {String}
 */
export const layout = (state) => {
  return get(state, `device-info.layout`);
};

/**
 * It returns `true` if currently touch is enabled in device. `false` otherwise.
 * @param {Object} state 
 * @returns {Boolean}
 */
export const touch = (state) => {
  return get(state, `device-info.touch`);
};

/**
 * It returns `true` if currently virtual keyboard is supported in device. `false` otherwise.
 * @param {Object} state 
 */
export const vkb = (state) => {
  return get(state, `device-info.vkb`);
};