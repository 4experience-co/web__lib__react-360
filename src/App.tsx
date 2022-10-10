import svgLogoColor from "~/assets/logo-color.svg";
import FullScreen from "~/components/FullScreen";

const App = () => (
  <FullScreen justifyContent="center" alignItems="center">
    <img src={svgLogoColor} alt="logo" />
  </FullScreen>
);

export default App;
