import { validate } from "../utils/validate";
import {
  registerSchema,
  loginSchema,
} from "../schemas/auth.schema";

import { authService } from "../services/auth.service";

export const authController = {

  async register(body: unknown) {

    const data = await validate(
      registerSchema,
      body
    );

    return authService.register(
      data.name,
      data.email,
      data.password
    );
  },


  async login(body: unknown) {

    const data = await validate(
      loginSchema,
      body
    );

    return authService.login(
      data.email,
      data.password
    );
  },

  async logout() {
    return authService.logout();
  },

  async me(token: string) {
    return authService.getCurrentUser(
      token
    );
  },

};