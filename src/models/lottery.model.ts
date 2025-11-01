import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Member} from './member.model';

@model({
  settings: {
    mysql: {
      table: 'lottery',
    },
  },
})
export class Lottery extends Entity {
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
  lotteryId: number;

  @property({
    type: 'date',
  })
  assigned?: string;

  @belongsTo(() => Member, {name: 'member'})
  memberFk: number;

  @property({
    type: 'number',
  })
  ticketsMale?: number;

  @property({
    type: 'number',
  })
  ticketsFemale?: number;

  @property({
    type: 'number',
  })
  ticketsChildish?: number;

  @property({
    type: 'number',
  })
  tenthsMale?: number;

  @property({
    type: 'number',
  })
  tenthsFemale?: number;

  @property({
    type: 'number',
  })
  tenthsChildish?: number;

  @property({
    type: 'boolean',
  })
  isAssigned?: boolean;

  @property({
    type: 'number',
  })
  price?: number;

  @property({
    type: 'number',
  })
  benefit?: number;

  @property({
    type: 'number',
    required: true,
  })
  lotteryNameFk: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Lottery>) {
    super(data);
  }
}

export interface LotteryRelations {
  member?: Member;
}

export type LotteryWithRelations = Lottery & LotteryRelations;
