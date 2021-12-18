import { nanoid } from "nanoid";
import React from "react";

import type { AnimatedProps } from "./Animated";
import { Animated } from "./Animated";

type Condition = Omit<AnimatedProps, "children" | "visible"> & {
  content: React.ReactNode;
};

type ConditionalAnimatedProps<T extends PropertyKey> = {
  conditions: Partial<Record<T, Condition>> & { default: Condition };
  result: T;
};

export function ConditionalAnimated<T extends PropertyKey>({
  conditions,
  result,
}: ConditionalAnimatedProps<T>): JSX.Element {
  return (
    <>
      {Object.entries(conditions).map(
        ([conditionKey, { content, animationIn, animationOut, style }]) => (
          <Animated
            animationIn={animationIn}
            animationOut={animationOut}
            key={nanoid()}
            style={style}
            visible={
              result === conditionKey ||
              (Object.keys(conditions).every(
                (conditionKey) => conditionKey !== result
              ) &&
                conditionKey === "default")
            }
          >
            {content}
          </Animated>
        )
      )}
    </>
  );
}
