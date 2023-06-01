import { useCallback, useEffect, useState } from "react";
import { isIOS } from "react-device-detect";

import isDeviceOrientationEvent from "~/utils/isDeviceOrientationEvent";
import isDeviceOrientationEventWebkit from "~/utils/isDeviceOrientationEventWebkit";

const useHeading = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const [heading, setHeading] = useState<number | null>(null);

  const [orientationError, setOrientationError] = useState<string | null>(null);

  const getDeviceOrientationPermission = useCallback(
    () =>
      new Promise((resolve, reject) => {
        if (!isIOS) {
          resolve(true);
        }

        if (isDeviceOrientationEventWebkit(DeviceOrientationEvent)) {
          DeviceOrientationEvent.requestPermission()
            .then((response: string) => {
              if (response === "granted") {
                setHasPermission(true);
                resolve(true);
              } else {
                setHasPermission(false);
                reject(new Error("Permission not granted."));
              }
            })
            .catch((error: Error) => reject(error));
        }
      }),
    []
  );

  const handleDeviceOrientationAbsolute = useCallback(
    (event: Event) => {
      if (hasPermission === false) {
        return;
      }

      if (isDeviceOrientationEvent(event)) {
        const absAlpha = event.alpha || 0;
        const value = Math.abs(absAlpha - 360); // heading
        setHeading(value);
      } else {
        setOrientationError("error");
      }
    },
    [hasPermission]
  );

  const handleDeviceOrientationIos = useCallback(
    (event: Event) => {
      if (hasPermission === false) {
        return;
      }

      if (isDeviceOrientationEventWebkit(event)) {
        setHeading(event.webkitCompassHeading);
      } else {
        setOrientationError("Browser not supported. We're headed North!");
      }
    },
    [hasPermission]
  );

  useEffect(() => {
    (async () => {
      if (hasPermission === false) {
        return;
      }

      if (isIOS) {
        try {
          window.addEventListener("deviceorientation", handleDeviceOrientationIos);
        } catch (error) {
          console.log(error);
        }
      } else {
        window.addEventListener("deviceorientationabsolute", handleDeviceOrientationAbsolute);
      }
    })();
    return () => {
      window.removeEventListener("deviceorientation", handleDeviceOrientationIos);
      window.removeEventListener("deviceorientationAbsolute", handleDeviceOrientationAbsolute);
    };
  }, [handleDeviceOrientationIos, handleDeviceOrientationAbsolute, hasPermission]);

  return {
    getDeviceOrientationPermission,
    heading,
    orientationError,
    hasPermission
  };
};

export default useHeading;
