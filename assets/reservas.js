// Código comum das páginas de reserva do hostel.
// Dois servidores com as mesmas reservas: o BitServer atende; se ele cair, o Pi assume sozinho.
const RESERVAS_APIS = location.hostname === 'localhost' ? ['/hostel-reservas'] : ['https://bitserver.tail8abf1e.ts.net/hostel-reservas', 'https://aurora2d.tail8abf1e.ts.net/hostel-reservas'];
let apiAtual = 0;
try { apiAtual = Math.max(0, RESERVAS_APIS.indexOf(sessionStorage.getItem('reservas_api'))); } catch {}
const WHATSAPP = '5511980991685';
const brl = (c) => (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dataBR = (s) => s.split('-').reverse().join('/');
const linkWhats = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
const el = (id) => document.getElementById(id);
function no(tag, txt, cls) { const n = document.createElement(tag); if (txt != null) n.textContent = txt; if (cls) n.className = cls; return n; }
async function apiReservas(caminho, corpo) {
  let r;
  for (let i = 0; i < RESERVAS_APIS.length; i++) {
    const n = (apiAtual + i) % RESERVAS_APIS.length;
    try {
      r = await fetch(RESERVAS_APIS[n] + caminho, corpo ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) } : {});
    } catch { r = null; continue; }
    if ([502, 503, 504].includes(r.status) && r.headers.get('content-type')?.includes('json') !== true) { r = null; continue; }
    if (n !== apiAtual) { apiAtual = n; try { sessionStorage.setItem('reservas_api', RESERVAS_APIS[n]); } catch {} }
    break;
  }
  if (!r) { const e = new Error('Sem conexão com o sistema de reservas.'); e.codigo = 'fora_do_ar'; throw e; }
  const d = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error(d.erro || 'Algo deu errado.'); e.codigo = d.codigo; e.status = r.status; throw e; }
  return d;
}
function mostrarWhats(alvo, texto) {
  const a = no('a', 'Reservar pelo WhatsApp', 'inline-block mt-4 px-6 py-3 rounded-md bg-orneon text-black font-extrabold text-sm uppercase tracking-widest');
  a.href = linkWhats('Olá! Gostaria de reservar no Hostel 666 Pinheiros.'); a.target = '_blank'; a.rel = 'noopener';
  alvo.replaceChildren(no('p', texto, 'text-gray-300'), a);
}
