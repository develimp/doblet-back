import {Entity, hasOne, model, property} from '@loopback/repository';
import {Member} from './member.model';

@model({
  settings: {
    mysql: {
      table: 'user',
    },
  },
})
export class User extends Entity {
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
  email: string;

  @hasOne(() => Member, {keyFrom: 'id', keyTo: 'id'})
  member: Member;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  member?: Member;
}

export type UserWithRelations = User & UserRelations;
