import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {SpDataSource} from '../datasources';
import {DirectDebit, DirectDebitRelations, Member} from '../models';
import {MemberRepository} from './member.repository';

export class DirectDebitRepository extends DefaultCrudRepository<
  DirectDebit,
  typeof DirectDebit.prototype.id,
  DirectDebitRelations
> {
  public readonly member: BelongsToAccessor<Member, typeof DirectDebit.prototype.id>;

  constructor(
    @inject('datasources.sp') dataSource: SpDataSource,
    @repository.getter('MemberRepository')
    protected memberRepositoryGetter: Getter<MemberRepository>,
  ) {
    super(DirectDebit, dataSource);

    this.member = this.createBelongsToAccessorFor(
      'member',
      memberRepositoryGetter,
    );
    this.registerInclusionResolver('member', this.member.inclusionResolver);
  }
}
