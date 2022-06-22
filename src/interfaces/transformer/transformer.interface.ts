export interface Transformer<T> {
  transform: (data: any) => T
}
