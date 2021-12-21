import type { TimelineItemProps } from "@components";
import { Divider, ModalWide, Timeline } from "@components";
import { useModal } from "@hooks";
import type { AppUser } from "@modules/na3-react";
import { useNa3Users } from "@modules/na3-react";
import type { Na3StdDocument, Na3StdDocumentEvent } from "@modules/na3-types";
import { parseStringId, timestampToStr } from "@utils";
import { Button, Col, Row } from "antd";
import dayjs from "dayjs";
import React from "react";

import { TimelineVersionSummary } from "./TimelineVersionSummary";

type DocsStdTimelineProps = {
  doc: Na3StdDocument;
};

export function DocsStdTimeline({ doc }: DocsStdTimelineProps): JSX.Element {
  const { isVisible, handleOpen, handleClose } = useModal();

  const {
    helpers: { getByUid: getUserByUid },
  } = useNa3Users();

  return (
    <>
      <Button block={true} onClick={handleOpen}>
        Ver histórico
      </Button>

      <ModalWide onClose={handleClose} title="Histórico" visible={isVisible}>
        {[...doc.versions].reverse().map((version, idx, arr) => {
          const previousVersion =
            idx === arr.length - 1 ? undefined : arr[idx + 1];
          const versionUpgradeComment = previousVersion?.events.find(
            (ev) => ev.type === "upgrade"
          )?.payload.comment;

          return (
            <>
              <Row gutter={[12, 36]}>
                <Col md={12} sm={24}>
                  <TimelineVersionSummary
                    doc={doc}
                    version={version}
                    versionUpgradeComment={versionUpgradeComment}
                  />
                </Col>

                <Col md={12} sm={24}>
                  <Timeline
                    items={version.events.map((ev) =>
                      getDocsStdTimelineItem({
                        ev,
                        originUser: getUserByUid(ev.origin.uid),
                      })
                    )}
                  />
                </Col>
              </Row>

              {idx !== arr.length - 1 && <Divider />}
            </>
          );
        })}
      </ModalWide>
    </>
  );
}

function getDocsStdTimelineItem({
  ev,
  originUser,
}: {
  ev: Na3StdDocumentEvent;
  originUser: AppUser | undefined;
}): TimelineItemProps {
  return {
    title: parseStringId(ev.type),

    postTitle:
      ev.type !== "create" && dayjs(ev.timestamp).format("DD/MM/YY HH:mm"),

    body:
      ev.type === "create"
        ? `em ${timestampToStr(ev.timestamp)}`
        : (ev.type === "acknowledge" || ev.type === "download") && originUser
        ? `por ${originUser.displayName}`
        : ev.payload.comment,

    color:
      ev.type === "create" || ev.type === "upgrade"
        ? "cyan"
        : ev.type === "approve"
        ? "lime"
        : ev.type === "reject"
        ? "red"
        : ev.type === "acknowledge"
        ? "green"
        : undefined,

    info: ev.type !== "acknowledge" &&
      ev.type !== "download" &&
      originUser && {
        variant: "tooltip",
        content: originUser.displayName,
      },
  };
}
