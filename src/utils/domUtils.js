// utils/domUtils.js
export function rafRead(fn) {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        const result = fn();
        resolve(result);
      });
    });
  }
  
  export function rafWrite(fn) {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        fn();
        resolve();
      });
    });
  }
  