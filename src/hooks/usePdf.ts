import type {
  PdfAddTextOptions,
  PdfGeneratedDoc,
  PdfSetFontOptions,
} from "@types";
import { jsPDF } from "jspdf";
import { useCallback, useState } from "react";

type Pdf = {
  addImage: (
    data: string,
    x: number,
    y: number,
    w: number,
    h: number,
    options?: { rotate?: number }
  ) => void;
  addPage: () => void;
  addText: (
    text: string,
    x: number,
    y: number,
    options?: PdfAddTextOptions
  ) => void;
  generate: () => PdfGeneratedDoc;
  setFont: (options?: PdfSetFontOptions) => void;
};

export function usePdf(options?: {
  format?: number[];
  orientation?: "landscape" | "portrait";
}): Pdf {
  const [pdf, setPdf] = useState(new jsPDF(options));
  const [generatedPdf, setGeneratedPdf] = useState<jsPDF>();

  const setFont = useCallback(
    (options?: PdfSetFontOptions) => {
      const config: Required<PdfSetFontOptions> = {
        size: options?.size || 10,
        weight: options?.weight || "bold",
      };
      pdf.setFont(
        "helvetica",
        config.weight === "regular" ? "normal" : config.weight
      );
      pdf.setFontSize(config.size);
    },
    [pdf]
  );

  const addText = useCallback(
    (text: string, x: number, y: number, options?: PdfAddTextOptions) => {
      text = text.trim().toUpperCase();
      setFont(options);
      if (options?.maxLines) {
        const words = text.split(" ");
        while (
          pdf.getTextDimensions(words.join(" "), options).h >
          (options?.lineHeight || 11.641666666666666 / 3) * options.maxLines
        )
          words.pop();
        text = words.join(" ");
      }
      pdf.text(text, x, y, {
        angle: options?.rotate,
        baseline: "top",
        ...options,
      });
      setFont(options);
    },
    [pdf, setFont]
  );

  const addImage = useCallback(
    (
      data: string,
      x: number,
      y: number,
      w: number,
      h: number,
      options?: { rotate?: number }
    ) => {
      pdf.addImage(
        data,
        "PNG",
        x,
        y,
        w,
        h,
        undefined,
        undefined,
        options?.rotate
      );
    },
    [pdf]
  );

  const addPage = useCallback(() => {
    pdf.addPage();
  }, [pdf]);

  const generate = useCallback((): PdfGeneratedDoc => {
    setGeneratedPdf(pdf);
    setPdf(new jsPDF(options));
    return {
      save: (fileName): void => {
        (generatedPdf || pdf).save(fileName);
      },
    };
  }, [pdf, generatedPdf, options]);

  return { addImage, addPage, addText, generate, setFont };
}
