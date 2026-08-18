# Sitio Web VITAHER IPS S.A.S.

Sitio web de IPS VITAHER S.A.S. ZOMAC — Salud domiciliaria en Arauca, Colombia.
Reconstruido desde cero con React + Vite (frontend puro, sin backend).

## Secciones

- **Inicio** — hero con estadísticas y ruta del cuidado domiciliario
- **Nosotros** — misión, visión, valores y por qué elegirnos
- **Servicios** — 9 servicios + atención a pacientes crónicos y agudos
- **PQRS** — formulario de peticiones, quejas, reclamos y sugerencias
- **Trabaja con Nosotros** — postulación de hojas de vida
- **Contáctanos** — información de contacto y agendamiento de citas

Los formularios no envían a un servidor: generan un mensaje de WhatsApp (o correo)
con los datos prellenados y muestran confirmación visual.

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
