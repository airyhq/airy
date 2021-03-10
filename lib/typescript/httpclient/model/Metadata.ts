export interface Metadata {
  userData?: Metadata;
  [key: string]: any;
}

export interface MetadataEvent<T extends Metadata = Metadata> {
  subject: string;
  identifier: string;
  metadata: T;
}
