import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {SpDataSource} from '../datasources';
import {Member, MemberRelations, Movement} from '../models';
import {MovementRepository} from './movement.repository';

export class MemberRepository extends DefaultCrudRepository<
  Member,
  typeof Member.prototype.id,
  MemberRelations
> {

  public readonly movements: HasManyRepositoryFactory<Movement, typeof Member.prototype.id>;

  constructor(@inject('datasources.sp') dataSource: SpDataSource, @repository.getter('MovementRepository') protected movementRepositoryGetter: Getter<MovementRepository>,) {
    super(Member, dataSource);
    this.movements = this.createHasManyRepositoryFactoryFor('movements', movementRepositoryGetter,);
    this.registerInclusionResolver('movements', this.movements.inclusionResolver);
  }
}
