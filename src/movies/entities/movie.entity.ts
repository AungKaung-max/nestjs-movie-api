import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MovieLink } from './movie_link.entity';

@Entity('movie')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  video: string;

  @Column()
  user_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(() => MovieLink, (movieLink) => movieLink.movie, {
    cascade: ['remove'],
  })
  movie_link: MovieLink[];
}
