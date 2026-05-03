const SU_URL = 'https://yumoofwfcxujcdhelwjj.supabase.co';
const SU_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bW9vZndmY3h1amNkaGVsd2pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MzY4OTMsImV4cCI6MjA5MzAxMjg5M30.H3s4bQnlUQiWWVIRKzH0Wzi72HjMepQqXRecKRmwdoY';

let db = null;
let agreementId = null;
let agreementRow = null;
let agreementData = null;
let clientSignersCount = 1;
const CLIENT_ZOOM_STORAGE_KEY = 'somosdos.clientZoom';
const CLIENT_ZOOM_OPTIONS = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 2, 3];
let clientZoom = getStoredClientZoom();
let lastClientFitWidth = 0;

if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
}

function getDb() {
    if (!db && window.supabase) db = window.supabase.createClient(SU_URL, SU_KEY);
    return db;
}

function getStoredClientZoom() {
    try {
        const stored = Number(window.localStorage?.getItem(CLIENT_ZOOM_STORAGE_KEY));
        return Number.isFinite(stored) ? clampClientZoom(stored) : 1;
    } catch (_) {
        return 1;
    }
}

function storeClientZoom() {
    try {
        window.localStorage?.setItem(CLIENT_ZOOM_STORAGE_KEY, String(clientZoom));
    } catch (_) {}
}

function clampClientZoom(value) {
    const min = CLIENT_ZOOM_OPTIONS[0];
    const max = CLIENT_ZOOM_OPTIONS[CLIENT_ZOOM_OPTIONS.length - 1];
    return Math.min(max, Math.max(min, Number(value) || 1));
}

function parseAgreementContent(content) {
    let parsed = content;
    if (typeof parsed === 'string') {
        try { parsed = JSON.parse(parsed); } catch (_) {}
    }

    while (parsed && parsed.html && typeof parsed.html === 'string' && parsed.html.trim().startsWith('{')) {
        try {
            const inner = JSON.parse(parsed.html);
            if (!inner.html) break;
            parsed = inner;
        } catch (_) {
            break;
        }
    }

    return parsed;
}

function showError(message) {
    document.getElementById('client-loader')?.classList.add('hidden');
    const error = document.getElementById('client-error');
    if (error) {
        error.querySelector('p').textContent = message || 'Revisa el enlace o intenta abrirlo de nuevo.';
        error.classList.remove('hidden');
    }
}

function hideLoader() {
    document.getElementById('client-loader')?.classList.add('hidden');
}

function getZoomWrapper() {
    return document.getElementById('zoom-wrapper');
}

function resetClientScroll() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
}

async function waitForClientFonts() {
    if (!document.fonts?.ready) return;

    try {
        await Promise.race([
            document.fonts.ready,
            new Promise(resolve => setTimeout(resolve, 1600))
        ]);
    } catch (_) {}
}

function isDesktopZoomEnabled() {
    return window.matchMedia?.('(min-width: 900px)')?.matches ?? false;
}

function getNextZoom(direction) {
    if (direction > 0) {
        return CLIENT_ZOOM_OPTIONS.find(option => option > clientZoom + 0.001) || CLIENT_ZOOM_OPTIONS[CLIENT_ZOOM_OPTIONS.length - 1];
    }

    return [...CLIENT_ZOOM_OPTIONS].reverse().find(option => option < clientZoom - 0.001) || CLIENT_ZOOM_OPTIONS[0];
}

function formatZoomLabel(value) {
    return `${Math.round(value * 100)}%`;
}

function syncZoomControls() {
    const controls = document.getElementById('client-zoom-controls');
    if (!controls) return;

    const viewport = document.getElementById('client-viewport');
    const shouldShow = isDesktopZoomEnabled() && viewport && !viewport.classList.contains('hidden');
    controls.classList.toggle('hidden', !shouldShow);

    const percent = document.getElementById('client-zoom-percent');
    if (percent) percent.textContent = formatZoomLabel(clientZoom);

    document.querySelectorAll('[data-client-zoom]').forEach(btn => {
        const value = Number(btn.dataset.clientZoom);
        btn.classList.toggle('active', Math.abs(value - clientZoom) < 0.001);
    });

    const zoomOut = document.getElementById('client-zoom-out');
    const zoomIn = document.getElementById('client-zoom-in');
    if (zoomOut) zoomOut.disabled = clientZoom <= CLIENT_ZOOM_OPTIONS[0] + 0.001;
    if (zoomIn) zoomIn.disabled = clientZoom >= CLIENT_ZOOM_OPTIONS[CLIENT_ZOOM_OPTIONS.length - 1] - 0.001;
}

function toggleZoomMenu(forceOpen) {
    const menu = document.getElementById('client-zoom-menu');
    const toggle = document.getElementById('client-zoom-toggle');
    if (!menu || !toggle) return;

    const willOpen = forceOpen ?? menu.classList.contains('hidden');
    menu.classList.toggle('hidden', !willOpen);
    toggle.setAttribute('aria-expanded', String(willOpen));
}

function setClientZoom(nextZoom) {
    const scrollRoot = document.scrollingElement || document.documentElement;
    const previousMaxY = Math.max(0, scrollRoot.scrollHeight - window.innerHeight);
    const previousRatioY = previousMaxY > 0 ? scrollRoot.scrollTop / previousMaxY : 0;

    clientZoom = clampClientZoom(nextZoom);
    storeClientZoom();
    fitDocument(true);
    syncZoomControls();

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const nextMaxY = Math.max(0, scrollRoot.scrollHeight - window.innerHeight);
            window.scrollTo({ top: previousRatioY * nextMaxY });
            toggleFabByScroll();
        });
    });
}

function initClientZoomControls() {
    const controls = document.getElementById('client-zoom-controls');
    if (!controls) return;

    document.getElementById('client-zoom-out')?.addEventListener('click', () => setClientZoom(getNextZoom(-1)));
    document.getElementById('client-zoom-in')?.addEventListener('click', () => setClientZoom(getNextZoom(1)));
    document.getElementById('client-zoom-toggle')?.addEventListener('click', event => {
        event.stopPropagation();
        toggleZoomMenu();
    });

    document.getElementById('client-zoom-menu')?.addEventListener('click', event => {
        const target = event.target.closest('button');
        if (!target) return;

        if (target.dataset.clientZoom) setClientZoom(Number(target.dataset.clientZoom));
        if (target.dataset.clientZoomAction === 'out') setClientZoom(getNextZoom(-1));
        if (target.dataset.clientZoomAction === 'in') setClientZoom(getNextZoom(1));
        toggleZoomMenu(false);
    });

    document.addEventListener('click', event => {
        if (!controls.contains(event.target)) toggleZoomMenu(false);
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') toggleZoomMenu(false);
    });

    syncZoomControls();
}

function replaceClientPlaceholders(html) {
    const clientParam = new URLSearchParams(window.location.search).get('client');
    if (!clientParam) return html;
    const clientName = clientParam.toUpperCase();
    return html.replace(/\[NOMBRE DEL CLIENTE\]/g, clientName).replace(/\[CLIENTE\]/g, clientName);
}

function sanitizeClientDocument() {
    const zoom = getZoomWrapper();
    if (!zoom) return;

    zoom.querySelectorAll('.page-controls, .move-controls, .style-selector.mini, .btn-delete-page, .btn-delete.page')
        .forEach(el => el.remove());

    zoom.querySelectorAll('[contenteditable]').forEach(el => {
        el.setAttribute('contenteditable', 'false');
    });

    zoom.querySelectorAll('input, textarea, select').forEach(el => {
        el.setAttribute('disabled', 'disabled');
    });

    zoom.querySelectorAll('.page button').forEach(btn => {
        const action = btn.getAttribute('onclick') || '';
        if (action.includes("clearSignature('client-")) {
            btn.removeAttribute('onclick');
            const id = action.match(/clearSignature\('([^']+)'\)/)?.[1];
            if (id) btn.addEventListener('click', () => clearSignature(id));
            return;
        }
        btn.remove();
    });
}

function wrapClientPages() {
    const zoom = getZoomWrapper();
    if (!zoom) return;

    Array.from(zoom.children).forEach(child => {
        if (!child.classList?.contains('page')) return;
        const slot = document.createElement('div');
        slot.className = 'client-page-slot';
        child.before(slot);
        slot.appendChild(child);
    });
}

function fitDocument(force = false) {
    const viewport = document.getElementById('client-viewport');
    const zoom = getZoomWrapper();
    if (!viewport || !zoom) return;

    const pageWidth = 800;
    const availableWidth = Math.max(320, document.documentElement.clientWidth);
    const desktopZoom = isDesktopZoomEnabled();
    const hasPages = Boolean(zoom.querySelector('.client-page-slot'));
    if (!force && hasPages && !desktopZoom && Math.abs(availableWidth - lastClientFitWidth) < 1) {
        syncZoomControls();
        return;
    }

    lastClientFitWidth = availableWidth;
    const pageGutter = desktopZoom ? 80 : 46;
    const fitScale = Math.min((availableWidth - pageGutter) / pageWidth, 1);
    const scale = Math.max(CLIENT_ZOOM_OPTIONS[0], fitScale * (desktopZoom ? clientZoom : 1));
    const visualWidth = pageWidth * scale;
    const viewportWidth = desktopZoom ? Math.max(availableWidth, visualWidth + 80) : availableWidth;

    zoom.style.position = 'relative';
    zoom.style.top = '';
    zoom.style.left = '';
    zoom.style.width = `${visualWidth}px`;
    zoom.style.transform = 'none';
    zoom.style.webkitTransform = 'none';
    zoom.style.zoom = '1';
    zoom.style.marginLeft = 'auto';
    zoom.style.marginRight = 'auto';
    viewport.style.width = `${viewportWidth}px`;

    requestAnimationFrame(() => {
        zoom.querySelectorAll('.client-page-slot').forEach(slot => {
            const page = slot.querySelector('.page');
            if (!page) return;

            slot.style.position = 'relative';
            slot.style.width = `${visualWidth}px`;
            slot.style.height = `${page.offsetHeight * scale}px`;
            slot.style.setProperty('--client-page-scale', scale);
            page.style.transformOrigin = 'top left';
            page.style.setProperty('transform', `scale(${scale})`, 'important');
            page.style.setProperty('-webkit-transform', `scale(${scale})`, 'important');
            page.style.zoom = '1';
            page.style.willChange = 'auto';
            page.style.backfaceVisibility = 'visible';
            page.style.webkitBackfaceVisibility = 'visible';
            page.style.transition = 'none';
            page.style.position = 'absolute';
            page.style.top = '0';
            page.style.left = '0';
        });
        viewport.style.height = '';
        syncZoomControls();
    });
}

function getPos(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const point = event.touches?.[0] || event.changedTouches?.[0] || event;
    const rectWidth = rect.width || canvas.clientWidth || canvas.width;
    const rectHeight = rect.height || canvas.clientHeight || canvas.height;
    return {
        x: (point.clientX - rect.left) * (canvas.width / rectWidth),
        y: (point.clientY - rect.top) * (canvas.height / rectHeight)
    };
}

function initSignaturePad(id) {
    const canvas = document.getElementById(`sig-canvas-${id}`);
    if (!canvas) return;

    if (id.startsWith('owner-')) {
        canvas.style.cursor = 'not-allowed';
        canvas.style.opacity = '0.8';
        canvas.style.pointerEvents = 'none';
        return;
    }

    const ctx = canvas.getContext('2d');
    let drawing = false;
    let activePointerId = null;
    let pointerEventsSeen = false;

    const start = event => {
        if (event.button !== undefined && event.button !== 0) return;
        drawing = true;
        canvas.dataset.hasDrawing = 'true';
        activePointerId = event.pointerId ?? null;
        if (activePointerId !== null && canvas.setPointerCapture) {
            try { canvas.setPointerCapture(activePointerId); } catch (_) {}
        }
        ctx.beginPath();
        const pos = getPos(canvas, event);
        ctx.moveTo(pos.x, pos.y);
        event.preventDefault();
    };

    const move = event => {
        if (!drawing) return;
        if (activePointerId !== null && event.pointerId !== undefined && event.pointerId !== activePointerId) return;
        const pos = getPos(canvas, event);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        event.preventDefault();
    };

    const stop = event => {
        if (activePointerId !== null && event?.pointerId !== undefined && event.pointerId !== activePointerId) return;
        if (activePointerId !== null && canvas.releasePointerCapture) {
            try { canvas.releasePointerCapture(activePointerId); } catch (_) {}
        }
        drawing = false;
        activePointerId = null;
    };

    ctx.strokeStyle = '#1A1A2E';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    if (window.PointerEvent) {
        const pointerStart = event => {
            pointerEventsSeen = true;
            start(event);
        };
        const pointerMove = event => {
            pointerEventsSeen = true;
            move(event);
        };
        const pointerStop = event => {
            pointerEventsSeen = true;
            stop(event);
        };
        const touchStart = event => {
            if (!pointerEventsSeen) start(event);
        };
        const touchMove = event => {
            if (!pointerEventsSeen) move(event);
        };
        const touchStop = event => {
            if (!pointerEventsSeen) stop(event);
        };

        canvas.addEventListener('pointerdown', pointerStart);
        canvas.addEventListener('pointermove', pointerMove);
        window.addEventListener('pointerup', pointerStop);
        window.addEventListener('pointercancel', pointerStop);
        canvas.addEventListener('touchstart', touchStart, { passive: false });
        canvas.addEventListener('touchmove', touchMove, { passive: false });
        canvas.addEventListener('touchend', touchStop);
        canvas.addEventListener('touchcancel', touchStop);
    } else {
        canvas.addEventListener('mousedown', start);
        canvas.addEventListener('mousemove', move);
        window.addEventListener('mouseup', stop);
        canvas.addEventListener('touchstart', start, { passive: false });
        canvas.addEventListener('touchmove', move, { passive: false });
        canvas.addEventListener('touchend', stop);
        canvas.addEventListener('touchcancel', stop);
    }
}

function restoreSig(id, url) {
    const canvas = document.getElementById(`sig-canvas-${id}`);
    if (!canvas || !url) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.dataset.hasDrawing = 'true';
    };
    img.src = url;
}

function clearSignature(id) {
    if (id.startsWith('owner-')) return;
    const canvas = document.getElementById(`sig-canvas-${id}`);
    if (!canvas) return;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    canvas.dataset.hasDrawing = 'false';
}

function isCanvasBlank(canvas) {
    const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    for (let i = 3; i < data.length; i += 4) {
        if (data[i] !== 0) return false;
    }
    return true;
}

function initSignatures() {
    clientSignersCount = agreementData.clientSignersCount ||
        document.querySelectorAll('[id^="sig-canvas-client-"]').length ||
        1;

    ['client-1', 'client-2', 'owner-andrea', 'owner-wai'].forEach(initSignaturePad);

    const sigs = agreementData.sigs || {};
    Object.keys(sigs).forEach(id => restoreSig(id, sigs[id]));
}

function toggleFabByScroll() {
    const fab = document.getElementById('client-fab-save');
    if (!fab) return;

    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total < 100 || window.scrollY > total * 0.35) fab.classList.add('visible');
    else fab.classList.remove('visible');
}

function showModal(icon, title, message) {
    const modal = document.getElementById('client-modal');
    if (!modal) return;
    document.getElementById('client-modal-icon').textContent = icon || '!';
    document.getElementById('client-modal-title').textContent = title || '';
    document.getElementById('client-modal-message').textContent = message || '';
    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('client-modal')?.classList.add('hidden');
}

function setSaving(isSaving) {
    const fab = document.getElementById('client-fab-save');
    if (!fab) return;
    fab.disabled = isSaving;
    fab.innerHTML = isSaving ? '<span>Enviando firma...</span>' : '<span>✨ Finalizar y Enviar Acuerdo</span>';
}

async function saveClientSignature() {
    const clientCanvases = Array.from({ length: clientSignersCount }, (_, index) =>
        document.getElementById(`sig-canvas-client-${index + 1}`)
    ).filter(Boolean);

    if (clientCanvases.length === 0) {
        showModal('!', 'Firma no encontrada', 'No encontramos el espacio de firma del cliente. Recarga el enlace e intenta de nuevo.');
        return;
    }

    const unsignedIndex = clientCanvases.findIndex(isCanvasBlank);
    if (unsignedIndex !== -1) {
        showModal('!', 'Firma pendiente', `Falta la firma ${unsignedIndex + 1}. Por favor firma antes de enviar el acuerdo.`);
        return;
    }

    setSaving(true);

    try {
        const sigs = { ...(agreementData.sigs || {}) };
        ['client-1', 'client-2', 'owner-andrea', 'owner-wai'].forEach(id => {
            const canvas = document.getElementById(`sig-canvas-${id}`);
            if (canvas) sigs[id] = canvas.toDataURL();
        });

        agreementData.sigs = sigs;
        agreementData.clientSigned = true;
        agreementData.clientSignersCount = clientSignersCount;

        const { error } = await getDb()
            .from('agreements')
            .update({
                html_content: JSON.stringify(agreementData),
                client_signed: true
            })
            .eq('id', agreementId);

        if (error) throw error;

        document.getElementById('client-fab-save')?.classList.remove('visible');
        showModal('✓', 'Firma enviada', 'Gracias por confiar en SomosDos Studio. Hemos recibido tu aceptación correctamente.');
    } catch (error) {
        console.error('Client signature save error:', error);
        showModal('!', 'Error de conexión', 'Hubo un problema enviando tu firma. Comprueba tu conexión e intenta de nuevo.');
    } finally {
        setSaving(false);
    }
}

function showTutorialStep(step) {
    document.querySelectorAll('.tutorial-step').forEach(el => {
        el.classList.toggle('hidden', el.dataset.step !== String(step));
    });
    document.querySelectorAll('.progress-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index + 1 === Number(step));
    });
}

function closeTutorial() {
    document.getElementById('client-tutorial')?.classList.add('hidden');
    toggleFabByScroll();
}

function initTutorial() {
    document.querySelectorAll('[data-next-step]').forEach(btn => {
        btn.addEventListener('click', () => showTutorialStep(btn.dataset.nextStep));
    });
    document.getElementById('close-client-tutorial')?.addEventListener('click', closeTutorial);
    document.getElementById('client-tutorial')?.classList.remove('hidden');
}

async function renderAgreement() {
    const zoom = getZoomWrapper();
    const viewport = document.getElementById('client-viewport');
    if (!zoom || !viewport || !agreementData?.html) {
        showError('Este acuerdo no tiene contenido disponible.');
        return;
    }

    zoom.innerHTML = replaceClientPlaceholders(agreementData.html);
    sanitizeClientDocument();
    wrapClientPages();
    initSignatures();
    await waitForClientFonts();

    hideLoader();
    viewport.classList.remove('hidden');
    fitDocument(true);
    resetClientScroll();
    requestAnimationFrame(resetClientScroll);
    initTutorial();
}

async function loadAgreement() {
    agreementId = new URLSearchParams(window.location.search).get('id');
    if (!agreementId) {
        showError('Falta el identificador del acuerdo.');
        return;
    }

    const client = getDb();
    if (!client) {
        showError('No se pudo inicializar la conexión.');
        return;
    }

    try {
        const { data, error } = await client
            .from('agreements')
            .select('id, client_name, html_content, created_at, client_signed')
            .eq('id', agreementId)
            .single();

        if (error) throw error;
        agreementRow = data;
        agreementData = parseAgreementContent(data.html_content);
        await renderAgreement();
    } catch (error) {
        console.error('Client agreement load error:', error);
        showError('No pudimos cargar este acuerdo desde la nube.');
    }
}

window.addEventListener('resize', () => fitDocument());
window.addEventListener('scroll', toggleFabByScroll, { passive: true });
window.addEventListener('pageshow', () => requestAnimationFrame(resetClientScroll));

document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('is-client-mode');
    document.body.classList.add('is-client-mode');
    resetClientScroll();
    initClientZoomControls();
    document.getElementById('client-modal-close')?.addEventListener('click', closeModal);
    document.getElementById('client-modal')?.addEventListener('click', event => {
        if (event.target.id === 'client-modal') closeModal();
    });
    document.getElementById('client-fab-save')?.addEventListener('click', saveClientSignature);
    loadAgreement();
});

window.clearSignature = clearSignature;
