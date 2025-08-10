import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasOneRepositoryFactory,
  repository,
} from '@loopback/repository';
import {SpDataSource} from '../datasources';
import {Member, User, UserRelations} from '../models';
import {MemberRepository} from './member.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly member: HasOneRepositoryFactory<
    Member,
    typeof User.prototype.id
  >;

  constructor(
    @inject('datasources.sp') dataSource: SpDataSource,
    @repository.getter('MemberRepository')
    protected memberRepositoryGetter: Getter<MemberRepository>,
  ) {
    super(User, dataSource);

    this.member = this.createHasOneRepositoryFactoryFor(
      'member',
      memberRepositoryGetter,
    );
    this.registerInclusionResolver('member', this.member.inclusionResolver);
  }
}
