import { useEffect, useState } from "react";

export function useLockedBody(initialLocked = false) {
     const [locked, setLocked] = useState(initialLocked);

     // Do the side effect before render
     useEffect(() => {
          if (!locked) return;

          // Save initial body style
          const originalOverflow = document.body.style.overflow;
          const originalPaddingRight = document.body.style.paddingRight;

          // Get the scrollBar width
          const root = document.getElementById("___gatsby"); // or root
          const scrollBarWidth = root ? root.offsetWidth - root.scrollWidth : 0;

          // Avoid width reflow
          if (scrollBarWidth) document.body.style.paddingRight = `${scrollBarWidth}px`;

          return function () {
               document.body.style.overflow = originalOverflow;
               if (scrollBarWidth) document.body.style.paddingRight = originalPaddingRight;
          };
     }, [locked]);

     // Update state if initialValue changes
     useEffect(() => {
          if (locked !== initialLocked) setLocked(initialLocked);
          // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [initialLocked]);

     return [locked, setLocked];
}
