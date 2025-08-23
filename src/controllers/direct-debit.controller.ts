import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
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
import {SpDataSource} from '../datasources';
import {DirectDebit} from '../models';
import {DirectDebitRepository} from '../repositories';

@authenticate('jwt')
export class DirectDebitController {
  constructor(
    @repository(DirectDebitRepository)
    public directDebitRepository: DirectDebitRepository,
    @inject('datasources.sp') private dataSource: SpDataSource,
  ) { }

  @post('/direct-debits')
  @response(200, {
    description: 'DirectDebit model instance',
    content: {'application/json': {schema: getModelSchemaRef(DirectDebit)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DirectDebit, {
            title: 'NewDirectDebit',
            exclude: ['id'],
          }),
        },
      },
    })
    directDebit: Omit<DirectDebit, 'id'>,
  ): Promise<DirectDebit> {
    return this.directDebitRepository.create(directDebit);
  }

  @get('/direct-debits/count')
  @response(200, {
    description: 'DirectDebit model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(DirectDebit) where?: Where<DirectDebit>,
  ): Promise<Count> {
    return this.directDebitRepository.count(where);
  }

  @get('/direct-debits')
  @response(200, {
    description: 'Array of DirectDebit model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(DirectDebit, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(DirectDebit) filter?: Filter<DirectDebit>,
  ): Promise<DirectDebit[]> {
    return this.directDebitRepository.find({
      include: [{relation: 'member'}],
    });
  }

  @patch('/direct-debits')
  @response(200, {
    description: 'DirectDebit PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DirectDebit, {partial: true}),
        },
      },
    })
    directDebit: DirectDebit,
    @param.where(DirectDebit) where?: Where<DirectDebit>,
  ): Promise<Count> {
    return this.directDebitRepository.updateAll(directDebit, where);
  }

  @get('/direct-debits/{id}')
  @response(200, {
    description: 'DirectDebit model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(DirectDebit, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(DirectDebit, {exclude: 'where'}) filter?: FilterExcludingWhere<DirectDebit>
  ): Promise<DirectDebit> {
    return this.directDebitRepository.findById(id, filter);
  }

  @patch('/direct-debits/{id}')
  @response(204, {
    description: 'DirectDebit PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DirectDebit, {partial: true}),
        },
      },
    })
    directDebit: DirectDebit,
  ): Promise<void> {
    await this.directDebitRepository.updateById(id, directDebit);
  }

  @put('/direct-debits/{id}')
  @response(204, {
    description: 'DirectDebit PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() directDebit: DirectDebit,
  ): Promise<void> {
    await this.directDebitRepository.replaceById(id, directDebit);
  }

  @del('/direct-debits/{id}')
  @response(204, {
    description: 'DirectDebit DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.directDebitRepository.deleteById(id);
  }

  @post('/direct-debits/update-calculated-amounts')
  async updateCalculatedAmounts(
    @requestBody({
      description: 'Update calculated amounts for all direct debits',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              months: {type: 'number', minimum: 1, maximum: 12},
            },
            required: ['months'],
          },
        },
      },
    })
    body: {months: number},
  ): Promise<any> {
    const sql = `CALL updateCalculatedAmounts(?)`;
    const result = await this.dataSource.execute(sql, [body.months]);
    return result;
  }
}
