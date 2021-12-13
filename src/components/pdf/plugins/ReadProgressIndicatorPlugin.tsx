import type {
  Plugin,
  PluginFunctions,
  Store as PluginStore,
} from "@react-pdf-viewer/core";
import { createStore as createPluginStore } from "@react-pdf-viewer/core";
import { Progress, Tooltip } from "antd";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

import classes from "./ReadProgressIndicator.module.css";

type ReadProgressIndicatorInternalProps = {
  store: PluginStore<ReadProgressIndicatorPluginStore>;
  tooltip: React.ReactNode;
  tooltipWhenComplete: React.ReactNode;
  onComplete: (() => void) | undefined;
  forceComplete: boolean;
};

type ReadProgressIndicatorPlugin = Plugin & {
  ReadProgressIndicator: () => JSX.Element;
};

type ReadProgressIndicatorPluginStore = {
  getPagesContainer?: () => HTMLElement | null;
};

type ReadProgressIndicatorPluginOptions = Partial<
  Omit<ReadProgressIndicatorInternalProps, "store">
>;

function ReadProgressIndicator({
  store,
  tooltip,
  tooltipWhenComplete,
  onComplete,
  forceComplete,
}: ReadProgressIndicatorInternalProps): JSX.Element {
  const [progressPercent, setProgressPercent] = useState(0);
  const [isComplete, setIsComplete] = useState<boolean>(forceComplete);

  const handleScroll = useCallback((ev: Event) => {
    const { target } = ev;
    if (target instanceof HTMLDivElement) {
      const percent = Math.floor(
        (100 * target.scrollTop) / (target.scrollHeight - target.clientHeight)
      );
      setProgressPercent(Math.min(100, percent));
    }
  }, []);

  const handlePagesContainer = useCallback(() => {
    const getPagesContainer = store.get("getPagesContainer");
    if (!getPagesContainer) {
      return;
    }
    const pagesEl = getPagesContainer();
    pagesEl?.addEventListener("scroll", handleScroll);
  }, [store, handleScroll]);

  useLayoutEffect(() => {
    store.subscribe("getPagesContainer", handlePagesContainer);

    return () => {
      store.unsubscribe("getPagesContainer", handlePagesContainer);
    };
  }, [store, handlePagesContainer]);

  useEffect(() => {
    if (progressPercent >= 100 && !isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [progressPercent, isComplete, onComplete]);

  return (
    <Tooltip
      title={isComplete ? tooltipWhenComplete : tooltip}
      placement="bottomLeft"
    >
      <div
        className={`${classes.IndicatorContainer} ${
          isComplete ? classes.IndicatorContainerComplete : ""
        }`.trim()}
      >
        <Progress
          percent={isComplete ? 100 : progressPercent}
          size="small"
          showInfo={isComplete}
          status={isComplete ? "success" : "active"}
        />
      </div>
    </Tooltip>
  );
}

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
    install: (pluginFns: PluginFunctions) => {
      store.update("getPagesContainer", pluginFns.getPagesContainer);
    },
    ReadProgressIndicator: () => (
      <ReadProgressIndicator
        store={store}
        tooltip={tooltip}
        tooltipWhenComplete={tooltipWhenComplete}
        onComplete={onComplete}
        forceComplete={forceComplete || false}
      />
    ),
  };
}
