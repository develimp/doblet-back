import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Client} from './client.model';
import {SubItem} from './sub-item.model';

@model({
  settings: {
    mysql: {
      table: 'sale',
    },
  },
})
export class Sale extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  amount: number;

  @property({
    type: 'string',
    required: true,
  })
  payMethod: string;

  @property({
    type: 'string',
  })
  ticketReference?: string;

  @property({
    type: 'date',
  })
  sold?: string;

  @property({
    type: 'string',
  })
  digitizedDocument?: string;

  @property({
    type: 'date',
  })
  created?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @belongsTo(() => SubItem, {name: 'subItem'})
  subItemFk: number;

  @belongsTo(() => Client, {name: 'client'})
  clientFk: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Sale>) {
    super(data);
  }
}

export interface SaleRelations {
  // describe navigational properties here
}

export type SaleWithRelations = Sale & SaleRelations;
