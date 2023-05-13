import { type SuccessResponse } from './success.response';

export const ok = (data: any): SuccessResponse => {
    return {
        successCode: 200,
        data,
    };
};

export const created = (data: any): SuccessResponse => {
    return {
        successCode: 201,
        data,
    };
};
