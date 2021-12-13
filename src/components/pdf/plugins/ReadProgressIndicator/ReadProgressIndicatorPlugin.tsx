import type { Plugin, PluginFunctions } from "@react-pdf-viewer/core";
import { createStore as createPluginStore } from "@react-pdf-viewer/core";
import React, { useMemo } from "react";

import type { ReadProgressIndicatorCompInternalProps } from "./ReadProgressIndicatorComponent";
import { ReadProgressIndicatorComponent } from "./ReadProgressIndicatorComponent";

type ReadProgressIndicatorPlugin = Plugin & {
  ReadProgressIndicator: () => JSX.Element;
};

type ReadProgressIndicatorPluginStore = {
  getPagesContainer?: () => HTMLElement | null;
};

type ReadProgressIndicatorPluginOptions = Partial<
  Omit<ReadProgressIndicatorCompInternalProps, "store">
>;

export function createReadProgressIndicatorPlugin({
  tooltip,
  tooltipWhenComplete,
  onComplete,
  forceComplete,
}: ReadProgressIndicatorPluginOptions = {}): ReadProgressIndicatorPlugin {
  // Here we can disable ESLint because the PdfViewer's Plugin API follows a
  // different pattern than React.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const store = useMemo(
    () => createPluginStore<ReadProgressIndicatorPluginStore>({}),
    []
  );

  return {
    install: (pluginFns: PluginFunctions): void => {
      store.update("getPagesContainer", () => pluginFns.getPagesContainer());
    },
    ReadProgressIndicator: (): JSX.Element => (
      <ReadProgressIndicatorComponent
        forceComplete={forceComplete || false}
        onComplete={onComplete}
        store={store}
        tooltip={tooltip}
        tooltipWhenComplete={tooltipWhenComplete}
      />
    ),
  };
}
