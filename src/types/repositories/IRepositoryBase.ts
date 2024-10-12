import { Dto } from '../../models/dtos/Dto';
import { Entity } from '../../models/entities/Entity';

export interface IRepositoryBase<T extends Entity> {
	create(entity: Dto): Promise<boolean>;
	getById(id: string): Promise<T>;
	getAll(filter: Partial<T>): Promise<T[]>;
	update(id: string, entity: Dto | Partial<T>): Promise<boolean>;
	delete(id: string): Promise<boolean>;
}
