export interface ProductItem {
  title: string
  body_html: string
  vendor: string
  product_type: string
  tags: string[]
  images: Array<{position: number, src: string}>
  options: Array<{position: number, name: string, values: string[] }>
  variants: Array<{
    sku: string
    grams: string
    // title: string
    // 'Variant Inventory Tracker': string
    // 'Variant Inventory Qty': string
    inventory_policy: string
    fulfillment_service: string
    price: string
    compare_at_price: string
    requires_shipping: string
    taxable: boolean
    barcode: string
    option1?: string
    option2?: string
    option3?: string
  }>
}
