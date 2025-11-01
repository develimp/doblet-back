import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SpDataSource} from '../datasources';
import {LotteryName, LotteryNameRelations} from '../models';

export class LotteryNameRepository extends DefaultCrudRepository<
  LotteryName,
  typeof LotteryName.prototype.id,
  LotteryNameRelations
> {
  constructor(
    @inject('datasources.sp') dataSource: SpDataSource,
  ) {
    super(LotteryName, dataSource);
  }
}
