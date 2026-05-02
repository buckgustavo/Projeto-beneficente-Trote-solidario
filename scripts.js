/* ============================================================
   Trote Solidário UniFACEF 2026 — scripts.js
   ============================================================ */

/* ── Metas por equipe ── Fonte: Regulamento (Tabelas 4–7)
   kit        = 1 kit por aluno        (Prova 1)
   suplemento = 1 lata por 2 alunos   (Prova 2, arredondado p/ cima)
   leite      = 1 litro por aluno     (Prova 3 = mesma meta de kit)
   sangue     = 1 doação por 2 alunos (Prova 4 = mesma meta de suplem.)
*/
const EQUIPES = {
    comunicacao:  { kit: 54, suplemento: 27, leite: 54, sangue: 27 },
    psicologia:   { kit: 51, suplemento: 26, leite: 51, sangue: 26 },
    letras:       { kit: 21, suplemento: 11, leite: 21, sangue: 11 },
    medicina:     { kit: 88, suplemento: 44, leite: 88, sangue: 44 },
    computacaoB:  { kit: 60, suplemento: 30, leite: 60, sangue: 30 },
    contabeis:    { kit: 44, suplemento: 22, leite: 44, sangue: 22 },
    engenharias:  { kit: 42, suplemento: 21, leite: 42, sangue: 21 },
    computacaoA:  { kit: 61, suplemento: 31, leite: 61, sangue: 31 },
    administracao:{ kit: 32, suplemento: 16, leite: 32, sangue: 16 },
};

const AVULSOS = {
    qtdeArroz5:   10,   // pacote 5 kg — arroz tipo 1
    qtdeArroz1:    2,   // pacote 1 kg — arroz tipo 1
    qtdeFeijao2:   8,   // pacote 2 kg — feijão carioca
    qtdeFeijao1:   4,   // pacote 1 kg — feijão carioca
    qtdeOleo:      4,   // 1 unidade   — óleo de soja (900 mL/1 L)
    qtdeMacarrao:  2,   // pacote 500 g— macarrão
};

const PONTOS_META = 5000;
let metaJaCumprida = false;

// ── Utilidades ──────────────────────────────────────────────
function getVal(id) {
    const el = document.getElementById(id);
    return el ? Math.max(0, parseInt(el.value, 10) || 0) : 0;
}

function setText(id, v) {
    const el = document.getElementById(id);
    if (el) el.textContent = v;
}

function calcMeta(qtde, meta) {
    return Math.round(qtde * (PONTOS_META / meta));
}

function fmt(n) { return n.toLocaleString('pt-BR'); }

//  Barras de progresso 
function atualizarBarra(barraId, labelId, qtde, meta) {
    const barra = document.getElementById(barraId);
    const label = document.getElementById(labelId);
    if (!barra || !label) return;
    barra.style.width = Math.min(100, (qtde / meta) * 100) + '%';
    barra.classList.toggle('meta-ok', qtde >= meta);
    label.textContent = `${qtde} / ${meta}`;
}

// Recálculo principal
function recalcular() {
    // ① Equipe ativa
    const btnAtivo = document.querySelector('.team-btn-item.ativo');
    const equipeId = btnAtivo ? btnAtivo.dataset.equipe : 'comunicacao';
    const metas    = EQUIPES[equipeId] || EQUIPES.comunicacao;
    let ptsAvulsos = 0;
    for (const [id, ptsPorUn] of Object.entries(AVULSOS)) {
        ptsAvulsos += getVal(id) * ptsPorUn;
    }

    const qKit    = getVal('qtdeKits');
    const qSupl   = getVal('qtdeSuplemento');
    const qLeite  = getVal('qtdeLeite');
    const qSangue = getVal('qtdeSangue');

    const ptsKit    = calcMeta(qKit,    metas.kit);
    const ptsSupl   = calcMeta(qSupl,   metas.suplemento);
    const ptsLeite  = calcMeta(qLeite,  metas.leite);
    const ptsSangue = calcMeta(qSangue, metas.sangue);
    const ptsMetas  = ptsKit + ptsSupl + ptsLeite + ptsSangue;

    const total = ptsAvulsos + ptsMetas;
    const totalEl = document.getElementById('totalDisplay');
    if (totalEl) {
        totalEl.textContent = fmt(total);
        const prog = (
            Math.min(qKit    / metas.kit,        1) +
            Math.min(qSupl   / metas.suplemento, 1) +
            Math.min(qLeite  / metas.leite,      1) +
            Math.min(qSangue / metas.sangue,     1)
        ) / 4;
        totalEl.style.color = `hsl(${Math.round(prog * 120)}, 90%, 65%)`;
    }

    setText('bkdKit',        fmt(ptsKit));
    setText('bkdAvulsos',    fmt(ptsAvulsos));
    setText('bkdSuplemento', fmt(ptsSupl));
    setText('bkdLeite',      fmt(ptsLeite));
    setText('bkdSangue',     fmt(ptsSangue));

    setText('ptsProva1', `+${fmt(ptsKit + ptsAvulsos)} pts`);
    setText('ptsMetas',  `+${fmt(ptsSupl + ptsLeite + ptsSangue)} pts`);

    atualizarBarra('barraKit',        'labelMetaKit',        qKit,    metas.kit);
    atualizarBarra('barraSuplemento', 'labelMetaSuplemento', qSupl,   metas.suplemento);
    atualizarBarra('barraLeite',      'labelMetaLeite',      qLeite,  metas.leite);
    atualizarBarra('barraSangue',     'labelMetaSangue',     qSangue, metas.sangue);

    const ptsPorKit = (PONTOS_META / metas.kit).toFixed(1);
    setText('ptsPorKit', ptsPorKit);

    const todasOk = qKit >= metas.kit && qSupl >= metas.suplemento
        && qLeite >= metas.leite && qSangue >= metas.sangue;
    if (todasOk && !metaJaCumprida) dispararFoguetes();
    metaJaCumprida = todasOk;
}

// Troca de equipe 
function aoSelecionarEquipe(btn) {
    document.querySelectorAll('.team-btn-item').forEach(b => b.classList.remove('ativo'));
    btn.classList.add('ativo');

    const metas = EQUIPES[btn.dataset.equipe] || EQUIPES.comunicacao;

    setText('infoMetaKit',        metas.kit);
    setText('infoMetaSuplemento', metas.suplemento);
    setText('infoMetaLeite',      metas.leite);
    setText('infoMetaSangue',     metas.sangue);

    // Reseta os labels das barras para o novo meta
    const setLabel = (id, v) => setText(id, `0 / ${v}`);
    setLabel('labelMetaKit',        metas.kit);
    setLabel('labelMetaSuplemento', metas.suplemento);
    setLabel('labelMetaLeite',      metas.leite);
    setLabel('labelMetaSangue',     metas.sangue);

    metaJaCumprida = false;
    recalcular();
}

// Fogos de artifício 
function criarExplosao(container, cx, cy) {
    const cores = ['#ffe066','#ff4444','#44ff88','#44aaff','#ff88ff','#f07e1e','#ffffff','#1ab4d3'];
    for (let i = 0; i < 32; i++) {
        const p    = document.createElement('div');
        p.className = 'foguete-particula';
        const ang  = (i / 32) * 360 + (Math.random() - .5) * 15;
        const dist = 70 + Math.random() * 140;
        const size = 5 + Math.random() * 7;
        const cor  = cores[Math.floor(Math.random() * cores.length)];
        const dur  = .7 + Math.random() * .6;
        p.style.cssText =
            `left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;` +
            `background:${cor};` +
            `--dx:${Math.cos(ang * Math.PI / 180) * dist}px;` +
            `--dy:${Math.sin(ang * Math.PI / 180) * dist}px;` +
            `animation-duration:${dur}s;`;
        container.appendChild(p);
        p.addEventListener('animationend', () => p.remove());
    }
}

function dispararFoguetes() {
    const container = document.getElementById('fogueiroContainer');
    const display   = document.getElementById('calcDisplay');
    if (!container || !display) return;
    const rect = display.getBoundingClientRect();
    for (let b = 0; b < 8; b++) {
        setTimeout(() => criarExplosao(container,
            rect.left + rect.width  * (.15 + Math.random() * .7),
            rect.top  + rect.height * (.15 + Math.random() * .7)
        ), b * 210);
    }
}

// Calculadora init 
function initCalculadora() {
    if (!document.getElementById('totalDisplay')) return;

    const fogueiro = document.createElement('div');
    fogueiro.id = 'fogueiroContainer';
    document.body.appendChild(fogueiro);

    document.querySelectorAll('.team-btn-item').forEach(btn =>
        btn.addEventListener('click', () => aoSelecionarEquipe(btn))
    );

    document.querySelectorAll('.item-input').forEach(input =>
        input.addEventListener('input', recalcular)
    );

    const ativo = document.querySelector('.team-btn-item.ativo');
    if (ativo) aoSelecionarEquipe(ativo);
    else recalcular();
}

//  Nav hamburger 
function initNav() {
    const toggle = document.getElementById('navToggle');
    const links  = document.getElementById('navLinks');
    if (!toggle || !links) return;
    toggle.addEventListener('click', () => links.classList.toggle('aberto'));
    links.querySelectorAll('a').forEach(a =>
        a.addEventListener('click', () => links.classList.remove('aberto'))
    );
}

// Link ativo 
function marcarPaginaAtiva() {
    const pagina = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === pagina) link.classList.add('active');
    });
}

// Mapas 
function toggleMapa(btn) {
    const iframe  = btn.nextElementSibling;
    const abrindo = iframe.style.display !== 'block';
    if (abrindo && !iframe.src) iframe.src = iframe.dataset.src;
    iframe.style.display = abrindo ? 'block' : 'none';
    btn.textContent = abrindo ? '✕ Fechar mapa' : '📍 Ver no mapa';
}

// Previa Canva 
function toggleCanva(btn) {
    const iframe  = document.getElementById(btn.dataset.target);
    if (!iframe) return;
    const abrindo = iframe.style.display !== 'block';
    if (abrindo && !iframe.src) iframe.src = iframe.dataset.src;
    iframe.style.display = abrindo ? 'block' : 'none';
    btn.textContent = abrindo ? '✕ Fechar prévia' : '🎨 Ver prévia do álbum';
}

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    marcarPaginaAtiva();
    initCalculadora();
});
