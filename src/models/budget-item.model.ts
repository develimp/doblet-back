import {Entity, hasMany, model, property} from '@loopback/repository';
import {SubItem} from './sub-item.model';

@model({
  settings: {
    mysql: {
      table: 'budgetItem', // nombre exacto en la DB, en minúsculas
    },
  },
})
export class BudgetItem extends Entity {
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
  })
  description?: string;

  @hasMany(() => SubItem, {keyTo: 'budgetItemFk'})
  subItems: SubItem[];

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<BudgetItem>) {
    super(data);
  }
}

export interface BudgetItemRelations {
  // describe navigational properties here
}

export type BudgetItemWithRelations = BudgetItem & BudgetItemRelations;
