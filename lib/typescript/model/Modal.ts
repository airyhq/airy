export enum ModalType {
  install = 'install',
  uninstall = 'uninstall',
}

export type Modal = {
  type: ModalType;
  title: string;
};
