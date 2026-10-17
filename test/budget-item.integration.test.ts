/// <reference types="jest" />

import {BudgetItemController} from '../src/controllers/budget-item.controller';
import {SpDataSource} from '../src/datasources/sp.datasource';
import {BudgetItemRepository, SubItemRepository} from '../src/repositories';

describe('BudgetItem and SubItem (integration)', () => {
  let dataSource: SpDataSource;
  let budgetItemController: BudgetItemController;
  let budgetItemRepository: BudgetItemRepository;
  let subItemRepository: SubItemRepository;

  beforeAll(() => {
    dataSource = new SpDataSource();

    let budgetItemRepositoryInstance: BudgetItemRepository;
    let subItemRepositoryInstance: SubItemRepository;

    const budgetItemGetter = async () => budgetItemRepositoryInstance;
    const subItemGetter = async () => subItemRepositoryInstance;

    budgetItemRepositoryInstance = new BudgetItemRepository(
      dataSource,
      subItemGetter,
    );
    subItemRepositoryInstance = new SubItemRepository(
      dataSource,
      budgetItemGetter,
    );

    budgetItemRepository = budgetItemRepositoryInstance;
    subItemRepository = subItemRepositoryInstance;
    budgetItemController = new BudgetItemController(budgetItemRepository);
  });

  afterAll(async () => {
    await dataSource.stop();
  });

  it('loads the seeded sub-item through the budget item relationship', async () => {
    const [budgetItem] = await budgetItemRepository.find({
      where: {name: 'Armes'},
    });
    expect(budgetItem).toBeDefined();

    const subItems = await budgetItemController.findSubItems(budgetItem.id!);
    expect(
      subItems.map(({name, description, budgetItemFk}) => ({
        name,
        description,
        budgetItemFk,
      })),
    ).toEqual([
      {
        name: 'armadura Ironman',
        description: 'Ironman Mark II',
        budgetItemFk: budgetItem.id,
      },
    ]);

    const parent = await subItemRepository.budgetItem(subItems[0].id!);
    expect(parent.id).toBe(budgetItem.id);
    expect(parent.name).toBe('Armes');
  });
});
