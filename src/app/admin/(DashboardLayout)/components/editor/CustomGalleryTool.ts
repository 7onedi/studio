export class CustomGalleryTool {
  private data: { files: { url: string }[]; caption: string };
  private wrapper: HTMLElement | null = null;
  private config: any;

  static get toolbox() {
    return { title: "Gallery", icon: "🖼" };
  }

  static get isReadOnlySupported() {
    return true;
  }

  constructor({ data, config }: any) {
    this.data = {
      files: data?.files ?? [],
      caption: data?.caption ?? "",
    };
    this.config = config || {};
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.style.cssText = "font-family:sans-serif;";
    this._renderAll();
    return this.wrapper;
  }

  private _renderAll() {
    if (!this.wrapper) return;
    this.wrapper.innerHTML = "";

    // Грід картинок
    const grid = document.createElement("div");
    grid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(${Math.min(Math.max(this.data.files.length, 1), 3)}, 1fr);
      gap: 8px;
      margin-bottom: 8px;
    `;

    this.data.files.forEach((file, index) => {
      const cell = document.createElement("div");
      cell.style.cssText = "position:relative;aspect-ratio:1;border-radius:8px;overflow:hidden;background:#f3f4f6;";

      const img = document.createElement("img");
      img.src = file.url;
      img.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;";

      const removeBtn = document.createElement("button");
      removeBtn.innerHTML = "🗑";
      removeBtn.style.cssText =
        "position:absolute;top:6px;right:6px;background:rgba(0,0,0,0.55);color:#fff;border:none;border-radius:6px;width:28px;height:28px;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;";
      removeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.data.files.splice(index, 1);
        this._renderAll();
      });

      cell.appendChild(img);
      cell.appendChild(removeBtn);
      grid.appendChild(cell);
    });

    this.wrapper.appendChild(grid);

    // Кнопки
    const btnRow = document.createElement("div");
    btnRow.style.cssText = "display:flex;gap:8px;margin-bottom:8px;";

    const galleryBtn = document.createElement("button");
    galleryBtn.textContent = "📁 Open Gallery";
    galleryBtn.style.cssText =
      "padding:6px 14px;background:#1976d2;color:#fff;border:none;border-radius:6px;font-size:13px;cursor:pointer;";
    galleryBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const picker = (window as any).__openMediaPicker;
      if (!picker) return;
      const item = await picker();
      this.data.files.push({ url: item.url });
      this.config?.onUpload?.(item.id, item.url);
      this._renderAll();
    });

    // Завантажити файл
    const uploadLabel = document.createElement("label");
    uploadLabel.style.cssText =
      "padding:6px 14px;background:#fff;color:#374151;border:1px solid #d1d5db;border-radius:6px;font-size:13px;cursor:pointer;";
    uploadLabel.textContent = "📷 Upload";

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.multiple = true;
    fileInput.style.display = "none";
    fileInput.addEventListener("change", async (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      for (const file of files) {
        await this._uploadFile(file);
      }
      fileInput.value = "";
      this._renderAll();
    });

    uploadLabel.appendChild(fileInput);
    btnRow.appendChild(galleryBtn);
    btnRow.appendChild(uploadLabel);
    this.wrapper.appendChild(btnRow);

    const caption = document.createElement("input");
    caption.type = "text";
    caption.placeholder = "Gallery caption";
    caption.value = this.data.caption;
    caption.style.cssText =
      "width:100%;border:1px solid #e5e7eb;border-radius:6px;outline:none;font-size:13px;color:#6b7280;padding:8px 12px;background:#fff;box-sizing:border-box;";
    caption.addEventListener("input", (e) => {
      this.data.caption = (e.target as HTMLInputElement).value;
    });
    this.wrapper.appendChild(caption);
  }

  private async _uploadFile(file: File) {
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
      this.data.files.push({ url: data.url });
      this.config?.onUpload?.(data.id, data.url);
    } catch {
      console.error("Помилка завантаження");
    }
  }

  save() {
    return {
      files: this.data.files,
      caption: this.data.caption,
    };
  }

  validate(data: any) {
    return Array.isArray(data?.files) && data.files.length > 0;
  }
}