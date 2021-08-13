import {
  objectType,
  inputObjectType,
  queryField,
  mutationField,
  arg,
  nonNull,
  enumType,
  list,
} from 'nexus';
import { Role } from '@prisma/client';
import { UserInputError } from 'apollo-server-micro';

import { canAccess, isAdmin } from '../../services/permissions';

// User Type
export const User = objectType({
  name: 'User',
  description: 'A User',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');
    t.nonNull.list.nonNull.field('roles', { type: 'Role' });

    // Show email as null for unauthorized users
    t.string('email', {
      resolve: (profile, _args, ctx) => (canAccess(profile, ctx) ? profile.email : null),
    });
  },
});

// Queries
export const meQuery = queryField('me', {
  type: 'User',
  description: 'Returns the currently logged in user',
  resolve: (_root, _args, ctx) => ctx.user,
});

export const findUsersQuery = queryField('users', {
  type: list('User'),
  authorize: (_root, _args, ctx) => isAdmin(ctx.user),
  resolve: async (_root, args, ctx) => {
    return await ctx.db.user.findMany({ ...args });
  },
});

export const findUniqueUserQuery = queryField('user', {
  type: 'User',
  args: {
    where: nonNull(arg({ type: 'UserWhereUniqueInput' })),
  },
  resolve: async (_root, args, ctx) => {
    return await ctx.db.user.findUnique({ where: args.where });
  },
});

// Mutations
export const createUserMutation = mutationField('createUser', {
  type: 'User',
  description: 'Create User for an account',
  args: {
    data: nonNull(arg({ type: 'UserCreateInput' })),
  },
  authorize: (_root, _args, ctx) => isAdmin(ctx.user),
  resolve: async (_root, args, ctx) => {
    const { data } = args;
    const existingUser = await ctx.db.user.findUnique({ where: { email: data.email } });

    if (existingUser) {
      throw new UserInputError('Email already exists.', {
        invalidArgs: { email: 'already exists' },
      });
    }

    // force role to user
    const updatedArgs = {
      data: {
        ...data,
      },
    };

    const user = await ctx.db.user.create(updatedArgs);

    return user;
  },
});

// Manually added types that were previously in the prisma plugin
export const UserRole = enumType({
  name: 'Role',
  members: Object.values(Role),
});

export const UserOrderByInput = inputObjectType({
  name: 'UserOrderByInput',
  description: 'Order users by a specific field',
  definition(t) {
    t.field('email', { type: 'SortOrder' });
    t.field('createdAt', { type: 'SortOrder' });
    t.field('updatedAt', { type: 'SortOrder' });
  },
});

export const UserWhereUniqueInput = inputObjectType({
  name: 'UserWhereUniqueInput',
  description: 'Input to find users based on unique fields',
  definition(t) {
    t.id('id');
    t.string('email');
  },
});

export const UserWhereInput = inputObjectType({
  name: 'UserWhereInput',
  description: 'Input to find users based other fields',
  definition(t) {
    t.int('id');
    t.field('email', { type: 'StringFilter' });
  },
});

export const UserCreateInput = inputObjectType({
  name: 'UserCreateInput',
  description: 'Input to Add a new user',
  definition(t) {
    t.nonNull.string('email');
    t.field('roles', {
      type: list('Role'),
    });
  },
});
