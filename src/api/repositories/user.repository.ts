import { prisma } from "@/lib/prisma";
import { UserRole } from "generated/prisma/enums";
import { SearchConcern } from "@/api/concerns/search.concern";
import { UserQueryBuilder } from "@/api/builders/user.query.builder";

export const userRepository = {
  ...SearchConcern(prisma.user, UserQueryBuilder),

  async create(data: {
    name: string;
    email: string;
    password: string;
  }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.password,
      },
    });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  },

  update(id: number, data: any) {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  async updateRole(userId: number, role: UserRole) {
    return prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }
};