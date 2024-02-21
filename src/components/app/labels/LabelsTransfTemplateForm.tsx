import { DeleteOutlined } from "@ant-design/icons";
import { Button, notification } from "antd";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";

import { useForm } from "../../../hooks";
import na3 from "../../../modules/na3";
import {
  useNa3Departments,
  useNa3People,
  useNa3TransfLabelTemplates,
} from "../../../modules/na3-react";
import type {
  Na3ApiPerson,
  Na3ApiProduct,
  Na3DepartmentId,
  Na3TransfLabelTemplate,
} from "../../../modules/na3-types";
import {
  createErrorNotifier,
  formatProductUnit,
  generateSelectOptions,
} from "../../../utils";
import { FormCollapse } from "../../forms/components/FormCollapse/FormCollapse";
import { Form } from "../../forms/Form";
import { FormField } from "../../forms/FormField/FormField";
import { SubmitButton } from "../../forms/SubmitButton";
import classes from "./LabelsTransfTemplateForm.module.css";

type LabelTemplateFormProps = {
  editingTemplate?: Na3TransfLabelTemplate;
  onDelete?: (template: Na3TransfLabelTemplate) => void;
  onSubmit?: () => void;
};

type FormValues = {
  batchIdFormat: "brazil" | "commercial" | "mexico";
  customerName: string;
  departmentId: Na3DepartmentId<"shop-floor"> | "";
  productCode: string;
  productName: string;
  productUnitDisplay: string;
  templateName: string;
};

const DEFAULT_BATCH_ID_FORMAT = "commercial";

export function LabelsTransfTemplateForm({
  editingTemplate,
  onSubmit,
  onDelete,
}: LabelTemplateFormProps): JSX.Element {
  // Controls productCode input's mask: S-\d{7} if Dart product, \d{9} otherwise
  const [productCodeMaskType, setProductCodeMaskType] = useState<
    "dart" | "default"
  >(() => (editingTemplate?.productCode.startsWith("S-") ? "dart" : "default"));

  // API product info for given productCode
  const [productLoading, setProductLoading] = useState(false);
  const [productData, setProductData] = useState<Na3ApiProduct>();

  // API customers info for given API product
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customersData, setCustomersData] = useState<Na3ApiPerson[]>();

  const na3People = useNa3People();

  /*
   * When editing a template, the form has to be initialized upon mounting.
   * The initialization process guarantees that both the template's API product
   * and its customers are fetched prior to any change.
   */
  const [hasInitializedEdit, setHasInitializedEdit] = useState(false);

  const { helpers } = useNa3TransfLabelTemplates();
  const departments = useNa3Departments();

  const form = useForm<FormValues>({
    defaultValues: {
      batchIdFormat: editingTemplate?.batchIdFormat || DEFAULT_BATCH_ID_FORMAT,
      customerName: editingTemplate?.customerName || "",
      departmentId: editingTemplate?.departmentId || "",
      productCode: editingTemplate?.productCode.replace("-", "") || "",
      productName: editingTemplate?.productName || "",
      productUnitDisplay: editingTemplate
        ? formatProductUnit(
            editingTemplate.productUnitName,
            editingTemplate.productUnitAbbreviation
          )
        : "",
      templateName: editingTemplate?.name || "",
    },
  });

  const fetchAndSetApiData = useCallback(
    async (productCode: string): Promise<{ error?: string }> => {
      setProductLoading(true);
      setCustomersLoading(true);

      const productRes = await na3.products.getByCode(productCode);

      if (productRes.error) {
        return { error: productRes.error.message };
      }

      const productRef = productRes.data;
      const customers = await productRef.getCustomers({ ignoreErrors: true });

      setProductData(productRef.get());
      setCustomersData(customers);

      setProductLoading(false);
      setCustomersLoading(false);

      return {};
    },
    []
  );

  const resetApiData = useCallback(() => {
    setCustomersData(undefined);
    setCustomersLoading(false);

    setProductData(undefined);
    setProductLoading(false);
  }, []);

  const handleProductCodeValidate = useCallback(
    async (value: string) => {
      const productCode = na3.products.utils.fixQuery(value);

      if (!na3.products.isProductCode(productCode)) {
        resetApiData();
        return "Código do produto inválido";
      }

      const apiRes = await fetchAndSetApiData(productCode);

      if (apiRes.error) {
        resetApiData();
        return apiRes.error;
      }
    },
    [resetApiData, fetchAndSetApiData]
  );

  const handleProductCodeChange = useCallback((value: string) => {
    if (value.startsWith("S")) setProductCodeMaskType("dart");
    else setProductCodeMaskType("default");
  }, []);

  const handleSubmit = useCallback(
    async ({
      templateName,
      productName,
      customerName,
      batchIdFormat,
      departmentId,
    }: FormValues) => {
      const notifyError = createErrorNotifier(
        `Erro ao ${editingTemplate ? "editar" : "criar"} o modelo`
      );

      if (departmentId === "") {
        notifyError("Você precisa atribuir um setor ao modelo.");
        return;
      }

      if (!productData || productData.name !== productName) {
        notifyError("Não foi possível vincular um produto ao modelo.");
        return;
      }

      const customer = customersData?.find(
        (customer) => customer.name === customerName
      );
      const template: Omit<Na3TransfLabelTemplate, "id"> = {
        batchIdFormat: batchIdFormat,
        customerId: customer?.id.trim().toUpperCase() || null,
        customerName: customer?.name.trim().toUpperCase() || customerName,
        departmentId,
        name: templateName.trim().toUpperCase(),
        productCode: productData.code.trim().toUpperCase(),
        productId: productData.id.trim().toUpperCase(),
        productName: productData.name.trim().toUpperCase(),
        productSnapshot: productData,
        productUnitAbbreviation: productData.unit.abbreviation
          .trim()
          .toUpperCase(),
        productUnitName: productData.unit.name.trim().toUpperCase(),
      };

      const operationRes = await (editingTemplate
        ? helpers.update(editingTemplate.id, template)
        : helpers.add(template));

      if (operationRes.error) {
        notifyError(operationRes.error.message);
      } else {
        notification.success({
          description: `O modelo "${template.name}" foi ${
            editingTemplate ? "editado" : "criado"
          } com sucesso!`,
          message: `Modelo ${editingTemplate ? "editado" : "criado"}`,
        });

        form.resetForm();
        onSubmit?.();
      }
    },
    [editingTemplate, productData, customersData, helpers, form, onSubmit]
  );

  const handleDelete = useCallback(() => {
    if (!editingTemplate) return;
    onDelete?.(editingTemplate);
  }, [editingTemplate, onDelete]);

  useEffect(() => {
    if (productData) {
      form.setValue("productName", productData.name.trim().toUpperCase());
      form.setValue(
        "productUnitDisplay",
        formatProductUnit(productData.unit.name, productData.unit.abbreviation)
      );

      if (productData.isMexicoProduct) {
        form.setValue("batchIdFormat", "mexico");
      }

      if (editingTemplate && !hasInitializedEdit) {
        form.setValue("customerName", editingTemplate.customerName);
        form.setValue("departmentId", editingTemplate.departmentId || "");
        form.setValue("batchIdFormat", editingTemplate.batchIdFormat);
        setHasInitializedEdit(true);
      }
    } else {
      form.setValue("productName", "");
      form.setValue("customerName", "");
      form.setValue("productUnitDisplay", "");
      form.setValue("batchIdFormat", DEFAULT_BATCH_ID_FORMAT);
    }
  }, [productData, form, editingTemplate, hasInitializedEdit]);

  // Initializes the form when editing a template
  useEffect(() => {
    if (editingTemplate && !(productData && customersData)) {
      form.setValue("templateName", editingTemplate.name, {
        shouldTouch: true,
        shouldValidate: true,
      });
      form.setValue(
        "productCode",
        editingTemplate.productCode.replace("-", ""),
        { shouldTouch: true, shouldValidate: true }
      );
    }
  }, [editingTemplate, productData, customersData, form]);

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <FormField
        autoUpperCase={true}
        label="Nome do modelo"
        name="templateName"
        rules={{ required: "Atribua um nome para o modelo" }}
        type="input"
      />

      <FormField
        autoUpperCase={true}
        helpWhenLoading="Buscando..."
        isLoading={productLoading}
        label="Código do produto"
        mask={[
          /[\ds]/i,
          ...(productCodeMaskType === "dart"
            ? ["-", /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, / /, /[r]/i]
            : [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]),
        ]}
        name="productCode"
        onValueChange={handleProductCodeChange}
        rules={{
          required: "Forneça o código do produto",
          validate: handleProductCodeValidate,
        }}
        type="mask"
      />

      <FormField
        disabled={true}
        hidden={!productData}
        label="Produto"
        name="productName"
        rules={null}
        type="input"
      />

      <FormField
        autoUpperCase={true}
        hidden={!productData || !customersData}
        isLoading={customersLoading}
        label="Cliente"
        name="customerName"
        options={[
          {
            label: "Sugeridos",
            options: generateSelectOptions(customersData, (item) =>
              item.name.trim().toUpperCase()
            ),
          },
          {
            label: "Todos",
            options: generateSelectOptions(na3People.data, (item) =>
              item.name.trim().toUpperCase()
            ),
          },
        ]}
        rules={{ required: "Selecione ou defina um cliente" }}
        type="autoComplete"
      />

      <FormField
        disabled={true}
        hidden={!productData || !customersData}
        label="Unidade"
        name="productUnitDisplay"
        rules={null}
        type="input"
      />

      <FormField
        hidden={!productData || !customersData}
        label="Setor"
        name="departmentId"
        options={(departments.helpers.getByType("shop-floor") || []).map(
          (dpt) => ({
            label: dpt.displayName.trim().toUpperCase(),
            value: dpt.id,
          })
        )}
        rules={{ required: "Atribua um setor ao modelo" }}
        type="select"
      />

      <FormCollapse title="Avançado">
        <FormField
          hidden={!productData || !customersData}
          label="Formato de numeração dos lotes"
          name="batchIdFormat"
          options={Object.entries(batchIdFormats).map(([formatId, format]) => ({
            label: (
              <>
                {format.name} <em>({format.example})</em>
              </>
            ),
            value: formatId,
          }))}
          rules={{
            required: "Selecione um formato para a numeração dos lotes",
          }}
          type="select"
        />

        {editingTemplate && onDelete && (
          <div className={classes.DeleteBtnContainer}>
            <Button
              danger={true}
              icon={<DeleteOutlined />}
              onClick={handleDelete}
            >
              Excluir modelo
            </Button>
          </div>
        )}
      </FormCollapse>

      {productData && customersData && (
        <SubmitButton
          label={editingTemplate ? "Salvar alterações" : "Criar modelo"}
          labelWhenLoading={editingTemplate ? "Salvando..." : "Enviando..."}
        />
      )}
    </Form>
  );
}

const batchIdFormats: Record<
  Na3TransfLabelTemplate["batchIdFormat"],
  { example: string; name: string }
> = {
  brazil: { example: `KA01-123-${dayjs().format("YY")}001 A`, name: "Brasil" },
  commercial: {
    example: `KA-123-${dayjs().format("YY")} A`,
    name: "Comercial",
  },
  mexico: { example: "KA-CI-123... A", name: "México" },
};
