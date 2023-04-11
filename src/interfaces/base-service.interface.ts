import { FindOptionsWhere, ObjectLiteral } from "typeorm";

export type QueryCriteria<T> = FindOptionsWhere<T>

export interface IBaseService<T extends ObjectLiteral> {
    findById(id: number): Promise<T | null>;
    findAll(): Promise<T[]>;
    findOneByCriteria(criteria: QueryCriteria<T>): Promise<T | null>;
    findAllByCriteria(criteria: QueryCriteria<T>): Promise<T[] | null>;

    save(value: Partial<T>): Promise<T>;

    delete(value: T): Promise<number>;
    deleteByCriteria(criteria: QueryCriteria<T>): Promise<number>;
}