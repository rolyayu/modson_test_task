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