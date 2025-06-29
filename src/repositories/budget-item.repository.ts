import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {SpDataSource} from '../datasources';
import {BudgetItem, BudgetItemRelations, SubItem} from '../models';
import {SubItemRepository} from './sub-item.repository';

export class BudgetItemRepository extends DefaultCrudRepository<
  BudgetItem,
  typeof BudgetItem.prototype.id,
  BudgetItemRelations
> {
  public readonly subItems: HasManyRepositoryFactory<SubItem, typeof BudgetItem.prototype.id>;

  constructor(
    @inject('datasources.sp') dataSource: SpDataSource,
    @repository.getter('SubItemRepository')
    protected subItemRepositoryGetter: Getter<SubItemRepository>,
  ) {
    super(BudgetItem, dataSource);
    this.subItems = this.createHasManyRepositoryFactoryFor('subItems', subItemRepositoryGetter);
    this.registerInclusionResolver('subItems', this.subItems.inclusionResolver);
  }
}
