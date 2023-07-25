import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
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
import { Permission, PermissionDocument } from 'src/schemas/permission.schemas';
import { Role, RoleDocument } from 'src/schemas/role.schemas';
import { CreatePermisisonDto } from './dto/create-permisison.dto';
import { UpdatePermisisonDto } from './dto/update-permisison.dto';
import {
  PermisisonGet,
  PermissionCheckGet,
  PermissionDelete,
} from './entities/permisison.entity';

@Injectable()
export class PermisisonService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>,
    @InjectModel(Modules.name) private moduleModel: Model<ModuleDocument>,
    @InjectModel(ModuleMethod.name)
    private methodModule: Model<ModuleMethodDocument>,
  ) {}
  async create(req: any, createPermisisonDto: CreatePermisisonDto) {
    const userId = req.user._id;
    const { organizationId, roleName, name, permissions, moduleName } = await {
      ...createPermisisonDto,
    };
    console.log(
      organizationId,"organizationId",
       roleName,"roleName",
        name,"name", 
        permissions, "permissions",
         moduleName,"moduleName"
         )
    const checkOrganization = await this.organizationModel.findOne({
      organizationId: organizationId,
      userId: userId,
    });
    console.log(checkOrganization , "checkOrG")
    if (!checkOrganization && organizationId) {
      throw new HttpException('Organization not exits', HttpStatus.BAD_REQUEST);
    } else {
      const roleCheck = await this.roleModel.findOne({
        userId: userId,
        name: roleName,
        organizationId: checkOrganization._id,
      });
      if (!roleCheck && organizationId) {
        throw new HttpException('Role not exists', HttpStatus.BAD_REQUEST);
      } else {
        var permissionCheckObject: any = {};
        permissionCheckObject.roleId = roleCheck._id;
        if (moduleName) {
          permissionCheckObject.moduleName = moduleName;
        }
        console.log(permissionCheckObject,"permissionCheckObject")
        const checkPermissionExists = await this.permissionModel.findOne(
          permissionCheckObject,
        );
        console.log(checkPermissionExists,"checkPermissionExists")
        if (!checkPermissionExists) {
          if (moduleName) {
            const checkModuleExists = await this.moduleModel.findOne({
              name: moduleName,
              userId: userId,
              $or: [
                { $eq: [organizationId, checkOrganization._id] },
                { $exists: [organizationId, true] },
              ],
              // organizationId: {
              //   $or: [{ $eq: checkOrganization._id }, { $exists: false }],
              // },
            });
            console.log(checkModuleExists,"checkModuleExists")
            if (checkModuleExists) {
              var getMethods = await this.methodModule.find({
                $and: [
                  {
                    $or: [
                      { moduleIdsIn: { $in: checkModuleExists._id } },
                      { moduleIdsNotIn: { $nin: checkModuleExists._id } },
                      {
                        $and: [
                          { 'moduleIdsIn.1': { $exists: false } },
                          { 'moduleIdsNotIn.1': { $exists: false } },
                        ],
                      },
                    ],
                  },
                  {
                    $or: [
                      { $eq: [organizationId, checkOrganization._id] },
                      { $exists: [organizationId, true] },
                    ],
                  },
                ],
                userId: userId,
              });
              console.log(getMethods,"getMethods")
              console.log(getMethods.length, "getMethods.length")
              if (getMethods.length > 0) {
                var methodArray = [];
                await Promise.all(
                  permissions.map(async (permission) => {
                    console.log(permission,"permission")
                    const getFiltered = getMethods.filter((moduleMethod) => {
                      console.log(moduleMethod,"moduleMethod")
                      if (moduleMethod.method == permission.method) {
                        methodArray.push(permission);
                        return;
                      }
                    });
                  }),
                );
                console.log(methodArray,"methodArray")
                const checkPermissionAlreadyExists =
                  await this.permissionModel.findOne({
                    roleId: roleCheck._id,
                    moduleName: moduleName,
                  });
                  console.log(checkPermissionAlreadyExists,"checkPermissionAlreadyExists")
                if (!checkPermissionAlreadyExists) {
                  console.log(methodArray.length == permissions.length,"methodArray.length == permissions.length" )
                  if (methodArray.length == permissions.length) {
                    const insertPermission = {
                      userId: userId,
                      roleId: roleCheck._id,
                      permissions: permissions,
                      moduleName: moduleName,
                    };
                    const data = await this.permissionModel.create(
                      insertPermission,
                    );
                    return { status: 'done' };
                  } else {
                    throw new HttpException(
                      'Module methods not exists',
                      HttpStatus.BAD_REQUEST,
                    );
                  }
                  console.log()
                } else {
                  throw new HttpException(
                    'Permission already exists!!',
                    HttpStatus.BAD_REQUEST,
                  );
                }
              } else {
                throw new HttpException(
                  'Module methods not exists',
                  HttpStatus.BAD_REQUEST,
                );
              }
            } else {
              throw new HttpException(
                'Module not exists',
                HttpStatus.BAD_REQUEST,
              );
            }
          } else {
            const insertPermission = {
              userId: userId,
              roleId: roleCheck._id,
              permissions: permissions,
              name: createPermisisonDto.name,
            };
            const data = await this.permissionModel.create(insertPermission);
            return { status: 'done' };
          }
        } else {
          throw new UnprocessableEntityException(
            'This role permission already exists with this module.Update it or delete it',
          );
        }
      }
    }
  }

  async findAll(req: any, query: PermisisonGet) {
    const { skip, limit, roleId, role, name, organizationId } = await {
      ...query,
    };
    const aggregation_option = [];
    aggregation_option.push({
      $match: {
        userId: new mongoose.Types.ObjectId(req.user._id),
      },
    });

    if (roleId) {
      aggregation_option.push({
        $match: {
          roleId: new mongoose.Types.ObjectId(roleId),
        },
      });
    }

    if (name) {
      aggregation_option.push({
        $match: {
          name: { $regex: name, $options: 'i' },
        },
      });
    }

    aggregation_option.push({
      $lookup: {
        from: 'roles',
        localField: 'roleId',
        foreignField: '_id',
        as: 'roleDetail',
      },
    });

    aggregation_option.push({
      $unwind: {
        path: '$roleDetail',
        preserveNullAndEmptyArrays: false,
      },
    });
    aggregation_option.push({
      $lookup: {
        from: 'organizations',
        localField: 'roleDetail.organizationId',
        foreignField: '_id',
        as: 'organizationDetail',
      },
    });
    if (organizationId) {
      aggregation_option.push({
        $match: {
          'organizationDetail.organizationId': organizationId,
        },
      });
    }

    if (role) {
      aggregation_option.push({
        $match: {
          'roleDetail.name': role,
        },
      });
    }
    aggregation_option.push({
      $project: {
        name: 1,
        permissions: 1,
        'roleDetail.name': 1,
        moduleName: 1,
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

    const data = await this.permissionModel.aggregate(aggregation_option);
    console.log(data)
    return { data: data };
  }

  async checkPermission(req: any, query: PermissionCheckGet) {
    const { roleName, MethodName, organizationId, moduleName } = await {
      ...query,
    };
    const checkOrganization = await this.organizationModel.findOne({
      organizationId: organizationId,
    });
    if (checkOrganization) {
      const checkRole = await this.roleModel.findOne({
        organizationId: checkOrganization._id,
        userId: req.user._id,
        name: roleName,
      });
      if (checkRole) {
        if (moduleName) {
          const checkModule = await this.moduleModel.findOne({
            organizationId: checkOrganization._id,
            userId: req.user._id,
            name: moduleName,
          });
          if (checkModule) {
            if (checkModule.isActive) {
              console.log(
                'checkOrganization._id: ',
                checkOrganization._id,
                req.user._id,
                moduleName,
              );

              const checkMethodPermission = await this.methodModule.findOne({
                organizationId: checkOrganization._id,
                userId: req.user._id,
                method: MethodName,
                isActive: true,
              });
              if (checkMethodPermission) {
                const getPermissionList = await this.permissionModel.find({
                  userId: req.user._id,
                  roleId: checkRole._id,
                  moduleName: moduleName,
                });
                if (getPermissionList.length > 0) {
                  var permissionArray = [];
                  await Promise.all(
                    getPermissionList.map(async (list) => {
                      const stringData = JSON.stringify(list.permissions);
                      const parseStringData = JSON.parse(stringData);
                      permissionArray.push(...parseStringData);
                    }),
                  );
                  const getValue = permissionArray.find(
                    (x) => (x.method = MethodName),
                  );

                  return { ...getValue, status: true };
                } else {
                  throw new NotFoundException('Permission not found');
                }
              } else {
                return { message: 'Method may be disabled or not exists' };
              }
            } else {
              throw new HttpException(
                'Module is not active',
                HttpStatus.BAD_REQUEST,
              );
            }
          } else {
            throw new NotFoundException('Module not found');
          }
        } else {
          const check = await this.permissionModel.findOne({
            userId: req.user._id,
            roleId: checkRole._id,
          });
          console.log('check: ', check);
          if (check) {
            const getPermissionArray = JSON.stringify(check.permissions);
            const getValue = JSON.parse(getPermissionArray).find(
              (x) => (x.method = MethodName),
            );
            return getValue;
          } else {
            throw new NotFoundException('Permission not found');
          }
        }
      } else {
        throw new NotFoundException('Role not found');
      }
    } else {
      throw new NotFoundException('Organization not found');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} permisison`;
  }

  async update(
    req: any,
    id: mongoose.Types.ObjectId,
    updatePermisisonDto: UpdatePermisisonDto,
  ) {
    const { name, permissions } = await {
      ...updatePermisisonDto,
    };
    var check = await this.permissionModel.findById({
      _id: id,
      userId: req.user._id,
    });
    console.log('check: ', check);
    if (check) {
      if (check.moduleName) {
        const getRoleDetail = await this.roleModel.findOne({
          _id: check.roleId,
        });
        const checkModuleExists = await this.moduleModel.findOne({
          name: check.moduleName,
          userId: req.user._id,
          $or: [
            { $eq: ['organizationId', getRoleDetail.organizationId] },
            { $exists: ['organizationId', true] },
          ],
        });
        if (checkModuleExists) {
          var getMethods = await this.methodModule.find({
            $and: [
              {
                $or: [
                  { moduleIdsIn: { $in: checkModuleExists._id } },
                  { moduleIdsNotIn: { $nin: checkModuleExists._id } },
                  {
                    $and: [
                      { 'moduleIdsIn.1': { $exists: false } },
                      { 'moduleIdsNotIn.1': { $exists: false } },
                    ],
                  },
                ],
              },
              {
                $or: [
                  { $eq: ['organizationId', getRoleDetail._id] },
                  { $exists: ['organizationId', true] },
                ],
              },
            ],
            userId: req.user._id,
          });
          if (getMethods.length > 0) {
            var methodArray = [];
            await Promise.all(
              permissions.map(async (permission) => {
                const getFiltered = getMethods.filter((moduleMethod) => {
                  if (moduleMethod.method == permission.method) {
                    methodArray.push(permission);
                    return;
                  }
                });
              }),
            );
            if (methodArray.length == permissions.length) {
              const checkUpdate = await this.permissionModel.findByIdAndUpdate(
                {
                  _id: id,
                },
                {
                  permissions: permissions,
                },
              );
              return { status: 'done' };
            } else {
              throw new HttpException(
                'Module methods not exists',
                HttpStatus.BAD_REQUEST,
              );
            }
          } else {
            throw new HttpException(
              'Module methods not exists',
              HttpStatus.BAD_REQUEST,
            );
          }
        } else {
          throw new NotFoundException('data not found');
        }
      } else {
        const checkUpdate = await this.permissionModel.findByIdAndUpdate(
          {
            _id: id,
          },
          {
            permissions: updatePermisisonDto.permissions,
            name: updatePermisisonDto.name,
          },
        );
        return { status: 'done' };
      }
    } else {
      throw new NotFoundException('data not found');
    }
  }

  async remove(req: any, id: mongoose.Types.ObjectId) {
    const check = await this.permissionModel.findByIdAndRemove({
      _id: id,
      userId: req.user._id,
    });
    if (check) {
      return { status: 'done' };
    } else {
      throw new NotFoundException('data not found');
    }
  }

  async removeByName(req: any, query: PermissionDelete) {
    const checkOrganization = await this.organizationModel.findOne({
      userId: req.user._id,
      organizationId: query.organizationId,
    });
    if (checkOrganization) {
      let getRole = await this.roleModel.findOne({
        name: query.roleName,
        organizationId: checkOrganization._id,
      });

      if (getRole) {
        let queryJson: any = {
          method: query.name,
          userId: req.user._id,
          roleId: getRole._id,
        };
        const data = await this.permissionModel.findOneAndRemove(queryJson);
        if (!data) {
          throw new NotFoundException('Data not found');
        } else {
          return { status: 'done' };
        }
      } else {
        throw new NotFoundException('Data not found');
      }
    } else {
      throw new NotFoundException('Organization not found');
    }
  }
}
