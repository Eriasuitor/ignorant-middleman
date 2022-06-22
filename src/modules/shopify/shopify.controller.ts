import { Request, Response } from 'express'
import { Method, RequestMapping } from '../../app'
import shopifyService from './shopify.service'

class ShopifyController {
  @RequestMapping(Method.GET, '/products')
  async get (req: Request, res: Response): Promise<void> {
    await shopifyService.createNewProduct()
    res.json({ a: 13 })
  }

  @RequestMapping(Method.POST, '/products')
  async post (req: Request, res: Response): Promise<void> {
    // const dataProvider = new ExcelResolver()
    res.json({ a: 13 })
  }
}

export default ShopifyController
