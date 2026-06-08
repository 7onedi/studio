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
        avatarId: true,
        avatar: {
          select: { url: true }
        },
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
  },

  async updatePassword(id: number, passwordHash: string) {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  },

  async updateAvatar(id: number, avatarId: number | null) {
    return prisma.user.update({
      where: { id },
      data: { avatarId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarId: true,
        avatar: { select: { url: true } },
      },
    });
  },
  
  async transferOwner(fromId: number, toId: number) {
  return prisma.$transaction([
    prisma.user.update({
      where: { id: fromId },
      data: { role: "ADMIN" },
    }),
    prisma.user.update({
      where: { id: toId },
      data: { role: "OWNER" },
    }),
  ]);
},

async findOwner() {
  return prisma.user.findFirst({
    where: { role: "OWNER" },
  });
},
};