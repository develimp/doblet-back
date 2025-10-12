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
  RestBindings
} from '@loopback/rest';
import * as fsSync from 'fs';
import * as fs from 'fs/promises';
import * as handlebars from 'handlebars';
import path from 'path';
import puppeteer from 'puppeteer';
import {Movement} from '../models';
import {BalanceRepository, MemberRepository, MovementRepository} from '../repositories';

@authenticate('jwt')
export class MovementController {
  constructor(
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
  @response(200, {
    description: 'Generate payment receipt PDF',
    content: {
      'application/pdf': {
        schema: {type: 'string', format: 'binary'}
      }
    },
  })
  async generateReceiptPDF(
    @param.path.number('memberId') memberId: number,
    @requestBody() paymentData: {
      pay_fee: number;
      pay_lottery: number;
      pay_raffle: number;
    },
    @inject(RestBindings.Http.RESPONSE) res: Response,
  ): Promise<void> {
    const member = await this.memberRepository.findById(memberId);
    const balance = await this.balanceRepository.findById(memberId);

    const totalPay =
      (paymentData.pay_fee || 0) +
      (paymentData.pay_lottery || 0) +
      (paymentData.pay_raffle || 0)

    let imagePath = path.join(process.cwd(), 'dist', 'templates', 'images', 'escut.png');
    if (!fsSync.existsSync(imagePath)) {
      const devImagePath = path.join(process.cwd(), 'src', 'templates', 'images', 'escut.png');
      if (fsSync.existsSync(devImagePath)) {
        imagePath = devImagePath;
      } else {
        imagePath = '';
      }
    }

    let imageBase64 = '';
    if (imagePath) {
      const imageData = await fs.readFile(imagePath);
      const mimeType = 'image/png';
      imageBase64 = `data:${mimeType};base64,${imageData.toString('base64')}`;
    }

    const templateData: any = {
      name: `${member.name} ${member.surname}`,
      individualized: 0,
      current_date: new Date().toLocaleDateString('ca-ES'),
      pay_fee: paymentData.pay_fee.toFixed(2),
      pay_lottery: paymentData.pay_lottery.toFixed(2),
      pay_raffle: paymentData.pay_raffle.toFixed(2),
      assigned_fee: balance.feeAssigned.toFixed(2),
      payed_fee: balance.feePayed.toFixed(2),
      assigned_lottery: balance.lotteryAssigned.toFixed(2),
      payed_lottery: balance.lotteryPayed.toFixed(2),
      assigned_raffle: balance.raffleAssigned.toFixed(2),
      payed_raffle: balance.rafflePayed.toFixed(2),
      fee_debt: (balance.feeAssigned - balance.feePayed).toFixed(2),
      lottery_debt: (balance.lotteryAssigned - balance.lotteryPayed).toFixed(2),
      raffle_debt: (balance.raffleAssigned - balance.rafflePayed).toFixed(2),
      total_pay: totalPay.toFixed(2),
      total_assigned: (balance.feeAssigned + balance.lotteryAssigned + balance.raffleAssigned).toFixed(2),
      total_payed: (balance.feePayed + balance.lotteryPayed + balance.rafflePayed).toFixed(2),
      total_debt:
        (balance.feeAssigned +
          balance.lotteryAssigned +
          balance.raffleAssigned -
          (balance.feePayed + balance.lotteryPayed + balance.rafflePayed)).toFixed(2),
      imageBase64,
    };

    let templatePath = path.join(process.cwd(), 'dist', 'templates', 'receipt.hbs');
    if (!fsSync.existsSync(templatePath)) {
      const devPath = path.join(process.cwd(), 'src', 'templates', 'receipt.hbs');
      if (fsSync.existsSync(devPath)) {
        templatePath = devPath;
      } else throw new Error('Template file not found');
    }

    const templateContent = await fs.readFile(templatePath, 'utf-8')
    const template = handlebars.compile(templateContent);
    const html = template(templateData);

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/chromium',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, {waitUntil: 'networkidle0'});
    const pdf = await page.pdf({format: 'A4'});
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="receipt.pdf"');
    res.end(pdf);
  }
}
