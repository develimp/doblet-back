/// <reference types="jest" />

import {BalanceController} from '../src/controllers/balance.controller';
import {SpDataSource} from '../src/datasources/sp.datasource';
import {
  BalanceRepository,
  FamilyRepository,
  FallaYearRepository,
  MemberRepository,
  MovementRepository,
} from '../src/repositories';
import {Member} from '../src/models';

describe('Balance (integration)', () => {
  let dataSource: SpDataSource;
  let controller: BalanceController;
  let balanceRepository: BalanceRepository;
  let familyRepository: FamilyRepository;
  let fallaYearRepository: FallaYearRepository;
  let memberRepository: MemberRepository;
  let movementRepository: MovementRepository;
  let familyIds: number[];
  let fallaYearIds: number[];
  let memberIds: number[];

  beforeAll(() => {
    dataSource = new SpDataSource();

    let familyRepositoryInstance: FamilyRepository;
    let fallaYearRepositoryInstance: FallaYearRepository;
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

    balanceRepository = new BalanceRepository(dataSource);
    familyRepository = familyRepositoryInstance;
    fallaYearRepository = fallaYearRepositoryInstance;
    memberRepository = memberRepositoryInstance;
    movementRepository = movementRepositoryInstance;
    controller = new BalanceController(balanceRepository, memberRepository);
  });

  beforeEach(() => {
    familyIds = [];
    fallaYearIds = [];
    memberIds = [];
  });

  afterEach(async () => {
    if (memberIds.length > 0) {
      const placeholders = memberIds.map(() => '?').join(', ');
      await dataSource.execute(
        `DELETE FROM memberStatusLog WHERE memberFk IN (${placeholders})`,
        memberIds,
      );
      await dataSource.execute(
        `DELETE FROM balance WHERE memberFk IN (${placeholders})`,
        memberIds,
      );

      for (const memberId of memberIds) {
        await memberRepository.deleteById(memberId);
      }
    }

    for (const familyId of familyIds) {
      await familyRepository.deleteById(familyId);
    }

    for (const fallaYearId of fallaYearIds) {
      await fallaYearRepository.deleteById(fallaYearId);
    }
  });

  afterAll(async () => {
    await dataSource.stop();
  });

  async function createFamily() {
    const family = await familyRepository.create({discount: 0});
    familyIds.push(family.id!);
    return family;
  }

  async function createRegisteredMember(familyFk: number, name: string) {
    const member = await memberRepository.create({
      name,
      surname: 'Balance Integration Test',
      birthdate: '1980-01-01',
      familyFk,
      categoryFk: 1,
      isRegistered: true,
    });
    memberIds.push(member.id);
    return member;
  }

  async function createMovement(
    member: Member,
    fallaYearFk: number,
    idType: number,
    idConcept: number,
    amount: number,
  ) {
    return movementRepository.create({
      amount,
      idType,
      idConcept,
      fallaYearFk,
      memberFk: member.id,
      description: 'balance integration test',
    });
  }

  it('tracks movements in each balance category and reconstructs totals', async () => {
    const family = await createFamily();
    const member = await createRegisteredMember(family.id!, 'Balance');
    const currentFallaYear = await fallaYearRepository.findOne({
      order: ['code DESC'],
    });
    if (!currentFallaYear) {
      throw new Error(
        'The test database must contain a falla year from the seed',
      );
    }

    const amounts = {
      feeAssigned: 11,
      feePayed: 12,
      lotteryAssigned: 13,
      lotteryPayed: 14,
      raffleAssigned: 15,
      rafflePayed: 16,
    };
    await createMovement(
      member,
      currentFallaYear.code,
      1,
      1,
      amounts.feeAssigned,
    );
    await createMovement(member, currentFallaYear.code, 2, 1, amounts.feePayed);
    await createMovement(
      member,
      currentFallaYear.code,
      1,
      2,
      amounts.lotteryAssigned,
    );
    await createMovement(
      member,
      currentFallaYear.code,
      2,
      2,
      amounts.lotteryPayed,
    );
    await createMovement(
      member,
      currentFallaYear.code,
      1,
      3,
      amounts.raffleAssigned,
    );
    await createMovement(
      member,
      currentFallaYear.code,
      2,
      3,
      amounts.rafflePayed,
    );

    const expectedBalance = {
      memberFk: member.id,
      feeAssigned: 535 + amounts.feeAssigned,
      feePayed: amounts.feePayed,
      lotteryAssigned: amounts.lotteryAssigned,
      lotteryPayed: amounts.lotteryPayed,
      raffleAssigned: amounts.raffleAssigned,
      rafflePayed: amounts.rafflePayed,
    };
    await expect(balanceRepository.findById(member.id)).resolves.toMatchObject(
      expectedBalance,
    );

    let historicalFallaYear = await fallaYearRepository.findOne({
      where: {code: currentFallaYear.code - 1},
    });
    if (!historicalFallaYear) {
      historicalFallaYear = await fallaYearRepository.create({
        code: currentFallaYear.code - 1,
        created: '2025-03-20',
      });
      fallaYearIds.push(historicalFallaYear.code);
    }
    const historicalMovement = await createMovement(
      member,
      currentFallaYear.code,
      1,
      1,
      999,
    );
    await dataSource.execute(
      'UPDATE movement SET fallaYearFk = ? WHERE id = ?',
      [historicalFallaYear.code, historicalMovement.id],
    );

    await dataSource.execute('CALL regenerateBalance()');

    await expect(balanceRepository.findById(member.id)).resolves.toMatchObject(
      expectedBalance,
    );
  });

  it('sums all member balances and calculates the family difference', async () => {
    const family = await createFamily();
    const firstMember = await createRegisteredMember(family.id!, 'First');
    const secondMember = await createRegisteredMember(family.id!, 'Second');
    const currentFallaYear = await fallaYearRepository.findOne({
      order: ['code DESC'],
    });
    if (!currentFallaYear) {
      throw new Error(
        'The test database must contain a falla year from the seed',
      );
    }

    await createMovement(firstMember, currentFallaYear.code, 2, 1, 100);
    await createMovement(firstMember, currentFallaYear.code, 1, 2, 30);
    await createMovement(firstMember, currentFallaYear.code, 2, 3, 20);
    await createMovement(secondMember, currentFallaYear.code, 2, 2, 10);
    await createMovement(secondMember, currentFallaYear.code, 1, 3, 40);

    await expect(controller.getFamilyBalance(family.id!)).resolves.toEqual({
      feeAssigned: 1070,
      feePayed: 100,
      lotteryAssigned: 30,
      lotteryPayed: 10,
      raffleAssigned: 40,
      rafflePayed: 20,
      difference: -1010,
    });
  });
});
