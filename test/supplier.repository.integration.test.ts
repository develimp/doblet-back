/// <reference types="jest" />

import {SpDataSource} from '../src/datasources/sp.datasource';
import {SupplierRepository} from '../src/repositories';

describe('SupplierRepository (integration)', () => {
  let dataSource: SpDataSource;
  let supplierRepository: SupplierRepository;

  beforeAll(() => {
    dataSource = new SpDataSource();
    supplierRepository = new SupplierRepository(dataSource);
  });

  afterAll(async () => {
    await dataSource.stop();
  });

  it('loads the supplier records seeded for the application', async () => {
    const suppliers = await supplierRepository.find({
      where: {name: {inq: ['Stark Industries', 'Oscorp']}},
      order: ['name ASC'],
    });

    expect(suppliers.map(({name, nif, email}) => ({name, nif, email}))).toEqual(
      [
        {
          name: 'Oscorp',
          nif: 'B87654321',
          email: 'contact@oscorp.com',
        },
        {
          name: 'Stark Industries',
          nif: 'B12345678',
          email: 'info@starkindustries.com',
        },
      ],
    );
  });
});
