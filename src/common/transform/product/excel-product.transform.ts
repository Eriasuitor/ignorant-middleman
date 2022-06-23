import lodash from 'lodash'
import { ProductItem } from '../../../interfaces/product.interface'
import { Transformer } from '../../../interfaces/transformer.interface'

export interface ExcelProductItem {
  'Handle': string
  'Title': string
  'Body (HTML)': string
  'Vendor': string
  'Type': string
  'Tags': string
  'Published': string
  'Option1 Name': string
  'Option1 Value': string
  'Option2 Name': string
  'Option2 Value': string
  'Option3 Name': string
  'Option3 Value': string
  'Variant SKU': string
  'Variant Grams': string
  'Variant Inventory Tracker': string
  'Variant Inventory Qty': string
  'Variant Inventory Policy': string
  'Variant Fulfillment Service': string
  'Variant Price': string
  'Variant Compare At Price': string
  'Variant Requires Shipping': string
  'Variant Taxable': boolean
  'Variant Barcode': string
  'Image Src': string
  'Image Position': string
  'Image Alt Text': string
  'Gift Card': string
  'Variant Image': string
  'Variant Weight Unit': string
  'Variant Tax Code': string
}

export class ExcelProductTransformer implements Transformer<ExcelProductItem[], ProductItem[]> {
  transform (items: ExcelProductItem[]): ProductItem[] {
    return lodash(items)
      .groupBy(_ => _.Handle)
      .values()
      .map<ProductItem>(
      variants => {
        const main = variants[0]
        return {
          title: main.Title,
          body_html: main['Body (HTML)'],
          vendor: main.Vendor,
          product_type: main.Type,
          tags: lodash(main.Tags).replace(/\s/g, '').split(/[，,]/),
          images: variants.map(variant => ({ position: Number(variant['Image Position']), src: variant['Image Src'] })),
          options: [1, 2, 3].map(
            position => ({
              position,
              name: lodash.get(main, `Option${position} Name`, ''),
              values: variants.map(variant => lodash.get(variant, `Option${position} Value`, '')).filter(_ => _)
            }))
            .filter(_ => _.name),
          variants: variants.map((variant, index) => ({
            sku: variant['Variant SKU'],
            grams: variant['Variant Grams'],
            // 'Variant Inventory Tracker': string
            // 'Variant Inventory Qty': string
            inventory_policy: variant['Variant Inventory Policy'],
            fulfillment_service: variant['Variant Fulfillment Service'],
            price: variant['Variant Price'],
            compare_at_price: variant['Variant Compare At Price'],
            requires_shipping: variant['Variant Requires Shipping'],
            taxable: !!variant['Variant Taxable'],
            barcode: variant['Variant Barcode'],
            option1: lodash.get(variant, 'Option1 Value', `Default Title${index}`),
            option2: variant['Option2 Value'],
            option3: variant['Option3 Value']
          }))
        }
      })
      .value()
  }
}
