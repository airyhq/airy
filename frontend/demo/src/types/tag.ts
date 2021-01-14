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
