import { ObjectLiteral, Repository } from "typeorm";
import { IBaseService } from "./base-service.interface";

export interface IBaseFactory<T extends ObjectLiteral> {
    buildService(): IBaseService<T>;
    createRepository(): Repository<T>;
}