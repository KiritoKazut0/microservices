
export default interface UserResponse {
    status: number
    message: string
    
    data: {
        id: string,
        name: string,
        email: string
    }

    token: string
}