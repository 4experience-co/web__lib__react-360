import styled, { CSSProperties } from "styled-components";

const cssProperties = [
  "display",
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "margin",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "padding",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "width",
  "height",
  "minWidth",
  "minHeight",
  "maxWidth",
  "maxHeight",
  "border",
  "borderTop",
  "borderRight",
  "borderBottom",
  "borderLeft",
  "borderRadius",
  "boxShadow",
  "background",
  "backgroundColor",
  "backgroundSize",
  "backgroundImage",
  "opacity",
  "transition",
  "transform",
  "overflow",
  "zIndex",
  "flex",
  "alignSelf",
  "justifySelf"
] as const;

type Props = Pick<CSSProperties, typeof cssProperties[number]>;

const Box = styled.div<Props>`
  box-sizing: border-box;
  ${(props) => {
    const vals = cssProperties.reduce((acc, val) => `${acc}${val}: ${props[val]};`, "");
    return vals;
  }}
`;

export default Box;
