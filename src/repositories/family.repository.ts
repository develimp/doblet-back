import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {SpDataSource} from '../datasources';
import {Family, FamilyRelations, Member} from '../models';
import {MemberRepository} from './member.repository';

export class FamilyRepository extends DefaultCrudRepository<
  Family,
  typeof Family.prototype.id,
  FamilyRelations
> {

  public readonly members: HasManyRepositoryFactory<Member, typeof Family.prototype.id>;

  constructor(
    @inject('datasources.sp') dataSource: SpDataSource,
    @repository.getter('MemberRepository') protected memberRepositoryGetter: Getter<MemberRepository>,
  ) {
    super(Family, dataSource);
    this.members = this.createHasManyRepositoryFactoryFor('members', memberRepositoryGetter);
    this.registerInclusionResolver('members', this.members.inclusionResolver);
  }
}
