import path from "path";
import fs from "fs";

const BASE_URL = "http://localhost:3000";
const LOGIN_EMAIL = "test@gmail.com";
const LOGIN_PASSWORD = "111111";
const LOG_FILE = path.join(process.cwd(), "partner-test.log");
const TEST_IMAGE_PATH = path.join(process.cwd(), "tests/test-images.jpeg");

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

async function uploadImage(token: string): Promise<number> {
  const imageBuffer = fs.readFileSync(TEST_IMAGE_PATH);
  const blob = new Blob([imageBuffer], { type: "image/jpeg" });
  const formData = new FormData();
  formData.append("file", blob, "test-image.jpeg");

  const res = await fetch(`${BASE_URL}/api/media`, {
    method: "POST",
    headers: { Cookie: `token=${token}` },
    body: formData,
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`[POST /api/media] HTTP ${res.status}: ${text.slice(0, 300)}`);
  }

  const data = JSON.parse(text);
  log("✅ Image uploaded", { id: data.id, url: data.url });
  return data.id;
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

    const authHeaders = {
      "Content-Type": "application/json",
      Cookie: `token=${token}`,
    };

    const publicHeaders = {
      "Content-Type": "application/json",
    };

    // =========================
    // 0️⃣ UPLOAD IMAGE
    // =========================
    const imageId = await uploadImage(token);

    // =========================
    // 1️⃣ CREATE PARTNER — публічний запит (без авторизації)
    // =========================
    const partner = await request("/api/partners", "POST", publicHeaders, {
      name:        "Тестовий партнер " + Date.now(),
      email:       `partner-${Date.now()}@test.com`,
      role:        "PARTNER",
      description: "Опис тестового партнера",
      imageId,
    });
    log("✅ Partner created (public)", partner);

    assert(!!partner.id,                     "partner має мати id");
    assert(partner.status === "PENDING",     "новий партнер має статус PENDING");
    assert(partner.published === false,      "новий партнер має бути неопублікований");
    assert(!!partner.image?.url,             "partner має повертати image");

    // =========================
    // 2️⃣ CREATE PARTNER без image та description
    // =========================
    const partnerMinimal = await request("/api/partners", "POST", publicHeaders, {
      name:  "Мінімальний партнер " + Date.now(),
      email: `minimal-${Date.now()}@test.com`,
      role:  "MEMBER",
    });
    log("✅ Partner created (minimal, no image/description)", partnerMinimal);

    assert(!!partnerMinimal.id,              "мінімальний партнер має мати id");
    assert(partnerMinimal.image === null,    "image має бути null якщо не передано");

    // =========================
    // 3️⃣ FIND BY ID
    // =========================
    const foundPartner = await request(
      `/api/partners/${partner.id}`,
      "GET",
      publicHeaders
    );
    log("✅ FindById", foundPartner);

    assert(foundPartner.id === partner.id,   "findById має повернути правильний id");
    assert(!!foundPartner.image?.url,        "findById має повертати image");

    // =========================
    // 4️⃣ UPDATE — змінити дані
    // =========================
    const updatedPartner = await request(
      `/api/partners/${partner.id}`,
      "PATCH",
      authHeaders,
      {
        name:        "Оновлений партнер " + Date.now(),
        description: "Оновлений опис",
        role:        "DONOR",
      }
    );
    log("✅ Partner updated", updatedPartner);

    assert(updatedPartner.role === "DONOR",                "role має бути оновлений");
    assert(updatedPartner.description === "Оновлений опис", "description має бути оновлений");

    // =========================
    // 5️⃣ UPDATE STATUS — approve
    // =========================
    const approvedPartner = await request(
      "/api/partners/status",
      "PATCH",
      authHeaders,
      { id: partner.id, status: "APPROVED" }
    );
    log("✅ Partner approved", approvedPartner);

    assert(approvedPartner.status === "APPROVED", "статус має бути APPROVED");

    // =========================
    // 6️⃣ UPDATE STATUS — reject другого партнера
    // =========================
    const rejectedPartner = await request(
      "/api/partners/status",
      "PATCH",
      authHeaders,
      { id: partnerMinimal.id, status: "REJECTED" }
    );
    log("✅ Partner rejected", rejectedPartner);

    assert(rejectedPartner.status === "REJECTED", "статус має бути REJECTED");

    // =========================
    // 7️⃣ PUBLISH
    // =========================
    const publishedPartner = await request(
      "/api/partners/publish",
      "POST",
      authHeaders,
      { id: partner.id }
    );
    log("✅ Partner published", publishedPartner);

    assert(publishedPartner.published === true, "партнер має бути опублікований");
    assert(!!publishedPartner.publishedAt,      "publishedAt має бути встановлено");

    // =========================
    // 8️⃣ SEARCH
    // =========================

    // 8a. Базовий пошук — структура відповіді
    const searchAll = await request(
      "/api/partners/search?page=1&limit=20",
      "GET",
      publicHeaders
    );
    log("✅ Search all", { total: searchAll.total, count: searchAll.data?.length });

    assert(Array.isArray(searchAll.data),       "search має повертати data масив");
    assert(typeof searchAll.total === "number", "search має повертати total");
    assert(typeof searchAll.pages === "number", "search має повертати pages");
    assert(searchAll.data.length <= 20,         "search має повертати не більше limit записів");

    // 8b. Фільтр по role
    const searchByRole = await request(
      `/api/partners/search?role=DONOR&page=1&limit=10`,
      "GET",
      publicHeaders
    );
    log("✅ Search by role=DONOR", { count: searchByRole.data?.length });

    assert(
      searchByRole.data.every((p: any) => p.role === "DONOR"),
      "всі результати мають мати role=DONOR"
    );

    // 8c. Фільтр по status=APPROVED
    const searchApproved = await request(
      `/api/partners/search?status=APPROVED&page=1&limit=10`,
      "GET",
      publicHeaders
    );
    log("✅ Search by status=APPROVED", { count: searchApproved.data?.length });

    assert(searchApproved.total >= 1, "має знайти мінімум 1 APPROVED партнера");
    assert(
      searchApproved.data.every((p: any) => p.status === "APPROVED"),
      "всі результати мають мати status=APPROVED"
    );
    assert(
      searchApproved.data.some((p: any) => p.id === partner.id),
      "схвалений партнер має бути у фільтрі status=APPROVED"
    );

    // 8d. Фільтр по status=REJECTED
    const searchRejected = await request(
      `/api/partners/search?status=REJECTED&page=1&limit=10`,
      "GET",
      publicHeaders
    );
    log("✅ Search by status=REJECTED", { count: searchRejected.data?.length });

    assert(
      searchRejected.data.some((p: any) => p.id === partnerMinimal.id),
      "відхилений партнер має бути у фільтрі status=REJECTED"
    );

    // 8e. Фільтр published=true
    const searchPublished = await request(
      `/api/partners/search?published=true&page=1&limit=10`,
      "GET",
      publicHeaders
    );
    log("✅ Search published=true", { count: searchPublished.data?.length });

    assert(
      searchPublished.data.every((p: any) => p.published === true),
      "всі результати мають бути опублікованими"
    );
    assert(
      searchPublished.data.some((p: any) => p.id === partner.id),
      "опублікований партнер має бути у результатах"
    );

    // 8f. Фільтр published=false
    const searchUnpublished = await request(
      `/api/partners/search?published=false&page=1&limit=10`,
      "GET",
      publicHeaders
    );
    log("✅ Search published=false", { count: searchUnpublished.data?.length });

    assert(
      searchUnpublished.data.every((p: any) => p.published === false),
      "всі результати мають бути неопублікованими"
    );

    // 8g. Пагінація — limit=1
    const searchPaged = await request(
      `/api/partners/search?page=1&limit=1`,
      "GET",
      publicHeaders
    );
    log("✅ Search with limit=1", { total: searchPaged.total, count: searchPaged.data?.length });

    assert(searchPaged.data.length === 1,                          "limit=1 має повертати рівно 1 запис");
    assert(searchPaged.pages === Math.ceil(searchPaged.total / 1), "pages має коректно рахуватись");
    assert(searchPaged.page === 1,                                 "page має повертатись у відповіді");

    // 8h. Сортування createdAt asc
    const searchAsc = await request(
      `/api/partners/search?sortBy=createdAt&order=asc&page=1&limit=10`,
      "GET",
      publicHeaders
    );
    const datesAsc = searchAsc.data.map((p: any) => new Date(p.createdAt).getTime());
    assert(
      datesAsc.every((d: number, i: number) => i === 0 || d >= datesAsc[i - 1]),
      "результати мають бути відсортовані за createdAt asc"
    );
    log("✅ Search sorted asc");

    // 8i. Сортування createdAt desc
    const searchDesc = await request(
      `/api/partners/search?sortBy=createdAt&order=desc&page=1&limit=10`,
      "GET",
      publicHeaders
    );
    const datesDesc = searchDesc.data.map((p: any) => new Date(p.createdAt).getTime());
    assert(
      datesDesc.every((d: number, i: number) => i === 0 || d <= datesDesc[i - 1]),
      "результати мають бути відсортовані за createdAt desc"
    );
    log("✅ Search sorted desc");

    // =========================
    // 9️⃣ CLEANUP
    // =========================
    await request(`/api/partners/${partner.id}`, "DELETE", authHeaders);
    log("✅ Partner deleted");

    await request(`/api/partners/${partnerMinimal.id}`, "DELETE", authHeaders);
    log("✅ Minimal partner deleted");

    log("🎉 Всі тести пройшли успішно!");
  } catch (err: any) {
    log("❌ Error", { message: err.message });
    process.exit(1);
  }
}

run();