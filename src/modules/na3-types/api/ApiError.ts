export type Na3ApiError = {
  code?: string;
  message: string;
  name: string;
  possibleCause?: string;
  status?: { code: number; text: string };
};
