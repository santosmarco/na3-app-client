import type { TimelineItemProps } from "@components";
import { UserTag } from "@components";
import { Timeline } from "@components";
import type { Na3ServiceOrderEvent } from "@modules/na3-types";
import { getMaintPersonDisplayName, parseStringId } from "@utils";
import { Grid, Modal, Space } from "antd";
import dayjs from "dayjs";
import React from "react";

type MaintServiceOrderTimelineModalProps = {
  events: Na3ServiceOrderEvent[];
  isVisible: boolean;
  onClose: () => void;
};

export function MaintServiceOrderTimelineModal({
  isVisible,
  events,
  onClose,
}: MaintServiceOrderTimelineModalProps): JSX.Element {
  const breakpoint = Grid.useBreakpoint();

  return (
    <Modal
      footer={null}
      onCancel={onClose}
      title="Histórico"
      visible={isVisible}
      width={breakpoint.lg ? "65%" : breakpoint.md ? "80%" : undefined}
    >
      <Timeline
        items={events
          .filter(
            (ev) =>
              ev.type !== "solutionStepAdded" ||
              ev.payload?.solutionStep?.type === "step"
          )
          .map(
            (ev): TimelineItemProps => ({
              body: getTimelineItemBody(ev),
              color: getTimelineItemColor(ev),
              postTitle: dayjs(ev.timestamp).format("DD/MM/YY HH:mm"),
              title: parseStringId(ev.type),
              info: ev.user && {
                type: "popover",
                title: "Origem do evento",
                content: (
                  <UserTag
                    fallbackDisplayName={ev.user.displayName}
                    uid={ev.user.uid}
                  />
                ),
              },
            })
          )}
      />
    </Modal>
  );
}

function getTimelineItemBody({
  payload,
  type,
}: Na3ServiceOrderEvent): React.ReactNode {
  if (payload) {
    if (type === "ticketConfirmed") {
      return `Prioridade: ${parseStringId(payload.priority)}${
        payload.assignedMaintainer
          ? ` • Responsável: ${getMaintPersonDisplayName(
              payload.assignedMaintainer
            )}`
          : ""
      }`;
    }

    switch (Object.keys(payload)[0]) {
      case "priority":
        return `Nova prioridade: ${parseStringId(payload.priority)}`;
      case "solutionStep":
        return (
          <Space direction="vertical" size={4}>
            {payload.solutionStep?.content || ""}
            {payload.solutionStep?.who && (
              <small>
                <em>— {getMaintPersonDisplayName(payload.solutionStep.who)}</em>
              </small>
            )}
          </Space>
        );
      case "solution":
        if (typeof payload.solution === "string") {
          return payload.solution;
        }
        return (
          <Space direction="vertical" size={4}>
            {payload.solution?.content || ""}
            {payload.solution?.who && (
              <small>
                <em>— {getMaintPersonDisplayName(payload.solution.who)}</em>
              </small>
            )}
          </Space>
        );
      case "refusalReason":
        if (payload.refusalReason) {
          return payload.refusalReason;
        }
        return;
      case "changes":
        /*
        return {
          message: Object.entries(payload.changes!)
            .map(([key, val]) => {
              if (key === "interruptions") {
                return Object.entries(payload.changes!.interruptions!)
                  .map(
                    ([key, val]) =>
                      `${translateTicketKey(key)}: ${
                        val.old === true ? "SIM" : "NÃO"
                      } -> ${val.new === true ? "SIM" : "NÃO"}`
                  )
                  .join("\n");
              }
              if (dpt.username === "ekoplasto" && key === "machine") {
                return `${translateTicketKey(key)}: ${
                  // @ts-ignore
                  dpt.getMachineNames()[+val.old - 1]
                  // @ts-ignore
                } -> ${dpt.getMachineNames()[+val.new - 1]}`;
              }
              return `${translateTicketKey(key)}: ${idToName(
                // @ts-ignore
                val.old
                // @ts-ignore
              )} -> ${idToName(val.new)}`;
            })
            .join("\n"),
          title: "Alterações na OS",
        };
        */
        return;
      case "poke":
        /*
        return {
          message: `${Db.getDepartment(payload.poke!.from)!.displayName} -> ${
            Db.getDepartment(payload.poke!.to)!.displayName
          }`,
          title: "Cutucada",
        };
        */
        return;
      case "assignedMaintainer":
        return payload.assignedMaintainer;

      default:
        return;
    }
  }

  return;
}

function getTimelineItemColor({
  type,
}: Na3ServiceOrderEvent): TimelineItemProps["color"] {
  switch (type) {
    case "ticketCreated":
    case "ticketReopened":
      return "cyan";
    case "solutionAccepted":
    case "ticketClosed":
      return "green";
    case "solutionRefused":
      return "red";

    default:
      return;
  }
}
