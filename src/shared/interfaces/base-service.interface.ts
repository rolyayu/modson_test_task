import { FindOptionsWhere, type ObjectLiteral } from 'typeorm';

export interface IBaseService<T extends ObjectLiteral> {
    findEntityByItsId: (id: number) => Promise<T | null>;
    findAll: (startPos: number, pageSize: number) => Promise<T[]>;

    save: (value: T) => Promise<T>;

    update: (toUpdate: T, withUpdatedProperties: T) => Promise<T>;

    deleteEntityByItsId: (id: number) => Promise<void | never>;
}
