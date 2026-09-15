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

## decision

menggunakan option C.

```text
Firebase Hosting
→ rewrite
→ Cloud Run
→ Next.js
```

Firebase Hosting tetap menjadi public edge dan pemilik domain
`simatupangkevin.web.app`.

Cloud Run menjalankan Next.js server sehingga Server Components,
dynamic metadata, dynamic sitemap, dan revalidation dapat berjalan.

Firebase tetap menjadi primary infrastructure.

tidak ada backend selain Firebase yang diperkenalkan.

---

## consequences

### positive

- domain production tidak berubah
- Server Components menjadi default sesuai `rules.md` section 25
- `generateMetadata()` dapat membaca Firestore per request
- sitemap dapat dihasilkan dari published content
- publish content tidak memerlukan rebuild
- `next/image` optimizer tersedia
- Firebase Admin SDK dapat menggunakan Application Default Credentials
  pada Cloud Run sehingga private key tidak perlu disimpan sebagai
  environment secret

### negative

- deployment memiliki dua target: Hosting configuration dan Cloud Run service
- cold start perlu diperhatikan sebagai bagian dari performance budget
  (`design.md` section 63)
- Cloud Run memiliki biaya yang bergantung pada traffic

### neutral

- static export tetap mungkin digunakan di masa depan untuk subset
  route apabila diperlukan, namun bukan strategi utama

---

## implications for later phases

1. `firebase.json` harus berisi hosting rewrite ke Cloud Run service.

2. Firebase Admin SDK diinisialisasi menggunakan Application Default
   Credentials pada Cloud Run.
   service account private key tidak boleh masuk ke repository
   (`rules.md` section 61).

3. caching menggunakan Next.js cache dengan explicit cache tags.
   revalidation dilakukan melalui protected endpoint yang dipanggil
   admin setelah publish.
   detail pada `architecture.md` section 21.

4. image strategy menggunakan `next/image` dengan `remotePatterns`
   yang mengizinkan Firebase Storage host.

5. preview draft dijalankan server side dengan Admin SDK sehingga
   Firestore Security Rules tetap menolak akses publik terhadap draft.
   detail pada `architecture.md` section 27.

---

## verification

decision ini dianggap terpenuhi apabila:

```text
simatupangkevin.web.app merespon melalui Firebase Hosting
request dirender oleh Cloud Run
project detail menghasilkan metadata dari Firestore
publish project baru muncul tanpa rebuild
sitemap memuat project baru tanpa perubahan source code
```
