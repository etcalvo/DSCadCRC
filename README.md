# CAD ↔ CRC

Convertidor simple de dólares canadienses (CAD) a colones costarricenses (CRC), instalable como PWA.

## Funcionalidades

- Conversión bidireccional en tiempo real
- Tasa de cambio obtenida de [Open Exchange Rates](https://open.er-api.com) al cargar la app
- Cache en `localStorage`: solo consulta la API una vez por día
- Funciona offline usando la última tasa guardada
- Instalable como PWA (Android, iOS, escritorio)

## Uso

Abrí la app en [etcalvo.github.io/DSCadCRC](https://etcalvo.github.io/DSCadCRC/) y escribí un monto en cualquiera de los dos campos.

## Desarrollo local

```bash
python3 -m http.server
```

Abrí `http://localhost:8000` — el servidor local es necesario para que el service worker funcione correctamente.

## Stack

Vanilla HTML/CSS/JS, sin dependencias ni build steps. Archivos estáticos servidos directamente desde GitHub Pages.
