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
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { JwtAccessTokenGuard } from 'src/common/guards/jwt-access-token/jwt-access-token.guard';
import { FormDataRequest } from 'nestjs-form-data';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ModuleDelete, ModuleGet } from './entities/module.entity';
import mongoose from 'mongoose';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post('/')
  @UseGuards(JwtAccessTokenGuard)
  @FormDataRequest()
  @ApiBody({ type: CreateModuleDto })
  @ApiBearerAuth('access-token')
  create(@Req() req: any, @Body() createModuleDto: CreateModuleDto) {
    return this.modulesService.create(req, createModuleDto);
  }

  @Get()
  @UseGuards(JwtAccessTokenGuard)
  findAll(@Req() req: any, @Query() query: ModuleGet) {
    return this.modulesService.findAll(req, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modulesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAccessTokenGuard)
  @FormDataRequest()
  update(
    @Req() req: any,
    @Param('id') id: mongoose.Types.ObjectId,
    @Body() updateModuleDto: UpdateModuleDto,
  ) {
    return this.modulesService.update(req, id, updateModuleDto);
  }

  @Delete(':id')
  @UseGuards(JwtAccessTokenGuard)
  remove(@Req() req: any, @Param('id') id: mongoose.Types.ObjectId) {
    return this.modulesService.remove(req, id);
  }

  @Delete('')
  @UseGuards(JwtAccessTokenGuard)
  removeByName(@Req() req: any, @Query() query: ModuleDelete) {
    return this.modulesService.removeByName(req, query);
  }
}
