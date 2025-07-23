import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {SpDataSource} from '../datasources';
import {Client, Sale, SaleRelations, SubItem} from '../models';
import {ClientRepository} from './client.repository';
import {SubItemRepository} from './sub-item.repository';

export class SaleRepository extends DefaultCrudRepository<
  Sale,
  typeof Sale.prototype.id,
  SaleRelations
> {
  public readonly subItem: BelongsToAccessor<SubItem, typeof Sale.prototype.id>;

  public readonly client: BelongsToAccessor<
    Client,
    typeof Sale.prototype.id
  >;
  constructor(
    @inject('datasources.sp') dataSource: SpDataSource,
    @repository.getter('SubItemRepository')
    protected subItemRepositoryGetter: Getter<SubItemRepository>,
    @repository.getter('ClientRepository')
    protected clientRepositoryGetter: Getter<ClientRepository>,
  ) {
    super(Sale, dataSource);
    this.client = this.createBelongsToAccessorFor(
      'client',
      clientRepositoryGetter,
    );
    this.registerInclusionResolver('client', this.client.inclusionResolver);
    this.subItem = this.createBelongsToAccessorFor(
      'subItem',
      subItemRepositoryGetter,
    );
    this.registerInclusionResolver('subItem', this.subItem.inclusionResolver);
  }
}
