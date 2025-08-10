import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Buy, SubItem} from '../models';
import {BuyRepository} from '../repositories';

@authenticate('jwt')
export class BuySubItemController {
  constructor(
    @repository(BuyRepository)
    public buyRepository: BuyRepository,
  ) {}

  @get('/buys/{id}/sub-item', {
    responses: {
      '200': {
        description: 'SubItem belonging to Buy',
        content: {
          'application/json': {
            schema: getModelSchemaRef(SubItem),
          },
        },
      },
    },
  })
  async getSubItem(
    @param.path.number('id') id: typeof Buy.prototype.id,
  ): Promise<SubItem> {
    return this.buyRepository.subItem(id);
  }
}
