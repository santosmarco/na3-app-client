import { Col, Layout, Row, Tooltip, Typography } from "antd";
import dayjs from "dayjs";
import React from "react";

import { APP_VERSION, APP_VERSION_TIMESTAMP } from "../../../constants";
import classes from "./Footer.module.css";

export function Footer(): JSX.Element {
  return (
    <Row>
      <Col md={24} xs={0}>
        <div className={classes.Container}>
          <Layout.Footer className={classes.Footer}>
            Nova A3 ©{dayjs().format("YYYY")} Todos os direitos reservados
          </Layout.Footer>

          <Tooltip
            placement="topRight"
            title={`Atualizado em: ${dayjs(APP_VERSION_TIMESTAMP).format(
              "DD/MM/YY HH:mm"
            )}`}
          >
            <Typography.Text italic={true} type="secondary">
              v{APP_VERSION}
            </Typography.Text>
          </Tooltip>
        </div>
      </Col>
    </Row>
  );
}
