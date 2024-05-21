import { observer } from "mobx-react-lite";
import DarkModeInfo from "../DarkModeInfo";
import PublishingTo from "../PublishingTo";
import React from "react";

function StatusBar({ store }) {
  return (
    <div>
      <PublishingTo
        publishingTarget={store.publishingConfig.target}
        onPublishingTargetChange={(newTarget) => {
          store.setPublishingTarget(newTarget);
        }}
      />{" "}
      · <DarkModeInfo /> · Status: {store.status}
    </div>
  );
}

const s = observer(StatusBar);

export default s;
