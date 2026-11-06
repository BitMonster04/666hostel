// Código comum das páginas de reserva do hostel.
const RESERVAS_API = location.hostname === 'localhost' ? '/hostel-reservas' : 'https://aurora2d.tail8abf1e.ts.net/hostel-reservas';
const WHATSAPP = '5511980991685';
const brl = (c) => (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dataBR = (s) => s.split('-').reverse().join('/');
const linkWhats = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
const el = (id) => document.getElementById(id);
function no(tag, txt, cls) { const n = document.createElement(tag); if (txt != null) n.textContent = txt; if (cls) n.className = cls; return n; }
async function apiReservas(caminho, corpo) {
  let r;
  try {
    r = await fetch(RESERVAS_API + caminho, corpo ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) } : {});
  } catch {
    const e = new Error('Sem conexão com o sistema de reservas.'); e.codigo = 'fora_do_ar'; throw e;
  }
  const d = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error(d.erro || 'Algo deu errado.'); e.codigo = d.codigo; e.status = r.status; throw e; }
  return d;
}
function mostrarWhats(alvo, texto) {
  const a = no('a', 'Reservar pelo WhatsApp', 'inline-block mt-4 px-6 py-3 rounded-md bg-orneon text-black font-extrabold text-sm uppercase tracking-widest');
  a.href = linkWhats('Olá! Gostaria de reservar no Hostel 666 Pinheiros.'); a.target = '_blank'; a.rel = 'noopener';
  alvo.replaceChildren(no('p', texto, 'text-gray-300'), a);
}
