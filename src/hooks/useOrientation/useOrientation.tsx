import { useCallback, useEffect, useState } from "react";
import { isIOS } from "react-device-detect";

import isDeviceOrientationEvent from "~/utils/isDeviceOrientationEvent";
import isDeviceOrientationEventWebkit from "~/utils/isDeviceOrientationEventWebkit";

const useOrientation = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const [heading, setHeading] = useState<number | null>(null);
  const [alpha, setAlpha] = useState<number | null>(null);
  const [beta, setBeta] = useState<number | null>(null);
  const [gamma, setGamma] = useState<number | null>(null);
  const [orientationError, setOrientationError] = useState<string | null>(null);
  const [initialAlpha, setInitialAlpha] = useState<number | null>(null);
  const [isInitialAlphaSet, setIsInitialAlphaSet] = useState<boolean>(false);

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
      if (hasPermission === false || hasPermission === null) {
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

  const handleDeviceOrientationAndroid = useCallback(
    (event: Event) => {
      if (hasPermission === false || hasPermission === null) {
        return;
      }

      if (isDeviceOrientationEvent(event)) {
        if (!isInitialAlphaSet) {
          // setting initial alpha only in android atm because ios works fine
          setIsInitialAlphaSet(true);
          setInitialAlpha(event.alpha);
        }
        setAlpha(event.alpha);
        setBeta(event.beta);
        setGamma(event.gamma);
      } else {
        setOrientationError("error");
      }
    },
    [isInitialAlphaSet, hasPermission]
  );

  const handleDeviceOrientationIos = useCallback(
    (event: Event) => {
      if (hasPermission === false || hasPermission === null) {
        return;
      }

      if (isDeviceOrientationEventWebkit(event)) {
        setHeading(event.webkitCompassHeading);
        console.log("XDDD");
        setAlpha(event.alpha);
        setBeta(event.beta);
        setGamma(event.gamma);
      } else {
        setOrientationError("Browser not supported. We're headed North!");
      }
    },
    [hasPermission]
  );

  useEffect(() => {
    (async () => {
      if (hasPermission === false || hasPermission === null) {
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
        window.addEventListener("deviceorientation", handleDeviceOrientationAndroid);
      }
    })();
    return () => {
      window.removeEventListener("deviceorientation", handleDeviceOrientationIos);
      window.removeEventListener("deviceorientationAbsolute", handleDeviceOrientationAbsolute);
      window.removeEventListener("deviceorientation", handleDeviceOrientationAndroid);
    };
  }, [handleDeviceOrientationIos, handleDeviceOrientationAbsolute, handleDeviceOrientationAndroid, hasPermission]);

  return {
    getDeviceOrientationPermission,
    heading,
    initialAlpha,
    alpha,
    beta,
    gamma,
    orientationError,
    hasPermission
  };
};

export default useOrientation;
