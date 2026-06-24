import {Entity, hasMany, model, property} from '@loopback/repository';
import {Member} from './member.model';

@model({
  settings: {
    mysql: {
      table: 'family',
    },
  },
})
export class Family extends Entity {
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
  discount: number;

  @hasMany(() => Member, {keyTo: 'familyFk'})
  members?: Member[];

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Family>) {
    super(data);
  }
}

export interface FamilyRelations {
  members?: Member[];
}

export type FamilyWithRelations = Family & FamilyRelations;
