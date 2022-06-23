interface DataProvider<T> {
  getData: () => Promise<T>
}

export default DataProvider
