import type { ReadonlyDeep } from "type-fest";
import type { ReportHandler } from "web-vitals";

type GetReportFn = (
  onReport: ReadonlyDeep<ReportHandler>,
  reportAllChanges?: Readonly<boolean | undefined>
) => void;

type WebVitals = {
  readonly getCLS: GetReportFn;
  readonly getFCP: GetReportFn;
  readonly getFID: GetReportFn;
  readonly getLCP: GetReportFn;
  readonly getTTFB: GetReportFn;
};

function reportWebVitals(onPerfEntry?: ReportHandler): void {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    void import("web-vitals").then(
      ({ getCLS, getFID, getFCP, getLCP, getTTFB }: WebVitals) => {
        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);
      }
    );
  }
}

export default reportWebVitals;
