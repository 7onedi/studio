// ColorTool.ts — повна заміна

export class TextColorTool {
  static get isInline() { return true; }
  static get title() { return 'Text Color'; }
  static get sanitize() { return { span: { style: true } }; }

  private button!: HTMLButtonElement;
  private savedRange: Range | null = null;

  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.innerHTML = 'A';
    this.button.style.cssText = 'font-weight:bold; color:#FF1300; cursor:pointer; background:none; border:none; font-size:14px; padding:4px;';

    this.button.addEventListener('click', () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        this.savedRange = selection.getRangeAt(0).cloneRange();
      }
      openColorPicker('text', this.savedRange, this.button);
    });

    return this.button;
  }

  surround(_range: Range) {}
  checkState() {}
}

export class BgColorTool {
  static get isInline() { return true; }
  static get title() { return 'Background Color'; }
  static get sanitize() { return { span: { style: true } }; }

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
      openColorPicker('bg', this.savedRange, this.button);
    });

    return this.button;
  }

  surround(_range: Range) {}
  checkState() {}
}

// ─── Спільна функція ─────────────────────────────────────────────────────────

function getCurrentColor(type: 'text' | 'bg', range: Range | null): string {
  if (!range) return type === 'text' ? '#FF1300' : '#FFBF00';

  const container = range.commonAncestorContainer;
  const el = container.nodeType === Node.TEXT_NODE
    ? container.parentElement
    : container as HTMLElement;

  if (!el) return type === 'text' ? '#FF1300' : '#FFBF00';

  const style = window.getComputedStyle(el);
  const raw = type === 'text' ? style.color : style.backgroundColor;
  return rgbToHex(raw) || (type === 'text' ? '#FF1300' : '#FFBF00');
}

function rgbToHex(rgb: string): string {
  const match = rgb.match(/\d+/g);
  if (!match || match.length < 3) return '';
  const [r, g, b] = match.map(Number);
  if (r === 0 && g === 0 && b === 0 && rgb.includes('rgba')) return '';
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function openColorPicker(
  type: 'text' | 'bg',
  savedRange: Range | null,
  button: HTMLButtonElement
) {
  document.getElementById('color-tool-modal')?.remove();

  const currentColor = getCurrentColor(type, savedRange);

  const overlay = document.createElement('div');
  overlay.id = 'color-tool-modal';
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
    z-index: 99999;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    min-width: 200px;
    position: relative;
  `;

  // Хрестик закриття
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
  label.innerText = type === 'text' ? 'Колір тексту' : 'Колір фону';
  label.style.cssText = 'font-size:14px; font-weight:600; color:#333; align-self:flex-start; padding-right:24px;';

  const picker = document.createElement('input');
  picker.type = 'color';
  picker.value = currentColor;
  picker.style.cssText = 'width:80px; height:44px; border:none; cursor:pointer; border-radius:6px;';

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
    if (savedRange) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedRange);
    }
    if (type === 'text') {
      document.execCommand('foreColor', false, picker.value);
      button.style.color = picker.value;
    } else {
      document.execCommand('hiliteColor', false, picker.value);
      button.style.background = picker.value;
    }
    overlay.remove();
  });

  cancelBtn.addEventListener('click', () => overlay.remove());

  // Закриття по кліку на оверлей
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  btnRow.appendChild(confirmBtn);
  btnRow.appendChild(cancelBtn);
  modal.appendChild(closeBtn);
  modal.appendChild(label);
  modal.appendChild(picker);
  modal.appendChild(btnRow);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  if (type === 'bg') {
  const clearBtn = document.createElement('button');
  clearBtn.innerText = 'Очистити фон';
  clearBtn.style.cssText = `
    width:100%; padding:7px 0;
    background:#fff; color:#e53935;
    border:1px solid #e53935; border-radius:6px;
    cursor:pointer; font-size:13px; font-weight:500;
  `;
  clearBtn.addEventListener('click', () => {
    if (savedRange) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedRange);
    }
    document.execCommand('hiliteColor', false, 'transparent');
    button.style.background = '#FFBF00';
    overlay.remove();
  });
  modal.appendChild(clearBtn);
}
}