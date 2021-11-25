import "antd/es/date-picker/style/index";

import generatePicker from "antd/es/date-picker/generatePicker";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import dayjsGenerateConfig from "rc-picker/lib/generate/dayjs";
import React, { useCallback, useMemo } from "react";

import classes from "./InputDate.module.css";

const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);

export type InputDateAsFieldProps = Partial<
  Pick<
    React.ComponentProps<typeof DatePicker>,
    "allowClear" | "autoFocus" | "disabled" | "format"
  >
> & {
  disallowFutureDates?: boolean;
  disallowPastDates?: boolean;
};

type InputDateProps = Required<InputDateAsFieldProps> & {
  id: string;
  onBlur: () => void;
  onChange: (dateString: string) => void;
  placeholder: string;
  value: string;
};

export function InputDate({
  allowClear,
  disabled,
  id,
  format,
  onBlur,
  onChange,
  disallowPastDates,
  disallowFutureDates,
  value,
  placeholder,
  autoFocus,
}: InputDateProps): JSX.Element {
  const handleChange = useCallback(
    (date: Dayjs | null) => {
      onChange(date?.format() || "");
    },
    [onChange]
  );

  const handleSetDisabledDates = useCallback(
    (date: Dayjs): boolean => {
      let isAllowed = true;
      if (disallowPastDates && date.isBefore(dayjs().subtract(1, "day"))) {
        isAllowed = false;
      }
      if (disallowFutureDates && date.isAfter(dayjs())) {
        isAllowed = false;
      }
      return !isAllowed;
    },
    [disallowPastDates, disallowFutureDates]
  );

  const parsedValue = useMemo(() => (value ? dayjs(value) : null), [value]);

  return (
    <DatePicker
      allowClear={allowClear}
      autoFocus={autoFocus}
      className={classes.DatePicker}
      disabled={disabled}
      disabledDate={handleSetDisabledDates}
      format={format}
      id={id}
      onBlur={onBlur}
      onChange={handleChange}
      placeholder={placeholder}
      value={parsedValue}
    />
  );
}
