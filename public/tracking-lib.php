<?php
declare(strict_types=1);

/**
 * Utilidades compartidas para radicados, seguimiento y panel de Talento Humano.
 * El almacenamiento es local (archivos JSONL dentro de public/storage).
 */

const VITAHER_ADMIN_EMAIL_DEFAULT = 'talentohumanovitaher@gmail.com';
// Hash legado de la contraseña inicial. Solo se usa para detectar instalaciones
// que aún no la han cambiado; no se usa como contraseña de respaldo.
const VITAHER_ADMIN_HASH_LEGACY = '$2y$10$O5DrmisfehHq3A/LeeMXCe1rkdmMJgjsMipBD0mB9Mml6SU2Y.oCC';

function vitaher_storage_dir(): string
{
    $dir = __DIR__ . '/storage';
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
    return $dir;
}

function vitaher_json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function vitaher_append_json_line(string $file, array $data): bool
{
    $line = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . PHP_EOL;
    return @file_put_contents($file, $line, FILE_APPEND | LOCK_EX) !== false;
}

function vitaher_read_json_lines(string $file): array
{
    if (!is_file($file)) {
        return [];
    }
    $lines = @file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if (!$lines) {
        return [];
    }
    $out = [];
    foreach ($lines as $line) {
        $data = json_decode($line, true);
        if (is_array($data)) {
            $out[] = $data;
        }
    }
    return $out;
}

function vitaher_generate_radicado(string $prefix): string
{
    $prefix = strtoupper((string)preg_replace('/[^A-Z]/', '', $prefix));
    if ($prefix === '') {
        $prefix = 'GEN';
    }

    $date = date('Ymd');
    $file = vitaher_storage_dir() . '/radicado-counter-' . strtolower($prefix) . '.json';
    $fp = @fopen($file, 'c+');

    if (!$fp) {
        return sprintf('%s-%s-%04d', $prefix, $date, random_int(1, 9999));
    }

    flock($fp, LOCK_EX);
    $raw = stream_get_contents($fp);
    $data = json_decode($raw ?: '[]', true);
    if (!is_array($data) || ($data['date'] ?? '') !== $date) {
        $data = ['date' => $date, 'seq' => 0];
    }
    $data['seq'] = ((int)($data['seq'] ?? 0)) + 1;
    $radicado = sprintf('%s-%s-%04d', $prefix, $date, $data['seq']);

    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);

    return $radicado;
}

function vitaher_save_record(array $record): bool
{
    $record['estado'] = $record['estado'] ?? 'Recibido';
    $record['fecha'] = $record['fecha'] ?? date('c');
    return vitaher_append_json_line(vitaher_storage_dir() . '/radicados.log', $record);
}

function vitaher_save_status(
    string $radicado,
    string $estado,
    string $nota = '',
    string $respuesta = '',
    string $por = 'Talento Humano'
): bool {
    return vitaher_append_json_line(vitaher_storage_dir() . '/estados.log', [
        'radicado' => $radicado,
        'estado' => $estado,
        'nota' => $nota,
        'respuesta' => $respuesta,
        'por' => $por,
        'fecha' => date('c'),
    ]);
}

function vitaher_smtp_password(): string
{
    $pass = trim((string)@file_get_contents(vitaher_storage_dir() . '/smtp_pass.txt'));
    return $pass !== '' ? $pass : trim((string)getenv('SMTP_PASS'));
}

function vitaher_tracking_url(string $radicado, string $categoria): string
{
    $base = rtrim((string)(getenv('VITAHER_SITE_URL') ?: 'https://vitaherips.com'), '/');
    $seccion = strtoupper($categoria) === 'POST' ? 'trabaja' : 'pqrs';
    return $base . '/?radicado=' . rawurlencode($radicado) . '#' . $seccion;
}

function vitaher_send_mail(string $to, string $subject, string $textBody, array $options = []): bool
{
    $to = trim($to);
    if ($to === '' || !filter_var($to, FILTER_VALIDATE_EMAIL)) {
        return false;
    }

    $from = 'info@vitaherips.com';
    $fromName = 'VITAHER IPS';
    $replyTo = trim((string)($options['reply_to'] ?? ''));
    $replyName = trim((string)($options['reply_name'] ?? ''));
    $html = (string)($options['html'] ?? '');
    $attachments = is_array($options['attachments'] ?? null) ? $options['attachments'] : [];
    $smtpPass = vitaher_smtp_password();
    $phpMailerDir = __DIR__ . '/PHPMailer';

    if ($smtpPass !== '' && is_file($phpMailerDir . '/PHPMailer.php')) {
        require_once $phpMailerDir . '/Exception.php';
        require_once $phpMailerDir . '/PHPMailer.php';
        require_once $phpMailerDir . '/SMTP.php';

        try {
            $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = 'smtp.hostinger.com';
            $mail->SMTPAuth = true;
            $mail->Username = $from;
            $mail->Password = $smtpPass;
            $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port = 465;
            $mail->Timeout = 15;
            $mail->setFrom($from, $fromName);
            $mail->addAddress($to);
            if ($replyTo !== '' && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
                $mail->addReplyTo($replyTo, $replyName !== '' ? $replyName : $replyTo);
            }
            $mail->Subject = $subject;
            $mail->CharSet = 'UTF-8';
            if ($html !== '') {
                $mail->isHTML(true);
                $mail->Body = $html;
                $mail->AltBody = $textBody;
            } else {
                $mail->Body = $textBody;
            }
            foreach ($attachments as $attachment) {
                $path = (string)($attachment['path'] ?? $attachment['ruta'] ?? '');
                $name = (string)($attachment['name'] ?? $attachment['nombre'] ?? basename($path));
                if ($path !== '' && is_file($path)) {
                    $mail->addAttachment($path, $name);
                }
            }
            $mail->send();
            return true;
        } catch (\Throwable $error) {
            error_log('PHPMailer error: ' . $error->getMessage());
        }
    }

    $headers = "From: {$fromName} <{$from}>\r\n";
    if ($replyTo !== '' && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
        $headers .= "Reply-To: {$replyTo}\r\n";
    }
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= 'Content-Type: ' . ($html !== '' ? 'text/html' : 'text/plain') . "; charset=UTF-8\r\n";
    $encodedSubject = function_exists('mb_encode_mimeheader')
        ? mb_encode_mimeheader($subject, 'UTF-8', 'B')
        : $subject;

    return @mail($to, $encodedSubject, $html !== '' ? $html : $textBody, $headers);
}

function vitaher_send_confirmation(array $record): bool
{
    $to = trim((string)($record['correo'] ?? ''));
    $radicado = trim((string)($record['radicado'] ?? ''));
    if ($to === '' || !filter_var($to, FILTER_VALIDATE_EMAIL) || $radicado === '') {
        return false;
    }

    $categoria = strtoupper((string)($record['categoria'] ?? 'PQRS'));
    $esPostulacion = $categoria === 'POST';
    $nombre = trim((string)($record['nombre'] ?? ''));
    if ($nombre === '' || $nombre === 'Anónimo') {
        $nombre = 'ciudadano(a)';
    }
    $tipo = trim((string)($record['tipo'] ?? ($esPostulacion ? 'Postulación laboral' : 'PQRS')));
    $timestamp = strtotime((string)($record['fecha'] ?? ''));
    $fecha = $timestamp ? date('d/m/Y H:i', $timestamp) : date('d/m/Y H:i');
    $trackingUrl = vitaher_tracking_url($radicado, $categoria);
    $titulo = $esPostulacion ? 'postulación' : 'PQRS';

    $subject = "[{$radicado}] Recibimos tu {$titulo} - VITAHER IPS";
    $textBody = "Hola {$nombre},\r\n\r\n"
        . "Recibimos tu {$titulo} y quedó en estado \"Recibido\". "
        . "El equipo de Talento Humano la revisará y se pondrá en contacto contigo si necesita información adicional.\r\n\r\n"
        . "Radicado: {$radicado}\r\n"
        . "Tipo: {$tipo}\r\n"
        . "Fecha: {$fecha}\r\n\r\n"
        . "Consulta el avance de tu solicitud aquí:\r\n{$trackingUrl}\r\n\r\n"
        . "Conserva este número de radicado. También puedes consultarlo en la sección "
        . ($esPostulacion ? '"Trabaja con nosotros"' : '"PQRS"')
        . " de nuestro sitio web.\r\n\r\n"
        . "VITAHER IPS S.A.S. ZOMAC\r\n"
        . "Salud domiciliaria en Arauca\r\n";

    $safeNombre = htmlspecialchars($nombre, ENT_QUOTES, 'UTF-8');
    $safeRadicado = htmlspecialchars($radicado, ENT_QUOTES, 'UTF-8');
    $safeTipo = htmlspecialchars($tipo, ENT_QUOTES, 'UTF-8');
    $safeFecha = htmlspecialchars($fecha, ENT_QUOTES, 'UTF-8');
    $safeUrl = htmlspecialchars($trackingUrl, ENT_QUOTES, 'UTF-8');
    $safeTitulo = htmlspecialchars($titulo, ENT_QUOTES, 'UTF-8');

    $html = '<div style="margin:0;padding:24px;background:#f5fafd;font-family:Arial,Helvetica,sans-serif;color:#3f5d75;">'
        . '<div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #d9e8f2;border-radius:16px;overflow:hidden;">'
        . '<div style="padding:22px 26px;background:#004b87;color:#ffffff;">'
        . '<div style="font-size:20px;font-weight:800;letter-spacing:-.02em;">VITAHER IPS</div>'
        . '<div style="margin-top:3px;font-size:12px;opacity:.85;">Salud domiciliaria · Arauca</div>'
        . '</div>'
        . '<div style="padding:26px;">'
        . '<p style="margin:0 0 14px;font-size:15px;">Hola <strong style="color:#004b87;">' . $safeNombre . '</strong>,</p>'
        . '<p style="margin:0 0 14px;font-size:14px;line-height:1.6;">Recibimos tu ' . $safeTitulo . ' y quedó en estado <strong style="color:#004b87;">Recibido</strong>. El equipo de Talento Humano la revisará y se pondrá en contacto contigo si necesita información adicional.</p>'
        . '<div style="margin:18px 0;padding:14px 16px;background:#eaf6fc;border:1px dashed #a9d8f0;border-radius:12px;">'
        . '<div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#3f5d75;">Número de radicado</div>'
        . '<div style="margin-top:4px;font-family:Consolas,monospace;font-size:20px;font-weight:800;color:#004b87;letter-spacing:.04em;">' . $safeRadicado . '</div>'
        . '</div>'
        . '<p style="margin:0 0 4px;font-size:13px;"><strong>Tipo:</strong> ' . $safeTipo . '</p>'
        . '<p style="margin:0 0 18px;font-size:13px;"><strong>Fecha:</strong> ' . $safeFecha . '</p>'
        . '<p style="margin:0 0 14px;font-size:14px;line-height:1.6;">Puedes consultar el avance cuando quieras con este número:</p>'
        . '<p style="margin:0 0 18px;"><a href="' . $safeUrl . '" style="display:inline-block;padding:12px 18px;background:#004b87;color:#ffffff;text-decoration:none;border-radius:10px;font-size:14px;font-weight:700;">Consultar mi seguimiento</a></p>'
        . '<p style="margin:0;font-size:12px;line-height:1.6;color:#6b7f91;">Si el botón no funciona, copia este enlace en tu navegador:<br><span style="word-break:break-all;">' . $safeUrl . '</span></p>'
        . '</div>'
        . '<div style="padding:16px 26px;background:#f8fbfd;border-top:1px solid #e3eef6;font-size:11px;line-height:1.6;color:#6b7f91;">'
        . 'VITAHER IPS S.A.S. ZOMAC · Salud domiciliaria en Arauca<br>'
        . 'Este es un mensaje automático; no respondas a este correo.'
        . '</div>'
        . '</div></div>';

    return vitaher_send_mail($to, $subject, $textBody, [
        'html' => $html,
        'reply_to' => 'info@vitaherips.com',
        'reply_name' => 'VITAHER IPS',
    ]);
}

function vitaher_send_status_update(array $record, string $estado, string $respuesta = ''): bool
{
    $to = trim((string)($record['correo'] ?? ''));
    $radicado = trim((string)($record['radicado'] ?? ''));
    if ($to === '' || !filter_var($to, FILTER_VALIDATE_EMAIL) || $radicado === '') {
        return false;
    }

    $categoria = strtoupper((string)($record['categoria'] ?? 'PQRS'));
    $esPostulacion = $categoria === 'POST';
    $nombre = trim((string)($record['nombre'] ?? ''));
    if ($nombre === '' || $nombre === 'Anónimo') {
        $nombre = 'ciudadano(a)';
    }
    $tipo = trim((string)($record['tipo'] ?? ($esPostulacion ? 'Postulación laboral' : 'PQRS')));
    $trackingUrl = vitaher_tracking_url($radicado, $categoria);
    $titulo = $esPostulacion ? 'postulación' : 'PQRS';
    $estado = trim($estado);
    $respuesta = trim($respuesta);

    $subject = "[{$radicado}] Actualización de tu {$titulo}: {$estado} - VITAHER IPS";
    $textBody = "Hola {$nombre},\r\n\r\n"
        . "Tu {$titulo} con radicado {$radicado} cambió de estado a \"{$estado}\".\r\n\r\n";
    if ($respuesta !== '') {
        $textBody .= "Respuesta de Talento Humano:\r\n{$respuesta}\r\n\r\n";
    }
    $textBody .= "Consulta el detalle de tu solicitud aquí:\r\n{$trackingUrl}\r\n\r\n"
        . "Conserva este número de radicado.\r\n\r\n"
        . "VITAHER IPS S.A.S. ZOMAC\r\n"
        . "Salud domiciliaria en Arauca\r\n";

    $safeNombre = htmlspecialchars($nombre, ENT_QUOTES, 'UTF-8');
    $safeRadicado = htmlspecialchars($radicado, ENT_QUOTES, 'UTF-8');
    $safeTipo = htmlspecialchars($tipo, ENT_QUOTES, 'UTF-8');
    $safeEstado = htmlspecialchars($estado, ENT_QUOTES, 'UTF-8');
    $safeUrl = htmlspecialchars($trackingUrl, ENT_QUOTES, 'UTF-8');
    $safeTitulo = htmlspecialchars($titulo, ENT_QUOTES, 'UTF-8');
    $safeRespuesta = nl2br(htmlspecialchars($respuesta, ENT_QUOTES, 'UTF-8'));

    $respuestaHtml = $respuesta !== ''
        ? '<div style="margin:18px 0;padding:14px 16px;background:#f4fbe8;border-left:4px solid #2e7d32;border-radius:10px;">'
            . '<div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#2e7d32;">Respuesta de Talento Humano</div>'
            . '<div style="margin-top:7px;font-size:14px;line-height:1.6;color:#3f5d75;">' . $safeRespuesta . '</div>'
            . '</div>'
        : '';

    $html = '<div style="margin:0;padding:24px;background:#f5fafd;font-family:Arial,Helvetica,sans-serif;color:#3f5d75;">'
        . '<div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #d9e8f2;border-radius:16px;overflow:hidden;">'
        . '<div style="padding:22px 26px;background:#004b87;color:#ffffff;">'
        . '<div style="font-size:20px;font-weight:800;letter-spacing:-.02em;">VITAHER IPS</div>'
        . '<div style="margin-top:3px;font-size:12px;opacity:.85;">Salud domiciliaria · Arauca</div>'
        . '</div>'
        . '<div style="padding:26px;">'
        . '<p style="margin:0 0 14px;font-size:15px;">Hola <strong style="color:#004b87;">' . $safeNombre . '</strong>,</p>'
        . '<p style="margin:0 0 14px;font-size:14px;line-height:1.6;">Tu ' . $safeTitulo . ' con radicado <strong style="color:#004b87;">' . $safeRadicado . '</strong> cambió de estado a <strong style="color:#004b87;">' . $safeEstado . '</strong>.</p>'
        . $respuestaHtml
        . '<div style="margin:18px 0;padding:14px 16px;background:#eaf6fc;border:1px dashed #a9d8f0;border-radius:12px;">'
        . '<div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#3f5d75;">Número de radicado</div>'
        . '<div style="margin-top:4px;font-family:Consolas,monospace;font-size:20px;font-weight:800;color:#004b87;letter-spacing:.04em;">' . $safeRadicado . '</div>'
        . '</div>'
        . '<p style="margin:0 0 4px;font-size:13px;"><strong>Tipo:</strong> ' . $safeTipo . '</p>'
        . '<p style="margin:0 0 18px;font-size:13px;"><strong>Estado:</strong> ' . $safeEstado . '</p>'
        . '<p style="margin:0 0 14px;font-size:14px;line-height:1.6;">Puedes consultar el detalle cuando quieras:</p>'
        . '<p style="margin:0 0 18px;"><a href="' . $safeUrl . '" style="display:inline-block;padding:12px 18px;background:#004b87;color:#ffffff;text-decoration:none;border-radius:10px;font-size:14px;font-weight:700;">Consultar mi seguimiento</a></p>'
        . '<p style="margin:0;font-size:12px;line-height:1.6;color:#6b7f91;">Si el botón no funciona, copia este enlace en tu navegador:<br><span style="word-break:break-all;">' . $safeUrl . '</span></p>'
        . '</div>'
        . '<div style="padding:16px 26px;background:#f8fbfd;border-top:1px solid #e3eef6;font-size:11px;line-height:1.6;color:#6b7f91;">'
        . 'VITAHER IPS S.A.S. ZOMAC · Salud domiciliaria en Arauca<br>'
        . 'Este es un mensaje automático; no respondas a este correo.'
        . '</div>'
        . '</div></div>';

    return vitaher_send_mail($to, $subject, $textBody, [
        'html' => $html,
        'reply_to' => 'info@vitaherips.com',
        'reply_name' => 'VITAHER IPS',
    ]);
}

function vitaher_statuses(): array
{
    return ['Recibido', 'En revisión', 'Resuelto', 'Cerrado'];
}

function vitaher_default_response(string $categoria, string $estado, string $radicado = ''): string
{
    $esPostulacion = strtoupper(trim($categoria)) === 'POST';
    $radicado = trim($radicado);
    $sufijoRadicado = $radicado !== '' ? " con radicado {$radicado}" : '';
    $estado = trim($estado);

    if ($esPostulacion) {
        switch ($estado) {
            case 'Recibido':
                return "Recibimos tu postulación{$sufijoRadicado}. El equipo de Talento Humano revisará tu hoja de vida y los documentos enviados.";
            case 'En revisión':
                return 'Tu postulación está en revisión por Talento Humano. Estamos verificando el cumplimiento de los requisitos y tu experiencia para la vacante.';
            case 'Resuelto':
                return 'El proceso de revisión de tu postulación quedó resuelto. Si tu perfil coincide con una vacante disponible, el equipo de Talento Humano se pondrá en contacto contigo.';
            case 'Cerrado':
                return 'Tu postulación fue cerrada. Puedes consultar nuevas vacantes y volver a postularte cuando lo desees.';
            default:
                return '';
        }
    }

    switch ($estado) {
        case 'Recibido':
            return "Recibimos tu PQRS{$sufijoRadicado}. Nuestro equipo la revisará y, si necesitamos información adicional, nos pondremos en contacto contigo.";
        case 'En revisión':
            return 'Tu PQRS está en revisión por el área correspondiente. Estamos analizando la información y te informaremos cualquier avance por este medio.';
        case 'Resuelto':
            return 'Tu PQRS fue atendida y quedó resuelta. Gracias por comunicarte con VITAHER IPS; tu solicitud nos ayuda a seguir mejorando.';
        case 'Cerrado':
            return 'Tu PQRS fue cerrada. Si necesitas ampliar la información o tienes una nueva solicitud, puedes radicar una nueva PQRS en nuestro sitio web.';
        default:
            return '';
    }
}

function vitaher_get_records(): array
{
    $records = [];

    foreach (vitaher_read_json_lines(vitaher_storage_dir() . '/radicados.log') as $record) {
        $radicado = trim((string)($record['radicado'] ?? ''));
        if ($radicado === '') {
            continue;
        }
        $record['estado'] = $record['estado'] ?? 'Recibido';
        $record['fecha'] = $record['fecha'] ?? date('c');
        $record['actualizado'] = $record['fecha'];
        $record['historial'] = [[
            'estado' => $record['estado'],
            'fecha' => $record['fecha'],
            'nota' => '',
            'respuesta' => '',
        ]];
        $records[$radicado] = $record;
    }

    foreach (vitaher_read_json_lines(vitaher_storage_dir() . '/estados.log') as $event) {
        $radicado = trim((string)($event['radicado'] ?? ''));
        if ($radicado === '' || !isset($records[$radicado])) {
            continue;
        }
        $estado = (string)($event['estado'] ?? '');
        if (!in_array($estado, vitaher_statuses(), true)) {
            continue;
        }
        $records[$radicado]['estado'] = $estado;
        $records[$radicado]['actualizado'] = $event['fecha'] ?? $records[$radicado]['actualizado'];
        $records[$radicado]['historial'][] = [
            'estado' => $estado,
            'fecha' => $event['fecha'] ?? '',
            'nota' => $event['nota'] ?? '',
            'respuesta' => $event['respuesta'] ?? '',
            'por' => $event['por'] ?? '',
        ];
    }

    foreach ($records as &$record) {
        usort(
            $record['historial'],
            static fn(array $a, array $b): int => strcmp(
                (string)($a['fecha'] ?? ''),
                (string)($b['fecha'] ?? '')
            )
        );
    }
    unset($record);

    uasort(
        $records,
        static fn(array $a, array $b): int => strcmp(
            (string)($b['fecha'] ?? ''),
            (string)($a['fecha'] ?? '')
        )
    );

    return array_values($records);
}

function vitaher_find_record(string $radicado): ?array
{
    $key = strtoupper(trim($radicado));
    if ($key === '') {
        return null;
    }
    foreach (vitaher_get_records() as $record) {
        if (strtoupper((string)($record['radicado'] ?? '')) === $key) {
            return $record;
        }
    }
    return null;
}

function vitaher_admin_config(): array
{
    $dir = vitaher_storage_dir();
    $email = trim((string)(getenv('VITAHER_ADMIN_EMAIL') ?: @file_get_contents($dir . '/admin_email.txt')));
    $hash = trim((string)(getenv('VITAHER_ADMIN_HASH') ?: @file_get_contents($dir . '/admin_hash.txt')));
    $pass = trim((string)(getenv('VITAHER_ADMIN_PASS') ?: @file_get_contents($dir . '/admin_pass.txt')));

    if ($email === '') {
        $email = VITAHER_ADMIN_EMAIL_DEFAULT;
    }

    return ['email' => $email, 'hash' => $hash, 'pass' => $pass];
}

function vitaher_admin_configured(): bool
{
    $config = vitaher_admin_config();
    return $config['email'] !== '' && ($config['hash'] !== '' || $config['pass'] !== '');
}

/**
 * Indica si el panel sigue usando la contraseña inicial de fábrica.
 * En ese caso el acceso queda limitado hasta cambiarla.
 */
function vitaher_admin_uses_default_password(): bool
{
    $config = vitaher_admin_config();
    if ($config['hash'] !== '') {
        return hash_equals($config['hash'], VITAHER_ADMIN_HASH_LEGACY);
    }
    if ($config['pass'] !== '') {
        return password_verify($config['pass'], VITAHER_ADMIN_HASH_LEGACY);
    }
    return false;
}

function vitaher_admin_must_change_password(): bool
{
    if (array_key_exists('vitaher_admin_must_change', $_SESSION ?? [])) {
        return (bool)$_SESSION['vitaher_admin_must_change'];
    }
    return vitaher_admin_uses_default_password();
}

function vitaher_check_credentials(string $email, string $password): bool
{
    $config = vitaher_admin_config();
    if ($config['email'] === '' || $password === '') {
        return false;
    }
    if (strcasecmp(trim($email), $config['email']) !== 0) {
        return false;
    }
    if ($config['hash'] !== '') {
        return password_verify($password, $config['hash']);
    }
    if ($config['pass'] !== '') {
        return hash_equals($config['pass'], $password);
    }
    return false;
}

function vitaher_check_password(string $password): bool
{
    $config = vitaher_admin_config();
    if ($config['hash'] !== '') {
        return password_verify($password, $config['hash']);
    }
    if ($config['pass'] !== '') {
        return hash_equals($config['pass'], $password);
    }
    return false;
}

function vitaher_validate_new_password(string $password): ?string
{
    if (mb_strlen($password) < 12) {
        return 'La contraseña debe tener al menos 12 caracteres.';
    }
    if (!preg_match('/[A-Z]/', $password)) {
        return 'La contraseña debe incluir al menos una letra mayúscula.';
    }
    if (!preg_match('/[a-z]/', $password)) {
        return 'La contraseña debe incluir al menos una letra minúscula.';
    }
    if (!preg_match('/[0-9]/', $password)) {
        return 'La contraseña debe incluir al menos un número.';
    }
    if (!preg_match('/[^A-Za-z0-9\s]/', $password)) {
        return 'La contraseña debe incluir al menos un símbolo.';
    }
    return null;
}

function vitaher_save_admin_password(string $password): bool
{
    $dir = vitaher_storage_dir();
    $hash = password_hash($password, PASSWORD_DEFAULT);
    if ($hash === false) {
        return false;
    }

    $target = $dir . '/admin_hash.txt';
    if (@file_put_contents($target, $hash . PHP_EOL, LOCK_EX) === false) {
        return false;
    }
    @chmod($target, 0600);
    @unlink($dir . '/admin_pass.txt');
    return true;
}

function vitaher_admin_reset_file(): string
{
    return vitaher_storage_dir() . '/admin_reset.json';
}

function vitaher_create_admin_reset(): ?string
{
    $token = bin2hex(random_bytes(32));
    $payload = [
        'hash' => hash('sha256', $token),
        'expires' => time() + 1800,
        'created' => time(),
    ];
    $file = vitaher_admin_reset_file();
    if (@file_put_contents($file, json_encode($payload, JSON_UNESCAPED_SLASHES), LOCK_EX) === false) {
        return null;
    }
    @chmod($file, 0600);
    return $token;
}

function vitaher_verify_admin_reset(string $token): bool
{
    if (!preg_match('/^[a-f0-9]{64}$/', $token)) {
        return false;
    }
    $raw = @file_get_contents(vitaher_admin_reset_file());
    if ($raw === false || $raw === '') {
        return false;
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        return false;
    }
    $hash = (string)($data['hash'] ?? '');
    $expires = (int)($data['expires'] ?? 0);
    if ($hash === '' || $expires < time()) {
        return false;
    }
    return hash_equals($hash, hash('sha256', $token));
}

function vitaher_clear_admin_reset(): void
{
    @unlink(vitaher_admin_reset_file());
}

function vitaher_admin_reset_url(string $token): string
{
    $base = rtrim((string)(getenv('VITAHER_SITE_URL') ?: 'https://vitaherips.com'), '/');
    return $base . '/admin.php?reset=' . rawurlencode($token);
}

function vitaher_send_admin_reset(string $to, string $link): bool
{
    $subject = 'Recuperación de contraseña - VITAHER IPS';
    $body = "Hola,\r\n\r\n"
        . "Recibimos una solicitud para restablecer la contraseña del panel de Talento Humano de VITAHER IPS.\r\n\r\n"
        . "Abre este enlace para crear una nueva contraseña. El enlace vence en 30 minutos y solo se puede usar una vez:\r\n"
        . $link . "\r\n\r\n"
        . "Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña actual sigue activa.\r\n\r\n"
        . "VITAHER IPS S.A.S. ZOMAC\r\n"
        . "Salud domiciliaria en Arauca\r\n";
    return vitaher_send_mail($to, $subject, $body);
}

function vitaher_start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    $secure = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

function vitaher_require_admin(bool $allowPendingPasswordChange = false): void
{
    vitaher_start_session();
    if (empty($_SESSION['vitaher_admin'])) {
        vitaher_json_response(['ok' => false, 'error' => 'No autorizado.'], 401);
    }
    if ($allowPendingPasswordChange) {
        return;
    }
    if (vitaher_admin_must_change_password()) {
        vitaher_json_response([
            'ok' => false,
            'error' => 'Por seguridad, debes cambiar la contraseña inicial antes de continuar.',
            'must_change_password' => true,
        ], 403);
    }
}

/**
 * Rate limit sencillo por IP. Devuelve true si la petición está permitida.
 */
function vitaher_rate_limit(string $key, int $max, int $window): bool
{
    $file = vitaher_storage_dir() . '/rate-limits.json';
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $bucket = (string)preg_replace('/[^a-z0-9_-]/i', '', $key);
    if ($bucket === '') {
        $bucket = 'general';
    }
    $id = $bucket . '|' . $ip;
    $now = time();

    $fp = @fopen($file, 'c+');
    if (!$fp) {
        return true;
    }

    flock($fp, LOCK_EX);
    $raw = stream_get_contents($fp);
    $data = json_decode($raw ?: '[]', true);
    if (!is_array($data)) {
        $data = [];
    }

    foreach ($data as $storedKey => $entry) {
        if (!is_array($entry) || ($now - (int)($entry['first'] ?? 0)) > $window) {
            unset($data[$storedKey]);
        }
    }

    $entry = $data[$id] ?? ['count' => 0, 'first' => $now];
    if (($now - (int)($entry['first'] ?? $now)) > $window) {
        $entry = ['count' => 0, 'first' => $now];
    }

    $allowed = ((int)($entry['count'] ?? 0)) < $max;
    if ($allowed) {
        $entry['count'] = ((int)($entry['count'] ?? 0)) + 1;
        $data[$id] = $entry;
    }

    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);

    return $allowed;
}

function vitaher_rate_reset(string $key): void
{
    $file = vitaher_storage_dir() . '/rate-limits.json';
    if (!is_file($file)) {
        return;
    }
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $bucket = (string)preg_replace('/[^a-z0-9_-]/i', '', $key);
    $id = $bucket . '|' . $ip;

    $fp = @fopen($file, 'c+');
    if (!$fp) {
        return;
    }
    flock($fp, LOCK_EX);
    $raw = stream_get_contents($fp);
    $data = json_decode($raw ?: '[]', true);
    if (is_array($data)) {
        unset($data[$id]);
        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        fflush($fp);
    }
    flock($fp, LOCK_UN);
    fclose($fp);
}

function vitaher_public_record(array $record): array
{
    $historial = [];
    foreach (($record['historial'] ?? []) as $item) {
        // Solo se expone la respuesta pública; las notas internas quedan privadas.
        $respuesta = trim((string)($item['respuesta'] ?? ''));
        if ($respuesta === '') {
            $respuesta = vitaher_default_response(
                (string)($record['categoria'] ?? ''),
                (string)($item['estado'] ?? ''),
                (string)($record['radicado'] ?? '')
            );
        }
        $historial[] = [
            'estado' => $item['estado'] ?? '',
            'fecha' => $item['fecha'] ?? '',
            'respuesta' => $respuesta,
        ];
    }

    return [
        'radicado' => $record['radicado'] ?? '',
        'categoria' => $record['categoria'] ?? '',
        'tipo' => $record['tipo'] ?? '',
        'fecha' => $record['fecha'] ?? '',
        'estado' => $record['estado'] ?? 'Recibido',
        'estado_fecha' => $record['actualizado'] ?? $record['fecha'] ?? '',
        'actualizado' => $record['actualizado'] ?? $record['fecha'] ?? '',
        'historial' => $historial,
    ];
}
