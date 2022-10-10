import { PropsWithChildren, useState } from "react";
import Webcam from "react-webcam";
import styled from "styled-components";

import FullScreen from "~/components/FullScreen";

const WebcamStyled = styled(Webcam)`
  position: fixed;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -10;
`;

const CameraFullScreen: React.FC<PropsWithChildren> = ({ children }) => {
  const [isCameraReady, setIsCameraReady] = useState(false);
  return (
    <FullScreen position="relative">
      <>
        <WebcamStyled
          audio={false}
          videoConstraints={{
            facingMode: "environment"
          }}
          onUserMedia={() => {
            setIsCameraReady(true);
          }}
        />

        {isCameraReady === true && children}
      </>
    </FullScreen>
  );
};
export default CameraFullScreen;
