<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Gestión Talento Humano — VITAHER IPS</title>
    <style>
      :root {
        --primary: #004b87;
        --primary-dark: #003a6a;
        --primary-light: #00a3e0;
        --primary-tint: #eaf6fc;
        --accent: #2e7d32;
        --accent-bright: #a3e53b;
        --accent-tint: #f4fbe8;
        --ink: #004b87;
        --ink-soft: #3f5d75;
        --bg: #f5fafd;
        --white: #ffffff;
        --border: #d9e8f2;
        --tint-border: #a9d8f0;
        --danger: #b91c1c;
        --shadow: 0 18px 50px -18px rgba(0, 75, 135, 0.28);
        --radius: 16px;
        --font: 'Segoe UI', system-ui, -apple-system, Roboto, sans-serif;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        font-family: var(--font);
        color: var(--ink-soft);
        background:
          radial-gradient(900px 500px at 100% -10%, rgba(0, 163, 224, 0.12), transparent 60%),
          radial-gradient(800px 500px at -10% 10%, rgba(163, 229, 59, 0.14), transparent 55%),
          var(--bg);
      }
      button, input, select, textarea { font: inherit; }
      [hidden] { display: none !important; }
      .wrap { width: min(1180px, 94%); margin: 0 auto; padding: 32px 0 64px; }
      .brand {
        display: inline-flex; align-items: center; gap: 10px;
        color: var(--primary); font-weight: 800; letter-spacing: -0.02em; text-decoration: none;
      }
      .brand-logo {
        width: 40px; height: 40px; flex: none; object-fit: contain;
        border-radius: 10px; background: #fff;
        box-shadow: 0 2px 8px rgba(0, 75, 135, 0.14);
      }
      .login-shell { min-height: 78vh; display: grid; place-items: center; }
      .login-card {
        width: min(430px, 100%); padding: 34px; background: var(--white);
        border: 1px solid var(--border); border-radius: 22px; box-shadow: var(--shadow);
      }
      .login-card h1 { margin: 20px 0 6px; color: var(--ink); font-size: 1.45rem; }
      .login-card p { margin: 0; font-size: 0.92rem; line-height: 1.55; }
      .field { display: flex; flex-direction: column; gap: 7px; margin-top: 20px; }
      .field label { color: var(--ink); font-size: 0.85rem; font-weight: 700; }
      .input, .select, .textarea {
        width: 100%; padding: 12px 14px; color: var(--ink); background: var(--white);
        border: 1.5px solid var(--border); border-radius: 11px; outline: none;
      }
      .input:focus, .select:focus, .textarea:focus {
        border-color: var(--primary-light); box-shadow: 0 0 0 4px rgba(0, 163, 224, 0.15);
      }
      .btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        padding: 11px 18px; border: 1.5px solid transparent; border-radius: 11px;
        background: var(--primary); color: #fff; font-weight: 700; cursor: pointer;
        transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
      }
      .btn:hover { background: var(--accent); transform: translateY(-1px); }
      .btn:disabled { opacity: 0.6; cursor: wait; transform: none; }
      .btn-soft { background: var(--primary-tint); color: var(--primary); border-color: var(--tint-border); }
      .btn-soft:hover { background: var(--primary-tint); color: var(--accent); }
      .btn-ghost { background: transparent; color: var(--ink-soft); border-color: var(--border); }
      .btn-ghost:hover { background: var(--primary-tint); color: var(--primary); }
      .btn-block { width: 100%; margin-top: 18px; }
      .form-msg { min-height: 1.2em; margin: 12px 0 0; color: var(--danger); font-size: 0.84rem; font-weight: 600; }
      .form-msg.ok { color: var(--accent); }
      .topbar {
        display: flex; align-items: center; justify-content: space-between; gap: 18px;
        padding: 16px 20px; background: rgba(255, 255, 255, 0.86); border: 1px solid var(--border);
        border-radius: 18px; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04); backdrop-filter: blur(10px);
      }
      .topbar-left { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
      .topbar-title { display: flex; flex-direction: column; }
      .topbar-title strong { color: var(--ink); font-size: 1rem; }
      .topbar-title span { font-size: 0.78rem; color: var(--ink-soft); }
      .topbar-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
      .stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-top: 22px; }
      .stat {
        padding: 18px 20px; background: var(--white); border: 1px solid var(--border);
        border-radius: 16px; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
      }
      .stat span { display: block; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-soft); }
      .stat strong { display: block; margin-top: 6px; color: var(--primary); font-size: 1.85rem; line-height: 1; }
      .stat.accent strong { color: var(--accent); }
      .toolbar {
        display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-top: 24px;
        padding: 14px; background: var(--white); border: 1px solid var(--border); border-radius: 16px;
      }
      .toolbar .search { flex: 1 1 260px; }
      .tabs { display: inline-flex; gap: 4px; padding: 4px; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; }
      .tab {
        border: 0; background: transparent; color: var(--ink-soft); font-size: 0.84rem; font-weight: 700;
        padding: 8px 13px; border-radius: 9px; cursor: pointer;
      }
      .tab.active { background: var(--primary); color: #fff; }
      .toolbar select { width: auto; min-width: 160px; }
      .list { display: grid; gap: 12px; margin-top: 18px; }
      .record {
        display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: start;
        padding: 18px 20px; background: var(--white); border: 1px solid var(--border);
        border-radius: 16px; transition: border-color 0.2s, box-shadow 0.2s;
      }
      .record:hover { border-color: var(--tint-border); box-shadow: 0 8px 24px -16px rgba(0, 75, 135, 0.35); }
      .record-top { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 7px; }
      .record h3 { margin: 0; color: var(--ink); font-size: 1rem; }
      .record h3 span { color: var(--ink-soft); font-size: 0.82rem; font-weight: 600; }
      .record .meta { margin-top: 3px; font-size: 0.8rem; color: var(--ink-soft); }
      .record .preview { margin-top: 8px; font-size: 0.86rem; line-height: 1.5; color: var(--ink-soft); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      .record .code { font-family: ui-monospace, Consolas, monospace; font-size: 0.8rem; font-weight: 800; color: var(--primary); letter-spacing: 0.03em; overflow-wrap: anywhere; }
      .record-actions { display: flex; flex-direction: column; gap: 7px; align-items: stretch; min-width: 138px; }
      .record-actions .btn { padding: 8px 12px; font-size: 0.8rem; }
      .badge {
        display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px;
        font-size: 0.68rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;
      }
      .badge::before { content: ''; width: 7px; height: 7px; border-radius: 999px; background: currentColor; }
      .badge.recibido { background: var(--primary-tint); color: var(--primary); }
      .badge.revision { background: #fef3c7; color: #92400e; }
      .badge.resuelto { background: var(--accent-tint); color: var(--accent); }
      .badge.cerrado { background: #e2e8f0; color: #475569; }
      .cat {
        display: inline-flex; padding: 3px 8px; border-radius: 7px; background: var(--bg);
        border: 1px solid var(--border); color: var(--ink-soft); font-size: 0.68rem; font-weight: 800;
        letter-spacing: 0.05em; text-transform: uppercase;
      }
      .empty {
        padding: 54px 20px; text-align: center; background: var(--white); border: 1px dashed var(--tint-border);
        border-radius: 16px; color: var(--ink-soft);
      }
      .empty strong { display: block; color: var(--ink); margin-bottom: 4px; }
      .overlay {
        position: fixed; inset: 0; z-index: 50; display: grid; place-items: center;
        padding: 20px; background: rgba(4, 34, 64, 0.55); backdrop-filter: blur(2px);
      }
      .modal {
        width: min(760px, 100%); max-height: 88vh; overflow-y: auto; padding: 26px;
        background: var(--white); border: 1px solid var(--border); border-radius: 20px; box-shadow: var(--shadow);
      }
      .modal-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
      .modal-head h2 { margin: 8px 0 0; color: var(--ink); font-size: 1.35rem; letter-spacing: 0.01em; }
      .modal-head p { margin: 5px 0 0; font-size: 0.84rem; color: var(--ink-soft); }
      .modal-close {
        display: grid; place-items: center; width: 36px; height: 36px; border: 1px solid var(--border);
        border-radius: 999px; background: var(--bg); color: var(--ink-soft); cursor: pointer; font-size: 1.15rem;
      }
      .detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 18px; margin-top: 20px; }
      .detail-grid div { padding: 10px 12px; background: var(--bg); border: 1px solid var(--border); border-radius: 10px; }
      .detail-grid span { display: block; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: var(--ink-soft); }
      .detail-grid strong { display: block; margin-top: 3px; color: var(--ink); font-size: 0.88rem; overflow-wrap: anywhere; }
      .detail-section { margin-top: 20px; }
      .detail-section h4 { margin: 0 0 8px; color: var(--ink); font-size: 0.8rem; letter-spacing: 0.06em; text-transform: uppercase; }
      .detail-section pre {
        margin: 0; padding: 12px 14px; background: var(--bg); border: 1px solid var(--border);
        border-radius: 10px; color: var(--ink-soft); font-family: var(--font); font-size: 0.86rem;
        line-height: 1.55; white-space: pre-wrap; overflow-wrap: anywhere;
      }
      .files { margin: 0; padding-left: 18px; font-size: 0.86rem; }
      .files li + li { margin-top: 4px; }
      .files a {
        color: var(--primary); font-weight: 700; overflow-wrap: anywhere;
        text-decoration: underline; text-underline-offset: 2px;
      }
      .files a:hover { color: var(--accent); }
      .files .muted { color: var(--ink-soft); font-size: 0.78rem; }
      .history { display: grid; gap: 10px; }
      .history-item { display: flex; gap: 10px; align-items: flex-start; }
      .history-dot { width: 10px; height: 10px; margin-top: 5px; border-radius: 999px; background: var(--primary); flex-shrink: 0; }
      .history-item strong { display: block; color: var(--ink); font-size: 0.85rem; }
      .history-item span { display: block; font-size: 0.76rem; color: var(--ink-soft); }
      .history-item p { margin: 3px 0 0; font-size: 0.8rem; color: var(--ink-soft); }
      .history-item p.history-public {
        margin-top: 6px; padding: 8px 10px; color: var(--ink);
        background: var(--primary-tint); border-left: 3px solid var(--primary-light);
        border-radius: 0 8px 8px 0; white-space: pre-wrap;
      }
      .history-item p.history-internal {
        margin-top: 6px; padding-left: 8px; color: var(--ink-soft);
        border-left: 3px solid var(--border); white-space: pre-wrap;
      }
      .status-form { margin-top: 24px; padding-top: 20px; border-top: 1px dashed var(--border); }
      .status-form h4 { margin: 0 0 10px; color: var(--ink); font-size: 0.8rem; letter-spacing: 0.06em; text-transform: uppercase; }
      .status-form .row { display: grid; grid-template-columns: 200px 1fr; gap: 12px; }
      .status-form .field { margin-top: 12px; }
      .status-form .row .field { margin-top: 0; }
      .check-field {
        display: flex; align-items: flex-start; gap: 9px; margin-top: 12px;
        color: var(--ink-soft); font-size: 0.84rem; font-weight: 600; cursor: pointer;
      }
      .check-field input { width: 16px; height: 16px; margin: 2px 0 0; accent-color: var(--primary); flex-shrink: 0; }
      .textarea { min-height: 74px; resize: vertical; }
      .status-actions { display: flex; align-items: center; gap: 12px; margin-top: 12px; }
      .status-msg { margin: 0; font-size: 0.84rem; font-weight: 700; }
      .status-msg.ok { color: var(--accent); }
      .status-msg.warn { color: #92400e; }
      .status-msg.error { color: var(--danger); }
      .link-btn {
        display: block; width: 100%; margin-top: 14px; padding: 0; border: 0;
        background: transparent; color: var(--primary); font-size: 0.84rem;
        font-weight: 700; text-align: center; text-decoration: underline; cursor: pointer;
      }
      .link-btn:hover { color: var(--accent); }
      .link-btn:disabled { opacity: 0.6; cursor: wait; }
      .hint { margin: 8px 0 0; font-size: 0.78rem; line-height: 1.5; color: var(--ink-soft); }
      .footnote { margin-top: 18px; text-align: center; font-size: 0.76rem; color: var(--ink-soft); }
      @media (max-width: 820px) {
        .stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .record { grid-template-columns: 1fr; }
        .record-actions { flex-direction: row; }
        .detail-grid { grid-template-columns: 1fr; }
        .status-form .row { grid-template-columns: 1fr; }
      }
      @media (max-width: 520px) {
        .wrap { width: 92%; padding-top: 20px; }
        .topbar { align-items: flex-start; flex-direction: column; }
        .stats { grid-template-columns: 1fr 1fr; }
        .login-card { padding: 26px 20px; }
        .modal { padding: 20px 16px; }
      }
    </style>
  </head>
  <body>
    <main class="wrap">
      <section id="login-view" class="login-shell">
        <div class="login-card">
          <a class="brand" href="/">
            <img class="brand-logo" src="/logo.png" alt="" aria-hidden="true" />
            <span>VITAHER IPS</span>
          </a>
          <h1>Gestión de Talento Humano</h1>
          <p>Acceso exclusivo para revisar postulaciones y PQRS, cambiar su estado y gestionar los radicados.</p>
          <form id="login-form">
            <div class="field">
              <label for="email">Correo electrónico</label>
              <input
                id="email"
                class="input"
                type="email"
                name="email"
                value="talentohumanovitaher@gmail.com"
                autocomplete="username"
                required
              />
            </div>
            <div class="field">
              <label for="password">Contraseña</label>
              <input id="password" class="input" type="password" autocomplete="current-password" required />
            </div>
            <button class="btn btn-block" type="submit">Ingresar</button>
            <p id="login-msg" class="form-msg" role="alert"></p>
          </form>
          <button id="forgot-btn" class="link-btn" type="button">¿Olvidaste tu contraseña?</button>
          <p id="forgot-msg" class="form-msg" role="status"></p>
          <p class="footnote"><a href="/">Volver al sitio</a></p>
        </div>
      </section>

      <section id="reset-view" class="login-shell" hidden>
        <div class="login-card">
          <a class="brand" href="/">
            <img class="brand-logo" src="/logo.png" alt="" aria-hidden="true" />
            <span>VITAHER IPS</span>
          </a>
          <h1>Nueva contraseña</h1>
          <p>Crea una contraseña segura para el panel de Talento Humano. El enlace es de un solo uso y vence en 30 minutos.</p>
          <form id="reset-form">
            <input id="reset-token" type="hidden" />
            <div class="field">
              <label for="reset-password">Nueva contraseña</label>
              <input id="reset-password" class="input" type="password" autocomplete="new-password" required />
            </div>
            <div class="field">
              <label for="reset-confirm">Confirma la nueva contraseña</label>
              <input id="reset-confirm" class="input" type="password" autocomplete="new-password" required />
            </div>
            <p class="hint">Mínimo 12 caracteres, con mayúscula, minúscula, número y símbolo.</p>
            <button class="btn btn-block" type="submit">Guardar contraseña</button>
            <p id="reset-msg" class="form-msg" role="alert"></p>
          </form>
          <p class="footnote"><a href="/admin.php">Volver al ingreso</a></p>
        </div>
      </section>

      <section id="force-password-view" class="login-shell" hidden>
        <div class="login-card">
          <a class="brand" href="/">
            <img class="brand-logo" src="/logo.png" alt="" aria-hidden="true" />
            <span>VITAHER IPS</span>
          </a>
          <h1>Cambia tu contraseña inicial</h1>
          <p>Por seguridad, el panel queda bloqueado hasta que reemplaces la contraseña inicial de Talento Humano.</p>
          <form id="force-password-form">
            <div class="field">
              <label for="force-current-password">Contraseña actual (inicial)</label>
              <input id="force-current-password" class="input" type="password" autocomplete="current-password" required />
            </div>
            <div class="field">
              <label for="force-new-password">Nueva contraseña</label>
              <input id="force-new-password" class="input" type="password" autocomplete="new-password" required />
            </div>
            <div class="field">
              <label for="force-confirm-password">Confirma la nueva contraseña</label>
              <input id="force-confirm-password" class="input" type="password" autocomplete="new-password" required />
            </div>
            <p class="hint">Mínimo 12 caracteres, con mayúscula, minúscula, número y símbolo. No uses la contraseña inicial.</p>
            <button class="btn btn-block" type="submit">Actualizar y continuar</button>
            <p id="force-password-msg" class="form-msg" role="alert"></p>
          </form>
          <button id="force-logout-btn" class="link-btn" type="button">Salir</button>
        </div>
      </section>

      <section id="app-view" hidden>
        <header class="topbar">
          <div class="topbar-left">
            <a class="brand" href="/">
              <img class="brand-logo" src="/logo.png" alt="" aria-hidden="true" />
              <span>VITAHER IPS</span>
            </a>
            <div class="topbar-title">
              <strong>Gestión de Talento Humano</strong>
              <span>Postulaciones y PQRS</span>
            </div>
          </div>
          <div class="topbar-actions">
            <button id="refresh-btn" class="btn btn-soft" type="button">Actualizar</button>
            <button id="password-btn" class="btn btn-ghost" type="button">Contraseña</button>
            <button id="logout-btn" class="btn btn-ghost" type="button">Salir</button>
          </div>
        </header>

        <div id="stats" class="stats"></div>

        <div class="toolbar">
          <input id="search" class="input search" type="search" placeholder="Buscar por radicado, nombre, correo o teléfono..." />
          <div class="tabs" role="tablist" aria-label="Filtrar por tipo">
            <button class="tab active" type="button" data-cat="">Todas</button>
            <button class="tab" type="button" data-cat="PQRS">PQRS</button>
            <button class="tab" type="button" data-cat="POST">Postulaciones</button>
          </div>
          <select id="status-filter" class="select" aria-label="Filtrar por estado">
            <option value="">Todos los estados</option>
            <option value="Recibido">Recibido</option>
            <option value="En revisión">En revisión</option>
            <option value="Resuelto">Resuelto</option>
            <option value="Cerrado">Cerrado</option>
          </select>
        </div>

        <div id="global-msg" class="form-msg" role="alert"></div>
        <div id="list" class="list"></div>
      </section>
    </main>

    <div id="detail-overlay" class="overlay" hidden>
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <div id="detail-content"></div>
      </div>
    </div>

    <div id="password-overlay" class="overlay" hidden>
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="password-title">
        <div class="modal-head">
          <div>
            <h2 id="password-title">Cambiar contraseña</h2>
            <p>Actualiza la clave de acceso al panel de Talento Humano.</p>
          </div>
          <button class="modal-close" type="button" data-action="close-password" aria-label="Cerrar">×</button>
        </div>
        <form id="password-form">
          <div class="field">
            <label for="current-password">Contraseña actual</label>
            <input id="current-password" class="input" type="password" autocomplete="current-password" required />
          </div>
          <div class="field">
            <label for="new-password">Nueva contraseña</label>
            <input id="new-password" class="input" type="password" autocomplete="new-password" required />
          </div>
          <div class="field">
            <label for="confirm-password">Confirma la nueva contraseña</label>
            <input id="confirm-password" class="input" type="password" autocomplete="new-password" required />
          </div>
          <p class="hint">Mínimo 12 caracteres, con mayúscula, minúscula, número y símbolo.</p>
          <div class="status-actions">
            <button class="btn" type="submit">Guardar contraseña</button>
            <p id="password-msg" class="status-msg" role="status"></p>
          </div>
        </form>
      </div>
    </div>

    <script>
      const API = 'gestion.php';
      let csrf = '';
      let records = [];
      let stats = null;
      let filters = { q: '', categoria: '', estado: '' };
      let currentRadicado = null;

      const DEFAULT_RESPONSES = {
        PQRS: {
          Recibido: (radicado) => `Recibimos tu PQRS${radicado ? ` con radicado ${radicado}` : ''}. Nuestro equipo la revisará y, si necesitamos información adicional, nos pondremos en contacto contigo.`,
          'En revisión': () => 'Tu PQRS está en revisión por el área correspondiente. Estamos analizando la información y te informaremos cualquier avance por este medio.',
          Resuelto: () => 'Tu PQRS fue atendida y quedó resuelta. Gracias por comunicarte con VITAHER IPS; tu solicitud nos ayuda a seguir mejorando.',
          Cerrado: () => 'Tu PQRS fue cerrada. Si necesitas ampliar la información o tienes una nueva solicitud, puedes radicar una nueva PQRS en nuestro sitio web.',
        },
        POST: {
          Recibido: (radicado) => `Recibimos tu postulación${radicado ? ` con radicado ${radicado}` : ''}. El equipo de Talento Humano revisará tu hoja de vida y los documentos enviados.`,
          'En revisión': () => 'Tu postulación está en revisión por Talento Humano. Estamos verificando el cumplimiento de los requisitos y tu experiencia para la vacante.',
          Resuelto: () => 'El proceso de revisión de tu postulación quedó resuelto. Si tu perfil coincide con una vacante disponible, el equipo de Talento Humano se pondrá en contacto contigo.',
          Cerrado: () => 'Tu postulación fue cerrada. Puedes consultar nuevas vacantes y volver a postularte cuando lo desees.',
        },
      };

      function defaultResponseFor(estado, record) {
        const categoria = record?.categoria === 'POST' ? 'POST' : 'PQRS';
        const templates = DEFAULT_RESPONSES[categoria];
        const template = templates[estado] || templates.Recibido;
        return typeof template === 'function' ? template(record?.radicado || '') : template;
      }

      const $ = (selector) => document.querySelector(selector);
      const loginView = $('#login-view');
      const appView = $('#app-view');
      const resetView = $('#reset-view');
      const forcePasswordView = $('#force-password-view');
      const resetForm = $('#reset-form');
      const resetMsg = $('#reset-msg');
      const forcePasswordForm = $('#force-password-form');
      const forcePasswordMsg = $('#force-password-msg');
      const loginForm = $('#login-form');
      const loginMsg = $('#login-msg');
      const passwordOverlay = $('#password-overlay');
      const passwordForm = $('#password-form');
      const passwordMsg = $('#password-msg');
      const listEl = $('#list');
      const statsEl = $('#stats');
      const globalMsg = $('#global-msg');
      const detailOverlay = $('#detail-overlay');
      const detailContent = $('#detail-content');

      function escapeHtml(value) {
        return String(value ?? '')
          .replaceAll('&', '&amp;')
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;')
          .replaceAll('"', '&quot;')
          .replaceAll("'", '&#039;');
      }

      function formatDate(value) {
        if (!value) return '—';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        return date.toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
      }

      function statusClass(estado) {
        return { Recibido: 'recibido', 'En revisión': 'revision', Resuelto: 'resuelto', Cerrado: 'cerrado' }[estado] || 'recibido';
      }

      function categoryLabel(categoria) {
        if (categoria === 'PQRS') return 'PQRS';
        if (categoria === 'POST') return 'Postulación';
        return categoria || 'General';
      }

      async function api(action, options = {}) {
        const method = options.method || 'GET';
        const query = action === 'track' ? '' : `?action=${encodeURIComponent(action)}`;
        const init = { method, credentials: 'same-origin', headers: {} };
        if (options.body) {
          const body = new URLSearchParams();
          for (const [key, value] of Object.entries(options.body)) body.append(key, value ?? '');
          init.body = body;
          init.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
        }
        const res = await fetch(`${API}${query}`, init);
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) {
          showLogin();
          throw new Error(data?.error || 'Tu sesión terminó. Ingresa de nuevo.');
        }
        if (res.status === 403 && data?.must_change_password) {
          showForcePassword(data?.error || 'Debes cambiar la contraseña inicial para continuar.');
          throw new Error(data?.error || 'Debes cambiar la contraseña inicial para continuar.');
        }
        if (!res.ok || !data?.ok) {
          throw new Error(data?.error || 'No fue posible completar la solicitud.');
        }
        return data;
      }

      function showLogin(message = '') {
        appView.hidden = true;
        resetView.hidden = true;
        forcePasswordView.hidden = true;
        passwordOverlay.hidden = true;
        loginView.hidden = false;
        loginMsg.textContent = message;
        $('#forgot-msg').textContent = '';
        $('#forgot-msg').className = 'form-msg';
        if ($('#email').value.trim()) {
          $('#password').focus();
        } else {
          $('#email').focus();
        }
      }

      function showApp() {
        loginView.hidden = true;
        resetView.hidden = true;
        forcePasswordView.hidden = true;
        passwordOverlay.hidden = true;
        appView.hidden = false;
      }

      function showReset(token) {
        loginView.hidden = true;
        appView.hidden = true;
        forcePasswordView.hidden = true;
        passwordOverlay.hidden = true;
        resetView.hidden = false;
        $('#reset-token').value = token;
        resetMsg.textContent = '';
        resetMsg.className = 'form-msg';
        $('#reset-password').value = '';
        $('#reset-confirm').value = '';
        $('#reset-password').focus();
      }

      function showForcePassword(message = '') {
        loginView.hidden = true;
        resetView.hidden = true;
        appView.hidden = true;
        passwordOverlay.hidden = true;
        forcePasswordView.hidden = false;
        forcePasswordForm.reset();
        forcePasswordMsg.textContent = message;
        forcePasswordMsg.className = 'form-msg';
        $('#force-current-password').focus();
      }

      function openPassword() {
        passwordOverlay.hidden = false;
        passwordMsg.textContent = '';
        passwordMsg.className = 'status-msg';
        passwordForm.reset();
        $('#current-password').focus();
      }

      function closePassword() {
        passwordOverlay.hidden = true;
        passwordMsg.textContent = '';
        passwordMsg.className = 'status-msg';
        passwordForm.reset();
      }

      function renderStats() {
        const s = stats || { total: 0, recibidos: 0, revision: 0, resueltos: 0 };
        statsEl.innerHTML = `
          <div class="stat"><span>Total radicados</span><strong>${s.total}</strong></div>
          <div class="stat"><span>Recibidos</span><strong>${s.recibidos || 0}</strong></div>
          <div class="stat accent"><span>En revisión</span><strong>${s.revision || 0}</strong></div>
          <div class="stat"><span>Resueltos</span><strong>${s.resueltos || 0}</strong></div>
        `;
      }

      function filteredRecords() {
        const q = filters.q.trim().toLowerCase();
        return records.filter((record) => {
          if (filters.categoria && record.categoria !== filters.categoria) return false;
          if (filters.estado && record.estado !== filters.estado) return false;
          if (!q) return true;
          const haystack = [
            record.radicado,
            record.nombre,
            record.correo,
            record.telefono,
            record.tipo,
            record.mensaje,
            record.extra,
          ]
            .join(' ')
            .toLowerCase();
          return haystack.includes(q);
        });
      }

      function renderList() {
        const rows = filteredRecords();
        if (!rows.length) {
          listEl.innerHTML = `
            <div class="empty">
              <strong>No hay radicados con estos filtros.</strong>
              <span>Prueba con otro estado, categoría o término de búsqueda.</span>
            </div>
          `;
          return;
        }

        listEl.innerHTML = rows
          .map((record) => {
            const nombre = record.nombre || 'Anónimo';
            const mensaje = record.mensaje || '';
            const preview = mensaje.length > 220 ? `${mensaje.slice(0, 220)}…` : mensaje;
            return `
              <article class="record" data-radicado="${escapeHtml(record.radicado)}">
                <div>
                  <div class="record-top">
                    <span class="badge ${statusClass(record.estado)}">${escapeHtml(record.estado || 'Recibido')}</span>
                    <span class="cat">${escapeHtml(categoryLabel(record.categoria))}</span>
                    <span class="code">${escapeHtml(record.radicado)}</span>
                  </div>
                  <h3>${escapeHtml(nombre)} <span>· ${escapeHtml(record.tipo || '')}</span></h3>
                  <p class="meta">${escapeHtml(formatDate(record.fecha))} · ${escapeHtml(record.correo || 'Sin correo')} · ${escapeHtml(record.telefono || 'Sin teléfono')}</p>
                  <p class="preview">${escapeHtml(preview || 'Sin descripción.')}</p>
                </div>
                <div class="record-actions">
                  <button type="button" class="btn" data-action="detail" data-radicado="${escapeHtml(record.radicado)}">Ver detalle</button>
                  <button type="button" class="btn btn-soft" data-action="copy" data-radicado="${escapeHtml(record.radicado)}">Copiar radicado</button>
                </div>
              </article>
            `;
          })
          .join('');
      }

      async function load() {
        globalMsg.textContent = '';
        try {
          const data = await api('list');
          records = data.registros || [];
          stats = data.stats || null;
          csrf = data.csrf || csrf;
          renderStats();
          renderList();
        } catch (error) {
          globalMsg.textContent = error.message;
        }
      }

      function renderDetail(record) {
        if (!record) return;
        currentRadicado = record.radicado;
        const archivos = Array.isArray(record.archivos) ? record.archivos : [];
        const archivosGuardados = Array.isArray(record.archivos_guardados) ? record.archivos_guardados : [];
        const historial = Array.isArray(record.historial) ? record.historial : [];
        const extra = record.extra || '';
        const mensaje = record.mensaje || '';
        const extraMap = Object.create(null);
        extra.split(/\r?\n/).forEach((line) => {
          const separator = line.indexOf(':');
          if (separator <= 0) return;
          const key = line.slice(0, separator).trim();
          const value = line.slice(separator + 1).trim();
          if (key && value) extraMap[key] = value;
        });
        const knownExtraKeys = new Set([
          'Tipo', 'Servicio', 'Fecha del evento', 'Documento', 'Municipio', 'Ciudad', 'Dirección',
          'Cargo', 'Nivel de formación', 'Lista de chequeo',
        ]);
        const municipio = extraMap['Municipio'] || extraMap['Ciudad'] || '—';
        const extraUnknown = extra
          .split(/\r?\n/)
          .filter((line) => {
            const separator = line.indexOf(':');
            return separator <= 0 || !knownExtraKeys.has(line.slice(0, separator).trim());
          })
          .filter(Boolean);
        const profileRows = [
          ['Cargo', extraMap['Cargo']],
          ['Nivel de formación', extraMap['Nivel de formación']],
          ['Lista de chequeo', extraMap['Lista de chequeo']],
          ['Servicio', extraMap['Servicio']],
          ['Fecha del evento', extraMap['Fecha del evento']],
          ['Dirección', extraMap['Dirección']],
        ].filter(([, value]) => value);
        const archivosHtml = archivos.length
          ? `<ul class="files">${archivos.map((name, index) => {
              const stored = typeof archivosGuardados[index] === 'string' && archivosGuardados[index];
              if (!stored) {
                return `<li>${escapeHtml(name)} <span class="muted">(no disponible para descarga)</span></li>`;
              }
              const href = `gestion.php?action=file&radicado=${encodeURIComponent(record.radicado)}&index=${index}`;
              return `<li><a href="${escapeHtml(href)}" target="_blank" rel="noopener">${escapeHtml(name)}</a></li>`;
            }).join('')}</ul>`
          : '<p style="margin:0;font-size:.86rem;color:var(--ink-soft)">Sin archivos adjuntos.</p>';

        detailContent.innerHTML = `
          <div class="modal-head">
            <div>
              <div class="record-top">
                <span class="badge ${statusClass(record.estado)}">${escapeHtml(record.estado || 'Recibido')}</span>
                <span class="cat">${escapeHtml(categoryLabel(record.categoria))}</span>
              </div>
              <h2 id="detail-title">${escapeHtml(record.radicado)}</h2>
              <p>${escapeHtml(record.tipo || '')} · Radicado el ${escapeHtml(formatDate(record.fecha))}</p>
            </div>
            <button class="modal-close" type="button" data-action="close-detail" aria-label="Cerrar">×</button>
          </div>

          <div class="detail-grid">
            <div><span>Nombre</span><strong>${escapeHtml(record.nombre || 'Anónimo')}</strong></div>
            <div><span>Documento</span><strong>${escapeHtml(extraMap['Documento'] || '—')}</strong></div>
            <div><span>Correo</span><strong>${escapeHtml(record.correo || '—')}</strong></div>
            <div><span>Teléfono</span><strong>${escapeHtml(record.telefono || '—')}</strong></div>
            <div><span>Municipio</span><strong>${escapeHtml(municipio)}</strong></div>
            ${profileRows.map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join('')}
            <div><span>Origen</span><strong>${record.origen === 'whatsapp' ? 'WhatsApp' : 'Formulario web'}</strong></div>
          </div>

          ${extraUnknown.length ? `<div class="detail-section"><h4>Otros datos</h4><pre>${escapeHtml(extraUnknown.join('\n'))}</pre></div>` : ''}
          <div class="detail-section"><h4>Descripción</h4><pre>${escapeHtml(mensaje || 'Sin descripción.')}</pre></div>
          <div class="detail-section">
            <h4>Archivos</h4>
            ${archivosHtml}
          </div>
          <div class="detail-section">
            <h4>Historial de estados</h4>
            <div class="history">
              ${historial.map((item) => `
                <div class="history-item">
                  <span class="history-dot"></span>
                  <div>
                    <strong>${escapeHtml(item.estado || '')}</strong>
                    <span>${escapeHtml(formatDate(item.fecha))}${item.por ? ` · ${escapeHtml(item.por)}` : ''}</span>
                    ${item.respuesta ? `<p class="history-public"><strong>Respuesta pública:</strong> ${escapeHtml(item.respuesta)}</p>` : ''}
                    ${item.nota ? `<p class="history-internal"><strong>Nota interna:</strong> ${escapeHtml(item.nota)}</p>` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <form id="status-form" class="status-form">
            <h4>Actualizar estado</h4>
            <div class="row">
              <div class="field">
                <label for="status-select">Nuevo estado</label>
                <select id="status-select" class="select" name="estado">
                  ${['Recibido', 'En revisión', 'Resuelto', 'Cerrado'].map((estado) => `<option value="${estado}"${estado === record.estado ? ' selected' : ''}>${estado}</option>`).join('')}
                </select>
              </div>
              <div class="field">
                <label for="status-response">Respuesta pública (visible para el ciudadano)</label>
                <textarea id="status-response" class="textarea" name="respuesta" maxlength="2000" placeholder="Ej: Tu solicitud fue revisada y..."></textarea>
                <span class="hint">Se completa automáticamente según el estado; puedes editarla. Se muestra en el seguimiento y se envía por correo si activas la notificación.</span>
              </div>
            </div>
            <div class="field">
              <label for="status-note">Nota interna (solo Talento Humano)</label>
              <textarea id="status-note" class="textarea" name="nota" maxlength="800" placeholder="Ej: Se validó con el área correspondiente..."></textarea>
            </div>
            <label class="check-field" for="status-notify">
              <input type="checkbox" id="status-notify" name="notificar" value="1" checked />
              <span>Notificar al ciudadano por correo</span>
            </label>
            <div class="status-actions">
              <button class="btn" type="submit">Guardar estado</button>
              <p id="status-msg" class="status-msg" role="status"></p>
            </div>
          </form>
        `;

        const syncResponseRequirement = () => {
          const estado = $('#status-select')?.value;
          const response = $('#status-response');
          if (!response) return;
          const required = estado === 'Resuelto';
          response.required = required;
          response.value = defaultResponseFor(estado, record);
          response.placeholder = required
            ? 'Obligatoria para marcar como Resuelto: explica la decisión al ciudadano...'
            : 'Ej: Estamos revisando tu caso y te contaremos cuando tengamos una respuesta...';
        };
        $('#status-select')?.addEventListener('change', syncResponseRequirement);
        syncResponseRequirement();

        $('#status-form')?.addEventListener('submit', async (event) => {
          event.preventDefault();
          const message = $('#status-msg');
          const button = event.currentTarget.querySelector('button[type="submit"]');
          const estado = $('#status-select').value;
          const respuesta = $('#status-response').value.trim();
          const nota = $('#status-note').value.trim();
          const notificar = $('#status-notify').checked;
          button.disabled = true;
          message.className = 'status-msg';
          message.textContent = 'Guardando…';
          try {
            const data = await api('status', {
              method: 'POST',
              body: {
                csrf,
                radicado: currentRadicado,
                estado,
                respuesta,
                nota,
                notificar: notificar ? '1' : '0',
              },
            });
            const detalle = data.notificacion || {};
            let statusMessage = 'Estado actualizado. No se envió notificación.';
            let statusClass = 'status-msg ok';
            if (notificar) {
              if (detalle.enviado) {
                statusMessage = 'Estado actualizado y ciudadano notificado por correo.';
              } else if (detalle.motivo === 'sin_correo') {
                statusMessage = 'Estado actualizado. El registro no tiene correo; puedes copiar el mensaje para WhatsApp.';
                statusClass = 'status-msg warn';
              } else {
                statusMessage = 'Estado actualizado, pero no se pudo enviar el correo. Revisa la configuración de correo.';
                statusClass = 'status-msg warn';
              }
            }
            await load();
            const updated = records.find((item) => item.radicado === currentRadicado);
            if (updated) {
              renderDetail(updated);
              const updatedMsg = $('#status-msg');
              if (updatedMsg) {
                updatedMsg.className = statusClass;
                updatedMsg.textContent = statusMessage;
              }
            } else {
              message.className = statusClass;
              message.textContent = statusMessage;
            }
          } catch (error) {
            message.className = 'status-msg error';
            message.textContent = error.message;
          } finally {
            button.disabled = false;
          }
        });
      }

      function openDetail(radicado) {
        const record = records.find((item) => item.radicado === radicado);
        if (!record) return;
        renderDetail(record);
        detailOverlay.hidden = false;
        document.body.style.overflow = 'hidden';
      }

      function closeDetail() {
        detailOverlay.hidden = true;
        document.body.style.overflow = '';
        currentRadicado = null;
      }

      async function copyRadicado(radicado) {
        try {
          await navigator.clipboard.writeText(radicado);
          globalMsg.textContent = `Radicado ${radicado} copiado.`;
          globalMsg.style.color = 'var(--accent)';
          setTimeout(() => {
            globalMsg.textContent = '';
            globalMsg.style.color = '';
          }, 2500);
        } catch {
          globalMsg.textContent = `No se pudo copiar automáticamente: ${radicado}`;
        }
      }

      loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        loginMsg.textContent = '';
        const button = loginForm.querySelector('button[type="submit"]');
        button.disabled = true;
        try {
          const data = await api('login', {
            method: 'POST',
            body: { email: $('#email').value.trim(), password: $('#password').value },
          });
          csrf = data.csrf;
          $('#password').value = '';
          if (data.must_change_password) {
            showForcePassword();
            return;
          }
          showApp();
          await load();
        } catch (error) {
          loginMsg.textContent = error.message;
        } finally {
          button.disabled = false;
        }
      });

      forcePasswordForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const button = forcePasswordForm.querySelector('button[type="submit"]');
        button.disabled = true;
        forcePasswordMsg.textContent = '';
        forcePasswordMsg.className = 'form-msg';
        try {
          const data = await api('change-password', {
            method: 'POST',
            body: {
              csrf,
              current_password: $('#force-current-password').value,
              new_password: $('#force-new-password').value,
              confirm_password: $('#force-confirm-password').value,
            },
          });
          csrf = data.csrf || csrf;
          forcePasswordForm.reset();
          showApp();
          await load();
          globalMsg.className = 'form-msg ok';
          globalMsg.textContent = 'Contraseña inicial actualizada. Ya puedes gestionar los radicados.';
        } catch (error) {
          forcePasswordMsg.textContent = error.message;
        } finally {
          button.disabled = false;
        }
      });

      $('#force-logout-btn').addEventListener('click', async () => {
        try {
          await api('logout', { method: 'POST' });
        } catch {}
        csrf = '';
        records = [];
        showLogin();
      });

      $('#forgot-btn').addEventListener('click', async () => {
        const button = $('#forgot-btn');
        const message = $('#forgot-msg');
        button.disabled = true;
        message.textContent = '';
        message.className = 'form-msg';
        try {
          const data = await api('request-reset', { method: 'POST', body: {} });
          message.className = 'form-msg ok';
          message.textContent = data.message || 'Revisa tu correo para continuar.';
        } catch (error) {
          message.className = 'form-msg';
          message.textContent = error.message;
        } finally {
          button.disabled = false;
        }
      });

      resetForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const button = resetForm.querySelector('button[type="submit"]');
        button.disabled = true;
        resetMsg.textContent = '';
        resetMsg.className = 'form-msg';
        try {
          const data = await api('reset-password', {
            method: 'POST',
            body: {
              token: $('#reset-token').value,
              new_password: $('#reset-password').value,
              confirm_password: $('#reset-confirm').value,
            },
          });
          history.replaceState({}, '', 'admin.php');
          showLogin(data.message || 'Contraseña actualizada. Ingresa con tu nueva contraseña.');
        } catch (error) {
          resetMsg.textContent = error.message;
        } finally {
          button.disabled = false;
        }
      });

      $('#password-btn').addEventListener('click', openPassword);

      passwordForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const button = passwordForm.querySelector('button[type="submit"]');
        button.disabled = true;
        passwordMsg.textContent = '';
        passwordMsg.className = 'status-msg';
        try {
          const data = await api('change-password', {
            method: 'POST',
            body: {
              csrf,
              current_password: $('#current-password').value,
              new_password: $('#new-password').value,
              confirm_password: $('#confirm-password').value,
            },
          });
          csrf = data.csrf || csrf;
          passwordMsg.className = 'status-msg ok';
          passwordMsg.textContent = data.message || 'Contraseña actualizada.';
          passwordForm.reset();
          setTimeout(() => {
            if (!passwordOverlay.hidden) closePassword();
          }, 1800);
        } catch (error) {
          passwordMsg.className = 'status-msg error';
          passwordMsg.textContent = error.message;
        } finally {
          button.disabled = false;
        }
      });

      $('#logout-btn').addEventListener('click', async () => {
        try {
          await api('logout', { method: 'POST' });
        } catch {}
        csrf = '';
        records = [];
        showLogin();
      });

      $('#refresh-btn').addEventListener('click', load);

      $('#search').addEventListener('input', (event) => {
        filters.q = event.target.value;
        renderList();
      });

      $('#status-filter').addEventListener('change', (event) => {
        filters.estado = event.target.value;
        renderList();
      });

      document.querySelectorAll('.tab').forEach((tab) => {
        tab.addEventListener('click', () => {
          document.querySelectorAll('.tab').forEach((item) => item.classList.remove('active'));
          tab.classList.add('active');
          filters.categoria = tab.dataset.cat || '';
          renderList();
        });
      });

      listEl.addEventListener('click', (event) => {
        const button = event.target.closest('[data-action]');
        if (!button) return;
        const radicado = button.dataset.radicado;
        if (button.dataset.action === 'detail') openDetail(radicado);
        if (button.dataset.action === 'copy') copyRadicado(radicado);
      });

      detailOverlay.addEventListener('click', (event) => {
        if (event.target === detailOverlay) closeDetail();
        if (event.target.closest('[data-action="close-detail"]')) closeDetail();
      });

      passwordOverlay.addEventListener('click', (event) => {
        if (event.target === passwordOverlay) closePassword();
        if (event.target.closest('[data-action="close-password"]')) closePassword();
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !passwordOverlay.hidden) {
          closePassword();
        } else if (event.key === 'Escape' && !detailOverlay.hidden) {
          closeDetail();
        }
      });

      (async function init() {
        const resetToken = new URLSearchParams(window.location.search).get('reset');
        if (resetToken) {
          showReset(resetToken);
          return;
        }
        try {
          const data = await api('me');
          if (data.authenticated) {
            csrf = data.csrf || '';
            if (data.must_change_password) {
              showForcePassword();
              return;
            }
            showApp();
            await load();
          } else {
            showLogin(
              data.configured
                ? ''
                : 'El acceso aún no está configurado. Revisa la configuración de Talento Humano.',
            );
          }
        } catch (error) {
          showLogin('No pudimos conectar con el servidor. Verifica que PHP esté activo.');
        }
      })();
    </script>
  </body>
</html>
