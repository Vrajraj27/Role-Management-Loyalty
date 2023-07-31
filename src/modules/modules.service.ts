import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ModuleDocument, Modules } from 'src/schemas/module.schemas';
import {
  Organization,
  OrganizationDocument,
} from 'src/schemas/organization.schemas';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ModuleGet } from './entities/module.entity';

@Injectable()
export class ModulesService {
  constructor(
    @InjectModel(Modules.name) private moduleModel: Model<ModuleDocument>,
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
  ) {}
  async create(req: any, createModuleDto: CreateModuleDto) {
    const userId = req.user._id;
    const name = createModuleDto.name;
    const organizationId = createModuleDto?.organizationId;
    const isActive = createModuleDto?.isActive;
    const checkOrganizationExists = await this.organizationModel.findOne({
      organizationId: organizationId,
      userId: userId,
    });
    if (!checkOrganizationExists && organizationId) {
      throw new HttpException(
        'Organization is not exits',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      let jsonForCheckExists: any = {};
      jsonForCheckExists.userId = userId;
      jsonForCheckExists.name = name;
      if (!organizationId) {
        const checkRoleExists = await this.moduleModel.findOne({
          userId: userId,
          name: name,
          organizationId: { $exists: false },
        });
        if (!checkRoleExists) {
          await this.moduleModel.create({
            userId,
            name,
            isGlobally: true,
            isActive,
          });
          return { status: 'done' };
        } else {
          return { message: 'Globally exists' };
        }
      } else {
        const checkRoleExists = await this.moduleModel.findOne({
          userId: userId,
          name: name,
          organizationId: checkOrganizationExists._id,
        });
        if (!checkRoleExists) {
          await this.moduleModel.create({
            userId,
            name,
            organizationId: checkOrganizationExists._id,
            isActive,
          });
          return { status: 'done' };
        } else {
          return { message: 'Already exits!' };
        }
      }
    }
  }

  async findAll(req: any, query: ModuleGet) {
    const { skip, limit, name, organizationId, isActive, isGlobally } = await {
      ...query,
    };
    const aggregation_option = [];
    aggregation_option.push({
      $match: {
        userId: new mongoose.Types.ObjectId(req.user._id),
      },
    });
    if (name) {
      aggregation_option.push({
        $match: {
          name: { $regex: name, $options: 'i' },
        },
      });
    }

    if (isActive?.toString()) {
      aggregation_option.push({
        $match: {
          isActive: isActive,
        },
      });
    }

    if (isGlobally?.toString() && !organizationId) {
      aggregation_option.push({
        $match: {
          isGlobally: isGlobally,
        },
      });
    }
    if (organizationId && !isGlobally?.toString()) {
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
    if (isGlobally?.toString() && organizationId) {
      // aggregation_option.push({
      //   $match: {
      //     isGlobally: isGlobally,
      //   },
      // });
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
          $expr: {
            $or: [
              { $eq: ['$isGlobally', isGlobally] },
              {
                $eq: ['$organizationDetail.organizationId', organizationId],
              },
            ],
          },
        },
      });
    }
    aggregation_option.push({
      $project: {
        name: 1,
        isActive: 1,
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
    const data = await this.moduleModel.aggregate(aggregation_option);
    return { data: data };
  }

  findOne(id: number) {
    return `This action returns a #${id} module`;
  }

  async update(
    req: any,
    id: mongoose.Types.ObjectId,
    updateModuleDto: UpdateModuleDto,
  ) {
    const data = await this.moduleModel.findOne({
      _id: id,
      userId: req.user._id,
    });
    if (data) {
      const { name, isActive } = await { ...updateModuleDto };
      const checkAlreadyExists = await this.moduleModel.findOne({
        _id: { $ne: id },
        name: name,
        organizationId: data.organizationId
          ? data.organizationId
          : { $exists: false },
      });
      if (!checkAlreadyExists) {
        const updateData = await this.moduleModel.findByIdAndUpdate(
          {
            _id: id,
          },
          {
            $set: {
              name: name,
              isActive: isActive,
            },
          },
        );
        return { status: 'done' };
      } else {
        return { message: 'Already exits!' };
      }
    } else {
      throw new NotFoundException('Data not found');
    }
  }

  async remove(req: any, id: any) {
    const data = await this.moduleModel.findByIdAndRemove({
      _id: id,
      userId: req.user._id,
    });
    if (!data) {
      throw new NotFoundException('Data not found');
    } else {
      return { status: 'done' };
    }
  }

  async removeByName(req: any, query: any) {
    let queryJson: any = {
      name: query.name,
      userId: req.user._id,
    };
    if (query.organizationId) {
      const checkOrganizationExists = await this.organizationModel.findOne({
        organizationId: query.organizationId,
        userId: req.user._id,
      });
      if (checkOrganizationExists) {
        queryJson.organizationId = checkOrganizationExists._id;
      } else {
        throw new NotFoundException('Organization not found!!');
      }
    }
    const data = await this.moduleModel.findOneAndRemove(queryJson);
    if (!data) {
      throw new NotFoundException('Data not found');
    } else {
      return { status: 'done' };
    }
  }
}
