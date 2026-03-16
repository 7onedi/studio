// src/app/admin/(DashboardLayout)/components/editor/FontSizeTool.ts

export class FontSizeTool {
  static get isInline() { return true; }
  static get title() { return 'Font Size'; }
  static get sanitize() {
    return { span: { style: true } };
  }

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

  openModal() {
    document.getElementById('fontsize-tool-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'fontsize-tool-modal';
    modal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      z-index: 99999;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    `;

    const label = document.createElement('div');
    label.innerText = 'Розмір шрифту';
    label.style.cssText = 'font-size:14px; font-weight:600; color:#333;';

    const input = document.createElement('input');
    input.type = 'number';
    input.value = '16';
    input.min = '8';
    input.max = '96';
    input.style.cssText = `
      width: 80px;
      height: 40px;
      border: 1px solid #ddd;
      border-radius: 5px;
      text-align: center;
      font-size: 16px;
      padding: 4px;
    `;

    const preview = document.createElement('div');
    preview.innerText = 'Aa';
    preview.style.cssText = `font-size: 16px; color: #333; transition: font-size 0.1s;`;

    input.addEventListener('input', () => {
      preview.style.fontSize = `${input.value}px`;
    });

    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex; gap:8px;';

    const confirmBtn = document.createElement('button');
    confirmBtn.innerText = 'Застосувати';
    confirmBtn.style.cssText = `
      padding: 6px 14px;
      background: #0070FF;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 13px;
    `;

    const cancelBtn = document.createElement('button');
    cancelBtn.innerText = 'Скасувати';
    cancelBtn.style.cssText = `
      padding: 6px 14px;
      background: #eee;
      color: #333;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 13px;
    `;

    confirmBtn.addEventListener('click', () => {
      if (!input.value) return;

      if (this.savedRange) {
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(this.savedRange);

        const span = document.createElement('span');
        span.style.fontSize = `${input.value}px`;
        span.appendChild(this.savedRange.extractContents());
        this.savedRange.insertNode(span);
      }

      modal.remove();
    });

    cancelBtn.addEventListener('click', () => {
      modal.remove();
    });

    btnRow.appendChild(confirmBtn);
    btnRow.appendChild(cancelBtn);
    modal.appendChild(label);
    modal.appendChild(input);
    modal.appendChild(preview);
    modal.appendChild(btnRow);
    document.body.appendChild(modal);

    // Фокус на input одразу
    setTimeout(() => input.focus(), 50);
  }

  surround(_range: Range) {}
  checkState() {}
}