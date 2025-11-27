# 🎄 Christmas Invitation Website

Website undangan acara Natal dengan fitur RSVP dan admin dashboard.

## Features

- ✨ Landing page dengan countdown dan info acara
- 📝 Form RSVP dengan validasi
- 💾 Penyimpanan data ke Supabase
- 🔄 Fitur ubah status kehadiran
- 📱 Responsive design (mobile-friendly)
- 🎨 Animasi salju dan lampu natal
- 👨‍💼 Admin dashboard dengan export Excel

## Tech Stack

- **Framework**: SvelteKit 2 + Svelte 5
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide Svelte
- **Export**: SheetJS (xlsx)

## Setup Instructions

### 1. Clone & Install Dependencies

```bash
# Clone repository
git clone <your-repo-url>
cd christmas-invitation

# Install dependencies
pnpm install
# atau
npm install
```

### 2. Setup Supabase

1. Buat project baru di [Supabase](https://supabase.com/dashboard)
2. Buka SQL Editor dan jalankan query dari `supabase/migrations/001_initial.sql`
3. Copy API keys dari Settings > API

### 3. Configure Environment Variables

```bash
# Copy example file
cp .env.example .env

# Edit .env dengan credentials Supabase kamu
```

Isi dengan:
- `PUBLIC_SUPABASE_URL` - URL project Supabase
- `PUBLIC_SUPABASE_ANON_KEY` - Anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (untuk admin)

### 4. Update Constants

Edit `src/lib/constants.ts` untuk menyesuaikan:
- Daftar kelas/jurusan sekolah
- Link Google Maps lokasi acara
- Tanggal dan waktu acara
- Informasi lainnya

### 5. Update Admin Credentials

Edit `src/routes/admin/login/+page.svelte`:
```typescript
const ADMIN_USERNAME = 'admin';     // Ganti dengan username
const ADMIN_PASSWORD = 'natal2025'; // Ganti dengan password
```

### 6. Run Development Server

```bash
pnpm dev
# atau
npm run dev
```

Buka http://localhost:5173

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Jangan lupa set environment variables di Vercel dashboard.

### Cloudflare Pages

1. Install adapter:
```bash
pnpm add -D @sveltejs/adapter-cloudflare
```

2. Update `svelte.config.js`:
```javascript
import adapter from '@sveltejs/adapter-cloudflare';
```

3. Deploy via Cloudflare Dashboard atau Wrangler CLI

## Project Structure

```
christmas-invitation/
├── src/
│   ├── routes/
│   │   ├── +page.svelte          # Landing page
│   │   ├── +layout.svelte        # Main layout
│   │   ├── rsvp/                 # RSVP form
│   │   ├── thank-you/            # Confirmation (attending)
│   │   ├── not-attending/        # Confirmation (not attending)
│   │   └── admin/                # Admin dashboard
│   └── lib/
│       ├── components/           # Reusable components
│       ├── stores/               # Svelte stores
│       ├── utils/                # Utility functions
│       ├── constants.ts          # App constants
│       └── supabase.ts           # Supabase client
├── static/                       # Static assets
└── supabase/
    └── migrations/               # Database migrations
```

## Customization

### Mengubah Warna

Edit CSS variables di `src/app.css`:

```css
@theme {
  --color-christmas-red: #8B1538;
  --color-christmas-gold: #D4AF37;
  /* ... */
}
```

### Menambah Jurusan/Kelas

Edit `src/lib/constants.ts`:

```typescript
export const SMK_CLASSES = [
  'X.RPL-1', 'X.RPL-2',
  'X.TKJ-1', 'X.TKJ-2',
  // Tambahkan kelas baru di sini
  'Lainnya'
];
```

## License

MIT License - Feel free to use for your own Christmas event! 🎄
