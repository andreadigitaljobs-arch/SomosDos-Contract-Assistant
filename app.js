// --- CONFIGURACIÓN SEGURA ---
const SU_URL = 'https://yumoofwfcxujcdhelwjj.supabase.co';
const SU_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bW9vZndmY3h1amNkaGVsd2pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MzY4OTMsImV4cCI6MjA5MzAxMjg5M30.H3s4bQnlUQiWWVIRKzH0Wzi72HjMepQqXRecKRmwdoY';
const isCloudEnabled = SU_URL.includes('supabase.co');
let _supabase = null;

let historyStack = [];
let historyIndex = -1;
const MAX_HISTORY = 50;
let historyTimer = null;

function saveHistory(debounce = false) {
    if (debounce) {
        clearTimeout(historyTimer);
        historyTimer = setTimeout(() => saveHistory(false), 800);
        return;
    }

    const container = getContainer();
    if (!container) return;
    const state = {
        html: container.innerHTML,
        styles: {
            logoSize: getComputedStyle(document.documentElement).getPropertyValue('--logo-size'),
            logoSmallSize: getComputedStyle(document.documentElement).getPropertyValue('--logo-small-size')
        }
    };
    if (historyIndex >= 0 && historyStack[historyIndex].html === state.html) return;
    historyStack = historyStack.slice(0, historyIndex + 1);
    historyStack.push(state);
    if (historyStack.length > MAX_HISTORY) historyStack.shift();
    else historyIndex++;
    updateHistoryButtons();
}

function undo() {
    if (historyIndex > 0) { historyIndex--; restoreState(historyStack[historyIndex]); }
}

function redo() {
    if (historyIndex < historyStack.length - 1) { historyIndex++; restoreState(historyStack[historyIndex]); }
}

function restoreState(state) {
    const container = getContainer();
    if (!container || !state) return;
    container.innerHTML = state.html;
    if (state.styles) {
        document.documentElement.style.setProperty('--logo-size', state.styles.logoSize);
        document.documentElement.style.setProperty('--logo-small-size', state.styles.logoSmallSize);
    }
    setTimeout(() => {
        initSignaturePad('owner'); initSignaturePad('client');
        updateHistoryButtons();
        saveDocument(true);
    }, 10);
}

function updateHistoryButtons() {
    const btnUndo = document.querySelector('button[onclick="undo()"]');
    const btnRedo = document.querySelector('button[onclick="redo()"]');
    if (btnUndo) btnUndo.disabled = historyIndex <= 0;
    if (btnRedo) btnRedo.disabled = historyIndex >= historyStack.length - 1;
}

function getSupabase() {
    try {
        if (!_supabase && isCloudEnabled && window.supabase) {
            _supabase = window.supabase.createClient(SU_URL, SU_KEY);
        }
    } catch (e) {
        console.error("Supabase Init Error:", e);
    }
    return _supabase;
}

// --- ADN DE MARCA SOMOSDOS (Gradients DNA) ---
const SOMOSDOS_DNA = {
    theme1: {
        primary: ['#2D3EAF', '#7B3FE4'], // Blue to Purple
        accent: '#7B3FE4'
    },
    theme2: {
        primary: ['#2D3EAF', '#7B3FE4'],
        accent: '#7B3FE4'
    },
    theme3: {
        primary: ['#FFFFFF', '#6366F1', '#7B3FE4'], // White -> Indigo -> Purple
        accent: '#FFFFFF'
    }
};

// --- SELECTORES ROBUSTOS ---
function getContainer() { return document.getElementById('zoom-wrapper'); }

// --- MOTOR DE PLANTILLAS ---
function getCurrentClientName() {
    const input = document.getElementById('global-client-name');
    return (input && input.value && input.value.trim() !== "") ? input.value.trim() : "[NOMBRE DEL CLIENTE]";
}

// --- MOTOR DE PLANTILLAS ---
function createPageHTML(id, type = 'content') {
    const isCover = type === 'cover';
    const isSigs = type === 'signatures';
    const logoSrc = "assets/logo.png";
    const clientName = getCurrentClientName();
    const clientNameUpper = clientName.toUpperCase();

    let inner = '';
    if (isCover) {
        inner = `
            <div class="cover-layout">
                <div class="cover-logo"><img src="${logoSrc}" class="brand-logo-main"></div>
                <div class="cover-title editable" contenteditable="true">
                    <h2 class="gradient-text">ACUERDO DE SERVICIOS<br>PROFESIONALES</h2>
                    <div class="divider"></div>
                    <p class="subtitle">ALTA CREATIVIDAD & COMPROMISO PROFESIONAL</p>
                </div>
                <div class="cover-footer editable" contenteditable="true">
                    <div class="client-info">PREPARADO PARA: ${clientNameUpper}</div>
                    <div class="date-info">${getTodayDateSpanish()}</div>
                </div>
            </div>`;
    } else if (type === 'strategy') {
        inner = `
            <div class="content-header">
                <img src="${logoSrc}" class="brand-logo-small">
                <div class="header-tag">PROPUESTA DE ESTRATEGIA</div>
            </div>
            <div class="content-body editable" contenteditable="true">
                <h2 class="gradient-text">Estrategia de Reactivación Digital</h2>
                <p>Para la marca <strong>${clientName}</strong>, iniciaremos una fase intensiva de posicionamiento y captación.</p>
                
                <p><strong>Esta fase incluiría:</strong></p>
                <ul>
                    <li>Auditoría y reorganización estratégica del ecosistema digital.</li>
                    <li>Definición de pilares de contenido y tono de comunicación.</li>
                    <li>Producción de contenido audiovisual de alto impacto.</li>
                    <li>Edición profesional optimizada para conversión.</li>
                    <li>Configuración y optimización de pauta publicitaria (Ads).</li>
                </ul>
                <p><em>Este plan está diseñado para generar resultados medibles en el corto plazo.</em></p>
            </div>
            <div class="content-footer"><span class="page-number">Plan de Acción</span></div>`;
    } else if (type === 'landing') {
        inner = `
            <div class="content-header">
                <img src="${logoSrc}" class="brand-logo-small">
                <div class="header-tag">SERVICIOS DIGITALES</div>
            </div>
            <div class="content-body editable" contenteditable="true">
                <h2 class="gradient-text">Desarrollo de Landing Page</h2>
                <div class="spacer-sm"></div>
                <p>Desarrollaremos una plataforma de aterrizaje optimizada para convertir los leads de <strong>${clientName}</strong>.</p>
                <div class="landing-grid">
                    <div class="feature-card">
                        <div class="feature-icon">🚀</div>
                        <h4>Estructura de Venta</h4>
                        <p>Copywriting enfocado en los beneficios del servicio.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🎨</div>
                        <h4>Diseño UI/UX</h4>
                        <p>Interfaz moderna y alineada a la identidad de marca.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🔌</div>
                        <h4>Integraciones</h4>
                        <p>Conexión directa con WhatsApp o CRM.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">📦</div>
                        <h4>Optimización SEO</h4>
                        <p>Velocidad de carga y visibilidad inicial.</p>
                    </div>
                </div>
            </div>
            <div class="content-footer"><span class="page-number">Propuesta Digital</span></div>`;
    } else if (type === 'note_alcance') {
        inner = `
            <div class="content-header">
                <img src="${logoSrc}" class="brand-logo-small">
                <div class="header-tag">NOTA DE ALCANCE</div>
            </div>
            <div class="content-body editable" contenteditable="true">
                <h2 class="gradient-text">Ajuste de Alcance y Prioridades</h2>
                <div class="spacer-sm"></div>
                <p>En SomosDos Studio nos enfocamos en la entrega de resultados excepcionales para <strong>${clientName}</strong>. Debido a la optimización de los tiempos operativos de este periodo, hemos decidido ajustar el alcance inicial.</p>
                <div class="spacer-sm"></div>
                <p>Nos centraremos exclusivamente en la entrega de los servicios de mayor impacto inmediato definidos en este acuerdo, garantizando que la ejecución sea funcional, rápida y efectiva desde el primer día.</p>
                
                <p><em>Cualquier servicio adicional no contemplado en este ajuste podrá ser estructurado en una fase posterior.</em></p>
            </div>
            <div class="content-footer"><span class="page-number">Nota de Alcance</span></div>`;
    } else if (type === 'exchange_simple') {
        inner = `
            <div class="content-header">
                <img src="${logoSrc}" class="brand-logo-small">
                <div class="header-tag">ACUERDO DE INTERCAMBIO</div>
            </div>
            <div class="content-body editable" contenteditable="true">
                <h2 class="gradient-text">Detalle de la Colaboración</h2>
                <p>Como parte de este acuerdo de intercambio entre ambas partes:</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 40px 0;">
                    <div class="feature-card" style="text-align: left; padding: 40px; border: 1px dashed var(--accent-color);">
                        <div class="feature-icon" style="font-size: 2.5rem; margin-bottom: 20px;">🤝</div>
                        <h4 style="margin-bottom: 25px; font-size: 1.2rem;">${clientName} ofrecerá:</h4>
                        <ul class="exchange-list" style="list-style-type: none; padding-left: 0;">
                            <li style="margin-bottom: 15px; position: relative; padding-left: 30px;"><span style="position: absolute; left: 0; color: var(--accent-color); font-weight: bold;">→</span>[INSERTAR SERVICIO O PRODUCTO]</li>
                        </ul>
                    </div>
                    
                    <div class="feature-card" style="text-align: left; padding: 40px; background: rgba(123, 63, 228, 0.05);">
                        <div class="feature-icon" style="font-size: 2.5rem; margin-bottom: 20px;">💻</div>
                        <h4 style="margin-bottom: 25px; font-size: 1.2rem;">SomosDos desarrollará:</h4>
                        <ul class="exchange-list" style="list-style-type: none; padding-left: 0;">
                            <li style="margin-bottom: 15px; position: relative; padding-left: 30px;"><span style="position: absolute; left: 0; color: var(--accent-color); font-weight: bold;">→</span>[INSERTAR SERVICIO DIGITAL]</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="content-footer"><span class="page-number">Intercambio</span></div>`;
    } else if (type === 'exchange') {
        inner = `
            <div class="content-header">
                <img src="${logoSrc}" class="brand-logo-small">
                <div class="header-tag">ACUERDO DE COLABORACIÓN</div>
            </div>
            <div class="content-body editable" contenteditable="true">
                <h2 class="gradient-text">Intercambio de Servicios Full</h2>
                <p>Definición de los entregables mutuos entre SomosDos Studio y <strong>${clientName}</strong>:</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 40px 0;">
                    <div class="feature-card" style="text-align: left; padding: 40px;">
                        <div class="feature-icon" style="font-size: 2.5rem; margin-bottom: 20px;">🤝</div>
                        <h4 style="margin-bottom: 25px; font-size: 1.2rem;">${clientName} ofrecerá:</h4>
                        <ul class="exchange-list" style="list-style-type: none; padding-left: 0;">
                            <li style="margin-bottom: 15px; position: relative; padding-left: 30px;"><span style="position: absolute; left: 0; color: var(--accent-color); font-weight: bold;">→</span>[DETALLE 1]</li>
                            <li style="margin-bottom: 15px; position: relative; padding-left: 30px;"><span style="position: absolute; left: 0; color: var(--accent-color); font-weight: bold;">→</span>[DETALLE 2]</li>
                        </ul>
                    </div>
                    
                    <div class="feature-card" style="text-align: left; padding: 40px;">
                        <div class="feature-icon" style="font-size: 2.5rem; margin-bottom: 20px;">💻</div>
                        <h4 style="margin-bottom: 25px; font-size: 1.2rem;">SomosDos desarrollará:</h4>
                        <ul class="exchange-list" style="list-style-type: none; padding-left: 0;">
                            <li style="margin-bottom: 15px; position: relative; padding-left: 30px;"><span style="position: absolute; left: 0; color: var(--accent-color); font-weight: bold;">→</span>[ENTREGABLE 1]</li>
                            <li style="margin-bottom: 15px; position: relative; padding-left: 30px;"><span style="position: absolute; left: 0; color: var(--accent-color); font-weight: bold;">→</span>[ENTREGABLE 2]</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="content-footer"><span class="page-number">Intercambio</span></div>`;
    } else if (type === 'intro') {
        inner = `
            <div class="content-header">
                <img src="${logoSrc}" class="brand-logo-small">
                <div class="header-tag">BIENVENIDA</div>
            </div>
            <div class="content-body editable" contenteditable="true" style="display: flex; flex-direction: column; justify-content: center; height: 75%; text-align: center; padding: 0 60px;">
                <h2 class="gradient-text" style="font-size: 3rem; margin-bottom: 25px;">¡Gracias por elegirnos!</h2>
                <p style="font-size: 1.25rem; line-height: 1.8; color: var(--text-main); font-weight: 500;">
                    En <strong>SomosDos Studio</strong>, nos apasiona colaborar con marcas que tienen una visión clara y ambiciosa. Es un verdadero privilegio para nuestro equipo ser seleccionados para acompañar a <strong>${clientName}</strong> en este viaje de innovación y crecimiento.
                </p>
                <div style="width: 60px; height: 3px; background: var(--brand-gradient); margin: 40px auto; border-radius: 10px;"></div>
                <p style="font-size: 1.15rem; color: #64748b; font-style: italic; line-height: 1.6;">
                    "Nuestra misión es fusionar la máxima creatividad con tecnología de vanguardia para crear activos que no solo impacten visualmente, sino que transformen su negocio."
                </p>
                <p style="margin-top: 50px; font-weight: 800; font-size: 1.1rem; color: var(--brand-blue); letter-spacing: 1px;">ESTAMOS LISTOS PARA EMPEZAR.</p>
            </div>
            <div class="content-footer"><span class="page-number">Bienvenida</span></div>`;
    } else if (type === 'payment') {
        inner = `
            <div class="content-header">
                <img src="${logoSrc}" class="brand-logo-small">
                <div class="header-tag">INVERSIÓN Y PAGOS</div>
            </div>
            <div class="content-body editable" contenteditable="true">
                <h2 class="gradient-text">Propuesta Económica</h2>
                <p>Para la ejecución integral del proyecto <strong>${clientName}</strong>, se ha definido la siguiente inversión estratégica:</p>
                
                <div class="payment-card" style="background: var(--brand-gradient); color: white; padding: 40px; border-radius: 20px; text-align: center; margin: 30px 0; box-shadow: 0 10px 30px rgba(123, 63, 228, 0.3);">
                    <label style="opacity: 0.8; font-size: 0.9rem; letter-spacing: 2px; font-weight: 800;">TOTAL INVERSIÓN</label>
                    <h2 style="font-size: 4rem; margin: 10px 0;">$ [MONTO]</h2>
                </div>
                
                <h4>Condiciones y Cronograma de Pagos:</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
                    <div class="feature-card" style="text-align: left; padding: 25px; border-left: 4px solid var(--brand-purple);">
                        <h5 class="gradient-text" style="font-size: 0.8rem; letter-spacing: 1px; margin-bottom: 5px;">50% INICIAL</h5>
                        <p style="font-size: 0.85rem; margin-top: 8px;">Para reserva de cupo, planificación e inicio formal de trabajos.</p>
                        <p style="font-weight: 800; margin-top: 15px; font-size: 1.2rem; color: var(--text-main);">$ [MONTO 50%]</p>
                    </div>
                    <div class="feature-card" style="text-align: left; padding: 25px; border-left: 4px solid var(--brand-blue);">
                        <h5 class="gradient-text" style="font-size: 0.8rem; letter-spacing: 1px; margin-bottom: 5px;">50% FINAL</h5>
                        <p style="font-size: 0.85rem; margin-top: 8px;">Previo a la entrega de accesos, archivos finales y cierre de proyecto.</p>
                        <p style="font-weight: 800; margin-top: 15px; font-size: 1.2rem; color: var(--text-main);">$ [MONTO 50%]</p>
                    </div>
                </div>
                
                <div class="spacer-sm"></div>
                <p style="font-size: 0.85rem; color: #64748b;"><em>* El método de pago se definirá a convenir entre ambas partes. Los precios no incluyen impuestos a menos que se especifique lo contrario.</em></p>
            </div>
            <div class="content-footer"><span class="page-number">Propuesta Económica</span></div>`;
    } else if (isSigs) {
        inner = `
            <div class="signature-layout">
                <div class="signature-top">
                    <h3 class="editable" contenteditable="true">ACEPTACIÓN Y FIRMAS</h3>
                    <p>Al firmar este documento, ambas partes aceptan los términos y condiciones para <strong>${clientName}</strong>.</p>
                </div>
                <div class="signature-grid">
                    <div class="sig-box">
                        <div class="sig-line-container"><canvas id="sig-canvas-owner" class="sig-canvas" width="300" height="100"></canvas></div>
                        <p class="sig-name">SomosDos Studio</p>
                        <p class="sig-detail">Representante Autorizado</p>
                        <button class="btn-clear-sig" onclick="clearSignature('owner')">Limpiar</button>
                    </div>
                    <div class="sig-box">
                        <div class="sig-line-container"><canvas id="sig-canvas-client" class="sig-canvas" width="300" height="100"></canvas></div>
                        <p class="sig-name editable" contenteditable="true">${clientNameUpper}</p>
                        <p class="sig-detail">Firma Digital del Cliente</p>
                        <button class="btn-clear-sig" onclick="clearSignature('client')">Limpiar</button>
                    </div>
                </div>
            </div>`;
    } else {
        inner = `
            <div class="content-header">
                <img src="${logoSrc}" class="brand-logo-small">
                <div class="header-tag">ACUERDO DE COLABORACIÓN</div>
            </div>
            <div class="content-body editable" contenteditable="true">
                <p>Este documento organiza los puntos conversados para <strong>${clientName}</strong> y establece el alcance de la colaboración.</p>
                
                <h3>Acuerdos Generales</h3>
                <p>Nos enfocaremos en desarrollar y ajustar los sistemas digitales para optimizar los resultados de tu marca.</p>
                
                <p><strong>Incluye:</strong></p>
                <ul>
                    <li>[SERVICIO O ENTREGABLE 1]</li>
                    <li>[SERVICIO O ENTREGABLE 2]</li>
                    <li>Ajustes y validaciones previas al lanzamiento.</li>
                </ul>
                
                <p><strong>Tiempo estimado:</strong> [TIEMPO ESTIMADO] aproximadamente.</p>
            </div>
            <div class="content-footer"><span class="page-number">Página</span></div>`;
    }

    return `
        <div class="page-controls">
            <div class="move-controls">
                <button class="btn-move" title="Subir Página" onclick="movePage('${id}', 'up')">↑</button>
                <button class="btn-move" title="Bajar Página" onclick="movePage('${id}', 'down')">↓</button>
                <button class="btn-move" title="Cambiar Diseño" onclick="toggleLayout('${id}')">◫</button>
                <button class="btn-move" title="Actualizar Formato" onclick="updatePageFormat('${id}')">🪄</button>
            </div>
            <button class="btn-delete-page" title="Eliminar Página" onclick="deletePage('${id}')">×</button>
            <div class="style-selector mini">
                <div class="style-dot dot-1" onclick="setPageTheme('${id}', 1)" title="Estilo Clásico"></div>
                <div class="style-dot dot-2" onclick="setPageTheme('${id}', 2)" title="Estilo SomosDos"></div>
                <div class="style-dot dot-3" onclick="setPageTheme('${id}', 3)" title="Estilo Premium"></div>
            </div>
        </div>
        <div class="page-content canvas-element">
            <div class="bg-blobs">
                <div class="blob blob-1"></div>
                <div class="blob blob-2"></div>
            </div>
            ${inner}
        </div>`;
}

// --- FUNCIONES DE PÁGINA ---
function addNewPage(type = 'content') {
    const container = getContainer();
    if (!container) return;

    const id = Date.now() + Math.floor(Math.random() * 1000);
    const page = document.createElement('section');
    page.id = `page-${id}`;
    page.setAttribute('data-page-type', type);
    page.innerHTML = createPageHTML(id, type);
    container.appendChild(page);

    setPageTheme(id, 1, true); // Inicializar sin guardar
    updatePageNumbers();
    if (type === 'signatures') {
        setTimeout(() => { initSignaturePad('owner'); initSignaturePad('client'); }, 50);
    }
    saveHistory();

    // Auto-setup for Specific Pages
    if (type === 'strategy' || type === 'landing' || type === 'exchange') {
        setTimeout(() => {
            const p = document.getElementById(`page-${id}`);
            if (p) {
                if (type === 'landing') p.setAttribute('data-layout', 'glass');
                if (type === 'strategy') p.setAttribute('data-layout', 'split');
                p.classList.remove('theme-1');
                p.classList.add('theme-2');
                saveDocument(true);
            }
        }, 100);
    }
    
    return id;
}

function deletePage(id) {
    const p = document.getElementById(`page-${id}`);
    if (p) { p.remove(); updatePageNumbers(); saveDocument(true); saveHistory(); }
}

function movePage(id, dir) {
    const p = document.getElementById(`page-${id}`);
    if (!p) return;
    const container = getContainer();
    if (dir === 'up') {
        if (p.previousElementSibling) container.insertBefore(p, p.previousElementSibling);
    } else {
        if (p.nextElementSibling) container.insertBefore(p.nextElementSibling, p);
    }
    updatePageNumbers();
    saveDocument(true);
    saveHistory();
}

function toggleLayout(id) {
    const p = document.getElementById(`page-${id}`);
    if (!p) return;
    const current = p.getAttribute('data-layout') || 'standard';
    const layouts = ['standard', 'centered', 'split', 'glass'];
    const nextIdx = (layouts.indexOf(current) + 1) % layouts.length;
    const next = layouts[nextIdx];

    p.setAttribute('data-layout', next);
    saveDocument(true);
    saveHistory();

    const names = { standard: 'Estándar', centered: 'Centrado', split: 'Columnas', glass: 'Premium Glass' };
    showToast(`Diseño: ${names[next]}`);
}

function updatePageFormat(id) {
    const p = document.getElementById(`page-${id}`);
    if (!p) return;

    // Si no tiene blobs, los inyectamos
    if (!p.querySelector('.bg-blobs')) {
        const content = p.querySelector('.page-content');
        if (content) {
            const blobs = document.createElement('div');
            blobs.className = 'bg-blobs';
            blobs.innerHTML = '<div class="blob blob-1"></div><div class="blob blob-2"></div>';
            content.prepend(blobs);
        }
    }

    // Forzar actualización de controles si son viejos
    const controls = p.querySelector('.page-controls');
    if (controls) {
        controls.innerHTML = `
            <div class="move-controls">
                <button class="btn-move" title="Subir Página" onclick="movePage('${id}', 'up')">↑</button>
                <button class="btn-move" title="Bajar Página" onclick="movePage('${id}', 'down')">↓</button>
                <button class="btn-move" title="Cambiar Diseño" onclick="toggleLayout('${id}')">◫</button>
                <button class="btn-move" title="Actualizar Formato" onclick="updatePageFormat('${id}')">🪄</button>
            </div>
            <button class="btn-delete-page" title="Eliminar Página" onclick="deletePage('${id}')">×</button>
            <div class="style-selector mini">
                <div class="style-dot dot-1" onclick="setPageTheme('${id}', 1)" title="Estilo Clásico"></div>
                <div class="style-dot dot-2" onclick="setPageTheme('${id}', 2)" title="Estilo SomosDos"></div>
                <div class="style-dot dot-3" onclick="setPageTheme('${id}', 3)" title="Estilo Premium"></div>
            </div>`;
    }

    showToast("✨ Formato Renovado");
    saveDocument(true);
    saveHistory();
}

function updatePageNumbers() {
    document.querySelectorAll('.page').forEach((p, i) => {
        const span = p.querySelector('.page-number');
        if (span) span.textContent = `Página ${(i + 1).toString().padStart(2, '0')}`;
    });
}

// --- DISEÑO ---
function resizeLogo(v, t) {
    document.documentElement.style.setProperty(t === 'main' ? '--logo-size' : '--logo-small-size', `${v}px`);
    saveHistory(true); // Debounced
}
function resizePageSpacing(v, id, t) {
    const p = document.getElementById(`page-${id}`);
    if (!p) return;
    if (t === 'top') p.querySelector('.page-content').style.setProperty('--page-padding-top', `${v}px`);
    else if (t === 'bottom') p.style.setProperty('--header-margin', `${v}px`);
    else p.style.setProperty('--text-spacing', `${v}px`);
    saveHistory(true); // Debounced
}
// --- TEMAS Y DISEÑO ---
function setPageTheme(id, n, noSave = false) {
    const p = document.getElementById(`page-${id}`);
    if (!p) return;

    p.className = `page theme-${n}`;
    p.setAttribute('data-theme', n);

    // Logo Switch (Official WHITE Logo for Themes 2 & 3)
    const logos = p.querySelectorAll('.brand-logo-main, .brand-logo-small');
    logos.forEach(img => {
        img.style.filter = 'none'; // Reset
        const isSmall = img.classList.contains('brand-logo-small');

        // Theme 3: All White
        // Theme 2: Header (Small) is White, Cover (Main) is Dark
        if (n == 3 || (n == 2 && isSmall)) {
            img.src = 'assets/logo-white.png';
            img.onerror = () => {
                img.src = 'assets/logo.png';
                img.style.filter = 'brightness(10) invert(1)';
            };
        } else {
            img.src = 'assets/logo.png';
            img.onerror = null;
        }
    });

    // Actualizar puntitos mini
    p.querySelectorAll('.page-controls .style-dot').forEach((dot, i) => {
        dot.classList.toggle('active', (i + 1) == n);
    });

    if (!noSave) { saveDocument(true); saveHistory(); }
}

function setGlobalTheme(n) {
    document.querySelectorAll('.page').forEach(p => {
        const id = p.id.replace('page-', '');
        setPageTheme(id, n, true);
    });

    document.querySelectorAll('#design-panel .style-dot').forEach((d, i) => {
        d.classList.toggle('active', (i + 1) == n);
    });

    saveDocument(true);
}

// --- PERSISTENCIA ---
async function saveDocument(isAuto = false) {
    const container = getContainer();
    if (!container) return;

    // Capturar valores de inputs antes de guardar el HTML
    container.querySelectorAll('input').forEach(input => {
        if (input.type === 'range' || input.type === 'text') {
            input.setAttribute('value', input.value);
        }
    });

    const data = {
        id: new URLSearchParams(window.location.search).get('id') || null,
        html: container.innerHTML,
        sigs: {
            owner: document.getElementById('sig-canvas-owner')?.toDataURL() || null,
            client: document.getElementById('sig-canvas-client')?.toDataURL() || null
        },
        styles: {
            logoSize: getComputedStyle(document.documentElement).getPropertyValue('--logo-size'),
            logoSmallSize: getComputedStyle(document.documentElement).getPropertyValue('--logo-small-size')
        }
    };

    // Si el cliente acaba de firmar, marcar el dato explícitamente
    if (window._clientSignedFlag) {
        data.clientSigned = true;
    }

    localStorage.setItem('s2_data_v2', JSON.stringify(data));

    const db = getSupabase();
    if (db && data.id) {
        try {
            // Buscamos el nombre del cliente desde la p.sig-name correspondiente a la sección cliente
            const clientNameEls = document.querySelectorAll('.sig-name');
            let clientName = "Cliente Anon";
            if (clientNameEls.length > 1 && clientNameEls[1].textContent) {
                clientName = clientNameEls[1].textContent.trim();
            } else if (clientNameEls.length > 0) {
                clientName = clientNameEls[0].textContent.trim();
            }

            const { error } = await db.from('agreements').upsert({
                id: data.id,
                client_name: clientName,
                html_content: JSON.stringify(data),
                created_at: new Date()
            });

            if (error) throw error;
            if (!isAuto && !document.body.classList.contains('client-mode')) {
                showToast("¡Sincronizado con la Nube!");
            }
        } catch (e) {
            console.error(e);
            if (!isAuto && !document.body.classList.contains('client-mode')) {
                showToast("Guardado Local (Fallo Nube)");
            }
        }
    } else if (!isAuto && !document.body.classList.contains('client-mode')) {
        showToast("Guardado Localmente");
    }
}

// Handler exclusivo para el botón del Cliente
async function saveClientSignature() {
    const clientCanvas = document.getElementById('sig-canvas-client');
    if (clientCanvas) {
        showExportLoader("Enviando...", "Guardando tu firma segura en la nube");
        try {
            // Marcar explícitamente que el cliente firmó
            window._clientSignedFlag = true;
            await saveDocument(false);
            window._clientSignedFlag = false;
            hideExportLoader();
            showModal('🎉', '¡Firma Guardada y Enviada!', 'Gracias por confiar en SomosDos Studio. Hemos recibido tu firma de aceptación exitosamente. Ya puedes cerrar esta ventana.');

            const btn = document.getElementById('btn-client-save');
            if (btn) btn.style.display = 'none';
            const fab = document.getElementById('client-fab-save');
            if (fab) fab.style.display = 'none';

        } catch (e) {
            window._clientSignedFlag = false;
            hideExportLoader();
            showModal('❌', 'Error de Conexión', 'Hubo un problema enviando tu firma. Por favor comprueba tu conexión a internet e intenta de nuevo.');
        }
    }
}

async function loadDocument() {
    console.log("📂 Iniciando carga de documento...");
    const container = getContainer();
    if (!container) { console.error("❌ No se encontró el contenedor principal"); return; }

    const urlParams = new URLSearchParams(window.location.search);
    const cloudId = urlParams.get('id');
    const isClient = urlParams.get('mode') === 'client';

    // 1. Cargar desde la Nube si hay un ID (con Timeout de Seguridad)
    if (cloudId && isCloudEnabled) {
        console.log(`☁️ Intentando cargar ID: ${cloudId}`);
        const db = getSupabase();
        if (db) {
            try {
                // Timeout de 4 segundos para la nube
                const cloudPromise = db.from('agreements').select('html_content').eq('id', cloudId).single();
                const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Supabase Timeout")), 4000));

                const { data, error } = await Promise.race([cloudPromise, timeoutPromise]);

                if (error) throw error;
                if (data && data.html_content) {
                    console.log("✅ Datos cargados desde la Nube");
                    const parsedData = JSON.parse(data.html_content);
                    renderDocument(parsedData);
                    return;
                }
            } catch (e) {
                console.error("⚠️ Error/Timeout Nube:", e);
                showToast("Fallo Nube: Cargando Local...");
            }
        }
    }

    // 2. Fallback: LocalStorage
    console.log("🏠 Buscando en LocalStorage...");
    const raw = localStorage.getItem('s2_data_v2');
    if (raw && raw !== "undefined") {
        try {
            const data = JSON.parse(raw);
            if (data && data.html && data.html.includes('class="page"')) {
                console.log("✅ Datos cargados desde LocalStorage");
                renderDocument(data);
                return;
            }
        } catch (e) { console.error("❌ Error carga local:", e); }
    }

    // 3. Documento Nuevo (Último recurso):
    console.log("✨ Creando documento nuevo por defecto");
    addNewPage('cover');
    addNewPage('content');
    addNewPage('signatures');
}

function renderDocument(data) {
    const container = getContainer();
    if (!container || !data) return;

    container.innerHTML = data.html;
    if (data.styles) {
        document.documentElement.style.setProperty('--logo-size', data.styles.logoSize);
        document.documentElement.style.setProperty('--logo-small-size', data.styles.logoSmallSize);
    }

    setTimeout(() => {
        initSignaturePad('owner'); initSignaturePad('client');
        if (data.sigs?.owner) restoreSig('owner', data.sigs.owner);
        if (data.sigs?.client) restoreSig('client', data.sigs.client);

        // REPARACIÓN DE CONTROLES Y TEMAS (Inyectar mini-dots si faltan)
        document.querySelectorAll('.page').forEach(p => {
            const id = p.id.replace('page-', '');
            const theme = parseInt(p.getAttribute('data-theme')) || 1;

            // Si no tiene los selectores mini o controles de movimiento, se los inyectamos (re-generar controls)
            if (!p.querySelector('.style-selector.mini') || !p.querySelector('.move-controls')) {
                const controls = p.querySelector('.page-controls');
                if (controls) {
                    controls.innerHTML = `
                                    <div class="move-controls">
                                        <button class="btn-move" title="Subir Página" onclick="movePage('${id}', 'up')">↑</button>
                                        <button class="btn-move" title="Bajar Página" onclick="movePage('${id}', 'down')">↓</button>
                                        <button class="btn-move" title="Cambiar Diseño" onclick="toggleLayout('${id}')">◫</button>
                                        <button class="btn-move" title="Actualizar Formato" onclick="updatePageFormat('${id}')">🪄</button>
                                    </div>
                                    <button class="btn-delete-page" title="Eliminar Página" onclick="deletePage('${id}')">×</button>
                                    <div class="style-selector mini">
                                        <div class="style-dot dot-1" onclick="setPageTheme('${id}', 1)" title="Estilo Clásico"></div>
                                        <div class="style-dot dot-2" onclick="setPageTheme('${id}', 2)" title="Estilo SomosDos"></div>
                                        <div class="style-dot dot-3" onclick="setPageTheme('${id}', 3)" title="Estilo Premium"></div>
                                    </div>`;
                }
            }

            // Restaurar visuales de forma aislada
            setPageTheme(id, theme, true);
        });

        // Update global client input from document
        const clientNameEls = document.querySelectorAll('.sig-name');
        if (clientNameEls.length > 1 && clientNameEls[1].textContent && clientNameEls[1].textContent.trim() !== "[CLIENTE]") {
            const globalInput = document.getElementById('global-client-name');
            if (globalInput) globalInput.value = clientNameEls[1].textContent.trim();
        }

    }, 100);
}

// Sincroniza el input global de la barra superior con el texto de la firma del cliente y la portada
function syncClientName(val) {
    // Actualizar sección de firmas
    const clientNameEls = document.querySelectorAll('.sig-name');
    if (clientNameEls.length > 1) {
        clientNameEls[1].textContent = val || "[CLIENTE]";
    }

    // Actualizar portada (client-info)
    const clientInfoEls = document.querySelectorAll('.client-info');
    clientInfoEls.forEach(el => {
        el.textContent = `PREPARADO PARA: ${val.toUpperCase() || "[NOMBRE DEL CLIENTE]"}`;
    });

    saveHistory(true);
}

// --- FIRMAS ---
function restoreSig(id, url) {
    const canvas = document.getElementById(`sig-canvas-${id}`);
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.src = url;
}

function initSignaturePad(id) {
    const canvas = document.getElementById(`sig-canvas-${id}`);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let drawing = false;
    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const ex = e.touches ? e.touches[0].clientX : e.clientX;
        const ey = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: (ex - rect.left) * (canvas.width / rect.width), y: (ey - rect.top) * (canvas.height / rect.height) };
    };
    const start = (e) => { drawing = true; ctx.beginPath(); const p = getPos(e); ctx.moveTo(p.x, p.y); };
    const move = (e) => { if (!drawing) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); e.preventDefault(); };
    const stop = () => { drawing = false; saveDocument(true); saveHistory(); };
    ctx.strokeStyle = '#1A1A2E'; ctx.lineWidth = 2; ctx.lineCap = 'round';
    canvas.addEventListener('mousedown', start); canvas.addEventListener('mousemove', move); canvas.addEventListener('mouseup', stop);
    canvas.addEventListener('touchstart', start); canvas.addEventListener('touchmove', move); canvas.addEventListener('touchend', stop);
}

function clearSignature(id) {
    const canvas = document.getElementById(`sig-canvas-${id}`);
    if (canvas) {
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        saveDocument(true);
        saveHistory();
    }
}

function showExportLoader(title, msg) {
    return new Promise((resolve) => {
        const loader = document.getElementById('loader');
        if (!loader) { resolve(); return; }

        // 1. Reset ALL inline styles from previous hideExportLoader calls
        loader.style.cssText = '';

        // 2. Remove the hidden class
        loader.classList.remove('hidden');

        // 3. Force browser to acknowledge the element is visible before animating
        void loader.offsetHeight; // Force reflow

        // 4. Set content immediately
        const t = document.getElementById('loader-title');
        const m = document.getElementById('loader-msg');
        const p = document.getElementById('loader-progress');
        if (t) t.textContent = title || "Procesando...";
        if (m) m.textContent = msg || "Iniciando motor...";
        if (p) p.style.width = '5%';

        // 5. Now animate in
        loader.style.opacity = '1';
        loader.style.pointerEvents = 'all';

        // 6. Wait for the paint to happen before returning control
        setTimeout(resolve, 80);
    });
}

function updateExportProgress(percent, msg) {
    const p = document.getElementById('loader-progress');
    const m = document.getElementById('loader-msg');

    if (p) {
        const currentW = parseFloat(p.style.width) || 0;
        const newW = Math.max(currentW, percent);
        p.style.width = `${newW}%`;
    }
    if (msg && m) m.textContent = msg;
}

function hideExportLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    // Fade out
    loader.style.opacity = '0';
    loader.style.pointerEvents = 'none';

    setTimeout(() => {
        // After transition, hide completely via class (not inline display)
        loader.classList.add('hidden');
        // Clear ALL inline styles so next showExportLoader starts clean
        loader.style.cssText = '';
        const p = document.getElementById('loader-progress');
        if (p) p.style.width = '0%';
    }, 500);
}

async function generateProfessionalPDF() {
    await showExportLoader("Generando PDF Premium", "Iniciando motor de alta fidelidad...");

    try {
        const { jsPDF } = window.jspdf;
        const pages = document.querySelectorAll('.page');
        const pdf = new jsPDF('p', 'mm', 'a4');

        for (let i = 0; i < pages.length; i++) {
            updateExportProgress((i / pages.length) * 100, `Capturando página ${i + 1} de ${pages.length}...`);
            const canvas = await captureZeroLoss(pages[i]);
            if (i > 0) pdf.addPage();
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
        }

        updateExportProgress(100, "¡Todo listo! Descargando...");
        pdf.save("SomosDos_Acuerdo_HD.pdf");
        setTimeout(hideExportLoader, 1000);
    } catch (e) {
        console.error("PDF Export Error:", e);
        showModal('❌', 'Error en PDF', 'Ocurrió un error al generar el PDF. Intenta de nuevo o revisa la consola.');
        hideExportLoader();
    } finally {
        setTimeout(hideExportLoader, 3000);
    }
}

async function downloadAsImages(mode = 'zip') {
    await showExportLoader(mode === 'zip' ? "Preparando ZIP 4K" : "Procesando Imagen HD", "Inicializando captura...");

    try {
        const pages = document.querySelectorAll('.page');
        if (mode === 'zip') {
            const zip = new JSZip();
            for (let i = 0; i < pages.length; i++) {
                updateExportProgress((i / pages.length) * 100, `Capturando página ${i + 1} de ${pages.length}...`);
                const canvas = await captureZeroLoss(pages[i]);
                const imgData = canvas.toDataURL('image/png').split(',')[1];
                zip.file(`SomosDos_Pagina_${i + 1}.png`, imgData, { base64: true });
            }
            updateExportProgress(95, "Comprimiendo paquete ZIP...");
            const content = await zip.generateAsync({ type: "blob" });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = "SomosDos_Fotos_4K.zip";
            link.click();
        } else {
            updateExportProgress(30, "Buscando página activa...");
            let targetPage = pages[0];
            let minDiff = Infinity;
            const viewportCenter = window.scrollY + (window.innerHeight / 2);
            pages.forEach(p => {
                const rect = p.getBoundingClientRect();
                const pageCenter = window.scrollY + rect.top + (rect.height / 2);
                const diff = Math.abs(viewportCenter - pageCenter);
                if (diff < minDiff) { minDiff = diff; targetPage = p; }
            });
            updateExportProgress(60, "Capturando con fidelidad 4K...");
            const canvas = await captureZeroLoss(targetPage);
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            const pageIdx = Array.from(pages).indexOf(targetPage) + 1;
            link.download = `SomosDos_Pagina_${pageIdx}.png`;
            link.click();
        }
        updateExportProgress(100, "¡Finalizado con éxito!");
        setTimeout(hideExportLoader, 1000);
    } catch (e) {
        console.error("Image/ZIP Export Error:", e);
        showModal('❌', 'Error en Exportación', 'Ocurrió un error al exportar. Intenta de nuevo o revisa la consola.');
        hideExportLoader();
    } finally {
        setTimeout(hideExportLoader, 3000);
    }
}

// --- HELPERS DE RENDERIZACIÓN ---
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function generateGradientBuffer(themeNum, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 1. Pintar fondo base sólido (Evita el lavado de color en PDF)
    const bgColor = themeNum === 3 ? '#080812' : '#FFFFFF';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    const dna = SOMOSDOS_DNA[`theme${themeNum}`];

    // 2. Toques de Luz 'Aurora' (Soft Elegance - Paridad Exacta)
    if (themeNum === 2 || themeNum === 1 || themeNum === 3) {
        // Opacidad muy suave (Efecto difuminado "Aire")
        const opacity = (themeNum === 3) ? 0.10 : 0.18;

        // Esquina Superior Derecha (Aura amplia y lejana)
        const grad1 = ctx.createRadialGradient(width * 0.95, height * 0.05, 0, width * 0.95, height * 0.05, width * 1.2);
        grad1.addColorStop(0, hexToRgba(dna.primary[0], opacity));
        grad1.addColorStop(1, 'transparent');
        ctx.fillStyle = grad1;
        ctx.fillRect(0, 0, width, height);

        // Esquina Inferior Izquierda (Aura amplia y lejana)
        const grad2 = ctx.createRadialGradient(width * 0.05, height * 0.95, 0, width * 0.05, height * 0.95, width * 1.2);
        grad2.addColorStop(0, hexToRgba(dna.primary[1], opacity));
        grad2.addColorStop(1, 'transparent');
        ctx.fillStyle = grad2;
        ctx.fillRect(0, 0, width, height);
    }

    return canvas.toDataURL('image/png');
}

// --- CAPTURA PIXEL-PARITY (DNA Match Engine) ---
async function captureZeroLoss(pageEl) {
    const themeNum = pageEl.classList.contains('theme-3') ? 3 : (pageEl.classList.contains('theme-2') ? 2 : 1);
    const dna = SOMOSDOS_DNA[`theme${themeNum}`];
    const content = pageEl.querySelector('.canvas-element');
    const container = getContainer();

    if (document.fonts) await document.fonts.ready;

    const originalTransform = container.style.transform;
    container.style.transform = 'scale(1)';
    document.body.style.filter = 'blur(1px)';
    await new Promise(r => setTimeout(r, 450));

    // RASTERIZACIÓN DE ADN (Manual Stop Mapping)
    const targets = content.querySelectorAll('h2, h3, h4, .sig-name');
    const backups = [];

    for (const el of targets) {
        // En Theme 3, H2 y el header de firmas son "Hero" (degradado completo)
        const isTheme3Hero = themeNum === 3 && (el.tagName === 'H2' || el.closest('.signature-top'));
        const hasDnaGradient = isTheme3Hero || themeNum === 2 || themeNum === 1;

        if (hasDnaGradient) {
            backups.push({ el: el, html: el.innerHTML, styles: el.style.cssText });
            try {
                const rect = el.getBoundingClientRect();
                const scale = 5;
                const textCanvas = document.createElement('canvas');
                textCanvas.width = rect.width * scale;
                textCanvas.height = rect.height * scale;
                const tCtx = textCanvas.getContext('2d');
                tCtx.scale(scale, scale);

                // ÁNGULO 135 GRADOS (Vector Diagonal)
                const grad = tCtx.createLinearGradient(0, 0, rect.width, rect.height);

                if (isTheme3Hero) {
                    // ADN COMPLETO (SomosDos DNA)
                    dna.primary.forEach((color, i) => grad.addColorStop(i / (dna.primary.length - 1), color));
                } else {
                    // PRIMARY ADN (2 COLORS)
                    grad.addColorStop(0, dna.primary[0]);
                    grad.addColorStop(1, dna.primary[1]);
                }

                tCtx.fillStyle = grad;
                const style = window.getComputedStyle(el);
                tCtx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
                tCtx.textBaseline = 'top';

                const lines = el.innerText.split('\n');
                let y = 0;
                lines.forEach(line => {
                    tCtx.fillText(line.trim(), 0, y);
                    y += (parseInt(style.lineHeight) || parseInt(style.fontSize)) * 1.1;
                });

                const img = new Image();
                img.src = textCanvas.toDataURL();
                img.style.cssText = `width: ${rect.width}px; height: ${rect.height}px; display: block; filter: none !important; opacity: 1 !important; transform: none !important;`;

                el.innerHTML = '';
                // Limpiar estilos que causan el "bloque blanco" en html2canvas
                el.style.setProperty('background', 'transparent', 'important');
                el.style.setProperty('-webkit-background-clip', 'initial', 'important');
                el.style.setProperty('-webkit-text-fill-color', 'transparent', 'important');
                el.style.setProperty('color', 'transparent', 'important');

                el.appendChild(img);
            } catch (e) { console.warn("Raster Error:", e); }
        }
    }

    try {
        const finalCanvas = await html2canvas(content, {
            scale: 4,
            useCORS: true,
            allowTaint: true,
            backgroundColor: null, // Dejamos que el buffer dibuje el fondo real!
            logging: false,
            ignoreElements: (node) => node.classList?.contains('page-controls') || node.classList?.contains('btn-clear-sig'),
            onclone: (clonedDoc) => {
                const clonedContent = clonedDoc.getElementById(pageEl.id)?.querySelector('.page-content');
                if (clonedContent) {
                    const width = clonedContent.offsetWidth || 800;
                    const height = clonedContent.offsetHeight || 1131;
                    const buffer = generateGradientBuffer(themeNum, width * 2, height * 2);

                    if (themeNum === 3) {
                        clonedContent.style.background = '#080812'; // El tema 3 es oscuro puro para evitar ruido extra
                    } else {
                        clonedContent.style.background = `url(${buffer}) center / 100% 100% no-repeat`; // Fondo integral con luces
                    }

                    // 1. FIX DE VIDRIO (Glassmorphism Fallback)
                    const glassElements = clonedContent.querySelectorAll('.feature-card, [data-layout="split"] .content-body ul, [data-layout="glass"] .content-body');
                    glassElements.forEach(el => {
                        el.style.backdropFilter = 'none';
                        el.style.webkitBackdropFilter = 'none';
                        el.style.backgroundColor = themeNum === 3 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.98)';
                        el.style.border = themeNum === 3 ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)';
                    });

                    // 2. FIX DE DIAGONAL & LOGO RESCUE (SVG Aurora)
                    const header = clonedContent.querySelector('.content-header');
                    if (themeNum === 2 && header) {
                        header.style.clipPath = 'none';
                        header.style.webkitClipPath = 'none';
                        header.style.background = 'transparent';
                        header.style.position = 'relative';
                        header.style.height = '180px';
                        header.style.paddingTop = '60px';
                        header.style.marginTop = '-80px';
                        header.style.display = 'flex';
                        header.style.alignItems = 'center';
                        header.style.zIndex = '1';

                        // Forzar logo blanco brillante
                        const logo = header.querySelector('.brand-logo-small');
                        if (logo) {
                            logo.style.filter = 'brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0,0,0,0.2))';
                            logo.style.position = 'relative';
                            logo.style.zIndex = '10';
                        }
                        const tag = header.querySelector('.header-tag');
                        if (tag) {
                            tag.style.color = '#FFFFFF';
                            tag.style.opacity = '1';
                            tag.style.zIndex = '10';
                        }

                        const svgNS = "http://www.w3.org/2000/svg";
                        const svg = clonedDoc.createElementNS(svgNS, "svg");
                        svg.setAttribute("viewBox", "0 0 800 240");
                        svg.setAttribute("preserveAspectRatio", "none");
                        svg.style.cssText = `position: absolute; top: 0; left: -60px; width: calc(100% + 120px); height: 100%; z-index: -1; pointer-events: none;`;

                        const polygon = clonedDoc.createElementNS(svgNS, "polygon");
                        polygon.setAttribute("points", "0,0 800,0 800,210 0,240");
                        polygon.setAttribute("fill", "url(#gradAurora)");

                        const defs = clonedDoc.createElementNS(svgNS, "defs");
                        const linearGrad = clonedDoc.createElementNS(svgNS, "linearGradient");
                        linearGrad.setAttribute("id", "gradAurora");
                        linearGrad.setAttribute("x1", "0%"); linearGrad.setAttribute("y1", "0%");
                        linearGrad.setAttribute("x2", "100%"); linearGrad.setAttribute("y2", "0%");

                        const stop1 = clonedDoc.createElementNS(svgNS, "stop");
                        stop1.setAttribute("offset", "0%"); stop1.setAttribute("stop-color", "#2D3EAF");
                        const stop2 = clonedDoc.createElementNS(svgNS, "stop");
                        stop2.setAttribute("offset", "100%"); stop2.setAttribute("stop-color", "#7B3FE4");

                        linearGrad.appendChild(stop1);
                        linearGrad.appendChild(stop2);
                        defs.appendChild(linearGrad);
                        svg.appendChild(defs);
                        svg.appendChild(polygon);
                        header.prepend(svg);
                    }

                    // 3. FIX DE GRADIENTES EN TEXTO (Fallback para PDF en Theme 3)
                    // html2canvas no soporta -webkit-background-clip: text y pinta un bloque sólido.
                    // Aquí lo reemplazamos por un color sólido y limpio equivalente al degradado.
                    if (themeNum === 3) {
                        const headingTexts = clonedContent.querySelectorAll('h2, h3');
                        headingTexts.forEach(txt => {
                            txt.style.background = 'none';
                            txt.style.webkitBackgroundClip = 'initial';
                            txt.style.webkitTextFillColor = 'initial';
                            txt.style.color = '#818CF8'; // Color Índigo suave que representa el centro del degradado
                            txt.style.textShadow = 'none'; // Evitar doble rendering extraño en el PDF
                        });
                    }

                    // 4. FIX DE ICONOS (Pure Arrow Logic)
                    const layoutType = pageEl.getAttribute('data-layout');
                    const listItems = clonedContent.querySelectorAll('.content-body ul li');

                    listItems.forEach(li => {
                        // Limpiar cualquier inyección previa
                        li.querySelectorAll('.export-bullet-dot').forEach(d => d.remove());

                        if (layoutType === 'split') {
                            // En split mantenemos la flecha pero eliminamos el punto
                            li.style.listStyle = 'none';
                            // Intentamos forzar que el pseudo-elemento flecha sea nítido
                        } else if (layoutType === 'landing') {
                            li.style.listStyle = 'none';
                        } else {
                            // Lista normal: inyectamos punto premium
                            li.style.listStyle = 'none';
                            li.style.paddingLeft = '0';
                            const dot = clonedDoc.createElement('span');
                            dot.className = 'export-bullet-dot';
                            li.prepend(dot);
                        }
                    });

                    // 4. AUTO-TITULADO (Escalado Dinámico)
                    const titles = clonedContent.querySelectorAll('.content-body h3');
                    titles.forEach(h3 => {
                        const len = h3.innerText.length;
                        if (len > 35) h3.style.fontSize = '1.7rem';
                        else if (len > 25) h3.style.fontSize = '2rem';
                        h3.style.lineHeight = '1.2';
                    });

                    // 5. LIMPIEZA TOTAL
                    const blobs = clonedContent.querySelector('.bg-blobs');
                    if (blobs) blobs.style.display = 'none';
                }
            }
        });

        // 4. Restaurar Interfaz
        backups.forEach(b => { b.el.innerHTML = b.html; b.el.style.cssText = b.styles; });
        container.style.transform = originalTransform;
        document.body.style.filter = 'none';

        return finalCanvas;
    } catch (err) {
        console.error("Fallo final:", err);
        backups.forEach(b => { b.el.innerHTML = b.html; b.el.style.cssText = b.styles; });
        container.style.transform = originalTransform;
        document.body.style.filter = 'none';
        throw err;
    }
}

function publishAgreement() {
    const id = crypto.randomUUID();
    const url = `${window.location.origin}${window.location.pathname}?id=${id}&mode=client`;
    window.history.pushState({}, '', url);
    saveDocument();
    showPublishModal(url);
}

function resetTool() {
    showConfirmModal(
        '🗑️',
        '¿Borrar borrador?',
        'Se eliminará el documento actual y se creará uno nuevo desde cero. Esta acción no se puede deshacer.',
        'Sí, borrar',
        'Cancelar'
    ).then(confirmed => {
        if (confirmed) { localStorage.removeItem('s2_data_v2'); location.reload(); }
    });
}

function toggleClientMode(autoShowTutorial = true) {
    document.body.classList.toggle('client-mode');
    const btn = document.getElementById('toggle-client-mode');
    const isClient = document.body.classList.contains('client-mode');
    if (btn) btn.textContent = isClient ? 'Modo Diseño' : 'Modo Cliente';
    if (isClient && autoShowTutorial) {
        document.getElementById('client-tutorial')?.classList.remove('hidden');
    }

    // Cerrar panel lateral si estaba abierto
    const panel = document.getElementById('design-panel');
    if (panel) panel.classList.remove('active');

    // Inyectar botón flotante independiente para el cliente en móvil
    const existingFab = document.getElementById('client-fab-save');
    if (isClient && window.innerWidth <= 900) {
        if (!existingFab) {
            const fab = document.createElement('button');
            fab.id = 'client-fab-save';
            fab.className = 'client-fab-save';
            fab.textContent = '✅ Guardar Firma y Enviar';
            fab.onclick = () => saveClientSignature();
            document.body.appendChild(fab);
        }
    } else {
        if (existingFab) existingFab.remove();
    }

    adaptMobileMenu();
}

function toggleDesignPanel() {
    const panel = document.getElementById('design-panel');
    if (panel) panel.classList.toggle('active');
}

function nextTutorialStep(n) {
    document.querySelectorAll('.tutorial-step').forEach(s => s.classList.add('hidden'));
    document.getElementById(`step-${n}`)?.classList.remove('hidden');
    document.querySelectorAll('.progress-dot').forEach((dot, i) => {
        dot.classList.toggle('active', (i + 1) === n);
    });
}

function closeTutorial() { document.getElementById('client-tutorial')?.classList.add('hidden'); }

function showToast(m) {
    const t = document.createElement('div'); t.className = 'save-toast'; t.textContent = m;
    document.body.appendChild(t); setTimeout(() => t.remove(), 2500);
}

// --- SISTEMA DE MODALES PREMIUM ---
function showModal(icon, title, message) {
    dismissModal(); // Remove any existing modal
    const overlay = document.createElement('div');
    overlay.className = 's2-modal-overlay';
    overlay.id = 's2-modal';
    overlay.innerHTML = `
        <div class="s2-modal-card">
            <div class="s2-modal-icon">${icon}</div>
            <div class="s2-modal-body">
                <h2>${title}</h2>
                <p>${message}</p>
            </div>
            <div class="s2-modal-actions">
                <button class="btn btn-modal-primary" onclick="dismissModal()">Entendido</button>
            </div>
        </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) dismissModal(); });
}

function showPublishModal(url) {
    dismissModal();
    const overlay = document.createElement('div');
    overlay.className = 's2-modal-overlay';
    overlay.id = 's2-modal';
    overlay.innerHTML = `
        <div class="s2-modal-card">
            <div class="s2-modal-icon">🚀</div>
            <div class="s2-modal-body">
                <h2>¡Link Generado!</h2>
                <p>Tu acuerdo ya está en la nube. Copia este link y envíalo por WhatsApp a tu cliente:</p>
                <div class="s2-modal-link-box" onclick="copyPublishLink(this, '${url}')" style="position: relative;">
                    <code>${url}</code>
                    <span class="copy-icon">📋</span>
                </div>
            </div>
            <div class="s2-modal-actions">
                <button class="btn btn-modal-secondary" onclick="dismissModal()">Cerrar</button>
                <button class="btn btn-modal-primary" onclick="copyPublishLink(document.querySelector('.s2-modal-link-box'), '${url}')">📋 Copiar Link</button>
            </div>
        </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) dismissModal(); });
}

function copyPublishLink(boxEl, url) {
    navigator.clipboard.writeText(url).then(() => {
        // Show copied feedback
        const existing = boxEl.querySelector('.s2-modal-copied');
        if (existing) existing.remove();
        const badge = document.createElement('span');
        badge.className = 's2-modal-copied';
        badge.textContent = '✅ ¡Copiado!';
        boxEl.appendChild(badge);
        boxEl.querySelector('.copy-icon').textContent = '✅';
        setTimeout(() => { badge.remove(); boxEl.querySelector('.copy-icon').textContent = '📋'; }, 2000);
        showToast('📋 Link copiado al portapapeles');
    }).catch(() => {
        // Fallback: select text for manual copy
        const range = document.createRange();
        range.selectNodeContents(boxEl.querySelector('code'));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        showToast('Seleccionado — usa Ctrl+C para copiar');
    });
}

function showConfirmModal(icon, title, message, confirmText = 'Confirmar', cancelText = 'Cancelar') {
    return new Promise((resolve) => {
        dismissModal();
        const overlay = document.createElement('div');
        overlay.className = 's2-modal-overlay';
        overlay.id = 's2-modal';
        overlay.innerHTML = `
            <div class="s2-modal-card">
                <div class="s2-modal-icon">${icon}</div>
                <div class="s2-modal-body">
                    <h2>${title}</h2>
                    <p>${message}</p>
                </div>
                <div class="s2-modal-actions">
                    <button class="btn btn-modal-secondary" id="s2-modal-cancel">${cancelText}</button>
                    <button class="btn btn-modal-danger" id="s2-modal-confirm">${confirmText}</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        document.getElementById('s2-modal-confirm').addEventListener('click', () => { dismissModal(); resolve(true); });
        document.getElementById('s2-modal-cancel').addEventListener('click', () => { dismissModal(); resolve(false); });
        overlay.addEventListener('click', (e) => { if (e.target === overlay) { dismissModal(); resolve(false); } });
    });
}

function dismissModal() {
    const m = document.getElementById('s2-modal');
    if (m) m.remove();
}

// --- DASHBOARD DE CLIENTES (BIBLIOTECA) ---
async function showDashboard() {
    closeDashboard();
    const overlay = document.createElement('div');
    overlay.className = 's2-dashboard-overlay';
    overlay.id = 's2-dashboard';

    overlay.innerHTML = `
        <div class="s2-dashboard-card">
            <div class="s2-dashboard-header">
                <div class="s2-dashboard-header-info">
                    <h2>Biblioteca de Acuerdos</h2>
                    <p>Gestiona todos tus clientes y firmas en un solo lugar</p>
                </div>
                <button class="s2-dashboard-close" onclick="closeDashboard()">✕</button>
            </div>
            <div class="s2-dashboard-content" id="dashboard-content">
                <div class="s2-dashboard-empty">Cargando datos desde la nube... ☁️</div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDashboard(); });

    fetchAgreements();
}

async function fetchAgreements() {
    const db = getSupabase();
    const content = document.getElementById('dashboard-content');
    if (!db || !content) {
        if (content) content.innerHTML = '<div class="s2-dashboard-empty">Error de conexión a la base de datos.</div>';
        return;
    }

    try {
        const { data, error } = await db.from('agreements')
            .select('id, client_name, created_at, html_content')
            .order('created_at', { ascending: false });

        if (error) throw error;
        renderDashboard(data);
    } catch (e) {
        console.error("Dashboard Fetch Error:", e);
        content.innerHTML = '<div class="s2-dashboard-empty">Error al cargar la biblioteca.</div>';
    }
}

function renderDashboard(agreements) {
    const container = document.getElementById('dashboard-content');
    if (!agreements || agreements.length === 0) {
        container.innerHTML = '<div class="s2-dashboard-empty">Todavía no has creado ningún acuerdo. ¡Publica tu primer link!</div>';
        return;
    }

    let html = '<div class="s2-client-grid">';

    agreements.forEach(doc => {
        let isSigned = false;
        try {
            const parsed = JSON.parse(doc.html_content);
            // Método determinístico: solo se marca como firmado si el cliente
            // explícitamente presionó "Guardar Firma y Enviar"
            if (parsed.clientSigned === true) isSigned = true;
        } catch (e) { }

        const date = new Date(doc.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        let name = doc.client_name || "Cliente Anon";
        if (name === '[CLIENTE]') name = "Cliente Nuevo (Sin nombrar)";

        const statusClass = isSigned ? 'status-signed' : 'status-pending';
        const badgeHTML = isSigned
            ? '<span class="s2-status-badge signed">✅ Firmado</span>'
            : '<span class="s2-status-badge pending">⏳ Pendiente</span>';

        const url = `${window.location.origin}${window.location.pathname}?id=${doc.id}`;
        const escapedName = name.replace(/'/g, "\\'");

        html += `
            <div class="s2-client-card ${statusClass}" id="card-${doc.id}">
                <button class="s2-card-delete" onclick="deleteAgreement('${doc.id}', '${escapedName}')" title="Eliminar">🗑️</button>
                <div class="s2-client-name">${name}</div>
                <div class="s2-client-meta">
                    <span>📅 ${date}</span>
                </div>
                ${badgeHTML}
                <div class="s2-client-actions">
                    <button class="btn btn-modal-secondary" onclick="window.open('${url}', '_blank')">👁️ Abrir</button>
                    <button class="btn btn-modal-primary" onclick="copyDashboardLink(this, '${url}&mode=client')">📋 Link Cliente</button>
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

async function deleteAgreement(id, name) {
    const confirmed = await showConfirmModal(
        '🗑️',
        `¿Eliminar a ${name}?`,
        'Se borrará este acuerdo permanentemente de la nube. Esta acción no se puede deshacer.',
        'Sí, eliminar',
        'Cancelar'
    );
    if (!confirmed) return;

    const db = getSupabase();
    if (!db) { showToast('Error: Sin conexión a la base de datos'); return; }

    try {
        const { error } = await db.from('agreements').delete().eq('id', id);
        if (error) throw error;

        // Remover la tarjeta del DOM con animación
        const card = document.getElementById(`card-${id}`);
        if (card) {
            card.style.transition = 'opacity 0.3s, transform 0.3s';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            setTimeout(() => card.remove(), 300);
        }
        showToast('🗑️ Acuerdo eliminado');
    } catch (e) {
        console.error('Delete Error:', e);
        showToast('❌ Error al eliminar');
    }
}

function copyDashboardLink(btn, url) {
    const originalText = btn.innerHTML;
    navigator.clipboard.writeText(url).then(() => {
        btn.innerHTML = '✅ ¡Copiado!';
        btn.style.background = '#10B981';
        btn.style.color = 'white';
        btn.style.borderColor = '#10B981';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.color = '';
            btn.style.borderColor = '';
        }, 2000);
    }).catch(() => {
        showToast('Error al copiar link');
    });
}

function closeDashboard() {
    const d = document.getElementById('s2-dashboard');
    if (d) d.remove();
}

async function initApp() {
    console.log("🏁 Inicializando Aplicación v18.5...");

    // REGISTRO DE EVENTOS (Hacerlo PRIMERO para que los botones funcionen pase lo que pase)
    try {
        document.getElementById('zoom-range')?.addEventListener('input', (e) => updateZoom(e.target.value));
        document.getElementById('zoom-fit')?.addEventListener('click', () => smartFit());

        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('editable')) saveHistory(true);
        });

        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undo(); }
            if (e.ctrlKey && e.key === 'y') { e.preventDefault(); redo(); }
        });

        // Auto-scale on window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                smartFit();
                adaptMobileMenu();
            }, 150);
        });

        console.log("✅ Event Listeners fijados");
    } catch (e) { console.error("❌ Error en Listeners:", e); }

    // CARGA DE DOCUMENTO
    try {
        await loadDocument();

        const urlParams = new URLSearchParams(window.location.search);
        const clientName = urlParams.get('client');

        if (clientName) {
            // Inyectar nombre del cliente en el documento cargado
            setTimeout(() => {
                const clientEls = document.querySelectorAll('.client-info');
                clientEls.forEach(el => el.innerText = `PREPARADO PARA: ${clientName.toUpperCase()}`);

                const clientInput = document.getElementById('client-name-input');
                if (clientInput) {
                    clientInput.value = clientName;
                    syncClientName(clientName);
                }
                saveDocument(true);
            }, 1000);
        }

        if (urlParams.get('mode') === 'client') {
            const toggleBtn = document.getElementById('toggle-client-mode');
            if (toggleBtn) toggleBtn.style.display = 'none';
            setTimeout(() => toggleClientMode(true), 500);
        }

        setTimeout(() => saveHistory(), 1000);

        // Ejecutar escala automática inicialmente
        setTimeout(() => {
            smartFit();
            adaptMobileMenu();
        }, 100);

        console.log("🚀 App Init Finalizada con éxito");
    } catch (e) {
        console.error("❌ Fallo Crítico en Carga:", e);
        // Rescate: si no hay nada, inyectar algo
        if (getContainer() && getContainer().innerHTML.trim() === '') {
            addNewPage('cover'); addNewPage('content'); addNewPage('signatures');
        }
    }
}

function updateZoom(v) {
    const container = getContainer();
    if (container) {
        const scale = v / 100;

        // FIX: Adjust height impact of scaled container to prevent infinite scroll
        container.style.height = 'auto'; // Reset to measure
        const originalHeight = container.scrollHeight;
        container.style.height = (originalHeight * scale) + 'px';
        container.style.overflow = 'visible';

        if (window.innerWidth <= 900) {
            // Apply scale and center it dynamically to fix mobile cutoffs
            const docContainer = document.getElementById('document-container');
            const style = window.getComputedStyle(docContainer);
            const paddingLeft = parseFloat(style.paddingLeft);
            const paddingRight = parseFloat(style.paddingRight);
            const contentWidth = docContainer.clientWidth - paddingLeft - paddingRight;

            const scaledWidth = 800 * scale;
            const leftOffset = Math.max(0, (contentWidth - scaledWidth) / 2);
            container.style.transform = `translateX(${leftOffset}px) scale(${scale})`;
        } else {
            container.style.transform = `scale(${scale})`; // Desktop uses top center origin naturally
        }
    }
    const label = document.getElementById('zoom-label');
    if (label) label.textContent = v + "%";
    const range = document.getElementById('zoom-range');
    if (range) range.value = v;
}

function getTodayDateSpanish() {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date().toLocaleDateString('es-ES', options).toUpperCase();
    return `FECHA: ${date}`;
}

function smartFit() {
    const container = document.getElementById('document-container');
    if (!container) return;

    // Obtenemos el ancho al que queremos ajustar (restando paddings reales del contenedor)
    const style = window.getComputedStyle(container);
    const paddingLeft = parseFloat(style.paddingLeft);
    const paddingRight = parseFloat(style.paddingRight);

    const availableWidth = container.clientWidth - paddingLeft - paddingRight;

    // Calculamos el alto disponible en base a la ventana (viewport) y no al contenedor de contenido
    const header = document.querySelector('.main-header');
    const headerHeight = header ? header.offsetHeight : 0;
    const availableHeight = window.innerHeight - headerHeight - 40; // 40px para margen extra de respiración

    const pageWidth = 800; // Ancho base de la página A4 en px
    const pageHeight = 1130; // Alto base aproximado de la página A4 en px

    // Calculamos la escala por ancho y por alto
    const scaleWidth = (availableWidth / pageWidth) * 0.98;
    const scaleHeight = (availableHeight / pageHeight);

    let scale = scaleWidth; // Móvil prioriza el ancho

    // En escritorio, usamos la escala que asegure que el documento encaje entero en la pantalla
    if (window.innerWidth > 900) {
        scale = Math.min(scaleWidth, scaleHeight);

        // Evitamos que haga un zoom excesivo si la pantalla es gigante
        if (scale > 1) scale = 1;
    }

    const finalPercent = Math.max(10, Math.min(200, Math.round(scale * 100)));

    updateZoom(finalPercent);
    // showToast(`Ajuste Automático: ${finalPercent}%`); // Detenido por solicitud del usuario
}

function adaptMobileMenu() {
    const actions = document.querySelector('.header-actions');
    const panel = document.getElementById('design-panel');
    const destDesktop = document.querySelector('.main-header .actions');

    if (document.body.classList.contains('client-mode')) {
        // Restaurar acciones al header en modo cliente (para evitar atrapar el botón offline)
        if (actions && destDesktop && actions.parentElement !== destDesktop) {
            destDesktop.appendChild(actions);
        }
        return;
    }

    if (!actions || !panel || !destDesktop) return;

    if (window.innerWidth <= 900) {
        if (actions.parentElement !== panel) {
            // Move inside the sidebar immediately after the header
            const header = panel.querySelector('.panel-header');
            if (header) {
                header.insertAdjacentElement('afterend', actions);
            } else {
                panel.prepend(actions);
            }
        }
    } else {
        if (actions.parentElement !== destDesktop) {
            // Restore to the top header
            destDesktop.appendChild(actions);
        }
    }
}

// --- IA COPILOT LOGIC ---
function toggleIAPanel() {
    document.getElementById('ia-panel').classList.toggle('active');
}

let recognition = null;
function toggleIARecording() {
    const btn = document.getElementById('ia-btn-record');
    const textarea = document.getElementById('ia-raw-input');
    
    if (recognition) {
        recognition.stop();
        recognition = null;
        btn.classList.remove('recording');
        btn.innerHTML = '<span class="icon">🎤</span> Hablar';
        processIAInput(textarea.value);
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        showModal('❌', 'Error de Voz', 'Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.');
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
        btn.classList.add('recording');
        btn.innerHTML = '<span class="icon">🛑</span> Detener';
    };

    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        textarea.value = transcript;
    };

    recognition.onerror = (event) => {
        console.error('Speech Error:', event.error);
        if (recognition) toggleIARecording();
    };

    recognition.start();
}

function handleIAFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            document.getElementById('ia-raw-input').value = content;
            processIAInput(content);
        };
        reader.readAsText(file);
    } else if (file.type.startsWith('audio/')) {
        showModal('🎙️', 'Audio Recibido', 'He recibido tu audio. Estoy procesando las ondas para extraer los datos...');
        setTimeout(() => {
            document.getElementById('ia-raw-input').value = "[Transcripción de Audio Simulada] Acuerdo con Cliente Demo para Servicios de Marketing Digital e Intercambio.";
            processIAInput(document.getElementById('ia-raw-input').value);
        }, 2000);
    }
}

function processIAInput(text) {
    if (!text || text.length < 5) return;
    
    document.getElementById('ia-processing').classList.remove('hidden');
    document.getElementById('ia-results').classList.add('hidden');
    
    // Simulación de procesamiento IA
    setTimeout(() => {
        const info = extractInfo(text);
        renderIAResults(info);
        document.getElementById('ia-processing').classList.add('hidden');
        document.getElementById('ia-results').classList.remove('hidden');
    }, 1500);
}

function extractInfo(text) {
    const info = {
        client: "[NOMBRE DEL CLIENTE]",
        services: [],
        type: "Acuerdo de Servicios Profesionales"
    };

    const lines = text.split('\n').map(l => l.trim()).filter(l => l !== '');
    const ltext = text.toLowerCase();

    // 1. Detectar por Título
    if (lines.length > 0) {
        const firstLine = lines[0];
        const titleMatch = firstLine.match(/(?:Proyecto|Cliente|Marca|Resumen|Contrato)\s*[:\-]?\s*([A-Z0-9].*)/i);
        if (titleMatch) {
            info.client = titleMatch[1].trim();
        }
    }

    // 2. Limpieza profunda del nombre (quitar "del Proyecto:", "Resumen:", etc.)
    info.client = info.client.replace(/(?:del Proyecto|Resumen del Proyecto|Proyecto|Resumen|Contrato)\s*[:\-]?\s*/i, '').trim();
    info.client = info.client.replace(/ CRM$| Sistema$| App$/i, '');

    // 3. Patrones secundarios
    if (info.client === "" || info.client === "[NOMBRE DEL CLIENTE]") {
        const patterns = [
            /(?:con|para|cliente|llamado|llama|marca)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
            /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:es|será|consiste)/m
        ];
        
        const stopwords = ['optimizar', 'mejorar', 'hacer', 'crear', 'desarrollar', 'implementar', 'gestionar', 'acuerdo', 'resumen'];
        
        for (let pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                const candidate = match[1].trim();
                if (!stopwords.includes(candidate.toLowerCase())) {
                    info.client = candidate;
                    break;
                }
            }
        }
    }

    // 3. Detección de servicios expandida (Más precisa para evitar falsos positivos)
    const categories = [
        { keys: ['crm', 'software', 'sistema', 'aplicación', 'app', 'gestión', 'punto de venta', 'pos', 'inventario'], name: 'Desarrollo de Software / CRM' },
        { keys: ['landing page', 'página web', 'sitio web', 'ecommerce', 'tienda online'], name: 'Landing Page / Web' },
        { keys: ['estrategia digital', 'marketing digital', 'plan de marketing', 'estrategia de contenidos'], name: 'Estrategia Digital' },
        { keys: ['producción de video', 'edición de video', 'reels', 'audiovisual', 'shooting'], name: 'Producción Audiovisual' },
        { keys: ['diseño de marca', 'identidad visual', 'creación de logo', 'manual de marca'], name: 'Diseño de Marca' },
        { keys: ['gestión de ads', 'pauta publicitaria', 'facebook ads', 'google ads'], name: 'Gestión de Ads' }
    ];

    categories.forEach(cat => {
        if (cat.keys.some(k => ltext.includes(k))) {
            info.services.push(cat.name);
        }
    });

    // 4. Detección de tipo de acuerdo
    if (ltext.includes('intercambio') || ltext.includes('trueque') || ltext.includes('mutuo')) {
        info.type = "Acuerdo de Intercambio";
    }

    // 5. Detección de Precio e Inversión (Soporta $1500, 1500 USD, 1500$, etc.)
    const priceMatch = text.match(/(?:(\d+(?:[.,]\d+)?)\s*(?:\$|USD|bs|bolívares))|(?:(?:\$|USD|bs|bolívares|monto|precio|costo|inversión)\s*[:\-]?\s*(\d+(?:[.,]\d+)?))/i);
    
    if (priceMatch) {
        const amount = priceMatch[1] || priceMatch[2];
        info.price = parseFloat(amount.replace(',', '.'));
        info.type = "Acuerdo de Servicios Profesionales";
    }

    // Limpieza final del nombre
    info.client = info.client.replace(/ CRM$| Sistema$| Proyecto$| Resumen$/i, '');
    if (info.services.length === 0) info.services.push('Servicios Digitales Personalizados');

    return info;
}

function renderIAResults(info) {
    const container = document.getElementById('ia-extracted-info');
    const priceInfo = info.price ? `<div class="ia-info-item"><label>INVERSIÓN</label><span>$ ${info.price} (50/50 detectado)</span></div>` : '';
    
    container.innerHTML = `
        <div class="ia-info-item"><label>CLIENTE</label><span>${info.client}</span></div>
        <div class="ia-info-item"><label>TIPO DE ACUERDO</label><span>${info.type}</span></div>
        <div class="ia-info-item"><label>SERVICIOS</label><span>${info.services.join(', ')}</span></div>
        ${priceInfo}
    `;
    
    // Actualizar UI de chips si es necesario
    const isPaid = info.type.includes('Servicios Profesionales');
    document.getElementById('chip-collab').classList.toggle('active', !isPaid);
    document.getElementById('chip-paid').classList.toggle('active', isPaid);
    document.getElementById('ia-manual-price-box').classList.toggle('hidden', !isPaid);
    
    if (isPaid && info.price) {
        document.getElementById('ia-input-price').value = info.price;
    }

    // Guardar temporalmente para la generación
    window._lastIAExtraction = info;
}

function setIAAgreementType(type) {
    const info = window._lastIAExtraction;
    if (!info) return;

    if (type === 'collaboration') {
        info.type = "Acuerdo de Colaboración";
        info.price = null;
    } else {
        info.type = "Acuerdo de Servicios Profesionales";
    }
    
    renderIAResults(info);
}

function updateIAManualPrice(val) {
    const info = window._lastIAExtraction;
    if (!info) return;
    info.price = parseFloat(val) || null;
    
    // No llamamos a renderIAResults aquí para no perder el foco del input
    // Solo actualizamos el objeto y la UI de resumen mínima
    const priceSpan = document.querySelector('.ia-info-item:last-child span');
    if (priceSpan && info.type.includes('Profesionales')) {
        priceSpan.innerText = `$ ${val || 0} (Manual)`;
    }
}

const serviceDescriptions = {
    'Desarrollo de Software / CRM': {
        intro: 'Ingeniería de software personalizada diseñada para centralizar su operación, automatizar flujos de trabajo y maximizar la rentabilidad mediante inteligencia de datos.',
        details: [
            'Punto de Venta Pro (POS): Procesamiento multimoneda, pagos mixtos y sincronización de tasa de cambio en tiempo real.',
            'Módulo de Finanzas: Conciliación automática de caja, control de egresos y cálculo de utilidad neta real.',
            'Gestión de Personal: Cálculo automatizado de comisiones dinámicas, roles de acceso y control de propinas.',
            'Inteligencia de Negocio (BI): Panel de control con Punto de Equilibrio, Tasa de Ocupación y Ticket Promedio.',
            'Arquitectura Cloud & Security: Infraestructura en la nube (Supabase) con encriptación y respaldos automáticos.',
            'Interfaz Premium Adaptativa: Diseño UX/UI de alta gama optimizado para dispositivos móviles y escritorio.'
        ]
    },
    'Landing Page / Web': {
        intro: 'Desarrollo de activos digitales de alto impacto diseñados para convertir visitantes en clientes y fortalecer la presencia de marca en el mercado global.',
        details: [
            'Diseño visual "Premium Glass" alineado a los estándares estéticos internacionales.',
            'Optimización de rendimiento (Core Web Vitals) para máxima velocidad y SEO.',
            'Copywriting estratégico enfocado en la psicología de ventas y conversión.',
            'Integración con CRM y sistemas de captación de leads automatizados.',
            'Arquitectura Mobile-First para una experiencia impecable en smartphones.'
        ]
    },
    'Estrategia Digital': {
        intro: 'Arquitectura estratégica integral diseñada para posicionar su marca en el ecosistema digital mediante análisis de datos y narrativa visual de alto impacto.',
        details: [
            'Auditoría completa de ecosistema digital y análisis de competencia estratégica.',
            'Definición de pilares de contenido narrativo y tono de comunicación corporativa.',
            'Plan de pauta publicitaria (Ads) optimizado para retorno de inversión (ROAS).',
            'Estrategia de fidelización de audiencia y embudos de conversión automatizados.',
            'Reportes de inteligencia con métricas clave de crecimiento y rendimiento.'
        ]
    },
    'Producción Audiovisual': {
        intro: 'Creación de activos visuales de alta fidelidad cinematográfica diseñados para elevar la percepción de valor y generar impacto inmediato.',
        details: [
            'Producción de contenido vertical (Reels/TikTok) con narrativa publicitaria avanzada.',
            'Edición profesional con transiciones dinámicas y etalonaje (color) premium.',
            'Storyboarding estratégico centrado en la retención de audiencia y llamado a la acción.',
            'Post-producción de audio y diseño sonoro para una experiencia inmersiva.',
            'Formatos optimizados para máxima visibilidad en el algoritmo de redes sociales.'
        ]
    }
};

function generateSmartContract() {
    const info = window._lastIAExtraction;
    if (!info) {
        alert("No hay información para generar el contrato.");
        return;
    }

    showConfirmModal('🤖', 'Generar Acuerdo', `Esto creará una propuesta premium para ${info.client}. ¿Continuar?`, 'Sí, generar', 'Cancelar').then(confirmed => {
        if (!confirmed) return;
        
        try {
            const container = getContainer();
            container.innerHTML = '';
            
            // Detectar el tema actual seleccionado por el usuario
            const activeThemeBtn = document.querySelector('.style-option.active');
            let currentThemeId = 1;
            if (activeThemeBtn) {
                if (activeThemeBtn.classList.contains('style-purple')) currentThemeId = 2;
                if (activeThemeBtn.classList.contains('style-dark')) currentThemeId = 3;
            }

            // 1. Sincronizar nombre
            const nameInput = document.getElementById('global-client-name');
            if (nameInput) {
                nameInput.value = info.client;
                syncClientName(info.client);
            }

            // Función auxiliar para añadir página con el tema correcto
            const addPageWithTheme = (type) => {
                const id = addNewPage(type);
                setPageTheme(id, currentThemeId);
                return id;
            };

            // 2. PORTADA
            const coverId = addPageWithTheme('cover');
            const coverEl = document.getElementById(`page-${coverId}`);
            if (coverEl) {
                const h2 = coverEl.querySelector('.cover-title h2');
                if (h2) h2.innerHTML = 'ACUERDO DE SERVICIOS<br>PROFESIONALES';
            }

            // 3. BIENVENIDA
            addPageWithTheme('intro');

            // 4. METODOLOGÍA
            const methodologyId = addPageWithTheme('content');
            const methEl = document.getElementById(`page-${methodologyId}`);
            if (methEl) {
                const tag = methEl.querySelector('.header-tag');
                const body = methEl.querySelector('.content-body');
                if (tag) tag.innerText = "METODOLOGÍA SOMOSDOS";
                if (body) {
                    body.innerHTML = `
                        <h2 class="gradient-text">Arquitectura de Trabajo</h2>
                        <p style="font-size: 1.1rem; margin-bottom: 40px;">Nuestro enfoque no es solo técnico, sino estratégico. Cada proyecto en SomosDos Studio sigue un ecosistema de ejecución diseñado para minimizar riesgos y maximizar el impacto comercial.</p>
                        
                        <div style="display: grid; grid-template-columns: 1fr; gap: 25px; margin: 30px 0;">
                            <div class="info-block-premium" style="display: flex; gap: 20px; align-items: flex-start;">
                                <div style="font-size: 2.5rem;">🔍</div>
                                <div>
                                    <strong style="color: var(--brand-purple); display: block; font-size: 1.1rem; margin-bottom: 5px;">01. DIAGNÓSTICO ESTRATÉGICO</strong>
                                    <p style="font-size: 0.85rem; line-height: 1.6;">Auditamos el estado actual de su marca para identificar cuellos de botella y oportunidades de crecimiento. No empezamos a construir hasta que el plano estratégico sea impecable.</p>
                                </div>
                            </div>
                            <div class="info-block-premium" style="display: flex; gap: 20px; align-items: flex-start;">
                                <div style="font-size: 2.5rem;">⚙️</div>
                                <div>
                                    <strong style="color: var(--brand-purple); display: block; font-size: 1.1rem; margin-bottom: 5px;">02. INGENIERÍA Y CREATIVIDAD</strong>
                                    <p style="font-size: 0.85rem; line-height: 1.6;">Nuestro equipo de especialistas desarrolla la solución utilizando tecnologías de vanguardia y estándares de diseño internacionales. Garantizamos una interfaz intuitiva y una infraestructura robusta.</p>
                                </div>
                            </div>
                            <div class="info-block-premium" style="display: flex; gap: 20px; align-items: flex-start;">
                                <div style="font-size: 2.5rem;">🚀</div>
                                <div>
                                    <strong style="color: var(--brand-purple); display: block; font-size: 1.1rem; margin-bottom: 5px;">03. DESPLIEGUE Y OPTIMIZACIÓN</strong>
                                    <p style="font-size: 0.85rem; line-height: 1.6;">Lanzamiento controlado y monitoreo de rendimiento. Nos aseguramos de que cada activo entregado funcione al 100% de su capacidad desde el primer día.</p>
                                </div>
                            </div>
                        </div>
                        <div style="margin-top: 40px; text-align: center; border-top: 1px solid rgba(123, 63, 228, 0.2); padding-top: 30px;">
                            <p style="font-style: italic; color: var(--brand-purple); font-weight: 600;">"En SomosDos, no entregamos archivos, entregamos resultados de negocio."</p>
                        </div>
                    `;
                }
            }
            
            // 5. ALCANCE
            info.services.forEach(sName => {
                const sId = addPageWithTheme('content');
                const sEl = document.getElementById(`page-${sId}`);
                const data = serviceDescriptions[sName] || { intro: 'Implementación personalizada.', details: ['Gestión profesional.'] };
                if (sEl) {
                    const tag = sEl.querySelector('.header-tag');
                    const body = sEl.querySelector('.content-body');
                    if (tag) tag.innerText = `ALCANCE DETALLADO: ${sName.toUpperCase()}`;
                    if (body) {
                        body.innerHTML = `
                            <h2 class="gradient-text">${sName}</h2>
                            <p style="font-size: 1.1rem; line-height: 1.7; margin-bottom: 30px;">${data.intro}</p>
                            
                            <div class="scope-card-main">
                                <h4 style="margin-bottom: 20px; color: var(--brand-blue); letter-spacing: 1px;">COMPONENTE TÉCNICO</h4>
                                <ul class="professional-list" style="margin: 0;">
                                    ${data.details.map(d => `<li style="margin-bottom: 15px; font-weight: 500;">${d}</li>`).join('')}
                                </ul>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                                <div class="value-tag-green">
                                    <strong style="font-size: 0.8rem; display: block; margin-bottom: 5px;">VALOR AGREGADO</strong>
                                    <p style="font-size: 0.75rem;">Optimización de procesos operativos y reducción de tiempos de respuesta.</p>
                                </div>
                                <div class="value-tag-blue">
                                    <strong style="font-size: 0.8rem; display: block; margin-bottom: 5px;">GARANTÍA SOMOSDOS</strong>
                                    <p style="font-size: 0.75rem;">Soporte técnico prioritario y revisiones de calidad post-entrega.</p>
                                </div>
                            </div>
                        `;
                    }
                }
            });

            // 6. SOPORTE Y EVOLUCIÓN
            const supportId = addPageWithTheme('content');
            const supEl = document.getElementById(`page-${supportId}`);
            if (supEl) {
                const tag = supEl.querySelector('.header-tag');
                const body = supEl.querySelector('.content-body');
                if (tag) tag.innerText = "SOPORTE Y CONDICIONES";
                if (body) {
                    body.innerHTML = `
                        <h2 class="gradient-text">Acompañamiento y Escalabilidad</h2>
                        
                        <div class="info-block-premium">
                            <div style="display: flex; gap: 20px; align-items: flex-start; margin-bottom: 20px;">
                                <div style="font-size: 2rem;">🛠️</div>
                                <div>
                                    <strong style="font-size: 1.1rem; display: block; margin-bottom: 5px;">Soporte Integral Incluido</strong>
                                    <p style="font-size: 0.9rem; line-height: 1.6;">En SomosDos Studio, nuestra relación no termina con la entrega. Este acuerdo incluye soporte técnico y resolución de incidencias para garantizar que su ecosistema digital funcione sin interrupciones.</p>
                                </div>
                            </div>
                        </div>

                        <div class="support-dashed-box">
                            <div style="display: flex; gap: 20px; align-items: flex-start;">
                                <div style="font-size: 2rem;">➕</div>
                                <div>
                                    <strong style="color: var(--brand-purple); font-size: 1.1rem; display: block; margin-bottom: 5px;">Alcance y Desarrollos Adicionales</strong>
                                    <p style="font-size: 0.9rem; line-height: 1.6;">Cualquier funcionalidad, diseño o servicio no especificado explícitamente en las páginas anteriores se considerará como <strong>"Desarrollo Adicional"</strong>. Estaremos encantados de evaluar, presupuestar y ejecutar estas nuevas necesidades en una fase posterior para continuar la evolución de su marca.</p>
                                </div>
                            </div>
                        </div>

                        <p style="margin-top: 40px; font-size: 0.8rem; color: #94a3b8; text-align: center;">Este marco de trabajo asegura la máxima calidad y transparencia en la ejecución del proyecto.</p>
                    `;
                }
            }

            // 7. INVERSIÓN
            if (info.price) {
                const pId = addPageWithTheme('payment');
                const pEl = document.getElementById(`page-${pId}`);
                if (pEl) {
                    const h2 = pEl.querySelector('.payment-card h2');
                    const p50 = pEl.querySelectorAll('.feature-card p:last-child');
                    const safePrice = info.price || 0;
                    if (h2) h2.innerText = `$ ${safePrice.toLocaleString()}`;
                    if (p50.length >= 2) {
                        const half = (safePrice / 2).toLocaleString();
                        p50[0].innerText = `$ ${half}`;
                        p50[1].innerText = `$ ${half}`;
                    }
                }
            }

            if (info.type === "Acuerdo de Intercambio") addPageWithTheme('exchange_simple');
            addPageWithTheme('signatures');

            if (typeof toggleIAPanel === 'function') toggleIAPanel();
            showModal('✨', 'Propuesta Premium', `Acuerdo inteligente generado con éxito para ${info.client}.`);

        } catch (err) {
            console.error("Error al generar:", err);
            showModal('⚠️', 'Error', 'Hubo un problema al generar el contrato.');
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initApp();
        const panel = document.getElementById('design-panel');
        if (panel) {
            panel.addEventListener('click', (e) => {
                if (e.target.closest('.btn') && window.innerWidth <= 900) {
                    setTimeout(() => panel.classList.remove('active'), 200);
                }
            });
        }
    });
} else {
    initApp();
}