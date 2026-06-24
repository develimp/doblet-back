import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {SpDataSource} from '../datasources';
import {Family, Member, MemberRelations, Movement} from '../models';
import {FamilyRepository} from './family.repository';
import {MovementRepository} from './movement.repository';

export class MemberRepository extends DefaultCrudRepository<
  Member,
  typeof Member.prototype.id,
  MemberRelations
> {

  public readonly movements: HasManyRepositoryFactory<Movement, typeof Member.prototype.id>;
  public readonly family: BelongsToAccessor<Family, typeof Member.prototype.id>;

  constructor(
    @inject('datasources.sp') dataSource: SpDataSource,
    @repository.getter('MovementRepository') protected movementRepositoryGetter: Getter<MovementRepository>,
    @repository.getter('FamilyRepository') protected familyRepositoryGetter: Getter<FamilyRepository>,
  ) {
    super(Member, dataSource);
    this.movements = this.createHasManyRepositoryFactoryFor('movements', movementRepositoryGetter);
    this.registerInclusionResolver('movements', this.movements.inclusionResolver);
    this.family = this.createBelongsToAccessorFor('family', familyRepositoryGetter);
    this.registerInclusionResolver('family', this.family.inclusionResolver);
  }
}
