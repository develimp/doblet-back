/// <reference types="jest" />

import {FallaYearController} from '../src/controllers/falla-year.controller';
import {SpDataSource} from '../src/datasources/sp.datasource';
import {
  FamilyRepository,
  FallaYearRepository,
  MemberRepository,
  MovementRepository,
} from '../src/repositories';

describe('FallaYear (integration)', () => {
  let dataSource: SpDataSource;
  let controller: FallaYearController;
  let fallaYearRepository: FallaYearRepository;

  beforeAll(() => {
    dataSource = new SpDataSource();

    let memberRepository: MemberRepository;
    let familyRepository: FamilyRepository;
    let movementRepository: MovementRepository;
    let fallaYearRepositoryInstance: FallaYearRepository;

    const memberGetter = async () => memberRepository;
    const familyGetter = async () => familyRepository;
    const movementGetter = async () => movementRepository;
    const fallaYearGetter = async () => fallaYearRepositoryInstance;

    memberRepository = new MemberRepository(
      dataSource,
      movementGetter,
      familyGetter,
    );
    familyRepository = new FamilyRepository(dataSource, memberGetter);
    movementRepository = new MovementRepository(
      dataSource,
      memberGetter,
      fallaYearGetter,
    );
    fallaYearRepositoryInstance = new FallaYearRepository(
      dataSource,
      movementGetter,
    );
    fallaYearRepository = fallaYearRepositoryInstance;
    controller = new FallaYearController(fallaYearRepository, dataSource);
  });

  afterAll(async () => {
    await dataSource.stop();
  });

  it('returns the current year code from the database function', async () => {
    await expect(controller.getCurrentFallaYear()).resolves.toEqual({
      code: 2027,
    });
  });

  it('loads seeded movements through the falla year relation', async () => {
    const fallaYear = await fallaYearRepository.findById(2027, {
      include: [{relation: 'movements'}],
    });
    const movements = fallaYear.movements ?? [];

    expect(movements.length).toBeGreaterThan(0);
    expect(movements.every(movement => movement.fallaYearFk === 2027)).toBe(
      true,
    );
  });
});
