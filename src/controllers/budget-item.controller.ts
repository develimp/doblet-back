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
import {BudgetItem, SubItem} from '../models';
import {BudgetItemRepository} from '../repositories';

export class BudgetItemController {
  constructor(
    @repository(BudgetItemRepository)
    public budgetItemRepository: BudgetItemRepository,
  ) {}

  @post('/budget-items')
  @response(200, {
    description: 'BudgetItem model instance',
    content: {'application/json': {schema: getModelSchemaRef(BudgetItem)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BudgetItem, {
            title: 'NewBudgetItem',
            exclude: ['id'],
          }),
        },
      },
    })
    budgetItem: Omit<BudgetItem, 'id'>,
  ): Promise<BudgetItem> {
    return this.budgetItemRepository.create(budgetItem);
  }

  @get('/budget-items/count')
  @response(200, {
    description: 'BudgetItem model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(BudgetItem) where?: Where<BudgetItem>,
  ): Promise<Count> {
    return this.budgetItemRepository.count(where);
  }

  @get('/budget-items')
  @response(200, {
    description: 'Array of BudgetItem model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(BudgetItem, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(BudgetItem) filter?: Filter<BudgetItem>,
  ): Promise<BudgetItem[]> {
    return this.budgetItemRepository.find(filter);
  }

  @patch('/budget-items')
  @response(200, {
    description: 'BudgetItem PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BudgetItem, {partial: true}),
        },
      },
    })
    budgetItem: BudgetItem,
    @param.where(BudgetItem) where?: Where<BudgetItem>,
  ): Promise<Count> {
    return this.budgetItemRepository.updateAll(budgetItem, where);
  }

  @get('/budget-items/{id}')
  @response(200, {
    description: 'BudgetItem model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(BudgetItem, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(BudgetItem, {exclude: 'where'})
    filter?: FilterExcludingWhere<BudgetItem>,
  ): Promise<BudgetItem> {
    return this.budgetItemRepository.findById(id, filter);
  }

  @patch('/budget-items/{id}')
  @response(204, {
    description: 'BudgetItem PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BudgetItem, {partial: true}),
        },
      },
    })
    budgetItem: BudgetItem,
  ): Promise<void> {
    await this.budgetItemRepository.updateById(id, budgetItem);
  }

  @put('/budget-items/{id}')
  @response(204, {
    description: 'BudgetItem PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() budgetItem: BudgetItem,
  ): Promise<void> {
    await this.budgetItemRepository.replaceById(id, budgetItem);
  }

  @del('/budget-items/{id}')
  @response(204, {
    description: 'BudgetItem DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.budgetItemRepository.deleteById(id);
  }

  @get('/budget-items/{id}/sub-items', {
    responses: {
      '200': {
        description: 'Array of SubItem belonging to BudgetItem',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                // el schema del modelo relacionado
                $ref: '#/components/schemas/SubItem',
              },
            },
          },
        },
      },
    },
  })
  async findSubItems(@param.path.number('id') id: number): Promise<SubItem[]> {
    return this.budgetItemRepository.subItems(id).find();
  }
}
