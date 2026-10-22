<?php
declare(strict_types=1);

require __DIR__ . '/tracking-lib.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Metodo no permitido']);
    exit;
}

/* ========= CONFIGURACION ========= */
$PARA_DEFAULT = 'coordinacionarauca2026@gmail.com';
$PARA_TALENTO = 'talentohumanovitaher@gmail.com';
$MAX_MB = 20;

/* Honeypot */
if (!empty($_POST['website'])) { echo json_encode(['ok' => true]); exit; }

$tipo     = trim((string)($_POST['tipo'] ?? 'Consulta web'));
$nombre   = trim((string)($_POST['nombre'] ?? ''));
$telefono = trim((string)($_POST['telefono'] ?? ''));
$correo   = trim((string)($_POST['correo'] ?? ''));
$mensaje  = trim((string)($_POST['mensaje'] ?? ''));
$extra    = trim((string)($_POST['extra'] ?? ''));

$categoria = 'GENERAL';
if (stripos($tipo, 'PQRS') !== false) {
    $categoria = 'PQRS';
} elseif (stripos($tipo, 'Postulación') !== false || stripos($tipo, 'Postulacion') !== false) {
    $categoria = 'POST';
}
$radicado = in_array($categoria, ['PQRS', 'POST'], true)
    ? vitaher_generate_radicado($categoria === 'POST' ? 'POST' : 'PQRS')
    : null;

$dest = trim((string)($_POST['destinatario'] ?? $_POST['para'] ?? ''));
if ($dest !== '' && filter_var($dest, FILTER_VALIDATE_EMAIL)) {
    $PARA = $dest;
} elseif (stripos($tipo, 'Postulación') !== false || stripos($tipo, 'PQRS') !== false) {
    $PARA = $PARA_TALENTO;
} else {
    $PARA = $PARA_DEFAULT;
}

if ($nombre === '' || $mensaje === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Faltan datos obligatorios.']);
    exit;
}

/* ========= VALIDACION DE ARCHIVOS ========= */
$permitidos = ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'doc', 'docx', 'xls', 'xlsx'];
$limite     = $MAX_MB * 1024 * 1024;
$adjuntos   = [];

if (!empty($_FILES['archivo'])) {
    $nombres = (array)$_FILES['archivo']['name'];
    $tmps    = (array)$_FILES['archivo']['tmp_name'];
    $errores = (array)$_FILES['archivo']['error'];
    $tamanos = (array)$_FILES['archivo']['size'];

    foreach ($nombres as $i => $nom) {
        if (($errores[$i] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) continue;
        if (!is_uploaded_file($tmps[$i])) continue;
        $ext = strtolower(pathinfo((string)$nom, PATHINFO_EXTENSION));
        if (!in_array($ext, $permitidos, true)) {
            http_response_code(415);
            echo json_encode(['ok' => false, 'error' => "Tipo de archivo no permitido: .$ext"]);
            exit;
        }
        if (($tamanos[$i] ?? 0) > $limite) {
            http_response_code(413);
            echo json_encode(['ok' => false, 'error' => "El archivo $nom supera {$MAX_MB}MB."]);
            exit;
        }
        $adjuntos[] = ['nombre' => (string)$nom, 'ruta' => (string)$tmps[$i]];
    }
}

/* ========= GUARDADO LOCAL Ley 1581 ========= */
$storageDir = __DIR__ . '/storage';
$uploadsDir = $storageDir . '/uploads/' . date('Y-m');
if (!is_dir($uploadsDir) && !mkdir($uploadsDir, 0755, true) && !is_dir($uploadsDir)) {
    $uploadsDir = null;
}
$registro = [
    'fecha' => date('c'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
    'ua' => $_SERVER['HTTP_USER_AGENT'] ?? '',
    'radicado' => $radicado,
    'categoria' => $categoria,
    'tipo' => $tipo,
    'para' => $PARA,
    'nombre' => $nombre,
    'telefono' => $telefono,
    'correo' => $correo,
    'extra' => $extra,
    'mensaje' => $mensaje,
    'archivos' => array_column($adjuntos, 'nombre'),
];
$savedFiles = [];
if ($uploadsDir) {
    foreach ($adjuntos as $a) {
        $ext = strtolower(pathinfo($a['nombre'], PATHINFO_EXTENSION));
        $safe = preg_replace('/[^a-zA-Z0-9._-]/', '_', pathinfo($a['nombre'], PATHINFO_FILENAME));
        $destName = date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '_' . $safe . '.' . $ext;
        $destPath = $uploadsDir . '/' . $destName;
        if (@copy($a['ruta'], $destPath)) {
            $savedFiles[] = 'uploads/' . date('Y-m') . '/' . $destName;
        }
    }
    $registro['archivos_guardados'] = $savedFiles;
    $logLine = json_encode($registro, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . PHP_EOL;
    @file_put_contents($storageDir . '/submissions.log', $logLine, FILE_APPEND | LOCK_EX);
    $csvFile = $storageDir . '/submissions.csv';
    $isNew = !file_exists($csvFile);
    $fp = @fopen($csvFile, 'a');
    if ($fp) {
        if ($isNew) fputcsv($fp, ['fecha','tipo','para','nombre','telefono','correo','extra','mensaje','archivos']);
        fputcsv($fp, [$registro['fecha'],$tipo,$PARA,$nombre,$telefono,$correo,$extra,$mensaje, implode('; ', $registro['archivos'])]);
        fclose($fp);
    }
}

$trackingGuardado = false;
$trackingRecord = null;
if ($radicado !== null) {
    $trackingRecord = [
        'radicado' => $radicado,
        'categoria' => $categoria,
        'tipo' => $tipo,
        'nombre' => $nombre,
        'telefono' => $telefono,
        'correo' => $correo,
        'extra' => $extra,
        'mensaje' => $mensaje,
        'archivos' => array_column($adjuntos, 'nombre'),
        'archivos_guardados' => $savedFiles,
        'origen' => 'formulario',
        'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
        'ua' => substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 300),
        'fecha' => date('c'),
        'estado' => 'Recibido',
    ];
    $trackingGuardado = vitaher_save_record($trackingRecord);
}

/* ========= ENVIO POR SMTP (PHPMailer) ========= */
$cuerpoTexto = "Nueva solicitud enviada desde vitaherips.com\r\n"
    . str_repeat('=', 46) . "\r\n"
    . ($radicado ? "Radicado: $radicado\r\n" : '')
    . "Tipo de formulario: $tipo\r\n"
    . ($extra !== '' ? "$extra\r\n" : '')
    . "Nombre: $nombre\r\n"
    . "Telefono: $telefono\r\n"
    . "Correo: $correo\r\n"
    . "Archivos adjuntos: " . (count($adjuntos) ? implode(', ', array_column($adjuntos, 'nombre')) : 'ninguno') . "\r\n"
    . "Fecha: " . date('d/m/Y H:i') . "\r\n\r\n"
    . "Mensaje:\r\n$mensaje\r\n";

$asunto = ($radicado ? "[$radicado] " : '') . "Sitio web VITAHER - $tipo - $nombre";
$enviado = vitaher_send_mail($PARA, $asunto, $cuerpoTexto, [
    'reply_to' => $correo,
    'reply_name' => $nombre,
    'attachments' => $adjuntos,
]);

$confirmacionEnviada = false;
if ($trackingGuardado && $trackingRecord !== null) {
    $confirmacionEnviada = vitaher_send_confirmation($trackingRecord);
}

$guardado = $trackingGuardado || (!empty($registro) && file_exists($storageDir . '/submissions.log'));

if ($enviado || $guardado) {
    echo json_encode([
        'ok' => true,
        'guardado' => $guardado,
        'enviado' => $enviado,
        'confirmacion' => $confirmacionEnviada,
        'radicado' => $radicado,
    ]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'No se pudo enviar el correo ni guardar el registro. Intenta por WhatsApp.']);
}
