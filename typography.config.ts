type FontSizeConfig = [string, { lineHeight: string; letterSpacing: string; fontWeight: string | number }];

export const fontFamily: Record<string, string[]> = {
  sans: ['var(--font-fira)', 'sans-serif'],
  heading: ['var(--font-fira)', 'sans-serif'],
  sans_mobile: ['var(--font-maven)', 'sans-serif'],
  heading_mobile: ['var(--font-maven)', 'sans-serif'],
}

export const fontSize: Record<string, FontSizeConfig> = {
  headline_1: ['68px', { lineHeight: '80px', letterSpacing: '0.014em', fontWeight: '700' }],
  headline_2: ['42px', { lineHeight: '60px', letterSpacing: '0.014em', fontWeight: '700' }],
  headline_3: ['32px', { lineHeight: '40px', letterSpacing: '0.014em', fontWeight: '700' }],
  headline_4: ['28px', { lineHeight: '38px', letterSpacing: '0.014em', fontWeight: '700' }],
  headline_5: ['24px', { lineHeight: '14px', letterSpacing: '0.0125em', fontWeight: '700' }],
  subtitle_1: ['24px', { lineHeight: '32px', letterSpacing: '0.014em', fontWeight: '400' }],
  subtitle_2: ['24px', { lineHeight: '42px', letterSpacing: '0.014em', fontWeight: '700' }],
  button: ['16px', { lineHeight: '24px', letterSpacing: '0.014em', fontWeight: '600' }],
  body: ['16px', { lineHeight: '24px', letterSpacing: '0.014em', fontWeight: '400' }],
  body_bold: ['16px', { lineHeight: '24px', letterSpacing: '0.014em', fontWeight: '700' }],
  body_link: ['16px', { lineHeight: '24px', letterSpacing: '0.014em', fontWeight: '400' }],
  headline_1_mobile: ['42px', { lineHeight: 'normal', letterSpacing: '0.014em', fontWeight: '700' }],
  headline_2_mobile: ['26px', { lineHeight: 'normal', letterSpacing: '0.014em', fontWeight: '700' }],
  headline_3_mobile: ['22px', { lineHeight: 'normal', letterSpacing: '0.014em', fontWeight: '700' }],
  headline_4_mobile: ['20px', { lineHeight: 'normal', letterSpacing: '0.014em', fontWeight: '700' }],
  headline_5_mobile: ['18px', { lineHeight: 'normal', letterSpacing: '0.0125em', fontWeight: '700' }],
  subtitle_1_mobile: ['20px', { lineHeight: 'normal', letterSpacing: '0.014em', fontWeight: '400' }],
  subtitle_2_mobile: ['20px', { lineHeight: 'normal', letterSpacing: '0.014em', fontWeight: '700' }],
  button_mobile: ['14px', { lineHeight: 'normal', letterSpacing: '0.014em', fontWeight: '600' }],
  body_mobile: ['16px', { lineHeight: 'normal', letterSpacing: '0.014em', fontWeight: '400' }],
  body_bold_mobile: ['16px', { lineHeight: 'normal', letterSpacing: '0.014em', fontWeight: '700' }],
  body_link_mobile: ['16px', { lineHeight: 'normal', letterSpacing: '0.014em', fontWeight: '400' }],
};
