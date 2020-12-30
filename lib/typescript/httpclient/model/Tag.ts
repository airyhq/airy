export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface ColorSettings {
  default: string;
  background: string;
  font: string;
  position: number;
  border: string;
}

export interface TagSettings {
  colors: ColorSettings[];
  enabled: boolean;
  channels: Tag[];
}

export interface ErrorTag {
  status: string;
  data?: string;
}

export interface ModalType {
  modal: {
    type: string;
    tagId: string;
    tagName: string;
    delete: string;
    error: string;
  };
}
