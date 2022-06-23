export interface Transformer<T, R> {
  transform: (data: T) => R
}
