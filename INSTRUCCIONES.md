# Instrucciones de instalación y deploy

## 1. Colocar el PDF

Copiá el archivo PDF a esta carpeta y renombralo:
```
stirparo-reader/public/book.pdf
```

## 2. Instalar dependencias

Abrí una terminal en la carpeta `stirparo-reader/` y ejecutá:
```bash
npm install
```

## 3. Configurar variables de entorno

Copiá `.env.example` a `.env.local`:
```bash
cp .env.example .env.local
```

Luego completá los valores (ver pasos abajo).

## 4. Configurar Google OAuth

1. Ir a https://console.cloud.google.com/
2. Crear proyecto → "APIs y servicios" → "Credenciales"
3. "Crear credenciales" → "ID de cliente de OAuth 2.0"
4. Tipo: Aplicación web
5. URI de redirección autorizado: `http://localhost:3000/api/auth/callback/google`
6. Copiar Client ID y Client Secret al `.env.local`

## 5. Ejecutar en desarrollo

```bash
npm run dev
```

Abrir: http://localhost:3000

## 6. Deploy gratuito en Vercel

1. Subir el proyecto a GitHub (nuevo repositorio)
2. Ir a https://vercel.com → "New Project" → importar el repo
3. En "Environment Variables" agregar las mismas variables que en `.env.local`
4. Cambiar `NEXTAUTH_URL` a tu URL de Vercel (ej: https://stirparo.vercel.app)
5. En Google Cloud agregar la URL de Vercel como URI de redirección autorizado
6. Deploy automático ✅

## 7. Configurar Stripe (monetización) - Opcional

1. Crear cuenta en https://stripe.com
2. Dashboard → Products → Crear producto "Acceso Completo" → Precio único $9.99
3. Copiar Price ID al `.env.local` como `STRIPE_PRICE_ID`
4. Copiar las API keys al `.env.local`
5. En Vercel, agregar también estas variables
6. Configurar webhook: Stripe Dashboard → Webhooks → Agregar endpoint
   URL: `https://tu-app.vercel.app/api/stripe/webhook`
   Evento: `checkout.session.completed`
