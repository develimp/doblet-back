/// <reference types="jest" />

import {LotteryNameController} from '../src/controllers/lottery-name.controller';
import {SpDataSource} from '../src/datasources/sp.datasource';
import {
  FamilyRepository,
  FallaYearRepository,
  LotteryNameRepository,
  LotteryRepository,
  MemberRepository,
  MovementRepository,
} from '../src/repositories';

describe('Lottery and LotteryName (integration)', () => {
  let dataSource: SpDataSource;
  let controller: LotteryNameController;
  let familyRepository: FamilyRepository;
  let lotteryNameRepository: LotteryNameRepository;
  let lotteryRepository: LotteryRepository;
  let memberRepository: MemberRepository;
  let movementRepository: MovementRepository;
  let familyId: number | undefined;
  let memberId: number | undefined;
  let lotteryNameId: number | undefined;
  let lotteryId: number | undefined;
  const descriptionMarker = 'lottery integration test';

  beforeAll(() => {
    dataSource = new SpDataSource();

    let familyRepositoryInstance: FamilyRepository;
    let fallaYearRepositoryInstance: FallaYearRepository;
    let lotteryRepositoryInstance: LotteryRepository;
    let memberRepositoryInstance: MemberRepository;
    let movementRepositoryInstance: MovementRepository;

    const familyGetter = async () => familyRepositoryInstance;
    const fallaYearGetter = async () => fallaYearRepositoryInstance;
    const memberGetter = async () => memberRepositoryInstance;
    const movementGetter = async () => movementRepositoryInstance;

    familyRepositoryInstance = new FamilyRepository(dataSource, memberGetter);
    fallaYearRepositoryInstance = new FallaYearRepository(
      dataSource,
      movementGetter,
    );
    movementRepositoryInstance = new MovementRepository(
      dataSource,
      memberGetter,
      fallaYearGetter,
    );
    memberRepositoryInstance = new MemberRepository(
      dataSource,
      movementGetter,
      familyGetter,
    );
    lotteryRepositoryInstance = new LotteryRepository(dataSource, memberGetter);

    familyRepository = familyRepositoryInstance;
    memberRepository = memberRepositoryInstance;
    movementRepository = movementRepositoryInstance;
    lotteryRepository = lotteryRepositoryInstance;
    lotteryNameRepository = new LotteryNameRepository(dataSource);
    controller = new LotteryNameController(lotteryNameRepository);
  });

  beforeEach(() => {
    familyId = undefined;
    memberId = undefined;
    lotteryNameId = undefined;
    lotteryId = undefined;
  });

  afterEach(async () => {
    if (memberId !== undefined) {
      await dataSource.execute(
        'DELETE FROM movement WHERE memberFk = ? AND description LIKE ?',
        [memberId, `${descriptionMarker}%`],
      );
    }
    if (lotteryId !== undefined) {
      await lotteryRepository.deleteById(lotteryId);
    }
    if (lotteryNameId !== undefined) {
      await lotteryNameRepository.deleteById(lotteryNameId);
    }
    if (memberId !== undefined) {
      await dataSource.execute(
        'DELETE FROM memberStatusLog WHERE memberFk = ?',
        [memberId],
      );
      await dataSource.execute('DELETE FROM balance WHERE memberFk = ?', [
        memberId,
      ]);
      await memberRepository.deleteById(memberId);
    }
    if (familyId !== undefined) {
      await familyRepository.deleteById(familyId);
    }
  });

  afterAll(async () => {
    await dataSource.stop();
  });

  it('uses the current year, calculates lottery values, and assigns unassigned tickets', async () => {
    const family = await familyRepository.create({discount: 0});
    familyId = family.id;

    const member = await memberRepository.create({
      name: 'Lottery',
      surname: 'Integration Test',
      birthdate: '1980-01-01',
      familyFk: family.id!,
      categoryFk: 1,
      isRegistered: true,
    });
    memberId = member.id;

    const lotteryName = await lotteryNameRepository.create({
      description: descriptionMarker,
      fallaYearFk: 0,
    });
    lotteryNameId = lotteryName.id;

    const storedLotteryName = await lotteryNameRepository.findById(
      lotteryName.id,
    );
    expect(storedLotteryName.fallaYearFk).toBe(2027);

    const lottery = await lotteryRepository.create({
      lotteryId: 987654,
      memberFk: member.id,
      lotteryNameFk: lotteryName.id,
      ticketsMale: 2,
      ticketsFemale: 1,
      ticketsChildish: 0,
      tenthsMale: 1,
      tenthsFemale: 1,
      tenthsChildish: 0,
      isAssigned: false,
    });
    lotteryId = lottery.id;

    const storedLottery = await lotteryRepository.findById(lottery.id);
    expect(storedLottery).toMatchObject({
      price: 52,
      benefit: 9,
      isAssigned: false,
    });

    const result = await controller.assignLottery(lotteryName.id!);
    expect(result).toMatchObject({
      success: true,
      message: 'Sorteig assignat correctament.',
    });

    const assignedLottery = await lotteryRepository.findById(lottery.id);
    expect(assignedLottery.isAssigned).toBe(true);

    const movements = (
      await movementRepository.find({
        where: {memberFk: member.id},
        order: ['id ASC'],
      })
    )
      .filter(movement => movement.description?.includes(descriptionMarker))
      .map(({amount, idType, idConcept, fallaYearFk, description}) => ({
        amount,
        idType,
        idConcept,
        fallaYearFk,
        description,
      }));

    expect(movements).toEqual([
      {
        amount: 9,
        idType: 2,
        idConcept: 1,
        fallaYearFk: 2027,
        description: 'benefici lottery integration test 2027',
      },
      {
        amount: 61,
        idType: 1,
        idConcept: 2,
        fallaYearFk: 2027,
        description: 'assignació lottery integration test 2027',
      },
    ]);
  });
});
