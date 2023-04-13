import { FindOptionsWhere, ObjectLiteral } from "typeorm";

export type QueryCriteria<T> = FindOptionsWhere<T>

export interface IBaseService<T extends ObjectLiteral> {
    findById(id: number): Promise<T | null>;
    findAll(): Promise<T[]>;
    findOneByCriteria(criteria: QueryCriteria<T>): Promise<T | null>;
    findAllByCriteria(criteria: QueryCriteria<T>): Promise<T[] | null>;

    save(value: T): Promise<T>;

    deleteById(id: number): Promise<void | never>;
}