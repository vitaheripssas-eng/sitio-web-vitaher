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
$PARA   = 'coordinacionarauca2026@gmail.com'; // Correo que recibe las solicitudes
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

if ($enviado) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'No se pudo enviar el correo. Intenta por WhatsApp.']);
}
