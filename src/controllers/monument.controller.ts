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
import {Monument} from '../models';
import {MonumentRepository} from '../repositories';

interface MonumentResponse {
  id?: number;
  fallaYear: number;
  type: string;
  section?: string;
  awardType?: string;
  award?: number;
  isCelebrated: boolean;
  title?: string;
  artist?: string;
  description?: string;
  imageKey?: string;
}

export class MonumentController {
  constructor(
    @repository(MonumentRepository)
    public monumentRepository : MonumentRepository,
  ) {}

  private toResponse(monument: Monument): MonumentResponse {
    const baseUrl = process.env.STORAGE_BASE_URL;
    return {
      id: monument.id,
      fallaYear: monument.fallaYear,
      type: monument.type,
      section: monument.section,
      awardType: monument.awardType,
      award: monument.award,
      isCelebrated: monument.isCelebrated,
      title: monument.title,
      artist: monument.artist,
      description: monument.description,
      imageKey: monument.imageKey
        ? `${baseUrl}/monuments/${monument.imageKey}`
        : undefined,
    };
  }

  @authenticate('jwt')
  @post('/monuments')
  @response(200, {
    description: 'Monument model instance',
    content: {'application/json': {schema: getModelSchemaRef(Monument)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Monument, {
            title: 'NewMonument',
            exclude: ['id'],
          }),
        },
      },
    })
    monument: Omit<Monument, 'id'>,
  ): Promise<Monument> {
    return this.monumentRepository.create(monument);
  }

  @authenticate('jwt')
  @get('/monuments/count')
  @response(200, {
    description: 'Monument model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Monument) where?: Where<Monument>,
  ): Promise<Count> {
    return this.monumentRepository.count(where);
  }

  @get('/monuments')
  @response(200, {
    description: 'Array of Monument model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Monument, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Monument) filter?: Filter<Monument>,
  ): Promise<MonumentResponse[]> {
    const monuments = await this.monumentRepository.find(filter);
    return monuments.map(monument => this.toResponse(monument));
  }

  @authenticate('jwt')
  @patch('/monuments')
  @response(200, {
    description: 'Monument PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Monument, {partial: true}),
        },
      },
    })
    monument: Monument,
    @param.where(Monument) where?: Where<Monument>,
  ): Promise<Count> {
    return this.monumentRepository.updateAll(monument, where);
  }

  @authenticate('jwt')
  @get('/monuments/{id}')
  @response(200, {
    description: 'Monument model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Monument, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Monument, {exclude: 'where'}) filter?: FilterExcludingWhere<Monument>
  ): Promise<MonumentResponse> {
    const monument = await this.monumentRepository.findById(id, filter);
    return this.toResponse(monument);
  }

  @authenticate('jwt')
  @patch('/monuments/{id}')
  @response(204, {
    description: 'Monument PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Monument, {partial: true}),
        },
      },
    })
    monument: Monument,
  ): Promise<void> {
    await this.monumentRepository.updateById(id, monument);
  }

  @authenticate('jwt')
  @put('/monuments/{id}')
  @response(204, {
    description: 'Monument PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() monument: Monument,
  ): Promise<void> {
    await this.monumentRepository.replaceById(id, monument);
  }

  @authenticate('jwt')
  @del('/monuments/{id}')
  @response(204, {
    description: 'Monument DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.monumentRepository.deleteById(id);
  }
}
