export function CrudConcern(model: any) {
  return {
    create(data: any) {
      return model.create({ data });
    },

    update(id: number, data: any) {
      return model.update({
        where: { id },
        data,
      });
    },

    delete(id: number) {
      return model.delete({
        where: { id },
      });
    },

    findById(id: number, params?: any) {
      return model.findUnique({
        where: { id },
        ...params,
      });
    },

    findMany(params?: any) {
      return model.findMany(params);
    },
  };
}