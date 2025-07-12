import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SpDataSource} from '../datasources';
import {SubItem, SubItemRelations} from '../models';

export class SubItemRepository extends DefaultCrudRepository<
  SubItem,
  typeof SubItem.prototype.id,
  SubItemRelations
> {
  constructor(@inject('datasources.sp') dataSource: SpDataSource) {
    super(SubItem, dataSource);
  }
}
