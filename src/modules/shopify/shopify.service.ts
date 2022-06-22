import Shopify, { DataType } from '@shopify/shopify-api'
import config from '../../../configs'

const client = new Shopify.Clients.Rest(config.shopify.domain, config.shopify.accessToken)

class ShopifyService {
  async get (): Promise<void> {
    const resp = await client.get({
      path: 'products',
      type: DataType.JSON
    })
    console.log(resp.body)
  }

  // title: string | null;
  // body_html: string | null;
  // created_at: string | null;
  // handle: string | null;
  // id: number | null;
  // images: Image[] | null | {
  //     [key: string]: any;
  // };
  // options: {
  //     [key: string]: unknown;
  // } | {
  //     [key: string]: unknown;
  // }[] | null;
  // product_type: string | null;
  // published_at: string | null;
  // published_scope: string | null;
  // status: string | null;
  // tags: string | string[] | null;
  // template_suffix: string | null;
  // updated_at: string | null;
  // variants: Variant[] | null | {
  //     [key: string]: any;
  // };
  // vendor: string | null;

  async createNewProduct (): Promise<void> {
    const resp = await client.post({
      path: 'products',
      type: DataType.JSON,
      data: {
        product: {
          title: 'Burton Custom Freestyle 151',
          body_html: '\u003cstrong\u003eGood snowboard!\u003c\/strong\u003e',
          vendor: 'Burton',
          product_type: 'Snowboard',
          tags: [
            'Barnes \u0026 Noble',
            'Big Air',
            "John's Fav"
          ]
        }
      }
    })
    console.log(resp.body)
  }
}

export default new ShopifyService()
