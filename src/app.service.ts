import {
  OutOfOrderEventException,
  UserCreatedEvent,
  UserEventType,
  UserUpdatedEvent,
} from '@indigobit/nubia.common';
import { BadRequestException } from '@indigobit/nubia.common/build/errors/bad-request.exception';
import { Injectable } from '@nestjs/common';
import { DBService, UserWithGamebooks } from './db.service';

@Injectable()
export class AppService {
  constructor(private readonly dBService: DBService) {}

  async userCreatedHandler(
    data: UserCreatedEvent['data'],
  ): Promise<UserWithGamebooks> {
    const { fullName, id, email, version, roles } = data;

    if (!email) {
      throw new Error('Missing Email');
    }
    if (!fullName) {
      throw new Error('Missing Full Name');
    }
    if (!id) {
      throw new Error('Missing Id');
    }

    const user: UserWithGamebooks = {
      id: id,
      email: email,
      fullName: fullName,
      version: version,
      roles: roles,
      library: [],
    };

    this.dBService.users.push({ ...user });

    return user;
  }

  async userUpdatedHandler(
    data: UserUpdatedEvent['data'],
  ): Promise<UserWithGamebooks> {
    const { fullName, id, version, roles } = data;

    if (!id) {
      throw new Error('Missing Id');
    }

    const index = this.dBService.users.findIndex((user) => user.id === id);
    if (index === -1)
      throw new BadRequestException('Bad Id in User Update Request');

    const user = { ...this.dBService.users[index], fullName, roles };
    if (user.version !== version - 1)
      throw new OutOfOrderEventException(
        UserEventType.USER_UPDATED,
        user.version - 1,
        version,
      );
    user.version = version;

    this.dBService.users[index] = { ...user };

    return user;
  }
}
