import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {SpDataSource} from '../datasources';
import {Lottery, LotteryRelations, Member} from '../models';
import {MemberRepository} from './member.repository';

export class LotteryRepository extends DefaultCrudRepository<
  Lottery,
  typeof Lottery.prototype.id,
  LotteryRelations
> {
  public readonly member: BelongsToAccessor<Member, typeof Lottery.prototype.id>;

  constructor(
    @inject('datasources.sp') dataSource: SpDataSource,
    @repository.getter('MemberRepository')
    protected memberRepositoryGetter: Getter<MemberRepository>,
  ) {
    super(Lottery, dataSource);
    this.member = this.createBelongsToAccessorFor(
      'member',
      memberRepositoryGetter,
    );
    this.registerInclusionResolver('member', this.member.inclusionResolver);
  }
}
