import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'sp',
  connector: 'mysql',
  url: '',
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'hamuclaulo07',
  database: 'sp'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class SpDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'sp';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.sp', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
