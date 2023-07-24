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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { JwtAccessTokenGuard } from 'src/common/guards/jwt-access-token/jwt-access-token.guard';
import { PaginationParams } from 'src/core/class/paginationParams';
import { RoleDelete, RoleGet } from './entities/role.entity';
import mongoose from 'mongoose';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Post('/')
  @UseGuards(JwtAccessTokenGuard)
  @FormDataRequest()
  @ApiBody({ type: CreateRoleDto })
  @ApiBearerAuth('access-token')
  async create(@Req() req: any, @Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(req, createRoleDto);
  }

  @Get()
  @UseGuards(JwtAccessTokenGuard)
  findAll(@Req() req: any, @Query() query: RoleGet) {
    return this.roleService.findAll(req, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAccessTokenGuard)
  @FormDataRequest()
  update(
    @Req() req: any,
    @Param('id') id: mongoose.Types.ObjectId,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(req, id, updateRoleDto);
  }

  @Delete(':id')
  @UseGuards(JwtAccessTokenGuard)
  remove(@Req() req: any, @Param('id') id: mongoose.Types.ObjectId) {
    return this.roleService.remove(req, id);
  }

  @Delete('')
  @UseGuards(JwtAccessTokenGuard)
  removeByName(@Req() req: any, @Query() query: RoleDelete) {
    return this.roleService.removeByName(req, query);
  }
}
