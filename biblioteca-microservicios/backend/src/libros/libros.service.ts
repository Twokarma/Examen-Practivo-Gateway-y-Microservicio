import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Autor } from '../autores/autor.entity';
import { Libro } from './libro.entity';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';

@Injectable()
export class LibrosService {
  constructor(
    @InjectRepository(Libro) private readonly libros: Repository<Libro>,
    @InjectRepository(Autor) private readonly autores: Repository<Autor>,
  ) {}

  private async resolverAutor(autorId?: number) {
    if (autorId === undefined) return undefined;
    const autor = await this.autores.findOneBy({ id: autorId });
    if (!autor) throw new BadRequestException(`El autor ${autorId} no existe`);
    return autor;
  }

  async create(dto: CreateLibroDto) {
    const { autorId, ...datos } = dto;
    if (await this.libros.findOneBy({ isbn: datos.isbn })) {
      throw new ConflictException(`Ya existe un libro con ISBN ${datos.isbn}`);
    }
    const libro = this.libros.create(datos);
    libro.autor = await this.resolverAutor(autorId);
    return this.libros.save(libro);
  }

  findAll() {
    return this.libros.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const libro = await this.libros.findOneBy({ id });
    if (!libro) throw new NotFoundException(`Libro ${id} no encontrado`);
    return libro;
  }

  async update(id: number, dto: UpdateLibroDto) {
    const libro = await this.findOne(id);
    const { autorId, ...datos } = dto;
    Object.assign(libro, datos);
    if (autorId !== undefined) libro.autor = await this.resolverAutor(autorId);
    return this.libros.save(libro);
  }

  async remove(id: number) {
    const libro = await this.findOne(id);
    await this.libros.remove(libro);
    return { message: `Libro ${id} eliminado` };
  }
}
