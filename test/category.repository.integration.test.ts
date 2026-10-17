/// <reference types="jest" />

import {SpDataSource} from '../src/datasources/sp.datasource';
import {CategoryRepository} from '../src/repositories';

describe('CategoryRepository (integration)', () => {
  let dataSource: SpDataSource;
  let categoryRepository: CategoryRepository;

  beforeAll(() => {
    dataSource = new SpDataSource();
    categoryRepository = new CategoryRepository(dataSource);
  });

  afterAll(async () => {
    await dataSource.stop();
  });

  it('has the seeded categories with IDs required by member category calculation', async () => {
    const categories = (await categoryRepository.find())
      .map(({id, name, fee}) => ({id, name, fee}))
      .sort((a, b) => (a.id ?? 0) - (b.id ?? 0));

    expect(categories).toEqual([
      {id: 1, name: 'adult', fee: 535},
      {id: 2, name: 'cadet', fee: 375},
      {id: 3, name: 'jovenil', fee: 220},
      {id: 4, name: 'infantil', fee: 140},
      {id: 5, name: 'bebe', fee: 50},
    ]);
  });
});
