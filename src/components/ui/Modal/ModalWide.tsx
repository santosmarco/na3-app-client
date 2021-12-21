import { Grid, Modal } from "antd";
import React from "react";

type ModalWideProps = {
  centered?: boolean;
  children: React.ReactNode;
  destroyOnClose?: boolean;
  footer?: React.ReactNode;
  onClose: () => void;
  title: React.ReactNode;
  visible: boolean;
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
