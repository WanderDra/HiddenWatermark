export interface User {
    id: string,
    username: string,
    password: string,
    type: string,
    token: {
        token: string,
        iv: Array<number>
    }
}
