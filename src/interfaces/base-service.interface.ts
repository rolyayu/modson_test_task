import { FindOptionsWhere, type ObjectLiteral } from 'typeorm';

export interface IBaseService<T extends ObjectLiteral> {
  findById: (id: number) => Promise<T | null>;
  findAll: (startPos: number, pageSize: number) => Promise<T[]>;

  save: (value: T) => Promise<T>;

  update: (toUpdate: T, withUpdatedProperties: T) => Promise<T>;

  deleteById: (id: number) => Promise<void | never>;
}
