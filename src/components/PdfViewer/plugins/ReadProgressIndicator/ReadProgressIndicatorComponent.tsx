import type { Store as PluginStore } from "@react-pdf-viewer/core";
import { Progress, Tooltip } from "antd";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

import classes from "./ReadProgressIndicatorComponent.module.css";

export type ReadProgressIndicatorCompInternalProps = {
  forceComplete: boolean;
  onComplete: (() => void) | undefined;
  store: PluginStore<{
    getPagesContainer?: () => HTMLElement | null;
  }>;
  tooltip: React.ReactNode;
  tooltipWhenComplete: React.ReactNode;
};

export function ReadProgressIndicatorComponent({
  store,
  tooltip,
  tooltipWhenComplete,
  onComplete,
  forceComplete,
}: ReadProgressIndicatorCompInternalProps): JSX.Element {
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

    return (): void => {
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
      placement="bottomLeft"
      title={isComplete ? tooltipWhenComplete : tooltip}
    >
      <div className={classes.IndicatorContainer}>
        <Progress
          percent={isComplete ? 100 : progressPercent}
          showInfo={false}
          size="small"
          status={isComplete ? "success" : "active"}
        />
      </div>
    </Tooltip>
  );
}
