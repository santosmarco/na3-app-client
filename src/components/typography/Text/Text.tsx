import { Typography } from "antd";
import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";

type AntdTextProps = React.ComponentProps<typeof Typography.Text>;
type AntdParagraphProps = React.ComponentProps<typeof Typography.Paragraph>;
type AntdLinkProps = React.ComponentProps<typeof Typography.Link>;

type EllipsisConfig = AntdParagraphProps["ellipsis"];

type TextBaseProps = {
  block?: boolean;
  children?: React.ReactNode;
  ellipsis?: EllipsisConfig | boolean | null | undefined;
  href?: string;
  italic?: boolean;
  maxLines?: number;
  onClick?: (ev?: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => void;
  small?: boolean;
  strong?: boolean;
  variant?: "link" | "paragraph" | "text";
};

type TextProps = Omit<
  AntdLinkProps & AntdParagraphProps & AntdTextProps,
  keyof TextBaseProps
> &
  TextBaseProps;

export function Text({
  variant = "text",
  block,
  italic,
  strong,
  small,
  onClick,
  href,
  code,
  delete: deleteProp,
  disabled,
  keyboard,
  mark,
  underline,
  type,
  copyable,
  editable,
  ellipsis,
  maxLines,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  children: childrenProp,
}: TextProps): JSX.Element {
  const history = useHistory();

  const handleClick = useCallback(
    (ev?: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
      if (onClick || (variant === "link" && href)) {
        ev?.stopPropagation();

        if (onClick) {
          onClick(ev);
        } else if (variant === "link" && href) {
          history.push(href);
        }
      }
    },
    [variant, href, history, onClick]
  );

  const style = useMemo(
    (): React.CSSProperties => ({
      display: variant === "paragraph" || block ? "block" : "inline",
      marginBottom: variant === "paragraph" ? undefined : 0,
    }),
    [variant, block]
  );

  const ellipsisConfig = useMemo((): EllipsisConfig | boolean | undefined => {
    if (ellipsis) {
      return {
        expandable: true,
        symbol: "mais...",
        rows: maxLines,
        ...(typeof ellipsis === "object" ? ellipsis : {}),
      };
    }
    return ellipsis === null ? false : ellipsis;
  }, [ellipsis, maxLines]);

  const children = useMemo(
    () => (small ? <small>{childrenProp}</small> : childrenProp),
    [small, childrenProp]
  );

  if (variant === "link") {
    return (
      <Typography.Link
        code={code}
        copyable={copyable}
        delete={deleteProp}
        disabled={disabled}
        editable={editable}
        ellipsis={!!ellipsisConfig}
        italic={italic}
        keyboard={keyboard}
        mark={mark}
        onClick={handleClick}
        onFocus={onFocus}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        strong={strong}
        style={style}
        type={type}
        underline={underline}
      >
        {children}
      </Typography.Link>
    );
  }
  return (
    <Typography.Paragraph
      code={code}
      copyable={copyable}
      delete={deleteProp}
      disabled={disabled}
      editable={editable}
      ellipsis={ellipsisConfig}
      italic={italic}
      keyboard={keyboard}
      mark={mark}
      onClick={handleClick}
      strong={strong}
      style={style}
      type={type}
      underline={underline}
    >
      {children}
    </Typography.Paragraph>
  );
}
