/// <reference types="jest" />

import {DirectDebitController} from '../src/controllers/direct-debit.controller';
import {SpDataSource} from '../src/datasources/sp.datasource';
import {DirectDebit, Member} from '../src/models';
import {
  DirectDebitRepository,
  FamilyRepository,
  FallaYearRepository,
  MemberRepository,
  MovementRepository,
} from '../src/repositories';

type DirectDebitWithMember = DirectDebit & {member: Member};

describe('DirectDebitController (integration)', () => {
  let dataSource: SpDataSource;
  let controller: DirectDebitController;
  let directDebitRepository: DirectDebitRepository;
  let familyRepository: FamilyRepository;
  let memberRepository: MemberRepository;
  let memberId: number | undefined;
  let familyId: number | undefined;
  let directDebitId: number | undefined;

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

    movementRepositoryInstance = new MovementRepository(
      dataSource,
      memberGetter,
      fallaYearGetter,
    );
    fallaYearRepositoryInstance = new FallaYearRepository(
      dataSource,
      movementGetter,
    );
    familyRepositoryInstance = new FamilyRepository(dataSource, memberGetter);
    memberRepositoryInstance = new MemberRepository(
      dataSource,
      movementGetter,
      familyGetter,
    );
    directDebitRepository = new DirectDebitRepository(dataSource, memberGetter);

    familyRepository = familyRepositoryInstance;
    memberRepository = memberRepositoryInstance;
    controller = new DirectDebitController(directDebitRepository, dataSource);
  });

  beforeEach(() => {
    memberId = undefined;
    familyId = undefined;
    directDebitId = undefined;
  });

  afterEach(async () => {
    if (directDebitId !== undefined) {
      await directDebitRepository.deleteById(directDebitId);
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

  async function createTestMember() {
    const family = await familyRepository.create({discount: 0});
    familyId = family.id;

    const member = await memberRepository.create({
      name: 'DirectDebit',
      surname: `Integration ${Date.now()}`,
      birthdate: '1980-01-01',
      familyFk: family.id!,
      categoryFk: 1,
      isRegistered: false,
    });
    memberId = member.id;

    return member;
  }

  it('links a new direct debit to its member and includes the member in find results', async () => {
    const member = await createTestMember();

    const createdDirectDebit = await controller.create({
      memberFk: member.id!,
      accountNumber: 'ES0000000000000000000001',
      calculatedAmount: 25,
      actualAmount: 30,
      notes: 'integration test',
    });
    directDebitId = createdDirectDebit.id;

    const updatedMember = await memberRepository.findById(member.id!);
    expect(updatedMember.directDebitFk).toBe(createdDirectDebit.id);

    const directDebits = (await controller.find()) as DirectDebitWithMember[];
    const foundDirectDebit = directDebits.find(
      directDebit => directDebit.id === createdDirectDebit.id,
    );
    expect(foundDirectDebit?.member).toMatchObject({
      id: member.id,
      name: 'DirectDebit',
    });
  });

  it('rejects a second direct debit for a member who already has one', async () => {
    const member = await createTestMember();

    const createdDirectDebit = await directDebitRepository.create({
      memberFk: member.id!,
      actualAmount: 30,
    });
    directDebitId = createdDirectDebit.id;

    await expect(
      directDebitRepository.create({
        memberFk: member.id!,
        actualAmount: 35,
      }),
    ).rejects.toThrow(/domiciliació assignada/);

    const directDebits = await directDebitRepository.find({
      where: {memberFk: member.id},
    });
    expect(directDebits).toHaveLength(1);
  });

  it('clears the member link when its direct debit is deleted', async () => {
    const member = await createTestMember();
    const createdDirectDebit = await directDebitRepository.create({
      memberFk: member.id!,
      actualAmount: 30,
    });
    directDebitId = createdDirectDebit.id;

    await controller.deleteById(createdDirectDebit.id!);
    directDebitId = undefined;

    const updatedMember = await memberRepository.findById(member.id!);
    expect(updatedMember.directDebitFk).toBeNull();
  });

  it('updates the calculated monthly amount from the member balance', async () => {
    const existingAmounts = await directDebitRepository.find();
    const member = await createTestMember();
    const createdDirectDebit = await directDebitRepository.create({
      memberFk: member.id!,
      calculatedAmount: 999,
      actualAmount: 30,
    });
    directDebitId = createdDirectDebit.id;

    await dataSource.execute(
      `UPDATE balance
       SET feeAssigned = 100,
           feePayed = 10,
           raffleAssigned = 40,
           rafflePayed = 10
       WHERE memberFk = ?`,
      [member.id],
    );

    try {
      await controller.updateCalculatedAmounts({months: 4});

      const updatedDirectDebit = await directDebitRepository.findById(
        createdDirectDebit.id!,
      );
      expect(Number(updatedDirectDebit.calculatedAmount)).toBe(30);
      expect(Number(updatedDirectDebit.actualAmount)).toBe(30);
    } finally {
      for (const directDebit of existingAmounts) {
        await directDebitRepository.updateById(directDebit.id!, {
          calculatedAmount: directDebit.calculatedAmount,
        });
      }
    }
  });
});
