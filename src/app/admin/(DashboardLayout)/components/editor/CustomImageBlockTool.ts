import ImageTool from "@editorjs/image";

export class CustomImageBlockTool {
  private nativeTool: any;
  private config: any;

  static get toolbox() {
    return { title: "Image", icon: "🌄" };
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get pasteConfig() {
    return (ImageTool as any).pasteConfig;
  }

  static get sanitize() {
    return (ImageTool as any).sanitize;
  }

  constructor(params: any) {
    this.config = params.config || {};
    this.nativeTool = new (ImageTool as any)(params);
  }

  render() {
    const nativeEl = this.nativeTool.render();

    const wrapper = document.createElement("div");

    const btn = document.createElement("button");
    btn.textContent = "📁 Вибрати з галереї";
    btn.style.cssText =
      "display:block;margin-bottom:8px;padding:6px 14px;background:#1976d2;color:#fff;border:none;border-radius:6px;font-size:13px;cursor:pointer;";
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const picker = (window as any).__openMediaPicker;
      if (!picker) return;
      const item = await picker();
      this.config?.onUpload?.(item.id, item.url);
      // Передаємо url напряму в нативний тул через його uploader
      const result = await this.nativeTool.uploadUrl(item.url).catch(() => null);
      if (!result) {
        // Якщо uploadUrl не доступний — підміняємо через onUpload колбек
        this.nativeTool.onUpload({
          success: 1,
          file: { url: item.url },
        });
      }
    });

    wrapper.appendChild(btn);
    wrapper.appendChild(nativeEl);
    return wrapper;
  }

  save() {
    return this.nativeTool.save();
  }

  validate(data: any) {
    return !!data?.file?.url;
  }
}