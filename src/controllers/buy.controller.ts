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
import fsSync from 'fs';
import * as fs from 'fs/promises';
import handlebars from 'handlebars';
import * as path from 'path';
import puppeteer from 'puppeteer';

import {Buy} from '../models';
import {BuyRepository} from '../repositories';

@authenticate('jwt')
export class BuyController {
  constructor(
    @repository(BuyRepository)
    public buyRepository: BuyRepository,
  ) { }

  @post('/buys')
  @response(200, {
    description: 'Buy model instance',
    content: {'application/json': {schema: getModelSchemaRef(Buy)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Buy, {
            title: 'NewBuy',
            exclude: ['id'],
          }),
        },
      },
    })
    buy: Omit<Buy, 'id'>,
  ): Promise<Buy> {
    return this.buyRepository.create(buy);
  }

  @get('/buys/count')
  @response(200, {
    description: 'Buy model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Buy) where?: Where<Buy>): Promise<Count> {
    return this.buyRepository.count(where);
  }

  @get('/buys')
  @response(200, {
    description: 'Array of Buy model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Buy, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Buy) filter?: Filter<Buy>): Promise<Buy[]> {
    const finalFilter: Filter<Buy> = {
      ...filter,
      include: [
        ...(filter?.include ?? []),
        {
          relation: 'subItem',
          scope: {
            include: [{relation: 'budgetItem'}],
          },
        },
        {relation: 'supplier'},
      ],
    };

    return this.buyRepository.find(finalFilter);
  }

  @patch('/buys')
  @response(200, {
    description: 'Buy PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Buy, {partial: true}),
        },
      },
    })
    buy: Buy,
    @param.where(Buy) where?: Where<Buy>,
  ): Promise<Count> {
    return this.buyRepository.updateAll(buy, where);
  }

  @get('/buys/{id}')
  @response(200, {
    description: 'Buy model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Buy, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Buy, {exclude: 'where'}) filter?: FilterExcludingWhere<Buy>,
  ): Promise<Buy> {
    return this.buyRepository.findById(id, filter);
  }

  @patch('/buys/{id}')
  @response(204, {
    description: 'Buy PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Buy, {partial: true}),
        },
      },
    })
    buy: Buy,
  ): Promise<void> {
    await this.buyRepository.updateById(id, buy);
  }

  @put('/buys/{id}')
  @response(204, {
    description: 'Buy PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() buy: Buy,
  ): Promise<void> {
    await this.buyRepository.replaceById(id, buy);
  }

  @del('/buys/{id}')
  @response(204, {
    description: 'Buy DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.buyRepository.deleteById(id);
  }

  @get('/buys/pdf')
  @response(200, {
    description: 'PDF generated successfully',
    content: {'application/pdf': {schema: {type: 'string', format: 'binary'}}},
  })
  async generateBuyListPDF(
    @inject(RestBindings.Http.RESPONSE) res: Response,
  ): Promise<void> {
    const buys = await this.buyRepository.find({
      include: [
        {relation: 'subItem', scope: {include: [{relation: 'budgetItem'}]}},
        {relation: 'supplier'},
      ],
    });

    let templatePath = path.join(process.cwd(), 'dist', 'templates', 'buy-list.hbs');
    if (!fsSync.existsSync(templatePath)) {
      const devPath = path.join(process.cwd(), 'src', 'templates', 'buy-list.hbs');
      if (fsSync.existsSync(devPath)) {
        templatePath = devPath;
      } else {
        throw new Error('No se encontró la plantilla buy-list.hbs');
      }
    }

    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.compile(templateContent);
    const html = template({buys});

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, {waitUntil: 'networkidle0'});
    const pdf = await page.pdf({format: 'A4'});
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="buy-list.pdf"');
    res.end(pdf);
  }
}
