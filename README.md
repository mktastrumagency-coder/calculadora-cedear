# Calculadora Brecha CEDEAR

Calculadora para comparar el precio de un activo vía CEDEAR en Argentina vs su precio internacional, incluyendo el fee de operación (0.663%).

## Cómo funciona

1. Elegís un ticker de la lista de ~200 CEDEARs
2. La app obtiene el precio internacional en tiempo real vía Yahoo Finance (API route server-side, sin problemas de CORS)
3. Ingresás el precio en USD que pagás en Argentina por el CEDEAR
4. La calculadora hace: `(precio_argy × 1.00663) × ratio = precio_sintético`
5. Te muestra la brecha % respecto al precio internacional

## Setup (1 minuto)

### 1. Conseguí tu API key gratis de Finnhub
1. Andá a [finnhub.io/register](https://finnhub.io/register) y creá una cuenta gratis
2. Copiá tu API key del dashboard

### 2. Deploy en Vercel
1. Subí este proyecto a un repo de GitHub
2. Andá a [vercel.com](https://vercel.com) → "Add New Project" → importá tu repo
3. **IMPORTANTE**: Antes de hacer deploy, andá a **Settings → Environment Variables** y agregá:
   - Name: `FINNHUB_API_KEY`
   - Value: `tu_api_key_de_finnhub`
4. Dale Deploy

### Alternativa: Vercel CLI
```bash
npm install -g vercel
cd cedear-next
npm install
vercel
# Cuando te pregunte por env variables, agregá FINNHUB_API_KEY
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
│   │       └── route.js     ← API route: Finnhub → Yahoo → Google (fallbacks)
│   ├── layout.js
│   └── page.js               ← Calculadora principal
├── .env.example               ← Ejemplo de variables de entorno
├── package.json
├── next.config.js
├── vercel.json
└── README.md
```

## Notas

- **Precios**: Usa Finnhub (primario), con fallback a Yahoo Finance y Google Finance.
- Los **ratios de CEDEAR** están hardcodeados. Si cambian, editá `CEDEAR_DATA` en `app/page.js`.
- El **fee** de 0.663% se puede cambiar en la constante `FEE_PERCENT`.
- Finnhub free tier: 60 requests/minuto — más que suficiente para uso personal.
- Fuente de ratios: BYMA / Banco Comafi (actualizado a 2025-2026).
