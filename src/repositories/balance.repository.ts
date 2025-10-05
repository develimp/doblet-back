import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SpDataSource} from '../datasources';
import {Balance, BalanceRelations} from '../models';

export class BalanceRepository extends DefaultCrudRepository<
  Balance,
  typeof Balance.prototype.memberFk,
  BalanceRelations
> {
  constructor(
    @inject('datasources.sp') dataSource: SpDataSource,
  ) {
    super(Balance, dataSource);
  }
}
