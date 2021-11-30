import type { ROUTES } from "@config";

export type MenuPageAction = {
  colors: { background: string; foreground: string };
  description: string;
  href: keyof typeof ROUTES;
  icon: JSX.Element;
  title: string;
};
