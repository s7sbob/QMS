import { FC } from "react";
import "./spinner.css";

interface SpinnerProps {
  text?: string;
}

const Spinner: FC<SpinnerProps> = ({ text }) => (
  <div className="fallback-spinner">
    <div className="loading component-loader">
      <div className="effect-1 effects" />
      <div className="effect-2 effects" />
      <div className="effect-3 effects" />
    </div>
    {text && <div className="spinner-text">{text}</div>}
  </div>
);
export default Spinner;
