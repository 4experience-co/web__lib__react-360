import styled, { CSSProperties } from "styled-components";

import Box from "../Box";

type FlexProps = {
  flexDirection?: CSSProperties["flexDirection"];
  justifyContent?: CSSProperties["justifyContent"];
  alignItems?: CSSProperties["alignItems"];
};

const Flex = styled(Box)<FlexProps>`
  display: flex;
  flex-direction: ${(props) => props.flexDirection};
  justify-content: ${(props) => props.justifyContent};
  align-items: ${(props) => props.alignItems};
`;

export default Flex;
