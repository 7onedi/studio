import { userRepository } from "../repositories/user.repository";
import { hashPassword, comparePassword } from "../utils/hash";
import { signToken } from "../utils/jwt";
import { verifyToken } from "../utils/jwt";
import { ApiError } from "../utils/api-error";

export const authService = {

  async register(name: string, email: string, password: string) {

    const existing = await userRepository.findByEmail(email);

      if (existing)
        throw new ApiError(
          400,
          "Email already exists",
          {
            email: [
              "Email already exists"
            ]
          }
        );

    const hashed = await hashPassword(password);

    const user = await userRepository.create({
      name,
      email,
      password: hashed,
    });

    const token = signToken({
      userId: user.id,
      role: user.role,
    });

    return { user, token };
  },


  async login(email: string, password: string) {
    // console.log("Login attempt with:", email, password);
    const user = await userRepository.findByEmail(email);
      if (!user)
        throw new ApiError(
          400,
          "Invalid credentials"
        );

    const valid = await comparePassword( password, user.passwordHash);
    // console.log("Password valid?", valid);
      if (!valid)
        throw new ApiError(
          400,
          "Invalid credentials"
        );

    const token = signToken({
      id: user.id,
      role: user.role,
    });
    // console.log("Login successful, token generated", token);
    return { user, token };
  },

  async logout() {
    return { success: true };
  },

    async getCurrentUser(token: string) {

    if (!token)
      throw new Error("Unauthorized");

    const payload = verifyToken(token);

    const user =
      await userRepository.findById(
        payload.id
      );

    if (!user)
      throw new Error("User not found");

    return user;
  },
};