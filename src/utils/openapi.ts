export const stringApiResponse = (content: string) => {
    return {
        'application/json': {
            schema: {
                type: 'string',
                example: content
            }
        }
    }
}

export const OkApiResponse = () => {
    return {
        'application/json': {
            schema: {
                type: 'string',
                example: 'OK.'
            }
        }
    }
}

export const getDefaultError = (message: string, code: number) => {
    return {
        'application/json': {
            schema: {
                type: 'object',
                properties: {
                    'statusCode': {
                        type: 'integer',
                        example: code
                    },
                    'message': {
                        type: 'string',
                        example: message
                    },
                    'name': {
                        type: 'string',
                        example: 'Error'
                    },
                },
            }
        }
    }
}