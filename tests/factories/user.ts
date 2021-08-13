import Chance from 'chance';
import { Role, Prisma } from '@prisma/client';

import { buildPrismaIncludeFromAttrs, prisma } from '../helpers';

const chance = new Chance();

export const UserFactory = {
  build: (attrs: Partial<Prisma.UserCreateInput> = {}) => {
    return {
      email: chance.email(),
      roles: { set: [Role.USER] },
      ...attrs,
    };
  },

  create: async (attrs: Partial<Prisma.UserCreateInput> = {}) => {
    const user = UserFactory.build(attrs);
    const options: Record<string, any> = {};
    const includes = buildPrismaIncludeFromAttrs(attrs);
    if (includes) options.include = includes;

    return await prisma.user.create({
      data: { ...user, roles: user.roles },
      ...options,
    });
  },
};
