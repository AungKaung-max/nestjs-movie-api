import { DataSource } from 'typeorm';
import { MovieLink } from './movie_link.entity';

export const movieLinkProviders = [
  {
    provide: 'MOVIE_LINK_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(MovieLink),
    inject: ['DATA_SOURCE'],
  },
];
