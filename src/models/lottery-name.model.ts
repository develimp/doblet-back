import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    mysql: {
      table: 'lotteryName',
    },
  },
})
export class LotteryName extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'number',
  })
  fallaYearFk: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<LotteryName>) {
    super(data);
  }
}

export interface LotteryNameRelations {
  // describe navigational properties here
}

export type LotteryNameWithRelations = LotteryName & LotteryNameRelations;
