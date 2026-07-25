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
import {FallaYear} from '../models';
import {FallaYearRepository} from '../repositories';

export class FallaYearController {
  constructor(
    @repository(FallaYearRepository)
    public fallaYearRepository: FallaYearRepository,
    @inject('datasources.sp') private dataSource: SpDataSource,
  ) { }

  @authenticate('jwt')
  @post('/falla-years')
  @response(200, {
    description: 'FallaYear model instance',
    content: {'application/json': {schema: getModelSchemaRef(FallaYear)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FallaYear, {
            title: 'NewFallaYear',

          }),
        },
      },
    })
    fallaYear: FallaYear,
  ): Promise<FallaYear> {
    return this.fallaYearRepository.create(fallaYear);
  }

  @authenticate('jwt')
  @get('/falla-years/count')
  @response(200, {
    description: 'FallaYear model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(FallaYear) where?: Where<FallaYear>,
  ): Promise<Count> {
    return this.fallaYearRepository.count(where);
  }

  @authenticate('jwt')
  @get('/falla-years')
  @response(200, {
    description: 'Array of FallaYear model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(FallaYear, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(FallaYear) filter?: Filter<FallaYear>,
  ): Promise<FallaYear[]> {
    return this.fallaYearRepository.find(filter);
  }

  @authenticate('jwt')
  @patch('/falla-years')
  @response(200, {
    description: 'FallaYear PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FallaYear, {partial: true}),
        },
      },
    })
    fallaYear: FallaYear,
    @param.where(FallaYear) where?: Where<FallaYear>,
  ): Promise<Count> {
    return this.fallaYearRepository.updateAll(fallaYear, where);
  }

  @authenticate('jwt')
  @get('/falla-years/{id}')
  @response(200, {
    description: 'FallaYear model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(FallaYear, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(FallaYear, {exclude: 'where'}) filter?: FilterExcludingWhere<FallaYear>
  ): Promise<FallaYear> {
    return this.fallaYearRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @patch('/falla-years/{id}')
  @response(204, {
    description: 'FallaYear PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FallaYear, {partial: true}),
        },
      },
    })
    fallaYear: FallaYear,
  ): Promise<void> {
    await this.fallaYearRepository.updateById(id, fallaYear);
  }

  @authenticate('jwt')
  @put('/falla-years/{id}')
  @response(204, {
    description: 'FallaYear PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() fallaYear: FallaYear,
  ): Promise<void> {
    await this.fallaYearRepository.replaceById(id, fallaYear);
  }

  @authenticate('jwt')
  @del('/falla-years/{id}')
  @response(204, {
    description: 'FallaYear DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.fallaYearRepository.deleteById(id);
  }

  @authenticate('jwt')
  @post('/falla-years/change-year')
  @response(200, {
    description: 'Close current falla year and create the next one',
  })
  async changeFallaYear(): Promise<any> {
    const sql = `CALL changeFallaYear()`;
    const result = await this.dataSource.execute(sql);

    return {
      message: 'Falla year changed successfully',
      result,
    };
  }

  @get('/falla-years/current')
  @response(200, {
    description: 'Current falla year',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            code: { type: 'number' },
          },
        },
      },
    },
  })
  async getCurrentFallaYear(): Promise<{ code: number | null }> {
    const sql = `SELECT sp.getCurrentFallaYear() AS code`;
    const result: any = await this.dataSource.execute(sql);

    return {
      code: result[0]?.code ?? null,
    };
  }
}
