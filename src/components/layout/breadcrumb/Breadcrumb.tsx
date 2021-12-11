import type { AppRoute } from "@config";
import { isAppRoutePath, ROUTES } from "@config";
import { useBreadcrumb } from "@hooks";
import { Breadcrumb as AntdBreadcrumb, Row } from "antd";
import { nanoid } from "nanoid";
import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

import classes from "./Breadcrumb.module.css";

type BreadcrumbItem = {
  content: string | null;
  icon?: React.ReactNode;
  path?: string;
};

export function Breadcrumb(): JSX.Element {
  const { pathname } = useLocation();

  const breadcrumb = useBreadcrumb();

  const breadcrumbItems = useMemo((): BreadcrumbItem[] => {
    const pathChunks = pathname
      .split("/")
      .filter((pathChunk, index) => !!pathChunk || index === 0);

    return [
      ...pathChunks
        .map((_, index): BreadcrumbItem | undefined => {
          const chunkPath = `/${pathChunks.slice(1, index + 1).join("/")}`;

          if (!isAppRoutePath(chunkPath)) return undefined;
          const chunkRoute: AppRoute | undefined = ROUTES[chunkPath];
          return {
            content: chunkRoute.title,
            icon: chunkRoute.icon,
            path: chunkPath,
          };
        })
        .filter((item): item is BreadcrumbItem => !!item),
      ...breadcrumb.extra.map((extra) => ({ content: extra })),
    ];
  }, [pathname, breadcrumb.extra]);

  return (
    <Row className={classes.Container}>
      {breadcrumbItems.length > 1 && (
        <AntdBreadcrumb className={classes.Breadcrumb}>
          {breadcrumbItems.map((breadcrumbItem) => (
            <AntdBreadcrumb.Item key={nanoid()}>
              <Link
                className={!breadcrumbItem.path ? classes.Disabled : ""}
                to={breadcrumbItem.path || ""}
              >
                {breadcrumbItem.icon && (
                  <span
                    className={
                      breadcrumbItem.content ? classes.Icon : undefined
                    }
                  >
                    {breadcrumbItem.icon}
                  </span>
                )}
                {breadcrumbItem.content}
              </Link>
            </AntdBreadcrumb.Item>
          ))}
        </AntdBreadcrumb>
      )}
    </Row>
  );
}
