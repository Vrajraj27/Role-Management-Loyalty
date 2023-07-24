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
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { JwtAccessTokenGuard } from 'src/common/guards/jwt-access-token/jwt-access-token.guard';
import { FormDataRequest } from 'nestjs-form-data';
import { organizationGet } from './entities/organization.entity';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @UseGuards(JwtAccessTokenGuard)
  @FormDataRequest()
  create(
    @Req() req: any,
    @Body() createOrganizationDto: CreateOrganizationDto,
  ) {
    return this.organizationService.create(req, createOrganizationDto);
  }

  @Get()
  @UseGuards(JwtAccessTokenGuard)
  findAll(@Req() req: any, @Query() query: organizationGet) {
    return this.organizationService.findAll(req, query);
  }

  @Get(':id')
  @UseGuards(JwtAccessTokenGuard)
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAccessTokenGuard)
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(+id, updateOrganizationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAccessTokenGuard)
  remove(@Req() req: any, @Param('id') id: string) {
    return this.organizationService.remove(req, id);
  }
}
