export type MenuProps = {
  defaultTab: 0 | 1;
  drawerProps?: Record<string, unknown>;
  toggleMenu: (newOpen: boolean) => () => void;
  open: boolean;
};
