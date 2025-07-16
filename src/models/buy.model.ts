import {belongsTo, Entity, model, property} from '@loopback/repository';
import {SubItem} from './sub-item.model';
import {Supplier} from './supplier.model';

@model({
  settings: {
    mysql: {
      table: 'buy',
    },
  },
})
export class Buy extends Entity {
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
  buyed?: string;

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

  @belongsTo(() => Supplier, {name: 'supplier'})
  supplierFk: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Buy>) {
    super(data);
  }
}

export interface BuyRelations {
  // describe navigational properties here
}

export type BuyWithRelations = Buy & BuyRelations;
