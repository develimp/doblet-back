import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    mysql: {
      table: 'monument',
    },
  },
})
export class Monument extends Entity {
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
  fallaYear: number;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'string',
  })
  section?: string;

  @property({
    type: 'string',
  })
  awardType?: string;

  @property({
    type: 'number',
  })
  award?: number;

  @property({
    type: 'boolean',
    required: true,
  })
  isCelebrated: boolean;

  @property({
    type: 'string',
  })
  title?: string;

  @property({
    type: 'string',
  })
  artist?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
  })
  imageKey?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Monument>) {
    super(data);
  }
}

export interface MonumentRelations {
  // describe navigational properties here
}

export type MonumentWithRelations = Monument & MonumentRelations;
