import { ObjectLiteral, Repository } from "typeorm";
import { IBaseService } from "./base-service.interface";

export interface IBaseFactory<T extends ObjectLiteral, S extends IBaseService<T>> {
    buildService(): S;
    createRepository(): Repository<T>;
}