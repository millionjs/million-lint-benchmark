import { createContext } from "use-context-selector";
import { useEffect, useState } from "react";
import "./index.css";

export const DarkModeContext = createContext();

export function DarkModeProvider({ children }) {
  const [mode, setMode] = useState("light");

  useEffect(() => {
    document.body.classList.add("theme-" + mode);

    return () => {
      document.body.classList.remove("theme-" + mode);
    };
  }, [mode]);

  const contextValue = useMemo(
    () => ({
      mode,
      setMode,
    }),
    [mode],
  );

  return <DarkModeContext.Provider value={contextValue}>{children}</DarkModeContext.Provider>;
}
