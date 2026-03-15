// src/app/admin/(DashboardLayout)/components/editor/ColorTool.ts

export class TextColorTool {
  static get isInline() { return true; }
  static get title() { return 'Text Color'; }
  static get sanitize() {
    return { span: { style: true } };
  }

  private button!: HTMLButtonElement;
  private savedRange: Range | null = null;

  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.innerHTML = 'A';
    this.button.style.cssText = 'font-weight:bold; color:#FF1300; cursor:pointer; background:none; border:none; font-size:14px; padding:4px;';

    this.button.addEventListener('click', () => {
      // Зберігаємо виділення перед відкриттям модалки
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        this.savedRange = selection.getRangeAt(0).cloneRange();
      }
      this.openColorPicker('text');
    });

    return this.button;
  }

  openColorPicker(type: 'text' | 'bg') {
    // Видаляємо попередню модалку якщо є
    document.getElementById('color-tool-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'color-tool-modal';
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
    label.innerText = type === 'text' ? 'Колір тексту' : 'Колір фону';
    label.style.cssText = 'font-size:14px; font-weight:600; color:#333;';

    const picker = document.createElement('input');
    picker.type = 'color';
    picker.value = type === 'text' ? '#FF1300' : '#FFBF00';
    picker.style.cssText = 'width:80px; height:40px; border:none; cursor:pointer;';

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
      // Відновлюємо виділення
      if (this.savedRange) {
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(this.savedRange);
      }

      if (type === 'text') {
        document.execCommand('foreColor', false, picker.value);
      } else {
        document.execCommand('hiliteColor', false, picker.value);
      }

      modal.remove();
    });

    cancelBtn.addEventListener('click', () => {
      modal.remove();
    });

    btnRow.appendChild(confirmBtn);
    btnRow.appendChild(cancelBtn);
    modal.appendChild(label);
    modal.appendChild(picker);
    modal.appendChild(btnRow);
    document.body.appendChild(modal);
  }

  surround(_range: Range) {}
  checkState() {}
}

export class BgColorTool {
  static get isInline() { return true; }
  static get title() { return 'Background Color'; }
  static get sanitize() {
    return { span: { style: true } };
  }

  private button!: HTMLButtonElement;
  private savedRange: Range | null = null;

  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.innerHTML = 'M';
    this.button.style.cssText = 'font-weight:bold; background:#FFBF00; cursor:pointer; border:none; font-size:14px; padding:4px 6px; border-radius:3px;';

    this.button.addEventListener('click', () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        this.savedRange = selection.getRangeAt(0).cloneRange();
      }
      this.openColorPicker('bg');
    });

    return this.button;
  }

  openColorPicker(type: 'text' | 'bg') {
    document.getElementById('color-tool-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'color-tool-modal';
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
    label.innerText = type === 'text' ? 'Колір тексту' : 'Колір фону';
    label.style.cssText = 'font-size:14px; font-weight:600; color:#333;';

    const picker = document.createElement('input');
    picker.type = 'color';
    picker.value = type === 'text' ? '#FF1300' : '#FFBF00';
    picker.style.cssText = 'width:80px; height:40px; border:none; cursor:pointer;';

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
      if (this.savedRange) {
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(this.savedRange);
      }

      if (type === 'text') {
        document.execCommand('foreColor', false, picker.value);
      } else {
        document.execCommand('hiliteColor', false, picker.value);
      }

      modal.remove();
    });

    cancelBtn.addEventListener('click', () => {
      modal.remove();
    });

    btnRow.appendChild(confirmBtn);
    btnRow.appendChild(cancelBtn);
    modal.appendChild(label);
    modal.appendChild(picker);
    modal.appendChild(btnRow);
    document.body.appendChild(modal);
  }

  surround(_range: Range) {}
  checkState() {}
}