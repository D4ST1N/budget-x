export interface SelectOption {
  text: string;
  value: string;
  parent?: string;
}

export interface InternalItem<T = any> {
  value: any;
  raw: T;
}
