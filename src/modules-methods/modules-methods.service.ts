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
  ModuleMethod,
  ModuleMethodDocument,
} from 'src/schemas/moduleMethods.schemas';
import {
  Organization,
  OrganizationDocument,
} from 'src/schemas/organization.schemas';
import { CreateModulesMethodDto } from './dto/create-modules-method.dto';
import { UpdateModulesMethodDto } from './dto/update-modules-method.dto';
import { ModulesMethodGet } from './entities/modules-method.entity';

@Injectable()
export class ModulesMethodsService {
  constructor(
    @InjectModel(Modules.name) private moduleModel: Model<ModuleDocument>,
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
    @InjectModel(ModuleMethod.name)
    private methodModule: Model<ModuleMethodDocument>,
  ) {}
  async create(req: any, createModulesMethodDto: CreateModulesMethodDto) {
    try {
      const {
        organizationId,
        moduleNameIn,
        moduleNameNotIn,
        method,
        isActive,
      } = await {
        ...createModulesMethodDto,
      };
      const userId = req.user._id;
      const checkOrganization = await this.organizationModel.findOne({
        userId: userId,
        organizationId: organizationId,
      });
      if (!checkOrganization && organizationId) {
        throw new HttpException(
          'Organization not exits',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        const checkGloballyMethodExists = await this.methodModule.findOne({
          method: method,
          isGlobally: true,
        });
        if (checkGloballyMethodExists) {
          throw new HttpException(
            'method already globally exits',
            HttpStatus.BAD_REQUEST,
          );
        }
        const checkMethodExists = await this.methodModule.findOne({
          userId: userId,
          method: method,
          organizationId: organizationId
            ? checkOrganization._id
            : { $exists: false },
        });
        if (!checkMethodExists) {
          if (moduleNameIn?.length > 0 || moduleNameNotIn?.length > 0) {
            const uniqueMethodNameForIn = [...new Set(moduleNameIn)];
            const uniqueMethodNameForNotIn = [...new Set(moduleNameNotIn)];
            if (
              moduleNameIn?.length == uniqueMethodNameForIn?.length ||
              uniqueMethodNameForNotIn?.length == moduleNameNotIn?.length
            ) {
              var moduleIdsArrayIn = [];
              var moduleIdsArrayNotIn = [];
              await Promise.all(
                uniqueMethodNameForIn.map(async (module) => {
                  const checkModule = await this.moduleModel.findOne({
                    name: module,
                    userId: userId,
                    organizationId: organizationId
                      ? checkOrganization._id
                      : { $exists: false },
                  });
                  if (checkModule) {
                    moduleIdsArrayIn.push(checkModule._id);
                  }
                }),
              );
              await Promise.all(
                uniqueMethodNameForNotIn.map(async (module) => {
                  const checkModule = await this.moduleModel.findOne({
                    name: module,
                    userId: userId,
                    organizationId: organizationId
                      ? checkOrganization._id
                      : { $exists: false },
                  });
                  if (checkModule) {
                    moduleIdsArrayNotIn.push(checkModule._id);
                  }
                }),
              );
              if (
                (moduleNameNotIn &&
                  moduleIdsArrayNotIn?.length ==
                    uniqueMethodNameForNotIn?.length) ||
                (moduleNameIn &&
                  moduleIdsArrayIn?.length == uniqueMethodNameForIn?.length)
              ) {
                let insertJson: any = {
                  moduleIdsIn: moduleIdsArrayIn,
                  moduleIdsNotIn: moduleIdsArrayNotIn,
                  userId: userId,
                  method: method,
                  isActive: isActive,
                };

                if (checkOrganization?._id) {
                  insertJson.organizationId = checkOrganization._id;
                } else {
                  insertJson.isGlobally = true;
                }

                await this.methodModule.create(insertJson);
                return { status: 'done' };
              } else {
                throw new HttpException(
                  'Some module are not exists',
                  HttpStatus.BAD_REQUEST,
                );
              }
            } else {
              throw new HttpException(
                'Some module are duplicates',
                HttpStatus.BAD_REQUEST,
              );
            }
          } else {
            let insertJson: any = {
              userId: userId,
              method: method,
              isActive: isActive,
            };
            if (organizationId) {
              insertJson.organizationId = checkOrganization._id;
            } else {
              insertJson.isGlobally = true;
            }
            await this.methodModule.create(insertJson);
            return { status: 'done' };
          }
        } else {
          return { message: 'Already exists!!' };
        }
      }
    } catch (error) {
      console.log('error: ', error);
      return error;
    }
  }

  async findAll(req: any, query: ModulesMethodGet) {
    const { skip, limit, organizationId, moduleName, methodName, isGlobally } =
      await {
        ...query,
      };
    const aggregation_option = [];

    aggregation_option.push({
      $match: {
        userId: new mongoose.Types.ObjectId(req.user._id),
      },
    });

    // if (organizationId) {
    //   aggregation_option.push({
    //     $match: {
    //       organizationId: organizationId,
    //     },
    //   });
    // }

    aggregation_option.push({
      $lookup: {
        from: 'organizations',
        localField: 'organizationId',
        foreignField: '_id',
        as: 'organizationDetail',
      },
    });
    if (organizationId && !isGlobally?.toString()) {
      aggregation_option.push({
        $match: {
          'organizationDetail.organizationId': organizationId,
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
    if (isGlobally?.toString() && organizationId) {
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
      $lookup: {
        from: 'modules',
        let: { id: '$moduleIdsIn' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $in: ['$_id', { $ifNull: ['$$id', []] }] }],
              },
            },
          },
        ],
        as: 'moduleDetailIn',
      },
    });

    aggregation_option.push({
      $lookup: {
        from: 'modules',
        let: { id: '$moduleIdsNotIn' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $in: ['$_id', { $ifNull: ['$$id', []] }] }],
              },
            },
          },
        ],
        as: 'moduleDetailNotIn',
      },
    });

    if (moduleName) {
      aggregation_option.push({
        $match: {
          'moduleDetailIn.name': { $regex: moduleName, $options: 'i' },
        },
      });

      aggregation_option.push({
        $match: {
          'moduleDetailNotIn.name': { $regex: moduleName, $options: 'i' },
        },
      });
    }

    // aggregation_option.push({
    //   $unwind: {
    //     path: '$moduleDetail',
    //     preserveNullAndEmptyArrays: false,
    //   },
    // });

    if (methodName) {
      aggregation_option.push({
        $match: {
          method: methodName,
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

    const data = await this.methodModule.aggregate(aggregation_option);
    return { data: data };
  }

  findOne(id: number) {
    return `This action returns a #${id} modulesMethod`;
  }

  async update(
    req: any,
    id: mongoose.Types.ObjectId,
    updateModulesMethodDto: UpdateModulesMethodDto,
  ) {
    const { organizationId, moduleNameIn, moduleNameNotIn, method, isActive } =
      await {
        ...updateModulesMethodDto,
      };
    const userId = req.user._id;
    const check = await this.methodModule.findOne({
      _id: id,
      userId: req.user._id,
    });
    if (check) {
      const checkWithMethodName = await this.methodModule.findOne({
        _id: { $ne: id },
        userId: req.user._id,
        organizationId: check.organizationId
          ? check.organizationId
          : { $exists: false },
        method: method,
      });
      if (!checkWithMethodName) {
        if (moduleNameIn?.length > 0 || moduleNameNotIn?.length > 0) {
          const uniqueMethodNameForIn = [...new Set(moduleNameIn)];
          const uniqueMethodNameForNotIn = [...new Set(moduleNameNotIn)];
          if (
            moduleNameIn?.length == uniqueMethodNameForIn?.length ||
            uniqueMethodNameForNotIn?.length == moduleNameNotIn?.length
          ) {
            var moduleIdsArrayIn = [];
            var moduleIdsArrayNotIn = [];
            await Promise.all(
              uniqueMethodNameForIn.map(async (module) => {
                const checkModule = await this.moduleModel.findOne({
                  name: module,
                  userId: req.user._id,
                  organizationId: organizationId
                    ? check._id
                    : { $exists: false },
                });
                if (checkModule) {
                  moduleIdsArrayIn.push(checkModule._id);
                }
              }),
            );
            await Promise.all(
              uniqueMethodNameForNotIn.map(async (module) => {
                const checkModule = await this.moduleModel.findOne({
                  name: module,
                  userId: req.user._id,
                  organizationId: organizationId
                    ? check._id
                    : { $exists: false },
                });
                if (checkModule) {
                  moduleIdsArrayNotIn.push(checkModule._id);
                }
              }),
            );
            if (
              (moduleNameNotIn &&
                moduleIdsArrayNotIn?.length ==
                  uniqueMethodNameForNotIn?.length) ||
              (moduleNameIn &&
                moduleIdsArrayIn?.length == uniqueMethodNameForIn?.length)
            ) {
              let updateJson = {
                moduleIdsIn: moduleIdsArrayIn,
                moduleIdsNotIn: moduleIdsArrayNotIn,
                method: method,
                isActive: check.isActive,
              };
              if (isActive?.toString()) {
                updateJson.isActive = isActive;
              }
              const checkUpdate = await this.methodModule.findByIdAndUpdate(
                {
                  _id: id,
                  userId: userId,
                },
                { $set: updateJson },
              );
              return { status: 'done' };
            } else {
              throw new HttpException(
                'Some module are not exists',
                HttpStatus.BAD_REQUEST,
              );
            }
          } else {
            throw new HttpException(
              'Some module are duplicates',
              HttpStatus.BAD_REQUEST,
            );
          }
        } else {
          let updateJson = {
            moduleIdsIn: undefined,
            moduleIdsNotIn: undefined,
            method: method,
            isActive: check.isActive,
          };
          if (isActive?.toString()) {
            updateJson.isActive = isActive;
          }
          const checkUpdate = await this.methodModule.findByIdAndUpdate(
            {
              _id: id,
              userId: userId,
            },
            { $set: updateJson },
          );
          return { status: 'done' };
        }
      } else {
        return { message: 'Already exists!!' };
      }
    } else {
      throw new NotFoundException('data not found');
    }
  }

  async remove(req: any, id: any) {
    const data = await this.methodModule.findByIdAndRemove({
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
      method: query.name,
      userId: req.user._id,
    };

    if (query.organizationId) {
      const checkOrganization = await this.organizationModel.findOne({
        userId: req.user._id,
        organizationId: query.organizationId,
      });
      if (checkOrganization) {
        queryJson.organizationId = checkOrganization._id;
      } else {
        throw new NotFoundException('Organization not found');
      }
    }
    const data = await this.methodModule.findOneAndRemove(queryJson);
    if (!data) {
      throw new NotFoundException('Data not found');
    } else {
      return { status: 'done' };
    }
    // } else {
    //           throw new NotFoundException('Organization not found');
    // }
  }
}
