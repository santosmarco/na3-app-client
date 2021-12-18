import { Grid, Modal } from "antd";
import React from "react";

type FormModalProps = {
  visible: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
};

export function FormModal({
  visible,
  onClose,
  title,
  children,
}: FormModalProps): JSX.Element {
  const breakpoint = Grid.useBreakpoint();

  return (
    <Modal
      destroyOnClose={true}
      footer={null}
      onCancel={onClose}
      title={title}
      visible={visible}
      width={breakpoint.lg ? "65%" : breakpoint.md ? "80%" : undefined}
    >
      {children}
    </Modal>
  );
}
