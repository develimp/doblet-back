import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {SubItem} from '../models';
import {SubItemRepository} from '../repositories';

export class SubItemController {
  constructor(
    @repository(SubItemRepository)
    public subItemRepository : SubItemRepository,
  ) {}

  @post('/sub-items')
  @response(200, {
    description: 'SubItem model instance',
    content: {'application/json': {schema: getModelSchemaRef(SubItem)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SubItem, {
            title: 'NewSubItem',
            exclude: ['id'],
          }),
        },
      },
    })
    subItem: Omit<SubItem, 'id'>,
  ): Promise<SubItem> {
    return this.subItemRepository.create(subItem);
  }

  @get('/sub-items/count')
  @response(200, {
    description: 'SubItem model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(SubItem) where?: Where<SubItem>,
  ): Promise<Count> {
    return this.subItemRepository.count(where);
  }

  @get('/sub-items')
  @response(200, {
    description: 'Array of SubItem model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SubItem, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(SubItem) filter?: Filter<SubItem>,
  ): Promise<SubItem[]> {
    return this.subItemRepository.find(filter);
  }

  @patch('/sub-items')
  @response(200, {
    description: 'SubItem PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SubItem, {partial: true}),
        },
      },
    })
    subItem: SubItem,
    @param.where(SubItem) where?: Where<SubItem>,
  ): Promise<Count> {
    return this.subItemRepository.updateAll(subItem, where);
  }

  @get('/sub-items/{id}')
  @response(200, {
    description: 'SubItem model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SubItem, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(SubItem, {exclude: 'where'}) filter?: FilterExcludingWhere<SubItem>
  ): Promise<SubItem> {
    return this.subItemRepository.findById(id, filter);
  }

  @patch('/sub-items/{id}')
  @response(204, {
    description: 'SubItem PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SubItem, {partial: true}),
        },
      },
    })
    subItem: SubItem,
  ): Promise<void> {
    await this.subItemRepository.updateById(id, subItem);
  }

  @put('/sub-items/{id}')
  @response(204, {
    description: 'SubItem PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() subItem: SubItem,
  ): Promise<void> {
    await this.subItemRepository.replaceById(id, subItem);
  }

  @del('/sub-items/{id}')
  @response(204, {
    description: 'SubItem DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.subItemRepository.deleteById(id);
  }
}
