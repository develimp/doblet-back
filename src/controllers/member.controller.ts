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
  Response,
  RestBindings,
} from '@loopback/rest';
import {SpDataSource} from '../datasources';
import {Family, Member} from '../models';
import {FamilyRepository, MemberRepository} from '../repositories';
import {PdfService} from '../services/pdf.service';

@authenticate('jwt')
export class MemberController {
  constructor(
    @repository(MemberRepository)
    public memberRepository: MemberRepository,
    @repository(FamilyRepository)
    public familyRepository: FamilyRepository,
    @inject('datasources.sp') private dataSource: SpDataSource,
    @inject('services.PdfService') private pdfService: PdfService,
  ) { }

  @post('/members')
  @response(200, {
    description: 'Member model instance',
    content: {'application/json': {schema: getModelSchemaRef(Member)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Member, {
            title: 'NewMember',
            exclude: ['id'],
          }),
        },
      },
    })
    member: Omit<Member, 'id'>,
  ): Promise<Member> {
    return this.memberRepository.create(member);
  }

  @get('/members/count')
  @response(200, {
    description: 'Member model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Member) where?: Where<Member>): Promise<Count> {
    return this.memberRepository.count(where);
  }

  @get('/members')
  @response(200, {
    description: 'Array of Member model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Member, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Member) filter?: Filter<Member>): Promise<Member[]> {
    return this.memberRepository.find(filter);
  }

  @patch('/members')
  @response(200, {
    description: 'Member PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Member, {partial: true}),
        },
      },
    })
    member: Member,
    @param.where(Member) where?: Where<Member>,
  ): Promise<Count> {
    return this.memberRepository.updateAll(member, where);
  }

  @get('/members/{id}')
  @response(200, {
    description: 'Member model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Member, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Member, {exclude: 'where'})
    filter?: FilterExcludingWhere<Member>,
  ): Promise<Member> {
    return this.memberRepository.findById(id, filter);
  }

  @patch('/members/{id}')
  @response(204, {
    description: 'Member PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Member, {partial: true}),
        },
      },
    })
    member: Member,
  ): Promise<void> {
    await this.memberRepository.updateById(id, member);
  }

  @post('/members/{id}/leave-family')
  @response(204, {
    description: 'Member leave family success',
  })
  async leaveFamily(
    @param.path.number('id') id: number,
  ): Promise<void> {
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new Error('Member not found');
    }

    const newFamily = await this.familyRepository.create({discount: 0});
    await this.memberRepository.updateById(id, {familyFk: newFamily.id});
  }

  @put('/members/{id}')
  @response(204, {
    description: 'Member PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() member: Member,
  ): Promise<void> {
    await this.memberRepository.replaceById(id, member);
  }

  @del('/members/{id}')
  @response(204, {
    description: 'Member DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.memberRepository.deleteById(id);
  }

  @post('/members/register-all-direct-debit-payments')
  async registerAllDirectDebitPayments(
    @requestBody({
      description: 'Register direct debit payments for all members',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              date: {type: 'string', format: 'date'},
              note: {type: 'string'},
            },
            required: ['date', 'note'],
          },
        },
      },
    })
    body: {date: string; note: string},
  ): Promise<any> {
    const sql = `CALL registerAllDirectDebitPayments(?, ?)`;
    const result = await this.dataSource.execute(sql, [body.date, body.note]);
    return result;
  }

  @get('/members/adherence-pdf')
  async generateAdherencePdf(
    @inject(RestBindings.Http.RESPONSE) res: Response,
  ): Promise<void> {
    const pdf = await this.pdfService.renderPdf(
      'adherence-document.hbs',
      {},
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'inline; filename="adherence-document.pdf"',
    );

    res.end(pdf);
  }

  @get('/members/authorization-pdf')
  async generateAuthorizationPdf(
    @inject(RestBindings.Http.RESPONSE) res: Response,
  ): Promise<void> {
    const pdf = await this.pdfService.renderPdf(
      'minors-authorization.hbs',
      {},
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'inline; filename="minors-authorization.pdf"',
    );

    res.end(pdf);
  }

  @get('/members/partner-pdf')
  async generatePartnerPdf(
    @inject(RestBindings.Http.RESPONSE) res: Response,
  ): Promise<void> {
    const pdf = await this.pdfService.renderPdf(
      'partner-document.hbs',
      {},
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'inline; filename="partner-document.pdf"',
    );

    res.end(pdf);
  }
}
