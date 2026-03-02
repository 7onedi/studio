import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { verifyToken } from "../utils/jwt";
import { da } from "zod/v4/locales";

export const userRepository = {
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
};