import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Member} from './member.model';

@model({
  settings: {
    mysql: {
      table: 'directDebit',
    },
  },
})
export class DirectDebit extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  accountNumber?: string;

  @property({
    type: 'number',
  })
  calculatedAmount?: number;

  @property({
    type: 'number',
    required: true,
  })
  actualAmount: number;

  @property({
    type: 'string',
  })
  notes?: string;

  @belongsTo(() => Member, {name: 'member'})
  memberFk: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<DirectDebit>) {
    super(data);
  }
}

export interface DirectDebitRelations {
  // describe navigational properties here
}

export type DirectDebitWithRelations = DirectDebit & DirectDebitRelations;
