import Button from "@mui/material/Button";
import { DarkModeContext } from "../DarkModeContext";
import { useContextSelector } from "use-context-selector";
import "./index.css";

function DarkModeInfo() {
  const mode = useContextSelector(DarkModeContext, (value) => value.mode);

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
    </span>
  );
}

export default DarkModeInfo;
