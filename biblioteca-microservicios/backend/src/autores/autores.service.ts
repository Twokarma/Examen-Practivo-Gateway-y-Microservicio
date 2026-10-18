import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Autor } from './autor.entity';
import { CreateAutorDto } from './dto/create-autor.dto';
import { UpdateAutorDto } from './dto/update-autor.dto';

@Injectable()
export class AutoresService {
  constructor(
    @InjectRepository(Autor) private readonly repo: Repository<Autor>,
  ) {}

  create(dto: CreateAutorDto) {
    return this.repo.save(this.repo.create(dto));
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const autor = await this.repo.findOne({ where: { id }, relations: ['libros'] });
    if (!autor) throw new NotFoundException(`Autor ${id} no encontrado`);
    return autor;
  }

  async update(id: number, dto: UpdateAutorDto) {
    const autor = await this.findOne(id);
    Object.assign(autor, dto);
    return this.repo.save(autor);
  }

  async remove(id: number) {
    const autor = await this.findOne(id);
    await this.repo.remove(autor);
    return { message: `Autor ${id} eliminado` };
  }
}
