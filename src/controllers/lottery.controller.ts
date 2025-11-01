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
import {Lottery} from '../models';
import {LotteryRepository} from '../repositories';

@authenticate('jwt')
export class LotteryController {
  constructor(
    @repository(LotteryRepository)
    public lotteryRepository: LotteryRepository,
  ) { }

  @post('/lotteries')
  @response(200, {
    description: 'Lottery model instance',
    content: {'application/json': {schema: getModelSchemaRef(Lottery)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Lottery, {
            title: 'NewLottery',
            exclude: ['id'],
          }),
        },
      },
    })
    lottery: Omit<Lottery, 'id'>,
  ): Promise<Lottery> {
    return this.lotteryRepository.create(lottery);
  }

  @get('/lotteries/count')
  @response(200, {
    description: 'Lottery model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Lottery) where?: Where<Lottery>,
  ): Promise<Count> {
    return this.lotteryRepository.count(where);
  }

  @get('/lotteries')
  @response(200, {
    description: 'Array of Lottery model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Lottery, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Lottery) filter?: Filter<Lottery>,
  ): Promise<Lottery[]> {
    return this.lotteryRepository.find(filter);
  }

  @patch('/lotteries')
  @response(200, {
    description: 'Lottery PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Lottery, {partial: true}),
        },
      },
    })
    lottery: Lottery,
    @param.where(Lottery) where?: Where<Lottery>,
  ): Promise<Count> {
    return this.lotteryRepository.updateAll(lottery, where);
  }

  @get('/lotteries/{id}')
  @response(200, {
    description: 'Lottery model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Lottery, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Lottery, {exclude: 'where'}) filter?: FilterExcludingWhere<Lottery>
  ): Promise<Lottery> {
    return this.lotteryRepository.findById(id, filter);
  }

  @patch('/lotteries/{id}')
  @response(204, {
    description: 'Lottery PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Lottery, {partial: true}),
        },
      },
    })
    lottery: Lottery,
  ): Promise<void> {
    await this.lotteryRepository.updateById(id, lottery);
  }

  @put('/lotteries/{id}')
  @response(204, {
    description: 'Lottery PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() lottery: Lottery,
  ): Promise<void> {
    await this.lotteryRepository.replaceById(id, lottery);
  }

  @del('/lotteries/{id}')
  @response(204, {
    description: 'Lottery DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.lotteryRepository.deleteById(id);
  }
}
