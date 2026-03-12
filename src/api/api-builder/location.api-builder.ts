export const LocationInclude = {
  project: {
    select: {
      id: true,
      title: true,
      parentId: true,
      category: { select: { id: true, name: true, slug: true } },
      subcategory: { select: { id: true, name: true, slug: true } },
      author: { select: { id: true, name: true } },
      image: true,
    },
  },
};