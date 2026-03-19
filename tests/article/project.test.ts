import path from "path";
import fs from "fs";
import { SocialPlatform } from "generated/prisma/enums";

const BASE_URL = "http://localhost:3000";
const LOGIN_EMAIL = "test@gmail.com";
const LOGIN_PASSWORD = "111111";
const LOG_FILE = path.join(process.cwd(), "test.log");

function log(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const fullMessage =
    `[${timestamp}] ${message}` +
    (data ? " - " + JSON.stringify(data, null, 2) : "") +
    "\n";
  fs.appendFileSync(LOG_FILE, fullMessage);
  console.log(message, data ?? "");
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

async function request(
  url: string,
  method: string,
  headers: Record<string, string>,
  body?: any
) {
  const res = await fetch(`${BASE_URL}${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();

  if (!text) {
    throw new Error(
      `[${method} ${url}] HTTP ${res.status} | Порожня відповідь від сервера`
    );
  }

  let data: any;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(
      `[${method} ${url}] HTTP ${res.status} | Невалідний JSON: "${text.slice(0, 300)}"`
    );
  }

  if (!res.ok) {
    throw new Error(
      `[${method} ${url}] HTTP ${res.status}: ${JSON.stringify(data)}`
    );
  }

  return data;
}

async function getToken() {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: LOGIN_EMAIL, password: LOGIN_PASSWORD }),
  });

  const data = await res.json();

  if (res.headers.get("set-cookie")) {
    return res.headers.get("set-cookie")!.split(";")[0].split("=")[1];
  }

  if (data.token) return data.token;
  throw new Error("Не вдалося отримати токен");
}

async function run() {
  fs.writeFileSync(LOG_FILE, "");

  try {
    const token = await getToken();
    log("✅ Token received");

    const headers = {
      "Content-Type": "application/json",
      Cookie: `token=${token}`,
    };

    // =========================
    // 0️⃣ CREATE CATEGORY + SUBCATEGORY
    // =========================
    const category = await request("/api/categories", "POST", headers, {
      name: "Test Category " + Date.now(),
    });
    log("✅ Category created", category);

    const subcategory = await request("/api/subcategories", "POST", headers, {
      name: "Test Subcategory " + Date.now(),
      categoryId: category.id,
    });
    log("✅ Subcategory created", subcategory);

    // =========================
    // 1️⃣ CREATE PARENT PROJECT
    // =========================
    const parentProject = await request("/api/studioprojects", "POST", headers, {
      title: "Батьківський проект " + Date.now(),
      body: { blocks: [] },
      description: "Опис батьківського проекту",
      categoryId: category.id,
      subcategoryId: subcategory.id,
    });
    log("✅ Parent project created", parentProject);
    assert(!!parentProject.id, "Parent project має мати id");

    // =========================
    // 2️⃣ CREATE CHILD PROJECT з socialLinks + locationData
    // =========================
    const childProject = await request("/api/studioprojects", "POST", headers, {
      title: "Дочірній проект " + Date.now(),
      body: { blocks: [] },
      description: "Проект з socialLinks і location",
      categoryId: category.id,
      subcategoryId: subcategory.id,
      parentId: parentProject.id,
      socialLinks: [
        { platform: SocialPlatform.FACEBOOK, url: "https://facebook.com/test" },
        { platform: SocialPlatform.INSTAGRAM, url: "https://instagram.com/test" },
      ],
      locationData: {
        name: "Тестова локація " + Date.now(),
        url: "https://example.com/location-" + Date.now(),
        coordinates: { lat: 50.45, lng: 30.523 },
        description: "Тестова локація",
      },
    });
    log("✅ Child project created", childProject);

    assert(childProject.parent?.id === parentProject.id, "parent має бути прив'язаний");
    assert(!!childProject.location?.name,                "location має бути створена");
    assert(childProject.socialLinks?.length === 2,       "має бути 2 socialLinks після create");
    assert(
      childProject.socialLinks.some((l: any) => l.social.platform === SocialPlatform.FACEBOOK),
      "має містити FACEBOOK"
    );
    assert(
      childProject.socialLinks.some((l: any) => l.social.platform === SocialPlatform.INSTAGRAM),
      "має містити INSTAGRAM"
    );

    // =========================
    // 3️⃣ UPDATE — замінити socialLinks + оновити location
    // =========================
    const updatedProject = await request(
      `/api/studioprojects/${childProject.id}`,
      "PATCH",
      headers,
      {
        socialLinks: [
          { platform: SocialPlatform.TIKTOK, url: "https://tiktok.com/test" },
          { platform: SocialPlatform.TWITTER, url: "https://twitter.com/test" },
        ],
        locationData: {
          name: "Оновлена локація " + Date.now(),
          url: "https://example.com/updated-" + Date.now(),
          description: "Оновлений опис",
        },
      }
    );
    log("✅ Child project updated (new socials + updated location)", updatedProject);

    assert(updatedProject.socialLinks?.length === 2, "має бути 2 socialLinks після update");
    assert(
      updatedProject.socialLinks.some((l: any) => l.social.platform === SocialPlatform.TIKTOK),
      "має містити TIKTOK після update"
    );
    assert(
      updatedProject.socialLinks.some((l: any) => l.social.platform === SocialPlatform.TWITTER),
      "має містити TWITTER після update"
    );
    assert(
      !updatedProject.socialLinks.some((l: any) => l.social.platform === SocialPlatform.FACEBOOK),
      "FACEBOOK має бути видалений після update"
    );
    assert(
      updatedProject.location?.description === "Оновлений опис",
      "location має бути оновлена"
    );

    // =========================
    // 4️⃣ SEARCH
    // =========================

    // 4a. findById — перевіряємо include незалежно від розміру БД
    const foundById = await request(
      `/api/studioprojects/${childProject.id}`,
      "GET",
      headers
    );
    log("✅ FindById", foundById);

    assert(foundById.socialLinks?.length === 2,       "findById має повертати socialLinks");
    assert(!!foundById.location?.name,                "findById має повертати location");
    assert(foundById.parent?.id === parentProject.id, "findById має повертати parent");
    assert(foundById.category?.id === category.id,    "findById має повертати category");

    // 4b. Базовий пошук — структура відповіді
    const searchAll = await request(
      `/api/studioprojects/search?page=1&limit=20`,
      "GET",
      headers
    );
    log("✅ Search all", { total: searchAll.total, count: searchAll.data?.length });

    assert(Array.isArray(searchAll.data),       "search має повертати data масив");
    assert(typeof searchAll.total === "number", "search має повертати total");
    assert(typeof searchAll.pages === "number", "search має повертати pages");
    assert(searchAll.data.length <= 20,         "search має повертати не більше limit записів");

    // 4c. Фільтр по categoryId
    const searchByCategory = await request(
      `/api/studioprojects/search?categoryId=${category.id}&page=1&limit=10`,
      "GET",
      headers
    );
    log("✅ Search by categoryId", {
      total: searchByCategory.total,
      count: searchByCategory.data?.length,
    });

    assert(searchByCategory.total >= 2, "має знайти мінімум 2 проєкти (parent + child)");
    assert(
      searchByCategory.data.every((p: any) => p.category?.id === category.id),
      "всі результати мають належати до тестової категорії"
    );

    // 4d. Фільтр по parentId
    const searchByParent = await request(
      `/api/studioprojects/search?parentId=${parentProject.id}&page=1&limit=10`,
      "GET",
      headers
    );
    log("✅ Search by parentId", { count: searchByParent.data?.length });

    assert(searchByParent.total >= 1, "має знайти мінімум 1 дочірній проєкт");
    assert(
      searchByParent.data.every((p: any) => p.parent?.id === parentProject.id),
      "всі результати мають мати правильний parentId"
    );
    assert(
      searchByParent.data.some((p: any) => p.id === childProject.id),
      "дочірній проєкт має бути у фільтрі по parentId"
    );

    // 4e. Фільтр published=false
    const searchUnpublished = await request(
      `/api/studioprojects/search?published=false&categoryId=${category.id}&page=1&limit=20`,
      "GET",
      headers
    );
    log("✅ Search unpublished", { count: searchUnpublished.data?.length });

    assert(searchUnpublished.total >= 2, "має знайти неопубліковані проєкти");
    assert(
      searchUnpublished.data.every((p: any) => p.published === false),
      "всі результати мають бути неопублікованими"
    );

    // 4f. Пагінація — limit=1
    const searchPaged = await request(
      `/api/studioprojects/search?page=1&limit=1`,
      "GET",
      headers
    );
    log("✅ Search with limit=1", { total: searchPaged.total, count: searchPaged.data?.length });

    assert(searchPaged.data.length === 1,                          "limit=1 має повертати рівно 1 запис");
    assert(searchPaged.pages === Math.ceil(searchPaged.total / 1), "pages має коректно рахуватись");
    assert(searchPaged.page === 1,                                 "page має повертатись у відповіді");

    // 4g. Сортування createdAt asc
    const searchSorted = await request(
      `/api/studioprojects/search?sortBy=createdAt&order=asc&page=1&limit=10`,
      "GET",
      headers
    );
    log("✅ Search sorted asc", { count: searchSorted.data?.length });

    const dates = searchSorted.data.map((p: any) => new Date(p.createdAt).getTime());
    assert(
      dates.every((d: number, i: number) => i === 0 || d >= dates[i - 1]),
      "результати мають бути відсортовані за createdAt asc"
    );

    // 4h. Сортування createdAt desc
    const searchDesc = await request(
      `/api/studioprojects/search?sortBy=createdAt&order=desc&page=1&limit=10`,
      "GET",
      headers
    );
    const datesDesc = searchDesc.data.map((p: any) => new Date(p.createdAt).getTime());
    assert(
      datesDesc.every((d: number, i: number) => i === 0 || d <= datesDesc[i - 1]),
      "результати мають бути відсортовані за createdAt desc"
    );
    log("✅ Search sorted desc");

    // =========================
    // 5️⃣ UPDATE — видалити location
    // =========================
    const projectNoLocation = await request(
      `/api/studioprojects/${childProject.id}`,
      "PATCH",
      headers,
      { deleteLocation: true }
    );
    log("✅ Location deleted", projectNoLocation);
    assert(!projectNoLocation.location, "location має бути null після deleteLocation");

    // =========================
    // 6️⃣ UPDATE — додати нову location після видалення
    // =========================
    const projectWithNewLocation = await request(
      `/api/studioprojects/${childProject.id}`,
      "PATCH",
      headers,
      {
        locationData: {
          name: "Нова локація після видалення " + Date.now(),
          url: "https://example.com/new-" + Date.now(),
        },
      }
    );
    log("✅ New location attached after delete", projectWithNewLocation);
    assert(!!projectWithNewLocation.location?.name, "нова location має бути створена");

    // =========================
    // 7️⃣ PUBLISH
    // =========================
    const published = await request("/api/studioprojects/publish", "POST", headers, {
      id: childProject.id,
    });
    log("✅ Child project published", published);
    assert(published.published === true, "проєкт має бути опублікований");
    assert(!!published.publishedAt,      "publishedAt має бути встановлено");

    const searchPublished = await request(
      `/api/studioprojects/search?published=true&categoryId=${category.id}&page=1&limit=10`,
      "GET",
      headers
    );
    assert(
      searchPublished.data.some((p: any) => p.id === childProject.id),
      "опублікований проєкт має з'явитись у фільтрі published=true"
    );
    assert(
      searchPublished.data.every((p: any) => p.published === true),
      "всі результати мають бути опублікованими"
    );
    log("✅ Search published=true works");

    // =========================
    // 8️⃣ CLEANUP
    // =========================
    await request(`/api/studioprojects/${childProject.id}`, "DELETE", headers);
    log("✅ Child project deleted");

    await request(`/api/studioprojects/${parentProject.id}`, "DELETE", headers);
    log("✅ Parent project deleted");

    await request(`/api/subcategories/${subcategory.id}`, "DELETE", headers);
    log("✅ Subcategory deleted");

    await request(`/api/categories/${category.id}`, "DELETE", headers);
    log("✅ Category deleted");

    log("🎉 Всі тести пройшли успішно!");
  } catch (err: any) {
    log("❌ Error", { message: err.message });
    process.exit(1);
  }
}

run();