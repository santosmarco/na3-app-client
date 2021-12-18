import { ModalWide, Timeline } from "@components";
import { useModal } from "@hooks";
import { useNa3Users } from "@modules/na3-react";
import type { Na3StdDocument } from "@modules/na3-types";
import { parseStringId, timestampToStr } from "@utils";
import { Button, Col, Row, Typography } from "antd";
import dayjs from "dayjs";
import React from "react";

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
            <Row key={version.id}>
              <Col span={12}>
                <Typography.Title level={4}>
                  v.{version.number}
                </Typography.Title>
                <Typography.Paragraph italic={true} type="secondary">
                  {versionUpgradeComment ||
                    "Esta foi a primeira versão desse documento."}
                </Typography.Paragraph>

                <Button>Acessar o arquivo dessa versão</Button>
              </Col>

              <Col span={12}>
                <Timeline
                  items={[...version.events].reverse().map((ev) => {
                    const originUser = getUserByUid(ev.origin.uid);

                    return {
                      body:
                        ev.type === "create"
                          ? `em ${timestampToStr(ev.timestamp)}`
                          : (ev.type === "acknowledge" ||
                              ev.type === "download") &&
                            originUser
                          ? `por ${originUser.displayName}`
                          : ev.payload.comment,
                      color:
                        ev.type === "create"
                          ? "cyan"
                          : ev.type === "approve"
                          ? "lime"
                          : ev.type === "reject"
                          ? "red"
                          : ev.type === "acknowledge"
                          ? "green"
                          : undefined,
                      postTitle:
                        ev.type !== "create" &&
                        dayjs(ev.timestamp).format("DD/MM/YY HH:mm"),
                      title: parseStringId(ev.type),
                      info: ev.type !== "acknowledge" &&
                        ev.type !== "download" &&
                        originUser && {
                          type: "tooltip",
                          content: originUser.displayName,
                        },
                    };
                  })}
                />
              </Col>
            </Row>
          );
        })}
      </ModalWide>
    </>
  );
}
