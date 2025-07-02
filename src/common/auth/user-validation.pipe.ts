import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class UserValidationPipe implements PipeTransform {
    transform(value: any) {
        if(!value.username || value.username.length < 3) {
            throw new BadRequestException('아이디는 3글자 이상이어야 합니다.');
        }
        if(!value.password || value.password.length < 6) {
            throw new BadRequestException('비밀번호는 6자 이상이어야 합니다.');
        }
        return value;
    }
}