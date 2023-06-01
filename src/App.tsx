import { useCallback, useEffect, useState } from "react";
import { Box } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import CameraFullScreen from "~/components/CameraFullScreen";
import Flex from "~/components/Flex";
import useOrientation from "~/hooks/useOrientation";
import DeviceOrientationView from "~/webgl/objects-3d/DeviceOrientationView";

const ArrowScene: React.FC = () => {
  const { getDeviceOrientationPermission } = useOrientation();
  const [isOrientationPermissionGranted, setIsOrientantionPermissionGranted] = useState(false);

  const handleOnMapButtonPress = useCallback(async () => {
    await getDeviceOrientationPermission();
    setIsOrientantionPermissionGranted(true);
  }, [getDeviceOrientationPermission]);

  return (
    <CameraFullScreen>
      {isOrientationPermissionGranted ? (
        <div style={{ height: "100vh", width: "100vw", position: "absolute" }}>
          <Canvas camera={{ position: [0, 0, 0], fov: 60 }}>
            <DeviceOrientationView />

            <Box position={[0, 0, -4]}>
              <meshBasicMaterial color="red" />
            </Box>
            <Box position={[0, 0, 4]}>
              <meshBasicMaterial color="blue" />
            </Box>
          </Canvas>
        </div>
      ) : (
        <Flex flexDirection="column" position="absolute" top="0" left="0" right="0" bottom="0" margin="auto" justifyContent="center" alignItems="center">
          <button type="button" style={{ fontSize: 15 }} onClick={handleOnMapButtonPress}>
            START THE ORIENTATION
          </button>
        </Flex>
      )}
    </CameraFullScreen>
  );
};

export default ArrowScene;
