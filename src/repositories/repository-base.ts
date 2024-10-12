import 'reflect-metadata';
import { Model } from 'mongoose';
import { Entity } from '../models/entities/Entity';
import { IRepositoryBase } from '../types/repositories/IRepositoryBase';
import { injectable, unmanaged } from 'inversify';

@injectable()
export class RepositoryBase<T extends Entity> implements IRepositoryBase<T> {
	protected readonly model: Model<T>;

	constructor(@unmanaged() model: Model<T>) {
		this.model = model;
	}

	async create(createDto: unknown): Promise<boolean> {
		const createdEntity = await this.model.create(createDto);
		return createdEntity !== null;
	}

	async getById(id: string): Promise<T | null> {
		const entity = await this.model.findById(id);
		return entity ? (entity.toObject() as T) : null;
	}

	async getAll(filter?: Partial<T>): Promise<T[]> {
		const entities = await this.model.find(filter);
		return entities.map(entity => entity.toObject() as T);
	}

	async update(id: string, entity: Partial<T>): Promise<boolean> {
		const updatedEntity = await this.model.findByIdAndUpdate(id, entity, { new: true });
		return !!updatedEntity;
	}

	async delete(id: string): Promise<boolean> {
		const result = await this.model.findByIdAndDelete(id);
		return result !== null;
	}
}
