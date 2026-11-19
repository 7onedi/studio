const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

export const partnerReceived = (name: string) => ({
  subject: 'We have received your application',
  html: `<p>Hello, ${esc(name)}!</p>
         <p>The Intercultural Youth Studio has received your details.</p>
         <p>This is an automated message, please do not reply. We will contact you soon.</p>`,
});

export const partnerStatus = (name: string, approved: boolean) =>
  approved
    ? {
        subject: 'Your application has been approved',
        html: `<p>Congratulations, ${esc(name)}! Your application has been approved.</p>`,
      }
    : {
        subject: 'Your application has been declined',
        html: `<p>${esc(name)}, unfortunately your application has been declined.</p>`,
      };

// Лист власнику (українською)
export const ownerNewPartner = (p: { name: string; email: string; role: string; link?: string | null }) => ({
  subject: `Нова заявка: ${p.name}`,
  html: `<p>Нова заявка з сайту.</p>
         <p><b>Ім'я:</b> ${esc(p.name)}<br>
         <b>Email:</b> ${esc(p.email)}<br>
         <b>Роль:</b> ${esc(p.role)}<br>
         ${p.link ? `<b>Посилання:</b> ${esc(p.link)}` : ''}</p>
         <p>Переглянути в адмінці (Partners).</p>`,
});