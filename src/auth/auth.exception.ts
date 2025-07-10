export class AuthUserNotFoundException extends Error {
    constructor(message: string = '해당 사용자를 찾을 수 없습니다.'){
        super(message);
        this.name = 'AuthUserNotFoundException';
    }
}

export class AuthInvalidPasswordException extends Error{
    constructor(message: string = '비밀번호가 올바르지 않습니다.'){
        super(message);
        this.name = 'AuthInvalidPasswordException';
    }
}

