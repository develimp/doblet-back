import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {SpDataSource} from '../datasources';
import {Buy, BuyRelations, SubItem, Supplier} from '../models';
import {SubItemRepository} from './sub-item.repository';
import {SupplierRepository} from './supplier.repository';

export class BuyRepository extends DefaultCrudRepository<
  Buy,
  typeof Buy.prototype.id,
  BuyRelations
> {

  public readonly subItem: BelongsToAccessor<SubItem, typeof Buy.prototype.id>;

  public readonly supplier: BelongsToAccessor<Supplier, typeof Buy.prototype.id>;

  constructor(
    @inject('datasources.sp') dataSource: SpDataSource, @repository.getter('SubItemRepository') protected subItemRepositoryGetter: Getter<SubItemRepository>, @repository.getter('SupplierRepository') protected supplierRepositoryGetter: Getter<SupplierRepository>,
  ) {
    super(Buy, dataSource);
    this.supplier = this.createBelongsToAccessorFor('supplier', supplierRepositoryGetter,);
    this.registerInclusionResolver('supplier', this.supplier.inclusionResolver);
    this.subItem = this.createBelongsToAccessorFor('subItem', subItemRepositoryGetter,);
    this.registerInclusionResolver('subItem', this.subItem.inclusionResolver);
  }
}
