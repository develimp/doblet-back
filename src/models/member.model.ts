import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {Balance} from './balance.model';
import {Movement} from './movement.model';

@model({
  settings: {
    mysql: {
      table: 'member',
    },
  },
})
export class Member extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  surname: string;

  @property({
    type: 'date',
    required: true,
  })
  birthdate: string;

  @property({
    type: 'string',
  })
  gender?: string;

  @property({
    type: 'string',
  })
  dni?: string;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'string',
  })
  phoneNumber?: string;

  @property({
    type: 'boolean',
  })
  isRegistered?: boolean;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'number',
  })
  familyFk?: string;

  @hasOne(() => Balance, {keyTo: 'memberFk'})
  balance: Balance;

  @hasMany(() => Movement, {keyTo: 'memberFk'})
  movements: Movement[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Member>) {
    super(data);
  }
}

export interface MemberRelations {
  balance?: Balance;
}

export type MemberWithRelations = Member & MemberRelations;
