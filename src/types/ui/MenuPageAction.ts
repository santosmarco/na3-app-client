import type { ROUTES } from "../../constants";

export type MenuPageAction = {
  colors: { background: string; foreground: string };
  description: string;
  href: keyof typeof ROUTES;
  icon: JSX.Element;
  title: string;
};
