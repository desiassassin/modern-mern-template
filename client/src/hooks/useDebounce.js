import { useEffect, useState } from "react";

/**
 * @description Applies debouncing to a react state variable, and updates it after a specified `delay`
 * @param {any} initialValue
 * @param {number} delay
 * @example const [oldValue, currentValue, setValue] = useDebounce("initial value", 1000);
 * @returns {[oldValue, currentValue, setValue]}
 *
 * `debouncedValue`: original value
 *
 * `value`: current value
 *
 * `setValue`: setter function to set the value
 */
export default function useDebounce(initialValue = "", delay = 0) {
     // original value before debouncing was applied
     const [debouncedValue, setDebouncedValue] = useState(initialValue);
     // current value
     const [value, setValue] = useState(initialValue);
     // callback to execute once timer runs out
     const [callback, setCallback] = useState(function () {});

     function updateValue(value, callback) {
          setValue(value);
          setCallback(callback);
     }

     useEffect(
          function updatedValueOrCancelUpdate() {
               if (delay) {
                    // store timeout's id to cancel it later if the value is updated before the timeout runs
                    const timeout = setTimeout(function updateValue() {
                         setDebouncedValue(value);
                         if (callback) callback();
                    }, delay);

                    // clear timeout if the value is updated before the timeout ran
                    return function cancelTimeout() {
                         clearTimeout(timeout);
                    };
               } else {
                    setDebouncedValue(value);
               }
          },
          [value, delay, callback]
     );

     return [debouncedValue, value, updateValue];
}
