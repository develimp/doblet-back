import {belongsTo, Entity, model, property} from '@loopback/repository';
import {FallaYear} from './falla-year.model';
import {Member} from './member.model';

@model({
  settings: {
    mysql: {
      table: 'movement',
    },
  },
})
export class Movement extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'date',
  })
  transactionDate?: string;

  @property({
    type: 'number',
    required: true,
  })
  amount: number;

  @property({
    type: 'number',
    required: true,
  })
  idType: number;

  @property({
    type: 'number',
    required: true,
  })
  idConcept: number;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'number',
  })
  receiptNumber?: number;

  @belongsTo(() => Member, {name: 'member'})
  memberFk: number;

  @belongsTo(() => FallaYear, {name: 'fallaYear'})
  fallaYearFk: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Movement>) {
    super(data);
  }
}

export interface MovementRelations {
  // describe navigational properties here
}

export type MovementWithRelations = Movement & MovementRelations;
