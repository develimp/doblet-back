import {SpDataSource} from '../src/datasources/sp.datasource';
import {CategoryRepository} from '../src/repositories';

/**
 * First back test. It is an INTEGRATION test: connect against the DB 
 * real (the mariadb container, with the schema.sql + seed.ts already loaded).
 *
 * NOTE: We deliberately did not use `new ApiApplication()` + `app.boot()` here.
 * LoopBack's "booter" discovers repositories/drivers by looking for
 * compiled `.js` files in dist/ (by convention), so when running
 * Jest with ts-jest directly on src/ (without going through dist/), the
 * booter finds nothing and CategoryRepository is never registered
 * in the context -> ResolutionError.
 *
 * For a single repository test, the simplest solution is
 * to instantiate it directly with its datasource, without going through the
 * automatic scanning of the complete Application.
 */
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

  it('finds the 5 fixed categories seeded by the seed', async () => {
    const categories = await categoryRepository.find();

    expect(categories).toHaveLength(5);

    const ids = categories.map(c => c.id).sort();
    expect(ids).toEqual([1, 2, 3, 4, 5]);
  });

  it('the category 1 (adult) has the fee we seeded', async () => {
    const adultCategory = await categoryRepository.findById(1);

    expect(adultCategory.name).toBe('adult');
    expect(adultCategory.fee).toBe(535);
  });
});