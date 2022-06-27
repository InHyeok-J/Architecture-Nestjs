import { dataSourceConfig } from '../config/data-source';
import { DATABASE_PROVIDER } from 'src/config/constant/database.constant';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: DATABASE_PROVIDER,
    useFactory: async () => {
      const databaseSource: DataSource = dataSourceConfig;
      return databaseSource.initialize();
    },
  },
];
