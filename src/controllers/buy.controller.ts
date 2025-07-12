import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Buy} from '../models';
import {BuyRepository} from '../repositories';

@authenticate('jwt')
export class BuyController {
  constructor(
    @repository(BuyRepository)
    public buyRepository: BuyRepository,
  ) {}

  @post('/buys')
  @response(200, {
    description: 'Buy model instance',
    content: {'application/json': {schema: getModelSchemaRef(Buy)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Buy, {
            title: 'NewBuy',
            exclude: ['id'],
          }),
        },
      },
    })
    buy: Omit<Buy, 'id'>,
  ): Promise<Buy> {
    return this.buyRepository.create(buy);
  }

  @get('/buys/count')
  @response(200, {
    description: 'Buy model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Buy) where?: Where<Buy>): Promise<Count> {
    return this.buyRepository.count(where);
  }

  @get('/buys')
  @response(200, {
    description: 'Array of Buy model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Buy, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Buy) filter?: Filter<Buy>): Promise<Buy[]> {
    return this.buyRepository.find(filter);
  }

  @patch('/buys')
  @response(200, {
    description: 'Buy PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Buy, {partial: true}),
        },
      },
    })
    buy: Buy,
    @param.where(Buy) where?: Where<Buy>,
  ): Promise<Count> {
    return this.buyRepository.updateAll(buy, where);
  }

  @get('/buys/{id}')
  @response(200, {
    description: 'Buy model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Buy, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Buy, {exclude: 'where'}) filter?: FilterExcludingWhere<Buy>,
  ): Promise<Buy> {
    return this.buyRepository.findById(id, filter);
  }

  @patch('/buys/{id}')
  @response(204, {
    description: 'Buy PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Buy, {partial: true}),
        },
      },
    })
    buy: Buy,
  ): Promise<void> {
    await this.buyRepository.updateById(id, buy);
  }

  @put('/buys/{id}')
  @response(204, {
    description: 'Buy PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() buy: Buy,
  ): Promise<void> {
    await this.buyRepository.replaceById(id, buy);
  }

  @del('/buys/{id}')
  @response(204, {
    description: 'Buy DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.buyRepository.deleteById(id);
  }
}
