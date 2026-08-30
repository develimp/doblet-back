import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SpDataSource} from '../datasources';
import {Monument, MonumentRelations} from '../models';

export class MonumentRepository extends DefaultCrudRepository<
  Monument,
  typeof Monument.prototype.id,
  MonumentRelations
> {
  constructor(
    @inject('datasources.sp') dataSource: SpDataSource,
  ) {
    super(Monument, dataSource);
  }
}
