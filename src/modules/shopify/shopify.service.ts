import { DataType, DeleteRequestParams, GetRequestParams, PostRequestParams, PutRequestParams, RequestReturn } from '@shopify/shopify-api'
import { RestClient } from '@shopify/shopify-api/dist/clients/rest'
import config from '../../../configs'
import DataProvider from '../../interfaces/data-provider.interface'
import { concurrentRun, sleep } from '../../utils/runner'
import lodash from 'lodash'
import logger from '../../logger'
import { ProductItem } from '../../interfaces/product.interface'

class ClientProxy extends RestClient {
  private async safeRun (fn: () => Promise<RequestReturn>): Promise<RequestReturn> {
    let retryTimes = 0
    while (retryTimes < 3) {
      const resp = await fn()
      if (!resp.headers.has('Retry-After')) return resp
      await sleep(lodash.toNumber(resp.headers.get('Retry-After')))
      retryTimes++
    }
    throw new Error(`Request to shopify exceeds the limit and has been retried ${retryTimes} times`)
  }

  async get (params: GetRequestParams): Promise<RequestReturn> {
    return await this.safeRun(super.get.bind(this, params))
  }

  async post (params: PostRequestParams): Promise<RequestReturn> {
    return await this.safeRun(super.post.bind(this, params))
  }

  async put (params: PutRequestParams): Promise<RequestReturn> {
    return await this.safeRun(super.put.bind(this, params))
  }

  async delete (params: DeleteRequestParams): Promise<RequestReturn> {
    return await this.safeRun(super.delete.bind(this, params))
  }
}

const client = new ClientProxy(config.shopify.domain, config.shopify.accessToken)

class ShopifyService {
  async fetch (): Promise<ProductItem[]> {
    const resp = await client.get({
      path: 'products',
      type: DataType.JSON
    })
    return resp.body as ProductItem[]
  }

  private async createProduct (product: ProductItem): Promise<RequestReturn> {
    logger.debug('Try create product', product)
    const resp = await client.post({
      path: 'products',
      type: DataType.JSON,
      data: { product }
    })
    logger.debug('Product created', product)
    return resp
  }

  async createNewProduct (dataProvider: DataProvider<ProductItem[]>): Promise<void> {
    const products = await dataProvider.getData()
    await concurrentRun(this.createProduct.bind(this), products, { concurrency: 3 })
  }
}

export default new ShopifyService()
