// CustomImageTool.ts
export class CustomImageTool {
  private data: { url?: string; redirectUrl?: string; caption?: string };
  private wrapper: HTMLElement | null = null;
  private api: any;
  private config: any;

  static get toolbox() {
    return { title: "Image + Link", icon: "🖼" };
  }

  static get isReadOnlySupported() {
    return true;
  }

  constructor({ data, config, api }: any) {
    this.data = data || {};
    this.config = config || {};
    this.api = api;
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.style.cssText = "border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;";

    // --- Зображення або upload кнопка ---
    const imgContainer = document.createElement("div");
    imgContainer.style.cssText = "position:relative;background:#f9fafb;";

    if (this.data.url) {
      this._renderImage(imgContainer, this.data.url);
    } else {
      this._renderUploadArea(imgContainer);
    }

    // --- Поле Redirect URL ---
    const redirectRow = document.createElement("div");
    redirectRow.style.cssText =
      "display:flex;align-items:center;gap:8px;padding:8px 12px;border-top:1px solid #e5e7eb;background:#fff;";

    const linkIcon = document.createElement("span");
    linkIcon.textContent = "🔗";
    linkIcon.style.fontSize = "14px";

    const redirectInput = document.createElement("input");
    redirectInput.type = "url";
    redirectInput.placeholder = "Redirect URL (необов'язково)";
    redirectInput.value = this.data.redirectUrl || "";
    redirectInput.style.cssText =
      "flex:1;border:none;outline:none;font-size:13px;color:#374151;background:transparent;";
    redirectInput.addEventListener("input", (e) => {
      this.data.redirectUrl = (e.target as HTMLInputElement).value;
    });

    // --- Caption ---
    const captionInput = document.createElement("input");
    captionInput.type = "text";
    captionInput.placeholder = "Підпис...";
    captionInput.value = this.data.caption || "";
    captionInput.style.cssText =
      "width:100%;border:none;border-top:1px solid #e5e7eb;outline:none;font-size:13px;color:#6b7280;padding:8px 12px;background:#fff;box-sizing:border-box;";
    captionInput.addEventListener("input", (e) => {
      this.data.caption = (e.target as HTMLInputElement).value;
    });

    redirectRow.appendChild(linkIcon);
    redirectRow.appendChild(redirectInput);
    this.wrapper.appendChild(imgContainer);
    this.wrapper.appendChild(redirectRow);
    this.wrapper.appendChild(captionInput);

    return this.wrapper;
  }

  private _renderImage(container: HTMLElement, url: string) {
    container.innerHTML = "";
    const img = document.createElement("img");
    img.src = url;
    img.style.cssText = "width:100%;display:block;max-height:400px;object-fit:contain;";

    // Кнопка заміни
    const replaceBtn = document.createElement("button");
    replaceBtn.textContent = "Замінити";
    replaceBtn.style.cssText =
      "position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.5);color:#fff;border:none;border-radius:4px;padding:4px 8px;font-size:12px;cursor:pointer;";
    replaceBtn.addEventListener("click", () => this._renderUploadArea(container));

    container.appendChild(img);
    container.appendChild(replaceBtn);
  }

  private _renderUploadArea(container: HTMLElement) {
    container.innerHTML = "";
    container.style.cssText += "cursor:pointer;padding:32px;text-align:center;";

    const label = document.createElement("label");
    label.style.cssText = "cursor:pointer;display:block;";
    label.innerHTML = `<div style="font-size:32px">📷</div><div style="color:#6b7280;font-size:13px;margin-top:8px;">Клікни або перетягни зображення</div>`;

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";
    fileInput.addEventListener("change", async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      await this._uploadFile(file, container);
    });

    // Drag & drop
    container.addEventListener("dragover", (e) => {
      e.preventDefault();
      container.style.background = "#eff6ff";
    });
    container.addEventListener("dragleave", () => {
      container.style.background = "#f9fafb";
    });
    container.addEventListener("drop", async (e) => {
      e.preventDefault();
      container.style.background = "#f9fafb";
      const file = e.dataTransfer?.files[0];
      if (file) await this._uploadFile(file, container);
    });

    label.appendChild(fileInput);
    container.appendChild(label);
  }

  private async _uploadFile(file: File, container: HTMLElement) {
    // Показуємо прогрес
    container.innerHTML = `<div style="padding:32px;text-align:center;color:#6b7280;font-size:13px;">Завантаження...</div>`;

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      this.data.url = data.url;
      this.config?.onUpload?.(data.id, data.url);
      this._renderImage(container, data.url);
    } catch {
      container.innerHTML = `<div style="padding:32px;text-align:center;color:#ef4444;font-size:13px;">Помилка завантаження</div>`;
    }
  }

  save() {
    return {
      url: this.data.url || "",
      redirectUrl: this.data.redirectUrl || "",
      caption: this.data.caption || "",
    };
  }

  validate(data: any) {
    return !!data.url;
  }
}