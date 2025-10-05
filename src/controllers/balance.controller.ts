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
import {Balance} from '../models';
import {BalanceRepository} from '../repositories';

@authenticate('jwt')
export class BalanceController {
  constructor(
    @repository(BalanceRepository)
    public balanceRepository: BalanceRepository,
  ) { }

  @post('/balances')
  @response(200, {
    description: 'Balance model instance',
    content: {'application/json': {schema: getModelSchemaRef(Balance)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Balance, {
            title: 'NewBalance',

          }),
        },
      },
    })
    balance: Balance,
  ): Promise<Balance> {
    return this.balanceRepository.create(balance);
  }

  @get('/balances/count')
  @response(200, {
    description: 'Balance model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Balance) where?: Where<Balance>,
  ): Promise<Count> {
    return this.balanceRepository.count(where);
  }

  @get('/balances')
  @response(200, {
    description: 'Array of Balance model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Balance, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Balance) filter?: Filter<Balance>,
  ): Promise<Balance[]> {
    return this.balanceRepository.find(filter);
  }

  @patch('/balances')
  @response(200, {
    description: 'Balance PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Balance, {partial: true}),
        },
      },
    })
    balance: Balance,
    @param.where(Balance) where?: Where<Balance>,
  ): Promise<Count> {
    return this.balanceRepository.updateAll(balance, where);
  }

  @get('/balances/{id}')
  @response(200, {
    description: 'Balance model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Balance, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Balance, {exclude: 'where'}) filter?: FilterExcludingWhere<Balance>
  ): Promise<Balance> {
    return this.balanceRepository.findById(id, filter);
  }

  @patch('/balances/{id}')
  @response(204, {
    description: 'Balance PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Balance, {partial: true}),
        },
      },
    })
    balance: Balance,
  ): Promise<void> {
    await this.balanceRepository.updateById(id, balance);
  }

  @put('/balances/{id}')
  @response(204, {
    description: 'Balance PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() balance: Balance,
  ): Promise<void> {
    await this.balanceRepository.replaceById(id, balance);
  }

  @del('/balances/{id}')
  @response(204, {
    description: 'Balance DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.balanceRepository.deleteById(id);
  }
}
