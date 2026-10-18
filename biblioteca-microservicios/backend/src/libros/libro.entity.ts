import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Autor } from '../autores/autor.entity';

@Entity('libros')
export class Libro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ unique: true })
  isbn: string;

  @Column({ type: 'int', nullable: true })
  anioPublicacion?: number;

  @Column({ default: true })
  disponible: boolean;

  @ManyToOne(() => Autor, (autor) => autor.libros, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  autor?: Relation<Autor>;
}
