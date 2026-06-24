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
import {Family} from '../models';
import {FamilyRepository} from '../repositories';

@authenticate('jwt')
export class FamilyController {
  constructor(
    @repository(FamilyRepository)
    public familyRepository : FamilyRepository,
  ) {}

  @post('/families')
  @response(200, {
    description: 'Family model instance',
    content: {'application/json': {schema: getModelSchemaRef(Family)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Family, {
            title: 'NewFamily',
            exclude: ['id'],
          }),
        },
      },
    })
    family: Omit<Family, 'id'>,
  ): Promise<Family> {
    return this.familyRepository.create(family);
  }

  @get('/families/count')
  @response(200, {
    description: 'Family model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Family) where?: Where<Family>,
  ): Promise<Count> {
    return this.familyRepository.count(where);
  }

  @get('/families')
  @response(200, {
    description: 'Array of Family model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Family, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Family) filter?: Filter<Family>,
  ): Promise<Family[]> {
    return this.familyRepository.find(filter);
  }

  @patch('/families')
  @response(200, {
    description: 'Family PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Family, {partial: true}),
        },
      },
    })
    family: Family,
    @param.where(Family) where?: Where<Family>,
  ): Promise<Count> {
    return this.familyRepository.updateAll(family, where);
  }

  @get('/families/{id}')
  @response(200, {
    description: 'Family model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Family, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Family, {exclude: 'where'}) filter?: FilterExcludingWhere<Family>
  ): Promise<Family> {
    return this.familyRepository.findById(id, filter);
  }

  @patch('/families/{id}')
  @response(204, {
    description: 'Family PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Family, {partial: true}),
        },
      },
    })
    family: Family,
  ): Promise<void> {
    await this.familyRepository.updateById(id, family);
  }

  @put('/families/{id}')
  @response(204, {
    description: 'Family PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() family: Family,
  ): Promise<void> {
    await this.familyRepository.replaceById(id, family);
  }

  @del('/families/{id}')
  @response(204, {
    description: 'Family DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.familyRepository.deleteById(id);
  }
}
