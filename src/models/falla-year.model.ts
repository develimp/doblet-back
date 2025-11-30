import {Entity, hasMany, model, property} from '@loopback/repository';
import {Movement} from './movement.model';

@model({
  settings: {
    mysql: {
      table: 'fallaYear',
    },
  },
})
export class FallaYear extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
    required: true,
  })
  code: number;

  @property({
    type: 'date',
  })
  created?: string;

  @property({
    type: 'date',
  })
  finished?: string;

  @property({
    type: 'number',
  })
  finalCash?: number;

  @property({
    type: 'number',
  })
  finalBank?: number;

  @property({
    type: 'number',
  })
  finalStock?: number;

  @hasMany(() => Movement, {keyTo: 'fallaYearFk'})
  movements: Movement[];

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<FallaYear>) {
    super(data);
  }
}

export interface FallaYearRelations {
  // describe navigational properties here
}

export type FallaYearWithRelations = FallaYear & FallaYearRelations;
