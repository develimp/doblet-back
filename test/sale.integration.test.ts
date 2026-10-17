/// <reference types="jest" />

import {SaleController} from '../src/controllers/sale.controller';
import {SpDataSource} from '../src/datasources/sp.datasource';
import {BudgetItem, Client, Sale, SubItem} from '../src/models';
import {
  BudgetItemRepository,
  ClientRepository,
  FamilyRepository,
  FallaYearRepository,
  MemberRepository,
  MovementRepository,
  SaleRepository,
  SubItemRepository,
} from '../src/repositories';

type SaleWithIncludedRelations = Sale & {
  subItem: SubItem & {budgetItem: BudgetItem};
  client: Client;
};

describe('Sale (integration)', () => {
  let dataSource: SpDataSource;
  let saleController: SaleController;
  let saleRepository: SaleRepository;
  let fallaYearRepository: FallaYearRepository;
  let subItemRepository: SubItemRepository;
  let clientRepository: ClientRepository;
  let saleId: number | undefined;

  beforeAll(() => {
    dataSource = new SpDataSource();

    let budgetItemRepositoryInstance: BudgetItemRepository;
    let familyRepositoryInstance: FamilyRepository;
    let memberRepositoryInstance: MemberRepository;
    let movementRepositoryInstance: MovementRepository;
    let subItemRepositoryInstance: SubItemRepository;

    const budgetItemGetter = async () => budgetItemRepositoryInstance;
    const clientGetter = async () => clientRepository;
    const familyGetter = async () => familyRepositoryInstance;
    const fallaYearGetter = async () => fallaYearRepository;
    const memberGetter = async () => memberRepositoryInstance;
    const movementGetter = async () => movementRepositoryInstance;
    const subItemGetter = async () => subItemRepositoryInstance;

    budgetItemRepositoryInstance = new BudgetItemRepository(
      dataSource,
      subItemGetter,
    );
    subItemRepositoryInstance = new SubItemRepository(
      dataSource,
      budgetItemGetter,
    );
    clientRepository = new ClientRepository(dataSource);
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

    const saleRepositoryInstance = new SaleRepository(
      dataSource,
      subItemGetter,
      clientGetter,
    );

    saleRepository = saleRepositoryInstance;
    subItemRepository = subItemRepositoryInstance;
    saleController = new SaleController(saleRepository);
  });

  beforeEach(() => {
    saleId = undefined;
  });

  afterEach(async () => {
    if (saleId !== undefined) {
      await saleRepository.deleteById(saleId);
    }
  });

  afterAll(async () => {
    await dataSource.stop();
  });

  it('creates a sale with current year and includes client, sub-item and budget item', async () => {
    const [subItem] = await subItemRepository.find({
      where: {name: 'armadura Ironman'},
    });
    if (!subItem) {
      throw new Error(
        'The test database must contain the seeded Ironman sub-item',
      );
    }

    const [client] = await clientRepository.find({
      where: {name: 'New York City Hall'},
    });
    if (!client) {
      throw new Error('The test database must contain the seeded client');
    }

    const currentFallaYear = await fallaYearRepository.findOne({
      order: ['code DESC'],
    });
    if (!currentFallaYear) {
      throw new Error('The test database must contain a seeded falla year');
    }
    const currentFallaYearCode = currentFallaYear.code;

    const createdSale = await saleRepository.create({
      subItemFk: subItem.id!,
      clientFk: client.id!,
      amount: 75,
      payMethod: 'efectiu',
      ticketReference: 'TEST-SALE-INTEGRATION',
      description: 'sale integration relation test',
      fallaYearFk: currentFallaYearCode - 1,
    });
    saleId = createdSale.id;

    const [sale] = (await saleController.find({
      where: {id: createdSale.id},
    })) as SaleWithIncludedRelations[];

    expect(sale.fallaYearFk).toBe(currentFallaYearCode);
    expect(sale.client.name).toBe('New York City Hall');
    expect(sale.subItem.name).toBe('armadura Ironman');
    expect(sale.subItem.budgetItem.name).toBe('Armes');
  });
});
