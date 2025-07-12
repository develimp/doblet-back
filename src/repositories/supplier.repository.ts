import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SpDataSource} from '../datasources';
import {Supplier, SupplierRelations} from '../models';

export class SupplierRepository extends DefaultCrudRepository<
  Supplier,
  typeof Supplier.prototype.id,
  SupplierRelations
> {
  constructor(@inject('datasources.sp') dataSource: SpDataSource) {
    super(Supplier, dataSource);
  }
}
