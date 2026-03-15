import path from "path";
import fs from "fs";

// === Налаштування ===
const BASE_URL = "http://localhost:3000";
const LOGIN_EMAIL = "test@gmail.com";
const LOGIN_PASSWORD = "qwerty123";

async function getToken() {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: LOGIN_EMAIL, password: LOGIN_PASSWORD }),
  });

  const data = await res.json();

  if (res.headers.get("set-cookie")) {
    const cookie = res.headers.get("set-cookie")!;
    return cookie.split(";")[0].split("=")[1];
  }

  if (data.token) return data.token;

  throw new Error("Не вдалося отримати токен");
}

async function run() {
  const token = await getToken();
  console.log("Token:", token);

  const headers = {
    "Content-Type": "application/json",
    Cookie: `token=${token}`,
  };


    const userId = 2; // тестовий користувач

  // =========================
  // SEARCH USERS
  // =========================
  const userSearchRes = await fetch(
    `${BASE_URL}/api/users/search?page=1&limit=10&email=walid`
  );

  const userSearchData = (await parseJSONSafe(userSearchRes)) || {};
  const userResults = Array.isArray(userSearchData.data)
    ? userSearchData.data
    : [];

  console.log("USER SEARCH:", userResults.length);
  console.log("TOTAL users:", userSearchData.total ?? 0);
  console.log(
    "User IDs:",
    userResults.map((u: any) => u.id)
  );

  console.log(
    "User names:",
    userResults.map((u: any) => u.name)
  );

  // =========================
  // UPDATE USER NAME
  // =========================
  const updateUserRes = await fetch(`${BASE_URL}/api/users/${userId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      name: "Updated User " + Date.now(),
    }),
  });

  const updatedUser = await parseJSONSafe(updateUserRes);

  console.log("USER UPDATE:", updatedUser);

  // =========================
  // CHANGE USER ROLE
  // =========================
  const roleRes = await fetch(`${BASE_URL}/api/users/${userId}/role`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      role: "EDITOR",
    }),
  });

  const updatedRole = await parseJSONSafe(roleRes);

  console.log("ROLE UPDATE:", updatedRole);


  // =========================
  // CREATE CATEGORY
  // =========================
  const categoryRes = await fetch(`${BASE_URL}/api/categories`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: "Test Category " + Date.now(),
    }),
  });

  const category = await categoryRes.json();
  console.log("CATEGORY:", category);

  const categoryId = category.id;

  // =========================
  // CREATE SUBCATEGORY
  // =========================
  const subcategoryRes = await fetch(`${BASE_URL}/api/subcategories`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: "Test Subcategory " + Date.now(),
      categoryId, // підключаємо до категорії
    }),
  });

  const subcategory = await subcategoryRes.json();
  console.log("SUBCATEGORY:", subcategory);

  const subcategoryId = subcategory.id;

  // =========================
  // CREATE ARTICLE
  // =========================
  const createRes = await fetch(`${BASE_URL}/api/articles`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      title: "Тестова стаття " + Date.now(),
      lang: "EN",
      body: { blocks: [] },
      authorName: "Admin",
      categoryId,
      subcategoryIds: [subcategoryId], // підключаємо до статті
      tags: [{ name: "test-tag" + Date.now() }],
    }),
  });

  const article = await createRes.json();
  console.log("CREATE ARTICLE:", article);

  const articleId = article.id;


  // =========================
  // CREATE NEW CATEGORY FOR UPDATE TEST
  // =========================
  const newCategoryRes = await fetch(`${BASE_URL}/api/categories`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: "Update Category " + Date.now(),
    }),
  });

  const newCategory = await newCategoryRes.json();
  const newCategoryId = newCategory.id;

  console.log("NEW CATEGORY:", newCategory);

  // =========================
  // CREATE NEW SUBCATEGORY FOR UPDATE TEST
  // =========================
  const newSubcategoryRes = await fetch(`${BASE_URL}/api/subcategories`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: "Update Subcategory " + Date.now(),
      categoryId: newCategoryId,
    }),
  });

  const newSubcategory = await newSubcategoryRes.json();
  const newSubcategoryId = newSubcategory.id;

  console.log("NEW SUBCATEGORY:", newSubcategory);

  // =========================
  // UPDATE ARTICLE (CATEGORY + SUBCATEGORY + TAGS)
  // =========================
  const updateArticleRes = await fetch(`${BASE_URL}/api/articles/${articleId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      title: "Updated Article " + Date.now(),
      categoryId: newCategoryId,
      subcategoryIds: [newSubcategoryId],
      tags: [
        { name: "updated-tag-" + Date.now() },
        { name: "second-tag-" + Date.now() },
      ],
    }),
  });

  const updatedArticle = await parseJSONSafe(updateArticleRes);

  console.log("ARTICLE UPDATE FULL:", updatedArticle);
  console.log("UPDATED CATEGORY:", updatedArticle?.category?.id);
  console.log(
    "UPDATED SUBCATEGORIES:",
    updatedArticle?.subcategories?.map((s: any) => s.id)
  );
  console.log(
    "UPDATED TAGS:",
    updatedArticle?.tags?.map((t: any) => t.name)
  );

  // =========================
// GET ARTICLE BY SLUG
// =========================
const articleSlug = article.slug;

const getBySlugRes = await fetch(
  `${BASE_URL}/api/articles/by-slug/${articleSlug}`
);

const articleBySlug = await parseJSONSafe(getBySlugRes);

console.log("FULL RESPONSE JSON:", JSON.stringify(articleBySlug, null, 2));
console.log("GET ARTICLE BY SLUG:", articleBySlug?.slug);
console.log("TITLE:", articleBySlug?.title);
console.log("ID:", articleBySlug?.id);

  // =========================
  // PATCH ARTICLE
  // =========================
  const patchRes = await fetch(`${BASE_URL}/api/articles/${articleId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      title: "Bobr " + Date.now(),
    }),
  });

  const updated = await patchRes.json();
  console.log("PATCH:", updated.title);

  // =========================
  // PUBLISH ARTICLE
  // =========================
  // const publishRes = await fetch(`${BASE_URL}/api/articles/publish`, {
  //   method: "POST",
  //   headers,
  //   body: JSON.stringify({ id: articleId }),
  // });

  // const published = await publishRes.json();
  // console.log("PUBLISH:", published.message || published);

// =========================
// SEARCH ARTICLES (filter by title)
// =========================
const searchRes = await fetch(
  `${BASE_URL}/api/articles/search?page=1&limit=15&sortBy=createdAt&order=desc&published=true`,
);
const searchData = (await parseJSONSafe(searchRes)) || {};
const searchResults = Array.isArray(searchData.data) ? searchData.data : [];

console.log("FULL RESPONSE JSON:", JSON.stringify(searchData, null, 2));
console.log("SEARCH:", searchResults.length, "articles found");
console.log("TOTAL found:", searchData.total ?? 0);
console.log("Current page:", searchData.page ?? 1, "/", searchData.pages ?? 1);

// Додатково лог id та title
console.log(
  "Found IDs:",
  searchResults.map((a: any) => a.id)
);
console.log(
  "Found Titles:",
  searchResults.map((a: any) => a.title)
);

// =========================
// SEARCH CATEGORIES
// =========================
const catSearchRes = await fetch(
  `${BASE_URL}/api/categories/search?name=Test&page=1&limit=7`
);

const catSearchData = (await parseJSONSafe(catSearchRes)) || {};
const catResults = Array.isArray(catSearchData.data) ? catSearchData.data : [];

console.log("CATEGORY SEARCH:", catResults.length);
console.log("TOTAL categories:", catSearchData.total ?? 0);
console.log("Current page:", catSearchData.page ?? 1, "/", catSearchData.pages ?? 1);

console.log(
  "Category IDs:",
  catResults.map((c: any) => c.id)
);

console.log(
  "Category names:",
  catResults.map((c: any) => c.name)
);

// =========================
// SEARCH SUBCATEGORIES
// =========================
const subSearchRes = await fetch(
  `${BASE_URL}/api/subcategories/search?name=Test&page=2&limit=6`
);

const subSearchData = (await parseJSONSafe(subSearchRes)) || {};
const subResults = Array.isArray(subSearchData.data) ? subSearchData.data : [];

console.log("SUBCATEGORY SEARCH:", subResults.length);
console.log("TOTAL subcategories:", subSearchData.total ?? 0);
console.log("Current page:", subSearchData.page ?? 1, "/", subSearchData.pages ?? 1);
console.log(
  "Subcategory IDs:",
  subResults.map((s: any) => s.id)
);

console.log(
  "Subcategory names:",
  subResults.map((s: any) => s.name)
);

// =========================
// SEARCH SUBCATEGORIES BY CATEGORY
// =========================
const subCatSearchRes = await fetch(
  `${BASE_URL}/api/subcategories/search?categoryId=${categoryId}&page=1&limit=10`
);

const subCatSearchData = (await parseJSONSafe(subCatSearchRes)) || {};
const subCatResults = Array.isArray(subCatSearchData.data)
  ? subCatSearchData.data
  : [];

console.log("SUBCATEGORY BY CATEGORY:", subCatResults.length);
console.log("Current page:", subCatSearchData.page ?? 1, "/", subCatSearchData.pages ?? 1);
console.log(
  "Subcategory IDs:",
  subCatResults.map((s: any) => s.id)
);

// =========================
// SEARCH TAGS
// =========================
const tagSearchRes = await fetch(
  `${BASE_URL}/api/tags/search?name=test&page=2&limit=5`
);

const tagSearchData = (await parseJSONSafe(tagSearchRes)) || {};
const tagResults = Array.isArray(tagSearchData.data) ? tagSearchData.data : [];

console.log("TAG SEARCH:", tagResults.length);
console.log("TOTAL tags:", tagSearchData.total ?? 0);
console.log("Current page:", tagSearchData.page ?? 1, "/", tagSearchData.pages ?? 1);
console.log(
  "Tag IDs:",
  tagResults.map((t: any) => t.id)
);

console.log(
  "Tag names:",
  tagResults.map((t: any) => t.name)
);



// =========================
// MEDIA UPLOAD
// =========================
const imagePath = path.join(process.cwd(), "test-images.jpeg"); // поклади файл поруч з тестом
const imageBuffer = fs.readFileSync(imagePath);

const formData = new FormData();
formData.append(
  "file",
  new Blob([imageBuffer], { type: "image/jpeg" }),
  "test-image.jpg"
);

const uploadRes = await fetch(`${BASE_URL}/api/media`, {
  method: "POST",
  headers: {
    Cookie: `token=${token}`,
  },
  body: formData,
});

const uploadedMedia = await uploadRes.json();

console.log("MEDIA UPLOAD:", uploadedMedia);

const mediaId = uploadedMedia.id;

// =========================
// MEDIA LIST
// =========================
const mediaListRes = await fetch(`${BASE_URL}/api/media`);
const mediaList = await mediaListRes.json();

console.log("MEDIA COUNT:", mediaList.length);

console.log(
  "MEDIA IDS:",
  mediaList.map((m: any) => m.id)
);


// =========================
// CREATE STUDIO PROJECT (без parentId)
// =========================
const createProjectRes = await fetch(`${BASE_URL}/api/studioprojects`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    title: "Тестовий проект " + Date.now(),
    body: { blocks: [] },
    description: "Опис проекту",
    categoryId,
    subcategoryId,
    imageId: mediaId,
  }),
});

const project = await createProjectRes.json();
console.log("CREATE STUDIO PROJECT:", project);

const projectId = project.id;

// =========================
// CREATE CHILD STUDIO PROJECT (з parentId)
// =========================
const createChildRes = await fetch(`${BASE_URL}/api/studioprojects`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    title: "Дочірній проект " + Date.now(),
    body: { blocks: [] },
    description: "Опис дочірнього проекту",
    categoryId,
    subcategoryId,
    parentId: projectId, // підключаємо до батька
    imageId: mediaId,
  }),
});

const childProject = await createChildRes.json();
console.log("CREATE CHILD STUDIO PROJECT:", childProject);
const childProjectId = childProject.id;

// =========================
// UPDATE STUDIO PROJECT
// =========================
const updateProjectRes = await fetch(`${BASE_URL}/api/studioprojects/${projectId}`, {
  method: "PATCH",
  headers,
  body: JSON.stringify({
    title: "Updated Studio Project " + Date.now(),
    description: "Оновлений опис",
  }),
});

const updatedProject = await parseJSONSafe(updateProjectRes);
console.log("UPDATED STUDIO PROJECT:", updatedProject.title);

// =========================
// PUBLISH PROJECT
// =========================
const publishRes = await fetch(`${BASE_URL}/api/studioprojects/publish`, {
  method: "POST",
  headers,
  body: JSON.stringify({ id: projectId }),
});

const publishedProject = await publishRes.json();
console.log("PUBLISH STUDIO PROJECT:", publishedProject.message || "Published");

// =========================
// PUBLISH CHILD PROJECT
// =========================
const publishChildRes = await fetch(`${BASE_URL}/api/studioprojects/publish`, {
  method: "POST",
  headers,
  body: JSON.stringify({ id: childProjectId }),
});

const publishedChild = await publishChildRes.json();
console.log("PUBLISH CHILD PROJECT:", publishedChild.message || "Published");

// =========================
// 1️⃣ CREATE LOCATION без проекту
// =========================
const createLocationRes1 = await fetch(`${BASE_URL}/api/locations`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Cookie: `token=${token}`,
  },
  body: JSON.stringify({
    name: "Локація без проекту " + Date.now(),
    url: "https://example.com/location1-" + Date.now(),
    coordinates: { lat: 50.4501, lng: 30.5234 },
    description: "Просто тестова локація",
  }),
});

const location1 = await parseJSONSafe(createLocationRes1);
console.log("CREATE LOCATION без проекту:", location1);

// =========================
// 2️⃣ CREATE LOCATION і підключення до існуючого проекту
// =========================
const createLocationRes2 = await fetch(`${BASE_URL}/api/locations`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Cookie: `token=${token}`,
  },
  body: JSON.stringify({
    name: "Локація з існуючим проектом " + Date.now(),
    url: "https://example.com/location2-" + Date.now(),
    coordinates: { lat: 51.0, lng: 31.0 },
    description: "Локація прив’язана до існуючого проекту",
    projectId: projectId, // connect до створеного проекту
  }),
});

const location2 = await parseJSONSafe(createLocationRes2);
console.log("CREATE LOCATION + connect до проекту:", location2);

// =========================
// 3️⃣ CREATE LOCATION і новий проект в одному запиті
// =========================
const createLocationRes3 = await fetch(`${BASE_URL}/api/locations`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Cookie: `token=${token}`,
  },
  body: JSON.stringify({
    name: "Локація з новим проектом " + Date.now(),
    url: "https://example.com/location3-" + Date.now(),
    coordinates: { lat: 49.0, lng: 30.5 },
    description: "Локація + новий проект в одному запиті",
    project: {
      create: {
        title: "Новый проект для локації " + Date.now(),
        body: { blocks: [] },
        description: "Проект створений разом з локацією",
        categoryId,
        subcategoryId,
        imageId: mediaId,
      },
    },
  }),
});

const location3 = await parseJSONSafe(createLocationRes3);
console.log("CREATE LOCATION + новий проект:", location3);

// =========================
// SEARCH STUDIO PROJECTS
// =========================
const searchProjectRes = await fetch(
  `${BASE_URL}/api/studioprojects/search?page=1&limit=2&sortBy=createdAt&order=desc&published=true`
);

type StudioProject = {
  id: number;
  parentId: number | null;
  title: string;
  category?: { id: number; name: string; slug: string };
  subcategory?: { id: number; name: string; slug: string };
  location?: { id: number; name: string };
  author?: { id: number; name: string };
  image?: { id: number; url: string };
};

const searchProjectData = (await parseJSONSafe(searchProjectRes)) || {};
const searchProjects: StudioProject[] = Array.isArray(searchProjectData.data)
  ? searchProjectData.data
  : [];
console.log("FULL RESPONSE JSON:", JSON.stringify(searchProjectData, null, 2));
console.log("SEARCH STUDIO PROJECTS:", searchProjects.length);
console.log("TOTAL found:", searchProjectData.total ?? 0);
console.log("Found IDs:", searchProjects.map(p => p.id));
console.log("Found Titles:", searchProjects.map(p => p.title));
console.log("Parent IDs:", searchProjects.map(p => p.parentId));

console.log("Category slugs:", searchProjects.map(p => p.category?.slug));
console.log("Subcategory slugs:", searchProjects.map(p => p.subcategory?.slug));
console.log("Location names:", searchProjects.map(p => p.location?.name));
console.log("Authors:", searchProjects.map(p => p.author?.name));


// =========================
// SEARCH LOCATIONS
// =========================
const searchLocationRes = await fetch(
  `${BASE_URL}/api/locations/search?page=1&limit=10&sortBy=createdAt&order=desc&studioProject[published]=true`
);

type Location = {
  id: number;
  name: string;
  url?: string;
  coordinates?: any;
  description?: string;
  publishedAt?: string;
  project?: {
    id: number;
    title: string;
    parentId?: number | null;
    category?: { id: number; name: string; slug: string };
    subcategory?: { id: number; name: string; slug: string };
    author?: { id: number; name: string };
    image?: { id: number; url: string };
  };
};

const searchLocationData = (await parseJSONSafe(searchLocationRes)) || {};
const searchLocations: Location[] = Array.isArray(searchLocationData.data)
  ? searchLocationData.data
  : [];

console.log("FULL LOCATION RESPONSE JSON:", JSON.stringify(searchLocationData, null, 2));

console.log("SEARCH LOCATIONS:", searchLocations.length);
console.log("TOTAL found:", searchLocationData.total ?? 0);
console.log("Found IDs:", searchLocations.map(l => l.id));
console.log("Found Names:", searchLocations.map(l => l.name));
console.log("URLs:", searchLocations.map(l => l.url));
console.log("Published At:", searchLocations.map(l => l.publishedAt));

// =========================
// MEDIA DELETE
// =========================
// const deleteMediaRes = await fetch(`${BASE_URL}/api/media/${mediaId}`, {
//   method: "DELETE",
//   headers,
// });

// const deletedMedia = await deleteMediaRes.json();

// console.log("MEDIA DELETE:", deletedMedia);

  console.log("✅ Тести завершені");
}

run().catch(console.error);

async function parseJSONSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return [];
  }
}