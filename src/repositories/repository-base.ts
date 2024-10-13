import 'reflect-metadata';
import { FilterQuery, Model } from 'mongoose';
import { Entity } from '../models/entities/Entity';
import { IRepositoryBase } from '../types/repositories/IRepositoryBase';
import { injectable, unmanaged } from 'inversify';

@injectable()
export class RepositoryBase<T extends Entity> implements IRepositoryBase<T> {
	protected readonly model: Model<T>;
	protected readonly entityConstructor: new (data: Partial<T>) => T; // Accept a constructor for T

	constructor(@unmanaged() model: Model<T>, @unmanaged() entityConstructor: new (data: Partial<T>) => T) {
		this.model = model;
		this.entityConstructor = entityConstructor;
	}

	async create(createDto: unknown): Promise<boolean> {
		const createdEntity = await this.model.create(createDto);
		return createdEntity !== null;
	}

	async get(filter: FilterQuery<T>): Promise<T | null> {
		const entity = await this.model.findOne(filter);

		if (!entity) return null;
		return new this.entityConstructor(entity.toObject<T>());
	}
	async getById(id: string): Promise<T | null> {
		const entity = await this.model.findById(id);

		if (!entity) return null;
		return new this.entityConstructor(entity.toObject<T>());
	}
	async getAll(filter?: FilterQuery<T>): Promise<T[]> {
		const entities = await this.model.find(filter);

		if (!entities) return [];
		return entities.map(entity => new this.entityConstructor(entity.toObject<T>()));
	}

	async update(id: string, entity: Partial<T>): Promise<boolean> {
		const updatedEntity = await this.model.findByIdAndUpdate(id, entity, { new: true });
		return !!updatedEntity;
	}

	async delete(id: string): Promise<boolean> {
		const result = await this.model.findByIdAndDelete(id);
		return !!result;
	}
}
