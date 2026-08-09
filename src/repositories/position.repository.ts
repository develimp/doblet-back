import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SpDataSource} from '../datasources';
import {Position, PositionRelations} from '../models';

export class PositionRepository extends DefaultCrudRepository<
  Position,
  typeof Position.prototype.id,
  PositionRelations
> {
  constructor(
    @inject('datasources.sp') dataSource: SpDataSource,
  ) {
    super(Position, dataSource);
  }
}
