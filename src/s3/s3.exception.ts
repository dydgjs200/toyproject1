export class S3FileNotFoundException extends Error{
    constructor(message: string = 'S3에서 파일을 찾을 수 없습니다.'){
        super(message)
        this.name = 'S3FileNotFoundException'
    }
}

export class S3FailConnectException extends Error{
    constructor(message: string = 'S3 연결에 실패하였습니다.'){
        super(message)
        this.name = 'S3FailConnectException'
    }
}