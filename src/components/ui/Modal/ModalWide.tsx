import { Grid, Modal } from "antd";
import React from "react";

type ModalWideProps = {
  visible: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  destroyOnClose?: boolean;
  centered?: boolean;
};

const defaultProps = {
  destroyOnClose: true,
  footer: null,
};

export function ModalWide({
  visible,
  onClose,
  title,
  children,
  footer,
  destroyOnClose,
  centered,
}: ModalWideProps): JSX.Element {
  const breakpoint = Grid.useBreakpoint();

  return (
    <Modal
      centered={centered}
      destroyOnClose={destroyOnClose}
      footer={footer}
      onCancel={onClose}
      title={title}
      visible={visible}
      width={breakpoint.lg ? "65%" : breakpoint.md ? "80%" : undefined}
    >
      {children}
    </Modal>
  );
}

ModalWide.defaultProps = defaultProps;
