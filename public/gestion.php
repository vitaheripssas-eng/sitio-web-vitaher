<?php
declare(strict_types=1);

require __DIR__ . '/tracking-lib.php';

header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = trim((string)($_GET['action'] ?? $_POST['action'] ?? ''));

if ($method === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}

if ($action === 'track') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');

    if (!vitaher_rate_limit('track', 60, 3600)) {
        vitaher_json_response(
            ['ok' => false, 'error' => 'Demasiadas consultas desde esta conexión. Intenta más tarde.'],
            429
        );
    }

    $radicado = trim((string)($_GET['radicado'] ?? ''));
    if ($radicado === '') {
        vitaher_json_response(['ok' => false, 'error' => 'Escribe un número de radicado.'], 422);
    }

    $record = vitaher_find_record($radicado);
    if ($record === null) {
        vitaher_json_response(
            ['ok' => false, 'error' => 'No encontramos un radicado con ese número.'],
            404
        );
    }

    vitaher_json_response(['ok' => true, 'registro' => vitaher_public_record($record)]);
}

if ($action === 'me') {
    vitaher_start_session();
    $authenticated = !empty($_SESSION['vitaher_admin']);
    vitaher_json_response([
        'ok' => true,
        'authenticated' => $authenticated,
        'email' => $_SESSION['vitaher_admin_email'] ?? null,
        'csrf' => $_SESSION['csrf'] ?? null,
        'configured' => vitaher_admin_configured(),
        'must_change_password' => $authenticated && vitaher_admin_must_change_password(),
    ]);
}

if ($action === 'login') {
    if ($method !== 'POST') {
        vitaher_json_response(['ok' => false, 'error' => 'Método no permitido.'], 405);
    }

    if (!vitaher_admin_configured()) {
        vitaher_json_response(
            [
                'ok' => false,
                'error' => 'El acceso de Talento Humano aún no está configurado.',
            ],
            503
        );
    }

    if (!vitaher_rate_limit('login', 8, 600)) {
        vitaher_json_response(
            ['ok' => false, 'error' => 'Demasiados intentos. Espera unos minutos e intenta de nuevo.'],
            429
        );
    }

    $email = trim((string)($_POST['email'] ?? ''));
    $password = (string)($_POST['password'] ?? '');
    if ($email === '') {
        vitaher_json_response(['ok' => false, 'error' => 'Escribe tu correo electrónico.'], 422);
    }
    if ($password === '') {
        vitaher_json_response(['ok' => false, 'error' => 'Escribe tu contraseña.'], 422);
    }

    if (!vitaher_check_credentials($email, $password)) {
        vitaher_json_response(['ok' => false, 'error' => 'Correo o contraseña incorrectos.'], 401);
    }

    vitaher_rate_reset('login');
    vitaher_start_session();
    session_regenerate_id(true);
    $_SESSION['vitaher_admin'] = true;
    $_SESSION['vitaher_admin_email'] = vitaher_admin_config()['email'];
    $_SESSION['vitaher_admin_must_change'] = vitaher_admin_uses_default_password();
    $_SESSION['csrf'] = bin2hex(random_bytes(32));

    vitaher_json_response([
        'ok' => true,
        'csrf' => $_SESSION['csrf'],
        'email' => $_SESSION['vitaher_admin_email'],
        'must_change_password' => $_SESSION['vitaher_admin_must_change'],
    ]);
}

if ($action === 'change-password') {
    vitaher_require_admin(true);
    if ($method !== 'POST') {
        vitaher_json_response(['ok' => false, 'error' => 'Método no permitido.'], 405);
    }

    $csrf = (string)($_POST['csrf'] ?? '');
    if ($csrf === '' || !hash_equals((string)($_SESSION['csrf'] ?? ''), $csrf)) {
        vitaher_json_response(['ok' => false, 'error' => 'Sesión inválida. Recarga la página.'], 403);
    }

    $current = (string)($_POST['current_password'] ?? '');
    $new = (string)($_POST['new_password'] ?? '');
    $confirm = (string)($_POST['confirm_password'] ?? '');

    if (!vitaher_check_password($current)) {
        vitaher_json_response(['ok' => false, 'error' => 'La contraseña actual no es correcta.'], 422);
    }
    if ($new !== $confirm) {
        vitaher_json_response(['ok' => false, 'error' => 'La nueva contraseña y su confirmación no coinciden.'], 422);
    }
    if ($current === $new) {
        vitaher_json_response(['ok' => false, 'error' => 'La nueva contraseña debe ser diferente a la actual.'], 422);
    }
    $passwordError = vitaher_validate_new_password($new);
    if ($passwordError !== null) {
        vitaher_json_response(['ok' => false, 'error' => $passwordError], 422);
    }
    if (!vitaher_save_admin_password($new)) {
        vitaher_json_response(['ok' => false, 'error' => 'No pudimos guardar la nueva contraseña. Intenta de nuevo.'], 500);
    }
    vitaher_clear_admin_reset();

    session_regenerate_id(true);
    $_SESSION['vitaher_admin_must_change'] = false;
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
    vitaher_json_response([
        'ok' => true,
        'csrf' => $_SESSION['csrf'],
        'message' => 'Contraseña actualizada correctamente.',
    ]);
}

if ($action === 'request-reset') {
    if ($method !== 'POST') {
        vitaher_json_response(['ok' => false, 'error' => 'Método no permitido.'], 405);
    }
    if (!vitaher_rate_limit('admin-reset', 3, 900)) {
        vitaher_json_response(
            ['ok' => false, 'error' => 'Demasiadas solicitudes. Espera unos minutos e intenta de nuevo.'],
            429
        );
    }

    $generic = [
        'ok' => true,
        'message' => 'Si el correo de Talento Humano está registrado, enviamos un enlace de recuperación. Revisa la bandeja de entrada y la carpeta de spam.',
    ];
    if (!vitaher_admin_configured()) {
        vitaher_json_response($generic);
    }

    $config = vitaher_admin_config();
    $token = vitaher_create_admin_reset();
    if ($token !== null) {
        vitaher_send_admin_reset($config['email'], vitaher_admin_reset_url($token));
    }
    vitaher_json_response($generic);
}

if ($action === 'reset-password') {
    if ($method !== 'POST') {
        vitaher_json_response(['ok' => false, 'error' => 'Método no permitido.'], 405);
    }
    if (!vitaher_rate_limit('admin-reset-confirm', 6, 900)) {
        vitaher_json_response(
            ['ok' => false, 'error' => 'Demasiados intentos. Espera unos minutos e intenta de nuevo.'],
            429
        );
    }

    $token = trim((string)($_POST['token'] ?? ''));
    $new = (string)($_POST['new_password'] ?? '');
    $confirm = (string)($_POST['confirm_password'] ?? '');

    if ($token === '') {
        vitaher_json_response(['ok' => false, 'error' => 'El enlace de recuperación no es válido.'], 422);
    }
    if ($new !== $confirm) {
        vitaher_json_response(['ok' => false, 'error' => 'La nueva contraseña y su confirmación no coinciden.'], 422);
    }
    $passwordError = vitaher_validate_new_password($new);
    if ($passwordError !== null) {
        vitaher_json_response(['ok' => false, 'error' => $passwordError], 422);
    }
    if (!vitaher_verify_admin_reset($token)) {
        vitaher_json_response(
            ['ok' => false, 'error' => 'El enlace no es válido o ya venció. Solicita uno nuevo.'],
            400
        );
    }
    if (!vitaher_save_admin_password($new)) {
        vitaher_json_response(['ok' => false, 'error' => 'No pudimos guardar la nueva contraseña. Intenta de nuevo.'], 500);
    }

    vitaher_clear_admin_reset();
    vitaher_rate_reset('admin-reset-confirm');
    vitaher_start_session();
    $_SESSION = [];
    session_destroy();

    vitaher_json_response([
        'ok' => true,
        'message' => 'Contraseña actualizada. Ya puedes ingresar con tu nueva contraseña.',
    ]);
}

if ($action === 'logout') {
    vitaher_start_session();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'] ?? '', (bool)$params['secure'], (bool)$params['httponly']);
    }
    session_destroy();
    vitaher_json_response(['ok' => true]);
}

if ($action === 'file') {
    vitaher_require_admin();

    $radicado = trim((string)($_GET['radicado'] ?? ''));
    $index = (int)($_GET['index'] ?? -1);
    $record = vitaher_find_record($radicado);

    if ($record === null) {
        vitaher_json_response(['ok' => false, 'error' => 'No encontramos ese radicado.'], 404);
    }

    $paths = $record['archivos_guardados'] ?? [];
    if (!is_array($paths) || $index < 0 || !array_key_exists($index, $paths)) {
        vitaher_json_response(['ok' => false, 'error' => 'Archivo no encontrado.'], 404);
    }

    $relative = ltrim(str_replace('\\', '/', (string)$paths[$index]), '/');
    if (!preg_match('#^uploads/\d{4}-\d{2}/[A-Za-z0-9._-]+$#', $relative)) {
        vitaher_json_response(['ok' => false, 'error' => 'Ruta de archivo no válida.'], 400);
    }

    $uploads = realpath(vitaher_storage_dir() . '/uploads');
    $path = realpath(vitaher_storage_dir() . '/' . $relative);

    if (
        $uploads === false
        || $path === false
        || strpos($path, $uploads . DIRECTORY_SEPARATOR) !== 0
        || !is_file($path)
    ) {
        vitaher_json_response(['ok' => false, 'error' => 'Archivo no disponible.'], 404);
    }

    $names = $record['archivos'] ?? [];
    $name = is_array($names) && isset($names[$index])
        ? (string)$names[$index]
        : basename($path);
    $name = preg_replace('/[\r\n"]+/', '_', basename($name)) ?: 'archivo';

    header('Content-Type: application/octet-stream');
    header('Content-Length: ' . (string)filesize($path));
    header(
        'Content-Disposition: attachment; filename="' . $name
        . '"; filename*=UTF-8\'\'' . rawurlencode($name)
    );
    header('X-Content-Type-Options: nosniff');
    readfile($path);
    exit;
}

if ($action === 'delete') {
    vitaher_require_admin();
    if ($method !== 'POST') {
        vitaher_json_response(['ok' => false, 'error' => 'Método no permitido.'], 405);
    }

    $csrf = (string)($_POST['csrf'] ?? '');
    if ($csrf === '' || !hash_equals((string)($_SESSION['csrf'] ?? ''), $csrf)) {
        vitaher_json_response(['ok' => false, 'error' => 'Sesión inválida. Recarga la página.'], 403);
    }

    $radicado = trim((string)($_POST['radicado'] ?? ''));
    if ($radicado === '') {
        vitaher_json_response(['ok' => false, 'error' => 'Falta el número de radicado.'], 422);
    }

    $result = vitaher_delete_record($radicado);
    if (empty($result['ok'])) {
        $status = ($result['error'] ?? '') === 'No encontramos ese radicado.' ? 404 : 500;
        vitaher_json_response($result, $status);
    }

    vitaher_json_response($result);
}

if ($action === 'list') {
    vitaher_require_admin();
    $records = vitaher_get_records();

    $stats = [
        'total' => count($records),
        'pqrs' => 0,
        'postulaciones' => 0,
        'recibidos' => 0,
        'revision' => 0,
        'resueltos' => 0,
        'cerrados' => 0,
    ];
    foreach ($records as $record) {
        if (($record['categoria'] ?? '') === 'PQRS') {
            $stats['pqrs']++;
        }
        if (($record['categoria'] ?? '') === 'POST') {
            $stats['postulaciones']++;
        }
        if (($record['estado'] ?? '') === 'Recibido') {
            $stats['recibidos']++;
        }
        if (($record['estado'] ?? '') === 'En revisión') {
            $stats['revision']++;
        }
        if (($record['estado'] ?? '') === 'Resuelto') {
            $stats['resueltos']++;
        }
        if (($record['estado'] ?? '') === 'Cerrado') {
            $stats['cerrados']++;
        }
    }

    vitaher_json_response([
        'ok' => true,
        'registros' => $records,
        'stats' => $stats,
        'csrf' => $_SESSION['csrf'] ?? '',
    ]);
}

if ($action === 'status') {
    vitaher_require_admin();
    if ($method !== 'POST') {
        vitaher_json_response(['ok' => false, 'error' => 'Método no permitido.'], 405);
    }

    $csrf = (string)($_POST['csrf'] ?? '');
    if ($csrf === '' || !hash_equals((string)($_SESSION['csrf'] ?? ''), $csrf)) {
        vitaher_json_response(['ok' => false, 'error' => 'Sesión inválida. Recarga la página.'], 403);
    }

    $radicado = trim((string)($_POST['radicado'] ?? ''));
    $estado = trim((string)($_POST['estado'] ?? ''));
    $nota = mb_substr(trim((string)($_POST['nota'] ?? '')), 0, 800);
    $respuesta = mb_substr(trim((string)($_POST['respuesta'] ?? '')), 0, 2000);
    $notificar = filter_var($_POST['notificar'] ?? '1', FILTER_VALIDATE_BOOLEAN);

    if ($radicado === '') {
        vitaher_json_response(['ok' => false, 'error' => 'Falta el número de radicado.'], 422);
    }
    if (!in_array($estado, vitaher_statuses(), true)) {
        vitaher_json_response(['ok' => false, 'error' => 'Estado no válido.'], 422);
    }
    if ($estado === 'Resuelto' && $respuesta === '') {
        vitaher_json_response(
            ['ok' => false, 'error' => 'Para marcar como Resuelto, escribe una respuesta pública para el ciudadano.'],
            422
        );
    }

    $record = vitaher_find_record($radicado);
    if ($record === null) {
        vitaher_json_response(['ok' => false, 'error' => 'No encontramos ese radicado.'], 404);
    }

    if ($respuesta === '') {
        $respuesta = vitaher_default_response(
            (string)($record['categoria'] ?? ''),
            $estado,
            $radicado
        );
    }

    if (!vitaher_save_status($radicado, $estado, $nota, $respuesta)) {
        vitaher_json_response(['ok' => false, 'error' => 'No pudimos guardar el estado.'], 500);
    }

    $record = vitaher_find_record($radicado);
    $notificacion = ['enviado' => false, 'motivo' => 'no_solicitada'];
    if ($notificar) {
        $correo = trim((string)($record['correo'] ?? ''));
        if ($correo === '' || !filter_var($correo, FILTER_VALIDATE_EMAIL)) {
            $notificacion['motivo'] = 'sin_correo';
        } elseif (vitaher_send_status_update($record, $estado, $respuesta)) {
            $notificacion = ['enviado' => true, 'motivo' => 'enviado'];
        } else {
            $notificacion['motivo'] = 'error_envio';
        }
    }

    vitaher_json_response([
        'ok' => true,
        'registro' => $record,
        'notificado' => $notificacion['enviado'],
        'notificacion' => $notificacion,
    ]);
}

vitaher_json_response(['ok' => false, 'error' => 'Acción no válida.'], 404);
