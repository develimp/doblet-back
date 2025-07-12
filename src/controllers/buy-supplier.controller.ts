import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Buy, Supplier} from '../models';
import {BuyRepository} from '../repositories';

export class BuySupplierController {
  constructor(
    @repository(BuyRepository)
    public buyRepository: BuyRepository,
  ) {}

  @get('/buys/{id}/supplier', {
    responses: {
      '200': {
        description: 'Supplier belonging to Buy',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Supplier),
          },
        },
      },
    },
  })
  async getSupplier(
    @param.path.number('id') id: typeof Buy.prototype.id,
  ): Promise<Supplier> {
    return this.buyRepository.supplier(id);
  }
}
