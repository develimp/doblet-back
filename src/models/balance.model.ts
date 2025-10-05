import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    mysql: {
      table: 'balance',
    },
  },
})
export class Balance extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
    required: true,
  })
  memberFk: number;

  @property({
    type: 'number',
    required: true,
  })
  feeAssigned: number;

  @property({
    type: 'number',
    required: true,
  })
  feePayed: number;

  @property({
    type: 'number',
    required: true,
  })
  lotteryAssigned: number;

  @property({
    type: 'number',
    required: true,
  })
  lotteryPayed: number;

  @property({
    type: 'number',
    required: true,
  })
  raffleAssigned: number;

  @property({
    type: 'number',
    required: true,
  })
  rafflePayed: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Balance>) {
    super(data);
  }
}

export interface BalanceRelations {
  // describe navigational properties here
}

export type BalanceWithRelations = Balance & BalanceRelations;
