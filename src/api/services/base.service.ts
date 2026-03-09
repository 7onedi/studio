import { ApiError } from "@/api/utils/api-error";

type SearchOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
};

export class BaseService {
  protected repository: any;

  constructor(repository: any) {
    this.repository = repository;
  }

  protected assertPolicy(user: any, policy?: (user: any) => boolean) {

    if (!user)
      throw new ApiError(401, "Unauthorized");
    if (policy && !policy(user))
      throw new ApiError(403, "You don't have permission to perform this action");

  }

  findById(id: number) {
    return this.repository.findById(id);
  }

  delete(user: any, id: number, policy?: (user: any) => boolean) {

    this.assertPolicy(user, policy);

    return this.repository.delete(id);
  }

  search(filters: Record<string, any>, options?: SearchOptions) {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 10;
    const sortBy = options?.sortBy ?? "createdAt";
    const order = options?.order ?? "desc";

    return this.repository.search(filters, {
      page,
      limit,
      sortBy,
      order,
    });
  }
}