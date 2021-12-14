import { Typography } from "antd";
import React, { useCallback } from "react";
import { IoPersonCircleOutline, IoPricetagOutline } from "react-icons/io5";

import type { Na3TransfLabelTemplate } from "../../../../modules/na3-types";
import { DataCard } from "../../../ui/DataCard/DataCard";
import classes from "./LabelsTransfCard.module.css";

type LabelsTransfCardProps = {
  data: Na3TransfLabelTemplate;
  onSelect: (template: Na3TransfLabelTemplate) => void;
};

export function LabelsTransfCard({
  data,
  onSelect,
}: LabelsTransfCardProps): JSX.Element {
  const handleSelect = useCallback(() => {
    onSelect(data);
  }, [data, onSelect]);

  return (
    <DataCard
      data={data}
      onClick={handleSelect}
      preTitle={data.productCode.trim().toUpperCase()}
      title={data.name.trim().toUpperCase()}
    >
      <div className={classes.TemplateInfoContainer}>
        <div className={classes.TemplateInfoIcon}>
          <IoPricetagOutline />
        </div>

        <Typography.Paragraph
          className={classes.TemplateInfo}
          ellipsis={{ rows: 1 }}
        >
          {data.productName.toUpperCase()}
        </Typography.Paragraph>
      </div>

      <div className={classes.TemplateInfoContainer}>
        <div className={classes.TemplateInfoIcon}>
          <IoPersonCircleOutline />
        </div>

        <Typography.Paragraph
          className={classes.TemplateInfo}
          ellipsis={{ rows: 1 }}
        >
          {data.customerName.toUpperCase()}
        </Typography.Paragraph>
      </div>
    </DataCard>
  );
}
