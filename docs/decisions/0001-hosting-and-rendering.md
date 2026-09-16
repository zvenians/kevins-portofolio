# 0001 — hosting and rendering model

```text
status
accepted

date
2026-09-15

phase
0

supersedes
none
```

---

## context

lima documentation file secara bersamaan mensyaratkan hal berikut:

1. Server Components sebagai default, minimal client javascript
   (`architecture.md` section 4, `rules.md` section 25)

2. `generateMetadata()` yang dihasilkan dari Firestore per slug
   (`architecture.md` section 37)

3. dynamic sitemap yang otomatis memuat project baru
   (`architecture.md` section 38, `rules.md` section 42)

4. content update tidak boleh memerlukan full rebuild
   (`architecture.md` section 21)

5. Firebase Hosting sebagai deployment target pada domain
   `simatupangkevin.web.app`
   (`architecture.md` section 31, `rules.md` section 60)

masalahnya:

> Firebase Hosting klasik adalah static CDN.
>
> static CDN tidak dapat mengeksekusi Server Components.

requirement 1 sampai 4 membutuhkan server runtime.

requirement 5 mensyaratkan domain Firebase Hosting.

kelima requirement tersebut tidak dapat dipenuhi oleh static hosting saja.

---

## options considered

### option A — static export

```text
next build
output: "export"
↓
Firebase Hosting
```

| aspek | hasil |
| --- | --- |
| domain `simatupangkevin.web.app` | terpenuhi |
| Server Components | tidak terpenuhi |
| publish tanpa rebuild | tidak terpenuhi |
| `next/image` optimizer | tidak tersedia |

setiap publish content memerlukan rebuild dan redeploy.

hal tersebut melanggar `architecture.md` section 21 dan core product principle pada `PRD.md` section 19:

```text
content changes must not require presentation code changes.
```

option A ditolak.

---

### option B — Firebase App Hosting langsung

```text
Firebase App Hosting
↓
*.hosted.app
```

| aspek | hasil |
| --- | --- |
| Server Components | terpenuhi |
| publish tanpa rebuild | terpenuhi |
| domain `simatupangkevin.web.app` | tidak terpenuhi secara default |

default domain App Hosting bukan `*.web.app`.

`rules.md` section 60 menyatakan domain tidak boleh diganti tanpa explicit product decision.

option B ditolak sebagai primary edge.

---

### option C — Firebase Hosting rewrite ke Cloud Run

```text
visitor
↓
Firebase Hosting (simatupangkevin.web.app)
↓
rewrite
↓
Cloud Run
↓
Next.js server
↓
Firestore / Storage
```

| aspek | hasil |
| --- | --- |
| domain `simatupangkevin.web.app` | terpenuhi |
| Server Components | terpenuhi |
| publish tanpa rebuild | terpenuhi |
| `next/image` optimizer | tersedia |
| tetap di dalam Firebase | terpenuhi |

option C diterima.

---

## decision (UPDATED 2026-09-16)

awalnya menggunakan Option C (Firebase Hosting rewrite ke Cloud Run).
Namun, pada Phase 10B, keputusan ini dimodifikasi untuk menggunakan **Vercel** sebagai layer hosting/runtime production.

```text
visitor
→
Vercel (kevins-portofolio.vercel.app)
→
Next.js server (App Router, Server Components)
→
Firebase backend (Firestore, Storage, Auth)
```

Firebase Hosting dan Cloud Run tidak lagi digunakan untuk production.
Vercel menggantikan layer hosting dan mengeksekusi Next.js secara native.

Alasan perubahan:
- Simplifikasi deployment: Vercel natively mendukung Next.js ISR, revalidation, dan Server Components tanpa setup Docker/Cloud Run manual.
- Keterbatasan Environment (Blocker Phase 10B): Kebutuhan Billing aktif untuk mengaktifkan Cloud Build API dan Cloud Run API di GCP menyebabkan blocker administratif yang dapat dihindari dengan menggunakan Vercel.

---

## consequences

### positive

- domain production diperbarui menjadi `kevins-portofolio.vercel.app`.
- Server Components, ISR, dan on-demand revalidation berjalan native tanpa workaround.
- Deployment jauh lebih cepat dan terintegrasi langsung dengan Git.
- Dockerfile dan konfigurasi container dapat dihapus.

### negative

- Vercel memerlukan management secret terpisah (tidak bisa lagi mengandalkan GCP Application Default Credentials).
- Rate limit in-memory (seperti untuk submit contact form) akan berjalan per instance serverless Vercel, sehingga state tidak terbagi (shared) antar instance. 

---

## implications for later phases

1. `next.config.ts` tidak lagi memerlukan `output: "standalone"`.
2. `firebase.json` dapat dihapus bagian `hosting` (rewrites), dan hanya menyimpan `firestore` dan `storage` rules.
3. Firebase Admin SDK harus dikonfigurasi melalui environment variables di Vercel (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`). Private key harus tetap aman dan tidak di-commit.
4. `simatupangkevin.web.app` tidak lagi digunakan. Semua `SITE_URL` diubah menjadi `https://kevins-portofolio.vercel.app`.

---

## verification

decision ini dianggap terpenuhi apabila:

```text
kevins-portofolio.vercel.app merespon melalui Vercel
project detail menghasilkan metadata dari Firestore
publish project baru muncul tanpa rebuild
sitemap memuat project baru tanpa perubahan source code
```
