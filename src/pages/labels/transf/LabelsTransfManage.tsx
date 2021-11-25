import {
  LabelsTransfList,
  LabelsTransfTemplateForm,
  ListFormPage,
} from "@components";
import { useNa3TransfLabelTemplates } from "@modules/na3-react";
import type { Na3TransfLabelTemplate } from "@modules/na3-types";
import { Grid, Modal, notification } from "antd";
import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";

export function LabelsTransfManagePage(): JSX.Element {
  const [selectedTemplate, setSelectedTemplate] =
    useState<Na3TransfLabelTemplate>();

  const history = useHistory();
  const breakpoint = Grid.useBreakpoint();

  const transfLabelTemplates = useNa3TransfLabelTemplates();

  const handleCreateTemplateClick = useCallback(() => {
    history.push("/etiquetas/gerenciar/transferencia/criar-modelo");
  }, [history]);

  const handleSelectTemplate = useCallback(
    (template: Na3TransfLabelTemplate) => {
      setSelectedTemplate(template);
    },
    []
  );

  const handleCloseModal = useCallback(() => {
    setSelectedTemplate(undefined);
  }, []);

  const handleDeleteTemplate = useCallback(
    (template: Na3TransfLabelTemplate) => {
      async function onConfirmDelete(): Promise<void> {
        setSelectedTemplate(undefined);

        const deletionResult = await transfLabelTemplates.helpers.delete(
          template.id
        );

        if (deletionResult.error) {
          notification.error({
            description: deletionResult.error.message,
            message: "Erro ao excluir o modelo",
          });
        } else {
          notification.success({
            description: `O modelo "${template.name}" foi excluído com sucesso.`,
            message: "Modelo excluído",
          });
        }
      }

      Modal.confirm({
        cancelText: "Voltar",
        content: "Esta ação é permanente.",
        okButtonProps: { danger: true },
        okText: "Excluir",
        onOk: onConfirmDelete,
        title: `Excluir "${template.name}"?`,
      });
    },
    [transfLabelTemplates.helpers]
  );

  return (
    <>
      <ListFormPage
        actions={[
          { label: "Criar modelo", onClick: handleCreateTemplateClick },
        ]}
        form={<LabelsTransfTemplateForm />}
        formTitle="Novo modelo"
        list={
          <LabelsTransfList
            data={transfLabelTemplates.data || []}
            onSelectTemplate={handleSelectTemplate}
          />
        }
        listTitle="Modelos"
        title="Etiquetas • Transferência"
      />

      <Modal
        destroyOnClose={true}
        footer={null}
        onCancel={handleCloseModal}
        title={selectedTemplate?.name.trim().toUpperCase()}
        visible={!!selectedTemplate}
        width={breakpoint.lg ? "65%" : breakpoint.md ? "80%" : undefined}
      >
        <LabelsTransfTemplateForm
          editingTemplate={selectedTemplate}
          onDelete={handleDeleteTemplate}
          onSubmit={handleCloseModal}
        />
      </Modal>
    </>
  );
}
