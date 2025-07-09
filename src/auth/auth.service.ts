import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    private readonly logger = new Logger(AuthService.name, {timestamp: true});

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findByUsername(username);

        if(user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            this.logger.log(`${username} 로그인 성공`);

            return result;
        }
        this.logger.log(`로그인 실패`);
        return null;
    }

    // 로그인 성공 시 token 발급
    async login(user: any) {
        const payload = { username: user.username, sub: user.userId};

        return {
            access_token: this.jwtService.sign(payload),
            userId: user.userId,
        }
    }
}
