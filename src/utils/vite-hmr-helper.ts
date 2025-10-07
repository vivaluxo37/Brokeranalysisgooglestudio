/**
 * Vite HMR Helper
 * Utilities for handling Hot Module Replacement in development
 */

// HMR acceptance wrapper
export const acceptHMR = (importMeta: any, callback?: () => void) => {
  if (importMeta.hot) {
    importMeta.hot.accept(callback);
  }
};

// HMR dispose wrapper
export const disposeHMR = (importMeta: any, callback: () => void) => {
  if (importMeta.hot) {
    importMeta.hot.dispose(callback);
  }
};

// HMR decline wrapper
export const declineHMR = (importMeta: any) => {
  if (importMeta.hot) {
    importMeta.hot.decline();
  }
};

// HMR invalidate wrapper
export const invalidateHMR = (importMeta: any) => {
  if (importMeta.hot) {
    importMeta.hot.invalidate();
  }
};

// Development check
export const isDevelopment = import.meta.env.MODE === 'development';

// HMR debug utility
export const debugHMR = (importMeta: any, message: string, data?: any) => {
  if (importMeta.env?.MODE === 'development' && importMeta.hot) {
    console.log(`[HMR] ${message}`, data);
  }
};

export default {
  acceptHMR,
  disposeHMR,
  declineHMR,
  invalidateHMR,
  isDevelopment,
  debugHMR
};