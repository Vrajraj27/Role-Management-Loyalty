import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ModulesMethodsService } from './modules-methods.service';
import { CreateModulesMethodDto } from './dto/create-modules-method.dto';
import { UpdateModulesMethodDto } from './dto/update-modules-method.dto';
import { JwtAccessTokenGuard } from 'src/common/guards/jwt-access-token/jwt-access-token.guard';
import { FormDataRequest } from 'nestjs-form-data';
import {
  MethodDelete,
  ModulesMethodGet,
} from './entities/modules-method.entity';
import mongoose from 'mongoose';

@Controller('modules-methods')
export class ModulesMethodsController {
  constructor(private readonly modulesMethodsService: ModulesMethodsService) {}

  @Post()
  @UseGuards(JwtAccessTokenGuard)
  @FormDataRequest()
  create(
    @Req() req: any,
    @Body() createModulesMethodDto: CreateModulesMethodDto,
  ) {
    return this.modulesMethodsService.create(req, createModulesMethodDto);
  }

  @Get()
  @UseGuards(JwtAccessTokenGuard)
  findAll(@Req() req: any, @Query() query: ModulesMethodGet) {
    return this.modulesMethodsService.findAll(req, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modulesMethodsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAccessTokenGuard)
  update(
    @Req() req: any,
    @Param('id') id: mongoose.Types.ObjectId,
    @Body() updateModulesMethodDto: UpdateModulesMethodDto,
  ) {
    return this.modulesMethodsService.update(req, id, updateModulesMethodDto);
  }

  @Delete(':id')
  @UseGuards(JwtAccessTokenGuard)
  remove(@Req() req: any, @Param('id') id: mongoose.Types.ObjectId) {
    return this.modulesMethodsService.remove(req, id);
  }

  @Delete('')
  @UseGuards(JwtAccessTokenGuard)
  removeByName(@Req() req: any, @Query() query: MethodDelete) {
    return this.modulesMethodsService.removeByName(req, query);
  }
}
