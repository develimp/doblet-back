/// <reference types="jest" />

import {SpDataSource} from '../src/datasources/sp.datasource';
import {Member} from '../src/models';
import {
  FamilyRepository,
  FallaYearRepository,
  MemberRepository,
  MovementRepository,
} from '../src/repositories';

describe('FamilyRepository (integration)', () => {
  let dataSource: SpDataSource;
  let familyRepository: FamilyRepository;

  beforeAll(() => {
    dataSource = new SpDataSource();

    let memberRepository: MemberRepository;
    let familyRepositoryInstance: FamilyRepository;
    let movementRepository: MovementRepository;
    let fallaYearRepository: FallaYearRepository;

    const memberGetter = async () => memberRepository;
    const familyGetter = async () => familyRepositoryInstance;
    const movementGetter = async () => movementRepository;
    const fallaYearGetter = async () => fallaYearRepository;

    memberRepository = new MemberRepository(
      dataSource,
      movementGetter,
      familyGetter,
    );
    movementRepository = new MovementRepository(
      dataSource,
      memberGetter,
      fallaYearGetter,
    );
    fallaYearRepository = new FallaYearRepository(dataSource, movementGetter);
    familyRepositoryInstance = new FamilyRepository(dataSource, memberGetter);
    familyRepository = familyRepositoryInstance;
  });

  afterAll(async () => {
    await dataSource.stop();
  });

  it('loads the seeded members through the family relation', async () => {
    const [family] = await familyRepository.find({
      include: [{relation: 'members'}],
    });

    expect(family).toBeDefined();
    const members = (family.members ?? []) as Member[];
    expect(members).toHaveLength(2);
    expect(members.map(member => member.name).sort()).toEqual([
      'Morgan',
      'Tony',
    ]);
    expect(members.every(member => member.familyFk === family.id)).toBe(true);
  });
});
