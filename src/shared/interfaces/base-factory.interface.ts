import { type ObjectLiteral, type Repository } from 'typeorm';
import { type IBaseService } from './base-service.interface';

export interface IBaseFactory<T extends ObjectLiteral, S extends IBaseService<T>> {
    buildService: () => S;
    createRepository: () => Repository<T>;
}
