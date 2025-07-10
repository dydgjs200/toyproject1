export class UserNotFoundException extends Error {
    constructor(message: string = '해당 유저를 찾을 수 없습니다.'){
        super(message)
        this.name = 'UserNotFoundException'
    }
}