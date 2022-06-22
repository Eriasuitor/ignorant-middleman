interface DataProvider {
  getJson: () => Promise<Array<{[key: string]: any}>>
}

export default DataProvider
