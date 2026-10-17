/// <reference types="jest" />

import {SpDataSource} from '../src/datasources/sp.datasource';
import {ClientRepository} from '../src/repositories';

describe('ClientRepository (integration)', () => {
  let dataSource: SpDataSource;
  let clientRepository: ClientRepository;

  beforeAll(() => {
    dataSource = new SpDataSource();
    clientRepository = new ClientRepository(dataSource);
  });

  afterAll(async () => {
    await dataSource.stop();
  });

  it('loads the client record seeded for the application', async () => {
    const clients = await clientRepository.find({
      where: {name: 'New York City Hall'},
    });

    expect(clients.map(({name, nif, email}) => ({name, nif, email}))).toEqual([
      {
        name: 'New York City Hall',
        nif: 'P4625000A',
        email: 'info@newyorkcityhall.com',
      },
    ]);
  });
});
