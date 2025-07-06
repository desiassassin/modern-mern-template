import { useEffect, useState } from "react";
import CONSTANTS from "../constants";

export default function useDimensions() {
     const [windowDimensions, setWindowDimesions] = useState({
          width: window.innerWidth,
          height: window.innerHeight
     });
     const isMobileLayout = windowDimensions.width <= CONSTANTS.MOBILE_SIZE;

     // update layout on the fly
     useEffect(() => {
          window.onresize = function (event) {
               setWindowDimesions({
                    height: event.currentTarget.innerHeight,
                    width: event.currentTarget.innerWidth
               });
          };

          return function () {
               window.onresize = null;
          };
     }, []);

     return { isMobileLayout, windowDimensions };
}
