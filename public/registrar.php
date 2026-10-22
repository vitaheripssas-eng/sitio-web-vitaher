<?php
declare(strict_types=1);

require __DIR__ . '/tracking-lib.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    vitaher_json_response(['ok' => false, 'error' => 'Método no permitido.'], 405);
}

if (!empty($_POST['website'])) {
    vitaher_json_response(['ok' => false, 'error' => 'Solicitud inválida.'], 422);
}

if (!vitaher_rate_limit('registrar', 12, 3600)) {
    vitaher_json_response(
        ['ok' => false, 'error' => 'Recibimos varias solicitudes desde esta conexión. Intenta más tarde.'],
        429
    );
}

$categoria = strtoupper(trim((string)($_POST['categoria'] ?? 'PQRS')));
$categoria = $categoria === 'POST' ? 'POST' : 'PQRS';
$tipo = trim((string)($_POST['tipo'] ?? ($categoria === 'POST' ? 'Postulación laboral' : 'PQRS')));
$nombre = trim((string)($_POST['nombre'] ?? ''));
$telefono = trim((string)($_POST['telefono'] ?? ''));
$correo = trim((string)($_POST['correo'] ?? ''));
$extra = trim((string)($_POST['extra'] ?? ''));
$mensaje = trim((string)($_POST['mensaje'] ?? ''));

if ($mensaje === '') {
    vitaher_json_response(['ok' => false, 'error' => 'Falta la descripción de la solicitud.'], 422);
}

if ($nombre === '') {
    $nombre = 'Anónimo';
}

if ($correo !== '' && !filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    $correo = '';
}

$radicado = vitaher_generate_radicado($categoria === 'POST' ? 'POST' : 'PQRS');

$record = [
    'radicado' => $radicado,
    'categoria' => $categoria,
    'tipo' => mb_substr($tipo, 0, 120),
    'nombre' => mb_substr($nombre, 0, 120),
    'telefono' => mb_substr($telefono, 0, 40),
    'correo' => mb_substr($correo, 0, 120),
    'extra' => mb_substr($extra, 0, 2000),
    'mensaje' => mb_substr($mensaje, 0, 5000),
    'archivos' => [],
    'origen' => 'whatsapp',
    'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
    'ua' => mb_substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 300),
    'fecha' => date('c'),
    'estado' => 'Recibido',
];

$guardado = vitaher_save_record($record);

if (!$guardado) {
    vitaher_json_response(
        ['ok' => false, 'error' => 'No pudimos registrar el radicado. Intenta de nuevo.'],
        500
    );
}

$confirmacionEnviada = vitaher_send_confirmation($record);

vitaher_json_response([
    'ok' => true,
    'radicado' => $radicado,
    'confirmacion' => $confirmacionEnviada,
]);
