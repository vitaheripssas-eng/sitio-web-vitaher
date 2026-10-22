# Sitio Web VITAHER IPS S.A.S.

Sitio web de IPS VITAHER S.A.S. ZOMAC — Salud domiciliaria en Arauca, Colombia.
Frontend en React + Vite con endpoints PHP para formularios, radicados y seguimiento.

## Secciones

- **Inicio** — hero con estadísticas y accesos principales
- **Nosotros** — misión, visión, valores y por qué elegirnos
- **Servicios** — 9 servicios, ruta de cuidado y atención a pacientes crónicos y agudos
- **PQRS** — formulario de peticiones, quejas, reclamos y sugerencias
- **Trabaja con Nosotros** — postulación de hojas de vida
- **Contáctanos** — información de contacto y agendamiento de citas

Las PQRS y postulaciones que incluyen archivos se envían por correo mediante
`public/enviar.php`. Las PQRS sin archivos y el contacto directo abren WhatsApp.
Cada PQRS o postulación recibe un número de radicado y puede consultarse en el
sitio con ese número.

## Desarrollo

```bash
npm install
npm run dev      # servidor local (el puerto 5173 está ocupado por otro proyecto,
                 # así que usa --port para cambiarlo si lo necesitas)
npm run build    # generar producción en dist/
npm run lint     # oxlint
```

## Configuración

Datos de contacto y números en `src/data.js` (WhatsApp, teléfono, correo).

## Backend y radicados

Los formularios con archivos envían a `public/enviar.php`. Las PQRS sin archivos
registran el radicado en `public/registrar.php` y luego abren WhatsApp. El
seguimiento público y el panel de Talento Humano usan:

- `public/gestion.php` — consulta pública de radicados, login y gestión de estados.
- `public/admin.php` — panel de Talento Humano en `/admin.php`.
- `public/tracking-lib.php` — almacenamiento y utilidades compartidas.

Los datos se guardan en `public/storage/` (`radicados.log`, `estados.log`). Esa
carpeta debe tener permisos de escritura para PHP. El build elimina de
`dist/storage/` los datos locales de prueba, pero conserva los `.htaccess`; no
subas al servidor el `admin_pass.txt` ni los logs generados en tu equipo.

> **Importante en producción:** el sitio usa nginx (CloudPanel), que **no lee
> `.htaccess`**. Sin una regla de nginx, `/storage/submissions.log`,
> `/storage/submissions.csv`, `/storage/smtp_pass.txt` y
> `/storage/admin_pass.txt` se pueden descargar desde Internet. Aplica el bloqueo
> de `deploy/nginx-security.conf` en CloudPanel (Sites > vitaherips.com > Vhost)
> y verifica que `https://vitaherips.com/storage/submissions.log` responda `403`.
> Si `smtp_pass.txt` estuvo expuesto, cambia esa contraseña en Hostinger y
> actualiza el archivo en el servidor.
>
> Verificado el 22/10/2026: `/storage/`, `/storage`,
> `/storage/submissions.log` y `/storage/smtp_pass.txt` responden `403` en
> producción.

### Acceso de Talento Humano

El panel queda en `https://vitaherips.com/admin.php` y no se enlaza desde el
sitio público. Hay un único usuario autorizado:

- Correo: `talentohumanovitaher@gmail.com`
- Contraseña inicial: se configura en el servidor; no se publica en el repositorio.

> Si la contraseña configurada es la inicial legada, el panel muestra una pantalla
> obligatoria para cambiarla. Mientras no se cambie, las acciones de gestión
> (`list`, `status` y descargas de adjuntos) responden `403`; solo `me`,
> `logout` y `change-password` quedan disponibles. Si configuras una contraseña
> propia con `VITAHER_ADMIN_PASS`/`VITAHER_ADMIN_HASH` o con los archivos de
> storage, esta pantalla no aparece.

La contraseña se puede cambiar desde el mismo panel:

1. Ingresa a `https://vitaherips.com/admin.php` y pulsa **Contraseña**.
2. Escribe la contraseña actual y la nueva. Debe tener mínimo 12 caracteres,
   con mayúscula, minúscula, número y símbolo.
3. El sistema guarda el hash en `public/storage/admin_hash.txt` (modo `600`) y
   elimina cualquier `admin_pass.txt` anterior.

Si no recuerdas la contraseña, pulsa **¿Olvidaste tu contraseña?** en el login.
El sistema envía un enlace de un solo uso al correo configurado de Talento
Humano; el enlace vence en 30 minutos. Requiere que el SMTP esté funcionando.
El token se guarda temporalmente en `public/storage/admin_reset.json`, que
también queda bloqueado por la regla de nginx para `/storage/`.

También se puede configurar desde el servidor con `VITAHER_ADMIN_PASS`,
`VITAHER_ADMIN_HASH` o `VITAHER_ADMIN_EMAIL`, o con los archivos
`public/storage/admin_pass.txt`, `admin_hash.txt` y `admin_email.txt`.
Si existe `admin_hash.txt`, tiene prioridad sobre `admin_pass.txt`.

El panel no tiene contraseña de respaldo. Antes de publicarlo, configura una
contraseña con `VITAHER_ADMIN_PASS`/`VITAHER_ADMIN_HASH` o crea
`public/storage/admin_pass.txt`/`admin_hash.txt` directamente en el servidor.
No subas esos archivos al repositorio. Puedes generar el hash con:

```bash
php -r "echo password_hash('TU_CONTRASEÑA', PASSWORD_DEFAULT), PHP_EOL;"
```

Si usas la contraseña inicial legada, el panel exigirá cambiarla en el primer
ingreso.

### Prueba local con PHP

```bash
php -S 127.0.0.1:8000 -t public
```

Crea `.env.local` (ignorado por Git) para que el frontend use el backend local:

```bash
VITE_FORM_ENDPOINT=http://127.0.0.1:8000/enviar.php
```

Luego reinicia `npm run dev` y abre `http://127.0.0.1:8000/admin.php` para probar
el panel. El build de producción usa `.env.production` con el endpoint oficial;
`.env.local` solo afecta al servidor de desarrollo.

## Renovación SSL en CloudPanel

CloudPanel renueva los certificados de Let's Encrypt automáticamente unos 30 días
antes del vencimiento mediante un cron. Verifica que exista:

```bash
cat /etc/cron.d/clp
```

Debe incluir una línea similar a:

```cron
10 5 * * * clp /usr/bin/bash -c "/usr/bin/clpctl lets-encrypt:renew:certificates" &> /dev/null
```

Si no aparece, agrégala sin borrar las demás líneas del archivo:

```bash
grep -q 'lets-encrypt:renew:certificates' /etc/cron.d/clp || \
  echo '10 5 * * * clp /usr/bin/bash -c "/usr/bin/clpctl lets-encrypt:renew:certificates" &> /dev/null' >> /etc/cron.d/clp
chmod 644 /etc/cron.d/clp
```

Prueba la renovación manualmente (no daña el certificado si aún es válido):

```bash
su -s /bin/bash -c '/usr/bin/clpctl lets-encrypt:renew:certificates' clp
```

El certificado actual de `vitaherips.com` vence el **19/01/2027**. Con el cron
activo no hay que renovarlo a mano. `saludomi.vitaherips.com` tiene su propio
certificado, que vence el **05/11/2026**; si no se renueva solo antes de esa
fecha, ejecuta la renovación manual y revisa el cron.
