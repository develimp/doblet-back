import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {SpDataSource} from '../datasources';
import {Member, Movement, MovementRelations} from '../models';
import {MemberRepository} from './member.repository';

export class MovementRepository extends DefaultCrudRepository<
  Movement,
  typeof Movement.prototype.id,
  MovementRelations
> {
  public readonly member: BelongsToAccessor<Member, typeof Movement.prototype.id>;

  constructor(
    @inject('datasources.sp') dataSource: SpDataSource,
    @repository.getter('MemberRepository')
    protected memberRepositoryGetter: Getter<MemberRepository>,
  ) {
    super(Movement, dataSource);

    this.member = this.createBelongsToAccessorFor('member', memberRepositoryGetter);
    this.registerInclusionResolver('member', this.member.inclusionResolver);
  }
}
