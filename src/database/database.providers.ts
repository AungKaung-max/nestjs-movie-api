import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      });

      try {
        console.log('Attempting to connect to the database...');
        await dataSource.initialize();
        console.log('Database connection successful!');
        return dataSource;
      } catch (error) {
        console.error('Database connection failed:', error.message);
        throw new Error('Database connection failed: ' + error.message);
      }
    },
  },
];
