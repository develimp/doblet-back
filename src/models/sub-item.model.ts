import {belongsTo, Entity, model, property} from '@loopback/repository';
import {BudgetItem} from './budget-item.model';

@model({
  settings: {
    mysql: {
      table: 'subItem',  // nombre exacto en la DB, en minúsculas
    },
  },
})
export class SubItem extends Entity {
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
    required: true,
  })
  description: string;

  @belongsTo(() => BudgetItem, {name: 'budgetItem'})
  budgetItemFk: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<SubItem>) {
    super(data);
  }
}

export interface SubItemRelations {
  // describe navigational properties here
}

export type SubItemWithRelations = SubItem & SubItemRelations;
