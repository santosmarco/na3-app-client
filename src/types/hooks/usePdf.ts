export type PdfSetFontOptions = {
  size?: number;
  weight?: "bold" | "regular";
};

export type PdfAddTextOptions = PdfSetFontOptions & {
  align?: "center" | "left";
  lineHeight?: number;
  maxLines?: number;
  maxWidth?: number;
  rotate?: number;
};

export type PdfGeneratedDoc = {
  save: (fileName: `${string}.pdf`) => void;
};
