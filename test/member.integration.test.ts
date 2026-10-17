/// <reference types="jest" />

import {MemberController} from '../src/controllers/member.controller';
import {SpDataSource} from '../src/datasources/sp.datasource';
import {Balance, Member} from '../src/models';
import {
  BalanceRepository,
  DirectDebitRepository,
  FamilyRepository,
  FallaYearRepository,
  MemberRepository,
  MovementRepository,
} from '../src/repositories';
import {PdfService} from '../src/services/pdf.service';

describe('MemberController (database integration)', () => {
  let dataSource: SpDataSource;
  let controller: MemberController;
  let balanceRepository: BalanceRepository;
  let directDebitRepository: DirectDebitRepository;
  let familyRepository: FamilyRepository;
  let fallaYearRepository: FallaYearRepository;
  let memberRepository: MemberRepository;
  let movementRepository: MovementRepository;
  let memberId: number | undefined;
  let familyIds: number[];
  let directDebitId: number | undefined;

  beforeAll(() => {
    dataSource = new SpDataSource();

    let memberGetter: () => Promise<MemberRepository>;
    let familyGetter: () => Promise<FamilyRepository>;
    let movementGetter: () => Promise<MovementRepository>;
    let fallaYearGetter: () => Promise<FallaYearRepository>;

    movementRepository = new MovementRepository(
      dataSource,
      () => memberGetter(),
      () => fallaYearGetter(),
    );
    fallaYearRepository = new FallaYearRepository(dataSource, () =>
      movementGetter(),
    );
    familyRepository = new FamilyRepository(dataSource, () => memberGetter());
    memberRepository = new MemberRepository(
      dataSource,
      () => movementGetter(),
      () => familyGetter(),
    );
    directDebitRepository = new DirectDebitRepository(dataSource, () =>
      memberGetter(),
    );
    balanceRepository = new BalanceRepository(dataSource);

    memberGetter = async () => memberRepository;
    familyGetter = async () => familyRepository;
    movementGetter = async () => movementRepository;
    fallaYearGetter = async () => fallaYearRepository;

    const pdfService = {
      renderPdf: async () =>
        Buffer.from('unused in database integration tests'),
    } as unknown as PdfService;

    controller = new MemberController(
      memberRepository,
      familyRepository,
      dataSource,
      pdfService,
    );
  });

  beforeEach(() => {
    memberId = undefined;
    familyIds = [];
    directDebitId = undefined;
  });

  afterEach(async () => {
    if (memberId !== undefined) {
      await dataSource.execute(
        'UPDATE member SET directDebitFk = NULL WHERE id = ?',
        [memberId],
      );
      if (directDebitId !== undefined) {
        await directDebitRepository.deleteById(directDebitId);
      }
      await dataSource.execute(
        'DELETE FROM memberStatusLog WHERE memberFk = ?',
        [memberId],
      );
      await dataSource.execute('DELETE FROM balance WHERE memberFk = ?', [
        memberId,
      ]);
      await memberRepository.deleteById(memberId);
    }

    for (const familyId of familyIds) {
      await familyRepository.deleteById(familyId);
    }
  });

  afterAll(async () => {
    await dataSource.stop();
  });

  async function createTestMember(isRegistered: boolean) {
    const family = await familyRepository.create({discount: 0});
    familyIds.push(family.id!);

    const member = await memberRepository.create({
      name: 'Integration',
      surname: `Member ${Date.now()}`,
      birthdate: '1980-01-01',
      familyFk: family.id!,
      categoryFk: 1,
      isRegistered,
    });
    memberId = member.id;

    return {family, member};
  }

  it('creates a zero-discount family and moves the member into it', async () => {
    const {family: originalFamily, member} = await createTestMember(false);

    await controller.leaveFamily(member.id);

    const updatedMember = await memberRepository.findById(member.id);
    expect(updatedMember.familyFk).not.toBe(originalFamily.id);
    familyIds.push(updatedMember.familyFk);

    const newFamily = await familyRepository.findById(updatedMember.familyFk);
    expect(newFamily.discount).toBe(0);
  });

  it('registers fee and raffle payments through the stored procedure', async () => {
    const {member} = await createTestMember(true);
    const [currentFallaYear] = await fallaYearRepository.find({
      order: ['code DESC'],
      limit: 1,
    });
    if (!currentFallaYear) {
      throw new Error(
        'The test database must contain a falla year from the seed',
      );
    }

    await movementRepository.create({
      transactionDate: '2026-10-12',
      amount: 50,
      idType: 1,
      idConcept: 3,
      fallaYearFk: currentFallaYear.code,
      memberFk: member.id,
      description: 'integration test raffle assignment',
    });

    const directDebit = await directDebitRepository.create({
      memberFk: member.id,
      actualAmount: 600,
    });
    directDebitId = directDebit.id;
    await memberRepository.updateById(member.id, {
      directDebitFk: directDebit.id,
    });

    const otherLinkedMembers = (await memberRepository.find()).filter(
      (candidate): candidate is Member & {directDebitFk: number} =>
        candidate.id !== member.id &&
        typeof candidate.directDebitFk === 'number',
    );
    try {
      for (const candidate of otherLinkedMembers) {
        await dataSource.execute(
          'UPDATE member SET directDebitFk = NULL WHERE id = ?',
          [candidate.id],
        );
      }

      await controller.registerAllDirectDebitPayments({
        date: '2026-10-12',
        note: 'integration test direct debit',
      });
    } finally {
      for (const candidate of otherLinkedMembers) {
        await memberRepository.updateById(candidate.id, {
          directDebitFk: candidate.directDebitFk,
        });
      }
    }

    const payments = (
      await movementRepository.find({where: {memberFk: member.id}})
    )
      .filter(movement => movement.idType === 2)
      .map(({idConcept, amount, transactionDate, description}) => ({
        idConcept,
        amount,
        transactionDate: transactionDate
          ? new Date(transactionDate).toISOString().slice(0, 10)
          : undefined,
        description,
      }))
      .sort((a, b) => a.idConcept - b.idConcept);

    expect(payments).toEqual([
      {
        idConcept: 1,
        amount: 535,
        transactionDate: '2026-10-12',
        description: 'integration test direct debit',
      },
      {
        idConcept: 3,
        amount: 50,
        transactionDate: '2026-10-12',
        description: 'integration test direct debit',
      },
    ]);

    const balance = await balanceRepository.findById(member.id);
    expect(balance).toMatchObject<Partial<Balance>>({
      feePayed: 535,
      rafflePayed: 50,
    });
  });
});
