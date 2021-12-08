import dayjs from "dayjs";
import type { Timestamp } from "firebase/firestore";
import React, { useMemo } from "react";

type MaintProjectTimeRemainingProps = {
  eta: Timestamp;
};

export function MaintProjectTimeRemaining({
  eta,
}: MaintProjectTimeRemainingProps): JSX.Element {
  const parsedEta = useMemo(() => dayjs(eta.toDate()), [eta]);

  const remainingMs = useMemo(() => parsedEta.diff(), [parsedEta]);

  if (remainingMs < 0) {
    return (
      <>
        <strong>Atenção!</strong> O prazo deste projeto venceu{" "}
        <strong>{dayjs.duration(remainingMs, "ms").humanize(true)}</strong> (em{" "}
        {parsedEta.format("DD/MM/YY")}). Entregue-o o quanto antes.
      </>
    );
  }
  return (
    <>
      Você tem mais{" "}
      <strong>{dayjs.duration(remainingMs, "ms").humanize()}</strong> para
      entregar este projeto no prazo ({parsedEta.format("DD/MM/YY")}).
    </>
  );
}
