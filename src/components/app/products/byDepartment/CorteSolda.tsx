// /* eslint-disable react/no-multi-comp */

// import { Divider, FormField } from "@components";
// import { EMeasurementUnit, CorteSoldaProductSchema, z } from "@schemas";
// import { Col, Row, Typography } from "antd";
// import React from "react";

// import { MinNomMaxFields } from "../fields/MinNomMaxFields";
// import { MinNomMaxGroup } from "../fields/MinNomMaxGroup";

// const variantShapeKeys = z.allKeys(CorteSoldaProductSchema, "variant");

// export function ProductsCreateCorteSoldaForm(): JSX.Element {
//   return (
//     <>
//       <Row align="bottom" gutter={16}>
//         <Col md={6} sm={24} xs={24}>
//           <FormField
//             label="Medida da puxada"
//             name={variantShapeKeys.pullMeasurement}
//             noDecimal={true}
//             rules={null}
//             suffix="mm"
//             type="number"
//           />
//         </Col>
//         <Col md={6} sm={24} xs={24}>
//           <FormField
//             label="Nº de pistas"
//             name={variantShapeKeys.numberOfTracks}
//             rules={null}
//             type="input"
//           />
//         </Col>
//         <Col md={6} sm={24} xs={24}>
//           <FormField
//             label="Barramento"
//             name={variantShapeKeys.barramento}
//             rules={null}
//             type="input"
//           />
//         </Col>
//         <Col md={6} sm={24} xs={24}>
//           <FormField
//             label="Nº de furos"
//             name={variantShapeKeys.numberOfHoles}
//             rules={null}
//             type="input"
//           />
//         </Col>
//       </Row>

//       <MinNomMaxGroup
//         fields={[
//           {
//             title: "Total",
//             titleRight: "mm",
//             names: variantShapeKeys.width.total,
//             unit: EMeasurementUnit.Millimeter,
//           },
//           {
//             title: "Aparente",
//             titleRight: "mm",
//             names: variantShapeKeys.width.apparent,
//             unit: EMeasurementUnit.Millimeter,
//           },
//         ]}
//         title="Largura"
//       />

//       <Divider>Espessura</Divider>
//       <Row gutter={16}>
//         <Col xs={24}>
//           <MinNomMaxFields
//             names={variantShapeKeys.thickness}
//             unit={EMeasurementUnit.Micrometer}
//           />
//         </Col>
//       </Row>
//     </>
//   );
// }

export {};
