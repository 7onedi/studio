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

// ─── Палітра та історія кольорів ────────────────────────────────────────────

const PRESET_COLORS = [
  '#FF1300', '#FF7A00', '#FFBF00', '#3DBE29', '#00A3FF',
  '#0070FF', '#7B2FF7', '#E91E8C', '#000000', '#666666',
];

function recentColorsKey(type: 'text' | 'bg'): string {
  return `editorColorTool_recent_${type}`;
}

function getRecentColors(type: 'text' | 'bg'): string[] {
  try {
    const raw = localStorage.getItem(recentColorsKey(type));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function rememberColor(type: 'text' | 'bg', color: string) {
  try {
    const list = getRecentColors(type).filter(c => c.toLowerCase() !== color.toLowerCase());
    list.unshift(color);
    localStorage.setItem(recentColorsKey(type), JSON.stringify(list.slice(0, 3)));
  } catch {
    // localStorage недоступний — просто пропускаємо
  }
}

function makeSwatch(color: string, onClick: () => void): HTMLButtonElement {
  const sw = document.createElement('button');
  sw.type = 'button';
  sw.style.cssText = `
    width:22px; height:22px; border-radius:5px; cursor:pointer;
    border:1px solid #ddd; background:${color}; padding:0;
  `;
  sw.title = color;
  sw.addEventListener('click', onClick);
  return sw;
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
    gap: 10px;
    min-width: 200px;
    position: relative;
  `;

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

  // ── спільна логіка застосування кольору ──
  const applyColor = (color: string) => {
    if (savedRange) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedRange);
    }
    // Без styleWithCSS Chrome/Edge вставляють <font color="...">, який
    // sanitize-схема (span[style]) видаляє при збереженні — тому колір
    // тексту "зникав" після save/reload.
    document.execCommand('styleWithCSS', false, 'true');
    if (type === 'text') {
      document.execCommand('foreColor', false, color);
      button.style.color = color;
    } else {
      document.execCommand('hiliteColor', false, color);
      button.style.background = color;
    }
    rememberColor(type, color);
    overlay.remove();
  };

  // ── палітра готових кольорів ──
  const paletteRow = document.createElement('div');
  paletteRow.style.cssText = 'display:flex; gap:6px; flex-wrap:wrap; width:100%; max-width:200px;';
  PRESET_COLORS.forEach(c => {
    paletteRow.appendChild(makeSwatch(c, () => {
      picker.value = c;
      applyColor(c);
    }));
  });

  // ── останні використані кольори ──
  const recent = getRecentColors(type);
  const recentBlock = document.createElement('div');
  recentBlock.style.cssText = 'display:flex; flex-direction:column; gap:4px; width:100%; align-self:flex-start;';
  if (recent.length) {
    const recentLabel = document.createElement('div');
    recentLabel.innerText = 'Останні';
    recentLabel.style.cssText = 'font-size:11px; color:#888;';
    const recentRow = document.createElement('div');
    recentRow.style.cssText = 'display:flex; gap:6px;';
    recent.forEach(c => {
      recentRow.appendChild(makeSwatch(c, () => {
        picker.value = c;
        applyColor(c);
      }));
    });
    recentBlock.appendChild(recentLabel);
    recentBlock.appendChild(recentRow);
  }

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
  confirmBtn.addEventListener('click', () => applyColor(picker.value));

  const cancelBtn = document.createElement('button');
  cancelBtn.innerText = 'Скасувати';
  cancelBtn.style.cssText = `
    flex:1; padding:7px 0;
    background:#eee; color:#333;
    border:none; border-radius:6px;
    cursor:pointer; font-size:13px;
  `;
  cancelBtn.addEventListener('click', () => overlay.remove());

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  btnRow.appendChild(confirmBtn);
  btnRow.appendChild(cancelBtn);
  modal.appendChild(closeBtn);
  modal.appendChild(label);
  modal.appendChild(picker);
  modal.appendChild(paletteRow);
  if (recent.length) modal.appendChild(recentBlock);
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
      document.execCommand('styleWithCSS', false, 'true');
      document.execCommand('hiliteColor', false, 'transparent');
      button.style.background = '#FFBF00';
      overlay.remove();
    });
    modal.appendChild(clearBtn);
  }
}