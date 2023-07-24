import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, loginDto, registerDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { JwtRefreshGuard } from 'src/common/guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('singup')
  @FormDataRequest()
  singUp(@Body() dto: registerDto) {
    return this.authService.singUp(dto);
  }

  @Post('singin')
  @FormDataRequest()
  singIn(@Body() dto: loginDto) {
    return this.authService.singIn(dto.email, dto.password);
  }

  @Post('refreshtoken')
  @UseGuards(JwtRefreshGuard)
  @FormDataRequest()
  refreshToken(@Req() req: any) {
    return this.authService.refreshAccesstoken(req);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
