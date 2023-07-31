import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Schema as MongooseSchema } from 'mongoose';
import {
  Organization,
  OrganizationDocument,
} from 'src/schemas/organization.schemas';
import { Role, RoleDocument } from 'src/schemas/role.schemas';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleDelete, RoleGet } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
  ) {}
  async create(req: any, createRole: CreateRoleDto) {
    const userId = req.user._id;
    const name = createRole.name;
    const organizationId = createRole.organizationId;
    const checkOrganizationExists = await this.organizationModel.findOne({
      organizationId: organizationId,
      userId: userId,
    });
    if (!checkOrganizationExists) {
      throw new HttpException(
        'Organization is not exits',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const checkRoleExists = await this.roleModel.findOne({
        userId: userId,
        name: name,
        organizationId: checkOrganizationExists._id,
      });
      if (!checkRoleExists) {
        await this.roleModel.create({
          userId,
          name,
          organizationId: checkOrganizationExists._id,
        });
        return { status: 'done' };
      } else {
        return { message: 'Already exits!' };
      }
    }
  }

  async findAll(req: any, query: RoleGet) {
    const { skip, limit, name, organizationId } = await { ...query };
    const aggregation_option = [];
    aggregation_option.push({
      $match: {
        userId: new mongoose.Types.ObjectId(req.user._id),
      },
    });
    if (name) {
      aggregation_option.push({
        $match: {
          name: name,
        },
      });
    }

    if (organizationId) {
      aggregation_option.push({
        $lookup: {
          from: 'organizations',
          localField: 'organizationId',
          foreignField: '_id',
          as: 'organizationDetail',
        },
      });
      aggregation_option.push({
        $match: {
          'organizationDetail.organizationId': organizationId,
        },
      });
    }
    aggregation_option.push({
      $project: {
        name: 1,
      },
    });
    aggregation_option.push({
      $facet: {
        metadata: [{ $count: 'total' }],
        docs: [
          {
            $skip: +skip,
          },
          { $limit: +limit },
        ],
      },
    });
    const data = await this.roleModel.aggregate(aggregation_option);
    return { data: data };
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  async update(
    req: any,
    id: mongoose.Types.ObjectId,
    updateRoleDto: UpdateRoleDto,
  ) {
    const data = await this.roleModel.findOne({
      _id: id,
      userId: req.user._id,
    });
    if (data) {
      const updateData = await this.roleModel.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          $set: {
            name: updateRoleDto.name,
          },
        },
      );
      return { status: 'done' };
    } else {
      throw new NotFoundException('Data not found');
    }
  }

  async remove(req: any, id: mongoose.Types.ObjectId) {
    const data = await this.roleModel.findByIdAndRemove({
      _id: id,
      userId: req.user._id,
    });
    if (!data) {
      throw new NotFoundException('Data not found');
    } else {
      return { status: 'done' };
    }
  }

  async removeByName(req: any, query: RoleDelete) {
    const checkOrganizationExists = await this.organizationModel.findOne({
      organizationId: query.organizationId,
      userId: req.user._id,
    });
    if (checkOrganizationExists) {
      const data = await this.roleModel.findOneAndRemove({
        name: query.name,
        organizationId: checkOrganizationExists._id,
        userId: req.user._id,
      });
      if (!data) {
        throw new NotFoundException('Data not found');
      } else {
        return { status: 'done' };
      }
    } else {
      throw new NotFoundException('Organization not found');
    }
  }
}
