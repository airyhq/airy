export interface Tag {
  id?: string;
  name: string;
  color: string;
  count?: number;
}

export interface TagPayload {
  id: string;
}

export interface CreateTagRequestPayload {
  name: string;
  color: string;
}
