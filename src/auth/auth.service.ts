import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto, registerDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User, UserDocument } from '../schemas/user.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { setPassword, verifyPassword } from 'src/common/helper/password.heper';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject('JwtAccessTokenService') private jwtService: JwtService,
    @Inject('JwtRefreshTokenService') private jwtRefreshService: JwtService,
  ) {}

  async checkUserEmailAndMobile(email: any) {
    const checkCode = await this.userModel.findOne({
      email: email,
    });
    if (!checkCode) {
      return true;
    }
    throw new ConflictException('Email  is Already registered');
  }

  async singUp(dto: registerDto) {
    try {
      await this.checkUserEmailAndMobile(dto.email);
      const pass = setPassword(dto.password);
      let insertData: registerDto;

      insertData = {
        email: dto.email,
        name: dto.name,
        password: pass,
      };

      let user = await this.userModel.create(insertData);

      delete user.password;
      console.log('user: ', user);
      let returnJson = {
        access_token: this.jwtService.sign(user.toJSON()),
        refreshToken: this.jwtRefreshService.sign(user.toJSON()),
      };
      let updateUser = await this.userModel.updateOne(
        { _id: user._id },
        { $set: { refreshToken: returnJson.refreshToken } },
      );
      return returnJson;
    } catch (error) {
      return error.response;
    }
  }

  async singIn(email: string, password: string) {
    let user = await this.userModel.findOne({ email: email });
    if (user) {
      const checkPassword = await verifyPassword(password, user.password);
      if (checkPassword) {
        delete user.password;
        console.log('user: ', user);
        let json = {};
        return {
          access_token: this.jwtService.sign(user.toJSON()),
          refreshToken: this.jwtRefreshService.sign(user.toJSON()),
        };
      } else {
        throw new UnauthorizedException('Entered password is wrong');
      }
    } else {
      throw new NotFoundException('User not found');
    }
  }

  async refreshAccesstoken(@Req() req: any) {
    console.log(req.user);
    const userId = req.user._id;
    let user = await this.userModel.findOne({ _id: userId });
    if (user) {
      let tokenParse = {
        _id: userId,
        name: user.name,
        email: user.email,
      };
      let access_token = this.jwtService.sign(tokenParse);
      return { access_token: access_token };
    } else {
      throw new NotFoundException('User not found');
    }
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
