import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PermisisonService } from './permisison.service';
import { CreatePermisisonDto } from './dto/create-permisison.dto';
import { UpdatePermisisonDto } from './dto/update-permisison.dto';
import { JwtAccessTokenGuard } from 'src/common/guards/jwt-access-token/jwt-access-token.guard';
import { FormDataRequest } from 'nestjs-form-data';
import { PermisisonGet, PermissionCheckGet, PermissionDelete } from './entities/permisison.entity';
import mongoose from 'mongoose';

@Controller('permission')
export class PermisisonController {
  constructor(private readonly permisisonService: PermisisonService) {}

  @Post()
  @UseGuards(JwtAccessTokenGuard)
  @FormDataRequest()
  create(@Req() req: any, @Body() createPermisisonDto: CreatePermisisonDto) {
    return this.permisisonService.create(req, createPermisisonDto);
  }

  @Get()
  @UseGuards(JwtAccessTokenGuard)
  findAll(@Req() req: any, @Query() query: PermisisonGet) {
    return this.permisisonService.findAll(req, query);
  }

  @Get('check')
  @UseGuards(JwtAccessTokenGuard)
  checkPermission(@Req() req: any, @Query() query: PermissionCheckGet) {
    return this.permisisonService.checkPermission(req, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permisisonService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAccessTokenGuard)
  @FormDataRequest()
  update(
    @Req() req: any,
    @Param('id') id: mongoose.Types.ObjectId,
    @Body() updatePermisisonDto: any,
  ) {
    return this.permisisonService.update(req, id, updatePermisisonDto);
  }

  @Delete(':id')
  @UseGuards(JwtAccessTokenGuard)
  remove(@Req() req: any, @Param('id') id: mongoose.Types.ObjectId) {
    return this.permisisonService.remove(req, id);
  }

  @Delete('')
  @UseGuards(JwtAccessTokenGuard)
  removeByName(@Req() req: any, @Query() query: PermissionDelete) {
    return this.permisisonService.removeByName(req, query);
  }
}
