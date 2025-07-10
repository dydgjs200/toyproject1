import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/user/entities/user.entity';
import { AuthUserNotFoundException, AuthInvalidPasswordException } from './auth.exception'

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    private readonly logger = new Logger(AuthService.name, {timestamp: true});

    //Omit<T,k> = T타입에서 k 제외 리턴
    async validateUser(username: string, password: string): Promise<Omit<User, 'password'>> {
        const user = await this.userService.findByUsername(username);
        console.log("val user > ", user)

        if (!user) {
          throw new AuthUserNotFoundException();
        }
        if (!(await bcrypt.compare(password, user.password))) {
          throw new AuthInvalidPasswordException();
        }

        const { password: _, ...result } = user;

        console.log("result > ", password, result, user)

        return result as Omit<User, 'password'>;
    }

    // 로그인 성공 시 token 발급
    async login(user: Omit<User, 'password'>) {
        const payload = { username: user.username, sub: user.userId};

        return {
            access_token: this.jwtService.sign(payload),
            userId: user.userId,
        }
    }
}
