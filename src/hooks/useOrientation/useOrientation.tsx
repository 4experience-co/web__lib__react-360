import { useCallback, useEffect, useState } from "react";
import { isIOS } from "react-device-detect";

import isDeviceOrientationEvent from "~/utils/isDeviceOrientationEvent";
import isDeviceOrientationEventWebkit from "~/utils/isDeviceOrientationEventWebkit";

const useOrientation = () => {
  const [, setHasPermission] = useState(false);

  const [addEventListeners, setAddEventListeners] = useState<boolean>(false);
  const [heading, setHeading] = useState<number | null>(null);
  const [alpha, setAlpha] = useState<number | null>(null);
  const [beta, setBeta] = useState<number | null>(null);
  const [gamma, setGamma] = useState<number | null>(null);
  const [orientationError, setOrientationError] = useState<string | null>(null);
  const [initialAlpha, setInitialAlpha] = useState<number | null>(null);
  const [isInitialAlphaSet, setIsInitialAlphaSet] = useState<boolean>(false);

  const addOrientationEventListeners = useCallback(() => setAddEventListeners(true), []);

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
                reject(new Error("Permission not granted."));
              }
            })
            .catch((error: Error) => reject(error));
        }
      }),
    []
  );

  const handleDeviceOrientationAbsolute = useCallback((event: Event) => {
    if (isDeviceOrientationEvent(event)) {
      const absAlpha = event.alpha || 0;
      const value = Math.abs(absAlpha - 360); // heading
      setHeading(value);
    } else {
      setOrientationError("error");
    }
  }, []);

  const handleDeviceOrientationAndroid = useCallback(
    (event: Event) => {
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
    [isInitialAlphaSet]
  );

  const handleDeviceOrientationIos = useCallback((event: Event) => {
    if (isDeviceOrientationEventWebkit(event)) {
      setHeading(event.webkitCompassHeading);
      setAlpha(event.alpha);
      setBeta(event.beta);
      setGamma(event.gamma);
    } else {
      setOrientationError("Browser not supported. We're headed North!");
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (addEventListeners) {
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
      }
    })();
    return () => {
      window.removeEventListener("deviceorientation", handleDeviceOrientationIos);
      window.removeEventListener("deviceorientationAbsolute", handleDeviceOrientationAbsolute);
      window.removeEventListener("deviceorientation", handleDeviceOrientationAndroid);
    };
  }, [addEventListeners, handleDeviceOrientationIos, handleDeviceOrientationAbsolute, handleDeviceOrientationAndroid]);

  return { getDeviceOrientationPermission, addOrientationEventListeners, heading, initialAlpha, alpha, beta, gamma, orientationError };
};

export default useOrientation;
