export class FontSizeTool {
  static get isInline() { return true; }
  static get title() { return 'Font Size'; }
  static get sanitize() { return { span: { style: true } }; }

  private button!: HTMLButtonElement;
  private savedRange: Range | null = null;

  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.innerHTML = 'A+';
    this.button.style.cssText = 'font-weight:bold; color:#000; cursor:pointer; background:none; border:none; font-size:14px; padding:4px;';

    this.button.addEventListener('click', () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        this.savedRange = selection.getRangeAt(0).cloneRange();
      }
      this.openModal();
    });

    return this.button;
  }

  getCurrentFontSize(): string {
    if (!this.savedRange) return '16';

    const container = this.savedRange.commonAncestorContainer;
    const el = container.nodeType === Node.TEXT_NODE
      ? container.parentElement
      : container as HTMLElement;

    if (!el) return '16';

    const size = window.getComputedStyle(el).fontSize;
    return size ? Math.round(parseFloat(size)).toString() : '16';
  }

  openModal() {
    document.getElementById('fontsize-tool-modal')?.remove();

    const currentSize = this.getCurrentFontSize();

    const overlay = document.createElement('div');
    overlay.id = 'fontsize-tool-modal';
    overlay.style.cssText = `
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.3);
      z-index: 99998;
      display: flex; align-items: center; justify-content: center;
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
      background: #fff;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.18);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      min-width: 200px;
      position: relative;
    `;

    // Хрестик
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
      position: absolute; top: 10px; right: 12px;
      background: none; border: none; cursor: pointer;
      font-size: 16px; color: #888; line-height: 1;
      padding: 2px 6px; border-radius: 4px;
    `;
    closeBtn.addEventListener('mouseover', () => closeBtn.style.background = '#f0f0f0');
    closeBtn.addEventListener('mouseout', () => closeBtn.style.background = 'none');
    closeBtn.addEventListener('click', () => overlay.remove());

    const label = document.createElement('div');
    label.innerText = 'Розмір шрифту';
    label.style.cssText = 'font-size:14px; font-weight:600; color:#333; align-self:flex-start; padding-right:24px;';

    const input = document.createElement('input');
    input.type = 'number';
    input.value = currentSize;
    input.min = '8';
    input.max = '96';
    input.style.cssText = `
      width: 80px; height: 40px;
      border: 1px solid #ddd; border-radius: 5px;
      text-align: center; font-size: 16px; padding: 4px;
    `;

    const preview = document.createElement('div');
    preview.innerText = 'Aa';
    preview.style.cssText = `font-size: ${currentSize}px; color: #333; transition: font-size 0.1s;`;

    input.addEventListener('input', () => {
      preview.style.fontSize = `${input.value}px`;
    });

    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex; gap:8px; width:100%;';

    const confirmBtn = document.createElement('button');
    confirmBtn.innerText = 'Застосувати';
    confirmBtn.style.cssText = `
      flex:1; padding:7px 0;
      background:#0070FF; color:#fff;
      border:none; border-radius:6px;
      cursor:pointer; font-size:13px; font-weight:500;
    `;

    const cancelBtn = document.createElement('button');
    cancelBtn.innerText = 'Скасувати';
    cancelBtn.style.cssText = `
      flex:1; padding:7px 0;
      background:#eee; color:#333;
      border:none; border-radius:6px;
      cursor:pointer; font-size:13px;
    `;

    confirmBtn.addEventListener('click', () => {
      if (!input.value || !this.savedRange) return;

      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(this.savedRange);

      const span = document.createElement('span');
      span.style.fontSize = `${input.value}px`;
      span.appendChild(this.savedRange.extractContents());
      this.savedRange.insertNode(span);

      overlay.remove();
    });

    cancelBtn.addEventListener('click', () => overlay.remove());

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });

    btnRow.appendChild(confirmBtn);
    btnRow.appendChild(cancelBtn);
    modal.appendChild(closeBtn);
    modal.appendChild(label);
    modal.appendChild(input);
    modal.appendChild(preview);
    modal.appendChild(btnRow);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    setTimeout(() => input.focus(), 50);
  }

  surround(_range: Range) {}
  checkState() {}
}