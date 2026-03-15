# Calculadora Brecha CEDEAR

Calculadora para comparar el precio de un activo vía CEDEAR en Argentina vs su precio internacional, incluyendo el fee de operación (0.663%).

## Cómo funciona

1. Elegís un ticker de la lista de ~200 CEDEARs
2. La app obtiene el precio internacional en tiempo real vía Yahoo Finance (API route server-side, sin problemas de CORS)
3. Ingresás el precio en USD que pagás en Argentina por el CEDEAR
4. La calculadora hace: `(precio_argy × 1.00663) × ratio = precio_sintético`
5. Te muestra la brecha % respecto al precio internacional

## Deploy en Vercel

### Opción 1: Desde GitHub
1. Subí este proyecto a un repositorio de GitHub
2. Andá a [vercel.com](https://vercel.com) → New Project → Import tu repo
3. Vercel detecta Next.js automáticamente → Deploy

### Opción 2: Vercel CLI
```bash
npm install -g vercel
cd cedear-next
npm install
vercel
```

## Desarrollo local

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Estructura

```
cedear-next/
├── app/
│   ├── api/
│   │   └── quote/
│   │       └── route.js     ← API route que llama a Yahoo Finance (server-side)
│   ├── layout.js             ← Layout con fonts
│   └── page.js               ← Componente principal de la calculadora
├── package.json
├── next.config.js
├── vercel.json
└── README.md
```

## Notas

- Los **ratios de CEDEAR** están hardcodeados. Si cambian, editá el objeto `CEDEAR_DATA` en `app/page.js`.
- El **fee** de 0.663% se puede cambiar modificando la constante `FEE_PERCENT`.
- Los precios se obtienen del último cierre si el mercado está cerrado.
- Fuente de ratios: BYMA / Banco Comafi (actualizado a 2025-2026).
