/// <reference types="jest" />

import {MovementController} from '../src/controllers/movement.controller';
import {SpDataSource} from '../src/datasources/sp.datasource';
import {Family, Member} from '../src/models';
import {
  BalanceRepository,
  FamilyRepository,
  FallaYearRepository,
  MemberRepository,
  MovementRepository,
} from '../src/repositories';
import {MailService} from '../src/services/mail.service';
import {ReceiptGeneratorService} from '../src/services/receipt-generator.service';

describe('MovementController (database integration)', () => {
  let dataSource: SpDataSource;
  let controller: MovementController;
  let familyRepository: FamilyRepository;
  let fallaYearRepository: FallaYearRepository;
  let memberRepository: MemberRepository;
  let movementRepository: MovementRepository;
  let familyId: number | undefined;
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

    familyRepository = familyRepositoryInstance;
    fallaYearRepository = fallaYearRepositoryInstance;
    memberRepository = memberRepositoryInstance;
    movementRepository = movementRepositoryInstance;

    controller = new MovementController(
      {} as ReceiptGeneratorService,
      {} as MailService,
      movementRepository,
      memberRepository,
      new BalanceRepository(dataSource),
      fallaYearRepository,
    );
  });

  beforeEach(() => {
    familyId = undefined;
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

    if (familyId !== undefined) {
      await familyRepository.deleteById(familyId);
    }
  });

  afterAll(async () => {
    await dataSource.stop();
  });

  async function createRegisteredFamilyMember(
    family: Family,
    name: string,
  ): Promise<Member> {
    const member = await memberRepository.create({
      name,
      surname: 'Movement Test',
      birthdate: '1980-01-01',
      familyFk: family.id!,
      categoryFk: 1,
      isRegistered: true,
    });
    memberIds.push(member.id);
    return member;
  }

  it('splits a family payment across members and assigns receipt numbers', async () => {
    const family = await familyRepository.create({discount: 0});
    familyId = family.id;
    const firstMember = await createRegisteredFamilyMember(family, 'First');
    const secondMember = await createRegisteredFamilyMember(family, 'Second');

    const response = await controller.registerFamilyPayment({
      familyFk: family.id!,
      amount: 600,
      idConcept: 1,
      payMethod: 'cash',
    });
    expect(response).toEqual({
      message: 'Pagament familiar registrat correctament',
    });

    const payments = (
      await movementRepository.find({
        where: {
          memberFk: {inq: [firstMember.id, secondMember.id]},
          idType: 2,
          idConcept: 1,
        },
        order: ['id ASC'],
      })
    ).map(({memberFk, amount, description, receiptNumber}) => ({
      memberFk,
      amount,
      description,
      receiptNumber,
    }));

    expect(payments).toHaveLength(2);
    expect(
      payments.map(({memberFk, amount, description}) => ({
        memberFk,
        amount,
        description,
      })),
    ).toEqual([
      {
        memberFk: firstMember.id,
        amount: 535,
        description: 'pagat en caixa',
      },
      {
        memberFk: secondMember.id,
        amount: 65,
        description: 'pagat en caixa',
      },
    ]);
    expect(payments[0].receiptNumber).toEqual(expect.any(Number));
    expect(payments[1].receiptNumber).toBe(payments[0].receiptNumber! + 1);
  });

  it('returns current-year movements scoped to a member or their family', async () => {
    const family = await familyRepository.create({discount: 0});
    familyId = family.id;
    const firstMember = await createRegisteredFamilyMember(family, 'First');
    const secondMember = await createRegisteredFamilyMember(family, 'Second');
    const [currentFallaYear] = await fallaYearRepository.find({
      order: ['code DESC'],
      limit: 1,
    });
    if (!currentFallaYear) {
      throw new Error(
        'The test database must contain a falla year from the seed',
      );
    }

    const firstMovement = await movementRepository.create({
      amount: 12,
      idType: 1,
      idConcept: 2,
      fallaYearFk: currentFallaYear.code,
      memberFk: firstMember.id,
      description: 'movement integration test first member',
    });
    const secondMovement = await movementRepository.create({
      amount: 15,
      idType: 1,
      idConcept: 3,
      fallaYearFk: currentFallaYear.code,
      memberFk: secondMember.id,
      description: 'movement integration test second member',
    });

    const memberMovements = await controller.findByMemberCurrent(
      firstMember.id,
    );
    expect(memberMovements.map(({id}) => id)).toEqual([firstMovement.id]);

    const familyMovements = await controller.findByFamilyCurrent(family.id!);
    expect(familyMovements.map(({id}) => id)).toEqual([
      secondMovement.id,
      firstMovement.id,
    ]);
  });
});
