import { useContext } from "react";
import Button from "@mui/material/Button";
import { DarkModeContext } from "../DarkModeContext";
import "./index.css";

export const createTest = () => {
  const Tester = () => {
    return <Button>Test</Button>;
  };
  return Tester;
};

const Test = createTest();

function DarkModeInfo() {
  const { mode } = useContext(DarkModeContext);

  return (
    <span>
      Mode:{" "}
      <Button
        classes={{ root: "dark-mode-info__button" }}
        size="small"
        onClick={() => alert("Ha, thought you can click me?")}
      >
        {mode}
      </Button>
      <Test />
    </span>
  );
}

export default DarkModeInfo;
