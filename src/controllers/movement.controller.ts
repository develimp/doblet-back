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
import {BalanceRepository, MemberRepository, MovementRepository} from '../repositories';
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
}
