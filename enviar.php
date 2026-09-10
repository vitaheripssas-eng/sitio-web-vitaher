<?php
declare(strict_types=1);

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
$PARA_DEFAULT = 'coordinacionarauca2026@gmail.com'; // Correo por defecto
$PARA_TALENTO = 'talentohumanovitaher@gmail.com';   // Talento Humano (Trabaja con nosotros)
$DE     = 'info@vitaherips.com';              // Cuenta de correo creada en Hostinger
$MAX_MB = 10;

/* Honeypot anti-spam: los bots llenan este campo oculto */
if (!empty($_POST['website'])) { echo json_encode(['ok' => true]); exit; }

$tipo     = trim((string)($_POST['tipo'] ?? 'Consulta web'));
$nombre   = trim((string)($_POST['nombre'] ?? ''));
$telefono = trim((string)($_POST['telefono'] ?? ''));
$correo   = trim((string)($_POST['correo'] ?? ''));
$mensaje  = trim((string)($_POST['mensaje'] ?? ''));
$extra    = trim((string)($_POST['extra'] ?? ''));

$dest = trim((string)($_POST['destinatario'] ?? $_POST['para'] ?? ''));
if ($dest !== '' && filter_var($dest, FILTER_VALIDATE_EMAIL)) {
    $PARA = $dest;
} elseif (stripos($tipo, 'Postulación') !== false) {
    $PARA = $PARA_TALENTO;
} else {
    $PARA = $PARA_DEFAULT;
}

if ($nombre === '' || $mensaje === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Faltan datos obligatorios.']);
    exit;
}

/* ========= GUARDADO LOCAL PARA TRATAMIENTO DE DATOS (Ley 1581) ========= */
$storageDir = __DIR__ . '/storage';
$uploadsDir = $storageDir . '/uploads/' . date('Y-m');
if (!is_dir($uploadsDir) && !mkdir($uploadsDir, 0755, true) && !is_dir($uploadsDir)) {
    // si no se puede crear, seguimos solo con el envío de correo
    $uploadsDir = null;
}
$registro = [
    'fecha' => date('c'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
    'ua' => $_SERVER['HTTP_USER_AGENT'] ?? '',
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
    foreach ($adjuntos as $idx => $a) {
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
    // también CSV para fácil apertura en Excel
    $csvFile = $storageDir . '/submissions.csv';
    $isNew = !file_exists($csvFile);
    $fp = @fopen($csvFile, 'a');
    if ($fp) {
        if ($isNew) fputcsv($fp, ['fecha','tipo','para','nombre','telefono','correo','extra','mensaje','archivos']);
        fputcsv($fp, [$registro['fecha'],$tipo,$PARA,$nombre,$telefono,$correo,$extra,$mensaje, implode('; ', $registro['archivos'])]);
        fclose($fp);
    }
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

/* ========= ARMADO DEL CORREO ========= */
$cuerpoTexto = "Nueva solicitud enviada desde vitaherips.com\r\n"
    . str_repeat('=', 46) . "\r\n"
    . "Tipo de formulario: $tipo\r\n"
    . ($extra !== '' ? "$extra\r\n" : '')
    . "Nombre: $nombre\r\n"
    . "Telefono: $telefono\r\n"
    . "Correo: $correo\r\n"
    . "Archivos adjuntos: " . (count($adjuntos) ? implode(', ', array_column($adjuntos, 'nombre')) : 'ninguno') . "\r\n"
    . "Fecha: " . date('d/m/Y H:i') . "\r\n\r\n"
    . "Mensaje:\r\n$mensaje\r\n";

$asunto    = mb_encode_mimeheader("Sitio web VITAHER - $tipo - $nombre", 'UTF-8', 'B');
$separador = md5(uniqid((string)mt_rand(), true));

$cabeceras = "From: VITAHER Web <$DE>\r\n"
    . ($correo !== '' ? "Reply-To: $correo\r\n" : '')
    . "MIME-Version: 1.0\r\n";

if (!$adjuntos) {
    $cabeceras .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $cuerpo = $cuerpoTexto;
} else {
    $cabeceras .= "Content-Type: multipart/mixed; boundary=\"$separador\"\r\n";
    $cuerpo = "--$separador\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\n\r\n"
        . $cuerpoTexto . "\r\n";
    foreach ($adjuntos as $a) {
        $contenido    = chunk_split(base64_encode((string)file_get_contents($a['ruta'])));
        $nombreSeguro = mb_encode_mimeheader($a['nombre'], 'UTF-8', 'B');
        $cuerpo .= "--$separador\r\n"
            . "Content-Type: application/octet-stream; name=\"$nombreSeguro\"\r\n"
            . "Content-Transfer-Encoding: base64\r\n"
            . "Content-Disposition: attachment; filename=\"$nombreSeguro\"\r\n\r\n"
            . $contenido . "\r\n";
    }
    $cuerpo .= "--$separador--";
}

$enviado = @mail($PARA, $asunto, $cuerpo, $cabeceras);

// Si se guardó localmente, consideramos éxito aunque falle el mail (para no perder el dato)
$guardado = !empty($registro) && file_exists($storageDir . '/submissions.log');

if ($enviado || $guardado) {
    echo json_encode(['ok' => true, 'guardado' => $guardado, 'enviado' => $enviado]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'No se pudo enviar el correo ni guardar el registro. Intenta por WhatsApp.']);
}
