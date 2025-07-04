import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class RegisterValidationPipe implements PipeTransform {
    transform(value: any) {
        // 아이디 3 ~ 8글자 사이, 특수문자 방지
        if(!value.username || value.username.length < 3 || value.username.length > 8) {
            throw new BadRequestException('아이디는 3글자 이상 8글자 이하여야 합니다.');
        }
        
        // 아이디 특수문자 방지 (영문, 숫자만 허용)
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        if(!usernameRegex.test(value.username)) {
            throw new BadRequestException('아이디는 영문과 숫자만 사용 가능합니다.');
        }
        
        // 비밀번호 6 ~ 12글자 사이
        if(!value.password || value.password.length < 6 || value.password.length > 12) {
            throw new BadRequestException('비밀번호는 6자 이상 12자 이하여야 합니다.');
        }
        
        // 비밀번호 특수문자 하나 이상 포함
        const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        if(!specialCharRegex.test(value.password)) {
            throw new BadRequestException('비밀번호는 특수문자를 하나 이상 포함해야 합니다.');
        }
        
        return value;
    }
}