// import { init } from "@million/lint/runtime";
import React from "react";
import * as Sentry from "@sentry/react";

// init();

// Sentry.init({
//   dsn: "https://7f983b54607ed2d908612641ae0f54b7@o4505682763382784.ingest.us.sentry.io/4506992941400064",
//   integrations: [
//     Sentry.browserTracingIntegration(),
//     Sentry.replayIntegration({
//       maskAllText: false,
//       blockAllMedia: false,
//     }),
//   ],
//   // Performance Monitoring
//   tracesSampleRate: 1.0, //  Capture 100% of the transactions
//   // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
//   tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
//   // Session Replay
//   replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
//   replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
// });

// Uncomment to enable why-did-you-render:
// import "./wdyr";
import ReactDOM from "react-dom";
import ReactDOMClient from "react-dom/client";
import * as MobxReact from "mobx-react-lite";
import * as ReactRedux from "react-redux";
import App from "./components/App";
import reduxStore from "./store/redux";
import mobxStore from "./store/mobx";
import "./index.css";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "inherit",
  },
  components: {
    MuiButton: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          fontFamily: "inherit",
          color: "black",
          borderColor: "rgba(0, 0, 0, 0.23)",
          backgroundColor: "white",
          "&:hover": {
            borderColor: "rgba(0, 0, 0, 0.23)",
            backgroundColor: "#ffe866",
          },
          "&:active": {
            borderColor: "rgba(0, 0, 0, 0.23)",
            backgroundColor: "#ffdb01",
          },
        },
      },
    },
  },
});

const useReact18 = true;

const element = (
  <React.StrictMode>
    {/* <Sentry.ErrorBoundary showDialog> */}
    <ReactRedux.Provider store={reduxStore}>
      <MobxReact.Observer>
        {() => (
          <ThemeProvider theme={theme}>
            {!useReact18 && (
              <div className="react-17-warning">
                Workshop warning: running in the React 17 mode.
              </div>
            )}
            <App mobxStore={mobxStore} />
          </ThemeProvider>
        )}
      </MobxReact.Observer>
    </ReactRedux.Provider>
    {/* </Sentry.ErrorBoundary> */}
  </React.StrictMode>
);

if (useReact18) {
  ReactDOMClient.createRoot(document.getElementById("root")).render(element);
} else {
  ReactDOM.render(element, document.getElementById("root"));
}
