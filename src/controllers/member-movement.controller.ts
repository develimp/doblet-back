import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Member,
  Movement,
} from '../models';
import {MemberRepository} from '../repositories';

export class MemberMovementController {
  constructor(
    @repository(MemberRepository) protected memberRepository: MemberRepository,
  ) { }

  @get('/members/{id}/movements', {
    responses: {
      '200': {
        description: 'Array of Member has many Movement',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Movement)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Movement>,
  ): Promise<Movement[]> {
    return this.memberRepository.movements(id).find(filter);
  }

  @post('/members/{id}/movements', {
    responses: {
      '200': {
        description: 'Member model instance',
        content: {'application/json': {schema: getModelSchemaRef(Movement)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Member.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Movement, {
            title: 'NewMovementInMember',
            exclude: ['id'],
            optional: ['memberFk']
          }),
        },
      },
    }) movement: Omit<Movement, 'id'>,
  ): Promise<Movement> {
    return this.memberRepository.movements(id).create(movement);
  }

  @patch('/members/{id}/movements', {
    responses: {
      '200': {
        description: 'Member.Movement PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Movement, {partial: true}),
        },
      },
    })
    movement: Partial<Movement>,
    @param.query.object('where', getWhereSchemaFor(Movement)) where?: Where<Movement>,
  ): Promise<Count> {
    return this.memberRepository.movements(id).patch(movement, where);
  }

  @del('/members/{id}/movements', {
    responses: {
      '200': {
        description: 'Member.Movement DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Movement)) where?: Where<Movement>,
  ): Promise<Count> {
    return this.memberRepository.movements(id).delete(where);
  }
}
