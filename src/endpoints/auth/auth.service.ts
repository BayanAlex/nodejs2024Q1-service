import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/endpoints/users/users.service';
import { AuthDto } from './dto/auth.dto';
import 'dotenv/config';
import { RefreshDto } from './dto/refresh.dto';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(dto: AuthDto) {
    return this.usersService.create(dto);
  }

  async login(dto: AuthDto) {
    const user = await this.usersService.findUserByLoginAndPassword(
      dto.login,
      dto.password,
    );
    return this.createTokensPair(user.id, user.login);
  }

  async refresh(dto: RefreshDto) {
    if (!dto?.refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync(dto.refreshToken, {
        secret: process.env.JWT_SECRET_KEY,
      });
    } catch {
      throw new ForbiddenException('Refresh token is expired or incorrect');
    }
    return this.createTokensPair(payload.userId, payload.login);
  }

  private async createTokensPair(userId: string, login: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken(userId, login),
      this.createRefreshToken(userId, login),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  private async createAccessToken(userId: string, login: string) {
    return this.jwtService.signAsync(
      { userId, login },
      {
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
        secret: process.env.JWT_SECRET_KEY,
      },
    );
  }

  private async createRefreshToken(userId: string, login: string) {
    return this.jwtService.signAsync(
      { userId, login },
      {
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      },
    );
  }
}
