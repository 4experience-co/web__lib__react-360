/* eslint-disable no-param-reassign */
import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import DeviceOrientationControls from "~/webgl/utils-3d/DeviceOrientationControls";
import DeviceOrientationControlsYawFixer from "~/webgl/utils-3d/DeviceOrientationControlsYawFixer";

// const orientationController = new DeviceOrientationControls();

const DeviceOrientationView: React.FC = () => {
  const [orientationController, setOrientationController] = useState<DeviceOrientationControls | null>(null);
  const [yawFixer] = useState(new DeviceOrientationControlsYawFixer());
  const { camera } = useThree();

  useEffect(() => {
    camera.rotation.reorder("YXZ");
  }, [camera]);

  useEffect(() => {
    setOrientationController(new DeviceOrientationControls());
  }, []);

  useFrame(() => {
    // Calculate magic window HMD quaternion.
    if (orientationController !== null && orientationController.enabled) {
      const quaternion = orientationController.getRotation();
      camera.rotation.setFromQuaternion(quaternion);
      const fixedEuler = yawFixer.getYawFixedRotation(quaternion);

      camera.rotation.x = fixedEuler.x; // + pitchObject.rotation.x;
      camera.rotation.y = fixedEuler.y; // + yawObject.rotation.y;
      camera.rotation.z = fixedEuler.z;
    }
  });

  return null;
};

export default DeviceOrientationView;
