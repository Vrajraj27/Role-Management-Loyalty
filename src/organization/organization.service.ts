import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  Organization,
  OrganizationDocument,
} from 'src/schemas/organization.schemas';
import { Permission, PermissionDocument } from 'src/schemas/permission.schemas';
import { Role, RoleDocument } from 'src/schemas/role.schemas';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { organizationGet } from './entities/organization.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>,
  ) {}
  async create(req: any, createOrganizationDto: CreateOrganizationDto) {
    const userId = req.user._id;
    const checkOrganizationExists = await this.organizationModel.findOne({
      userId: userId,
      organizationId: createOrganizationDto.organizationId,
    });
    if (!checkOrganizationExists) {
      let insertOrganization = {
        userId: userId,
        organizationId: createOrganizationDto.organizationId,
      };
      const data = await this.organizationModel.create(insertOrganization);
      if (data) {
        return { status: 'done' };
      } else {
        throw new InternalServerErrorException('Plz try after some time!!');
      }
    } else {
      throw new UnprocessableEntityException(
        'This organization already exists!!',
      );
    }
  }

  async findAll(req: any, query: organizationGet) {
    const { skip, limit, organizationId } = await { ...query };
    const aggregation_option = [];
    aggregation_option.push({
      $match: {
        userId: new mongoose.Types.ObjectId(req.user._id),
      },
    });
    if (organizationId) {
      aggregation_option.push({
        $match: {
          organizationId: { $regex: organizationId, $options: 'i' },
        },
      });
    }

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
    const data = await this.organizationModel.aggregate(aggregation_option);
    return { data: data };
  }

  findOne(id: number) {
    return `This action returns a #${id} organization`;
  }

  update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    return `This action updates a #${id} organization`;
  }

  async remove(req: any, id: string) {
    const userId = req.user._id;
    const checkOrganizationExists = await this.organizationModel.findOne({
      userId: userId,
      organizationId: id,
    });
    if (checkOrganizationExists) {
      var roleIdArray = [];
      const checkOrganizationExistsDelete =
        await this.organizationModel.deleteOne({
          userId: userId,
          organizationId: id,
        });
      const getRoles = await this.roleModel.find({
        organizationId: checkOrganizationExists._id,
      });
      await Promise.all(
        getRoles.map(async (element) => {
          const removePermissions = await this.permissionModel.deleteMany({
            roleId: element._id,
          });
          const removeRoles = await this.roleModel.deleteOne({
            _id: element._id,
          });
        }),
      );
      return { status: 'done' };
    } else {
      throw new NotFoundException('data not found');
    }
  }
}
