import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {SpDataSource} from '../datasources';
import {FallaYear, FallaYearRelations, Movement} from '../models';
import {MovementRepository} from './movement.repository';

export class FallaYearRepository extends DefaultCrudRepository<
  FallaYear,
  typeof FallaYear.prototype.code,
  FallaYearRelations
> {
  public readonly movements: HasManyRepositoryFactory<Movement, typeof FallaYear.prototype.id>

  constructor(
    @inject('datasources.sp') dataSource: SpDataSource,
    @repository.getter('MovementRepository')
    protected movementRepositoryGetter: Getter<MovementRepository>,
  ) {
    super(FallaYear, dataSource);
    this.movements = this.createHasManyRepositoryFactoryFor('movements', movementRepositoryGetter)
    this.registerInclusionResolver('movements', this.movements.inclusionResolver)
  }
}
