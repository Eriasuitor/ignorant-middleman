import { Request, Response } from 'express'
import { Method, RequestMapping } from '../../app'
import ExcelResolver from '../../common/resolver/excel-resolver'
import { ExcelProductTransformer } from '../../common/transform/product/excel-product.transform'
import shopifyService from './shopify.service'

class ShopifyController {
  @RequestMapping(Method.GET, '/products')
  async fetch (req: Request, res: Response): Promise<void> {
    res.json(await shopifyService.fetch())
  }

  @RequestMapping(Method.POST, '/products')
  async create (req: Request, res: Response): Promise<void> {
    if (req.file === undefined) {
      res.status(400).send()
      return
    }
    const dataProvider = new ExcelResolver(req.file.originalname, req.file.buffer, new ExcelProductTransformer())
    await shopifyService.createNewProduct(dataProvider)
    res.status(200).send()
  }
}

export default ShopifyController
