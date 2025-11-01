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
import {LotteryName} from '../models';
import {LotteryNameRepository} from '../repositories';

@authenticate('jwt')
export class LotteryNameController {
  constructor(
    @repository(LotteryNameRepository)
    public lotteryNameRepository: LotteryNameRepository,
  ) { }

  @post('/lottery-names')
  @response(200, {
    description: 'LotteryName model instance',
    content: {'application/json': {schema: getModelSchemaRef(LotteryName)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LotteryName, {
            title: 'NewLotteryName',
            exclude: ['id'],
          }),
        },
      },
    })
    lotteryName: Omit<LotteryName, 'id'>,
  ): Promise<LotteryName> {
    return this.lotteryNameRepository.create(lotteryName);
  }

  @get('/lottery-names/count')
  @response(200, {
    description: 'LotteryName model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(LotteryName) where?: Where<LotteryName>,
  ): Promise<Count> {
    return this.lotteryNameRepository.count(where);
  }

  @get('/lottery-names')
  @response(200, {
    description: 'Array of LotteryName model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(LotteryName, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(LotteryName) filter?: Filter<LotteryName>,
  ): Promise<LotteryName[]> {
    return this.lotteryNameRepository.find(filter);
  }

  @patch('/lottery-names')
  @response(200, {
    description: 'LotteryName PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LotteryName, {partial: true}),
        },
      },
    })
    lotteryName: LotteryName,
    @param.where(LotteryName) where?: Where<LotteryName>,
  ): Promise<Count> {
    return this.lotteryNameRepository.updateAll(lotteryName, where);
  }

  @get('/lottery-names/{id}')
  @response(200, {
    description: 'LotteryName model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(LotteryName, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(LotteryName, {exclude: 'where'}) filter?: FilterExcludingWhere<LotteryName>
  ): Promise<LotteryName> {
    return this.lotteryNameRepository.findById(id, filter);
  }

  @patch('/lottery-names/{id}')
  @response(204, {
    description: 'LotteryName PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LotteryName, {partial: true}),
        },
      },
    })
    lotteryName: LotteryName,
  ): Promise<void> {
    await this.lotteryNameRepository.updateById(id, lotteryName);
  }

  @put('/lottery-names/{id}')
  @response(204, {
    description: 'LotteryName PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() lotteryName: LotteryName,
  ): Promise<void> {
    await this.lotteryNameRepository.replaceById(id, lotteryName);
  }

  @del('/lottery-names/{id}')
  @response(204, {
    description: 'LotteryName DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.lotteryNameRepository.deleteById(id);
  }

  @post('/lottery-names/{id}/assign')
  @response(200, {
    description: 'Assigna la loteria pendent del sorteig indicat',
    content: {'application/json': {schema: {type: 'object'}}},
  })
  async assignLottery(
    @param.path.number('id') lotteryNameFk: number,
  ): Promise<object> {
    try {
      const result = await this.lotteryNameRepository.dataSource.execute(
        'CALL sp.assignLottery(?);',
        [lotteryNameFk],
      );

      return {
        success: true,
        message: `Sorteig assignat correctament.`,
        result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error assignant el sorteig: ' + error.message,
        error: error.message
      };
    }
  }
}
