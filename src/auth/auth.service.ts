import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    private readonly logger = new Logger(AuthService.name, {timestamp: true});

    //Omit<T,k> = T타입에서 k 제외 리턴턴
    async validateUser(username: string, password: string): Promise<Omit<User, 'password'> | null> {
        const user = await this.userService.findByUsername(username);

        if(user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            console.log("result >", result)
            this.logger.log(`${username} 로그인 성공`);

            return result;
        }
        this.logger.log(`로그인 실패`);
        return null;
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
