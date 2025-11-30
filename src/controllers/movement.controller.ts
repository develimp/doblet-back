import {authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
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
  Response,
  RestBindings
} from '@loopback/rest';
import {Movement} from '../models';
import {BalanceRepository, FallaYearRepository, MemberRepository, MovementRepository} from '../repositories';
import {MailService} from '../services/mail.service';
import {ReceiptGeneratorService} from '../services/receipt-generator.service';

@authenticate('jwt')
export class MovementController {
  constructor(
    @service(ReceiptGeneratorService)
    private receiptGeneratorService: ReceiptGeneratorService,
    @service(MailService)
    private mailService: MailService,
    @repository(MovementRepository)
    public movementRepository: MovementRepository,
    @repository(MemberRepository)
    public memberRepository: MemberRepository,
    @repository(BalanceRepository)
    public balanceRepository: BalanceRepository,
    @repository(FallaYearRepository)
    public fallaYearRepository: FallaYearRepository,
  ) { }

  @post('/movements')
  @response(200, {
    description: 'Movement model instance',
    content: {'application/json': {schema: getModelSchemaRef(Movement)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Movement, {
            title: 'NewMovement',
            exclude: ['id'],
          }),
        },
      },
    })
    movement: Omit<Movement, 'id'>,
  ): Promise<Movement> {
    return this.movementRepository.create(movement);
  }

  @get('/movements/count')
  @response(200, {
    description: 'Movement model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Movement) where?: Where<Movement>,
  ): Promise<Count> {
    return this.movementRepository.count(where);
  }

  @get('/movements')
  @response(200, {
    description: 'Array of Movement model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Movement, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Movement) filter?: Filter<Movement>,
  ): Promise<Movement[]> {
    return this.movementRepository.find(filter);
  }

  @patch('/movements')
  @response(200, {
    description: 'Movement PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Movement, {partial: true}),
        },
      },
    })
    movement: Movement,
    @param.where(Movement) where?: Where<Movement>,
  ): Promise<Count> {
    return this.movementRepository.updateAll(movement, where);
  }

  @get('/movements/{id}')
  @response(200, {
    description: 'Movement model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Movement, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Movement, {exclude: 'where'}) filter?: FilterExcludingWhere<Movement>
  ): Promise<Movement> {
    return this.movementRepository.findById(id, filter);
  }

  @patch('/movements/{id}')
  @response(204, {
    description: 'Movement PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Movement, {partial: true}),
        },
      },
    })
    movement: Movement,
  ): Promise<void> {
    await this.movementRepository.updateById(id, movement);
  }

  @put('/movements/{id}')
  @response(204, {
    description: 'Movement PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() movement: Movement,
  ): Promise<void> {
    await this.movementRepository.replaceById(id, movement);
  }

  @del('/movements/{id}')
  @response(204, {
    description: 'Movement DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.movementRepository.deleteById(id);
  }

  @post('/movements/receipt/{memberId}')
  async generateReceiptPDF(
    @param.path.number('memberId') memberId: number,
    @requestBody() paymentData: any,
    @inject(RestBindings.Http.RESPONSE) res: Response,
  ): Promise<void> {
    const pdfBuffer = await this.receiptGeneratorService.generateReceiptPDFBuffer(memberId, paymentData);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="receipt.pdf"');
    res.end(pdfBuffer);
  }

  @post('/movements/send-receipt/{memberId}')
  async sendReceiptByEmail(
    @param.path.number('memberId') memberId: number,
    @requestBody() paymentData: any,
  ) {
    const member = await this.memberRepository.findById(memberId);

    const pdfBuffer = await this.receiptGeneratorService.generateReceiptPDFBuffer(memberId, paymentData);
    await this.mailService.sendMailWithAttachment(
      member.email!,
      'Rebut de pagament',
      'S\'adjunta el rebut corresponent al teu últim pagament.',
      pdfBuffer,
    );
    return {message: 'Correu enviat correctament'};
  }

  @get('/movements/by-member/{memberId}/current')
  @response(200, {
    description: 'Movements for a member in the latest FallaYear',
    content: {'application/json': {schema: {type: 'array', items: {'x-ts-type': Movement}}}},
  })
  async findByMemberCurrent(
    @param.path.number('memberId') memberId: number,
  ): Promise<Movement[]> {
    const last = await this.fallaYearRepository.findOne({order: ['code DESC']});
    if (!last) return [];

    return this.movementRepository.find({
      where: {
        memberFk: memberId,
        fallaYearFk: last.code,
      },
      order: ['id DESC'],
    });
  }

  @get('/movements/by-family/{familyFk}/current')
  @response(200, {
    description: 'Movements for a family in the latest FallaYear',
    content: {'application/json': {schema: {type: 'array', items: {'x-ts-type': Movement}}}},
  })
  async findByFamilyCurrent(
    @param.path.number('familyFk') familyFk: number,
  ): Promise<Movement[]> {
    const last = await this.fallaYearRepository.findOne({order: ['code DESC']});
    if (!last) return [];

    const members = await this.memberRepository.find({where: {familyFk}});
    const memberIds = members.map(m => m.id).filter(id => id !== undefined) as number[];

    if (memberIds.length === 0) {
      return [];
    }

    return this.movementRepository.find({
      where: {
        memberFk: {inq: memberIds},
        fallaYearFk: last.code,
      },
      order: ['id DESC'],
    });
  }

  @post('/family-payment')
  @response(200, {
    description: 'Register a family payment and create movements for each member',
    content: {'application/json': {schema: {message: 'string'}}},
  })
  async registerFamilyPayment(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['familyFk', 'amount', 'idConcept', 'payMethod'],
            properties: {
              familyFk: {type: 'number'},
              amount: {type: 'number'},
              idConcept: {type: 'number'},
              payMethod: {type: 'string'},
            },
          },
        },
      },
    })
    body: {
      familyFk: number; amount: number; idConcept: number; payMethod: 'cash' | 'bank';
    },
  ): Promise<object> {
    const {familyFk, amount, idConcept, payMethod} = body;

    await this.movementRepository.dataSource.execute(
      'CALL RegisterFamilyPayment(?, ?, ?, ?)',
      [familyFk, amount, idConcept, payMethod]
    );

    return {message: 'Pagament familiar registrat correctament'};
  }
}
