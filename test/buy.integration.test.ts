/// <reference types="jest" />

import {BuyController} from '../src/controllers/buy.controller';
import {SpDataSource} from '../src/datasources/sp.datasource';
import {BudgetItem, Buy, SubItem, Supplier} from '../src/models';
import {
  BudgetItemRepository,
  BuyRepository,
  FallaYearRepository,
  FamilyRepository,
  MemberRepository,
  MovementRepository,
  SubItemRepository,
  SupplierRepository,
} from '../src/repositories';

type BuyWithIncludedRelations = Buy & {
  subItem: SubItem & {budgetItem: BudgetItem};
  supplier: Supplier;
};

describe('Buy (integration)', () => {
  let dataSource: SpDataSource;
  let buyController: BuyController;
  let buyRepository: BuyRepository;
  let fallaYearRepository: FallaYearRepository;
  let subItemRepository: SubItemRepository;
  let supplierRepository: SupplierRepository;
  let buyId: number | undefined;

  beforeAll(() => {
    dataSource = new SpDataSource();

    let budgetItemRepositoryInstance: BudgetItemRepository;
    let familyRepositoryInstance: FamilyRepository;
    let memberRepositoryInstance: MemberRepository;
    let movementRepositoryInstance: MovementRepository;
    let subItemRepositoryInstance: SubItemRepository;

    const budgetItemGetter = async () => budgetItemRepositoryInstance;
    const familyGetter = async () => familyRepositoryInstance;
    const fallaYearGetter = async () => fallaYearRepository;
    const memberGetter = async () => memberRepositoryInstance;
    const movementGetter = async () => movementRepositoryInstance;
    const subItemGetter = async () => subItemRepositoryInstance;
    const supplierGetter = async () => supplierRepository;

    budgetItemRepositoryInstance = new BudgetItemRepository(
      dataSource,
      subItemGetter,
    );
    subItemRepositoryInstance = new SubItemRepository(
      dataSource,
      budgetItemGetter,
    );
    supplierRepository = new SupplierRepository(dataSource);
    familyRepositoryInstance = new FamilyRepository(dataSource, memberGetter);
    fallaYearRepository = new FallaYearRepository(dataSource, movementGetter);
    memberRepositoryInstance = new MemberRepository(
      dataSource,
      movementGetter,
      familyGetter,
    );
    movementRepositoryInstance = new MovementRepository(
      dataSource,
      memberGetter,
      fallaYearGetter,
    );

    const buyRepositoryInstance = new BuyRepository(
      dataSource,
      subItemGetter,
      supplierGetter,
    );

    buyRepository = buyRepositoryInstance;
    subItemRepository = subItemRepositoryInstance;
    buyController = new BuyController(buyRepository);
  });

  beforeEach(() => {
    buyId = undefined;
  });

  afterEach(async () => {
    if (buyId !== undefined) {
      await buyRepository.deleteById(buyId);
    }
  });

  afterAll(async () => {
    await dataSource.stop();
  });

  it('creates a buy with current year and includes supplier, sub-item and budget item', async () => {
    const [subItem] = await subItemRepository.find({
      where: {name: 'armadura Ironman'},
    });
    if (!subItem) {
      throw new Error(
        'The test database must contain the seeded Ironman sub-item',
      );
    }

    const [supplier] = await supplierRepository.find({
      where: {name: 'Stark Industries'},
    });
    if (!supplier) {
      throw new Error('The test database must contain the seeded supplier');
    }

    const currentFallaYear = await fallaYearRepository.findOne({
      order: ['code DESC'],
    });
    if (!currentFallaYear) {
      throw new Error('The test database must contain a seeded falla year');
    }

    const createdBuy = await buyRepository.create({
      subItemFk: subItem.id!,
      supplierFk: supplier.id!,
      amount: 35,
      payMethod: 'banc',
      ticketReference: 'TEST-BUY-INTEGRATION',
      description: 'buy integration relation test',
      fallaYearFk: currentFallaYear.code - 1,
    });
    buyId = createdBuy.id;

    const [buy] = (await buyController.find({
      where: {id: createdBuy.id},
    })) as BuyWithIncludedRelations[];

    expect(buy.fallaYearFk).toBe(currentFallaYear.code);
    expect(buy.supplier.name).toBe('Stark Industries');
    expect(buy.subItem.name).toBe('armadura Ironman');
    expect(buy.subItem.budgetItem.name).toBe('Armes');
  });
});
