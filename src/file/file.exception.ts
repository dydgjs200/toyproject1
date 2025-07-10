export class FileNotFoundException extends Error {
    constructor(message = '파일을 찾을 수 없습니다.') {
      super(message);
      this.name = 'FileNotFoundException';
    }
  }
  
  export class FileUploadException extends Error {
    constructor(message = '파일 업로드에 실패했습니다.') {
      super(message);
      this.name = 'FileUploadException';
    }
  }
  
  export class FileDownloadException extends Error {
    constructor(message = '파일 다운로드에 실패했습니다.') {
      super(message);
      this.name = 'FileDownloadException';
    }
  }
  
  export class FileDeleteException extends Error {
    constructor(message = '파일 삭제에 실패했습니다.') {
      super(message);
      this.name = 'FileDeleteException';
    }
  }
  
  export class FileTypeNotAllowedException extends Error {
    constructor(message = '허용되지 않은 파일 형식입니다.') {
      super(message);
      this.name = 'FileTypeNotAllowedException';
    }
  }
  
  export class FileSizeLimitExceededException extends Error {
    constructor(message = '파일 크기 제한을 초과했습니다.') {
      super(message);
      this.name = 'FileSizeLimitExceededException';
    }
  }
  
  export class FileOwnerMismatchException extends Error {
    constructor(message = '파일 소유자가 아닙니다.') {
      super(message);
      this.name = 'FileOwnerMismatchException';
    }
  }
  
  export class FileAlreadyExistsException extends Error {
    constructor(message = '이미 존재하는 파일입니다.') {
      super(message);
      this.name = 'FileAlreadyExistsException';
    }
  }