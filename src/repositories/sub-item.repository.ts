import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {SpDataSource} from '../datasources';
import {BudgetItem, SubItem, SubItemRelations} from '../models';
import {BudgetItemRepository} from './budget-item.repository';

export class SubItemRepository extends DefaultCrudRepository<
  SubItem,
  typeof SubItem.prototype.id,
  SubItemRelations
> {
  public readonly budgetItem: BelongsToAccessor<
    BudgetItem,
    typeof SubItem.prototype.id
  >;

  constructor(
    @inject('datasources.sp') dataSource: SpDataSource,
    @repository.getter('BudgetItemRepository')
    protected budgetItemRepositoryGetter: Getter<BudgetItemRepository>,
  ) {
    super(SubItem, dataSource);
    this.budgetItem = this.createBelongsToAccessorFor(
      'budgetItem',
      budgetItemRepositoryGetter,
    );
    this.registerInclusionResolver(
      'budgetItem',
      this.budgetItem.inclusionResolver,
    );
  }
}
