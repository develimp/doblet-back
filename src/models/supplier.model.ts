import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    mysql: {
      table: 'supplier', // nombre exacto en la DB, en minúsculas
    },
  },
})
export class Supplier extends Entity {
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
  name: string;

  @property({
    type: 'string',
    default: null,
  })
  nif?: string;

  @property({
    type: 'string',
    default: null,
  })
  address?: string;

  @property({
    type: 'string',
    default: null,
  })
  phoneNumber?: string;

  @property({
    type: 'string',
    default: null,
  })
  email?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Supplier>) {
    super(data);
  }
}

export interface SupplierRelations {
  // describe navigational properties here
}

export type SupplierWithRelations = Supplier & SupplierRelations;
