# rules.md

# personal digital experience
## engineering and design rules

Dokumen ini adalah aturan utama untuk seluruh development website.

Semua implementation harus mengikuti:

```text
PRD.md
architecture.md
schema.md
design.md
rules.md
```

Jika terdapat konflik, jangan mengambil keputusan sendiri.

Prioritas:

```text
rules.md
↓
architecture.md
↓
schema.md
↓
design.md
↓
PRD.md
```

Namun aturan yang lebih spesifik harus tetap konsisten dengan tujuan product secara keseluruhan.

---

# 1. core principle

## 1.1 build a product, not a template

website bukan template portfolio.

jangan membuat architecture berdasarkan pola portfolio developer generik.

website harus terasa seperti personal product yang terus berkembang.

---

# 2. source of truth

developer wajib membaca seluruh documentation sebelum melakukan major implementation.

minimum:

```text
PRD.md
architecture.md
schema.md
design.md
rules.md
```

jangan melakukan architectural decision besar hanya berdasarkan asumsi.

---

# 3. no unnecessary reinvention

gunakan existing architecture dan reusable components.

jangan membuat:

- duplicate components
- duplicate route
- duplicate data model
- duplicate animation implementation
- duplicate Firebase service

jika functionality sudah tersedia, gunakan kembali.

---

# 4. content must never be hardcoded into presentation

dilarang menjadikan TSX/JSX sebagai primary production content database.

contoh yang dilarang:

```ts id="u8q4nr"
const projects = [
  {
    title: "project one"
  },
  {
    title: "project two"
  }
]
```

sebagai sumber utama production content.

content harus berasal dari content layer.

---

# 5. project scalability rule

menambahkan project baru **tidak boleh membutuhkan source code change** pada:

- project route
- project renderer
- project card
- navigation
- sitemap
- homepage composition

kecuali project memperkenalkan capability baru yang memang belum didukung schema.

---

# 6. no project-specific components

jangan membuat:

```text id="j8i8a4"
GmahkProject.tsx
PortfolioProject.tsx
ChurchProject.tsx
```

gunakan generic project architecture.

project differentiation harus berasal dari content.

---

# 7. no slug-specific logic

dilarang:

```ts id="zwdrw2"
if (slug === "gmahk-digital-archive") {
  ...
}
```

atau:

```ts id="m0l2pv"
switch (slug) {
  ...
}
```

slug harus menjadi identifier.

bukan business logic.

---

# 8. content block rule

content blocks harus reusable.

jika sebuah project membutuhkan content type baru:

1. evaluasi apakah existing block dapat digunakan.
2. jika tidak dapat, design new generic block.
3. update schema.
4. update renderer.
5. update admin editor.

jangan membuat workaround khusus untuk satu project.

---

# 9. Firebase rule

Firebase adalah primary infrastructure.

jangan mengganti atau memperkenalkan backend baru tanpa alasan kuat.

default architecture:

```text id="rgn1j8"
Firebase Hosting
Firebase Authentication
Firestore
Firebase Storage
Firebase Analytics
```

service yang tidak dibutuhkan tidak perlu diaktifkan.

---

# 10. Firestore rule

jangan melakukan Firestore query langsung dari arbitrary UI components.

gunakan data access layer.

correct:

```text id="5c2k3v"
component
↓
data service
↓
Firestore
```

incorrect:

```text id="g0n4gx"
component
↓
Firestore
```

---

# 11. Firebase read efficiency

jangan melakukan duplicate reads untuk data yang sama.

hindari:

```text id="rz5m1k"
Hero → projects query
Projects → projects query
Footer → projects query
```

jika data dapat diambil sekali, ambil sekali.

gunakan caching dan revalidation sesuai kebutuhan.

---

# 12. Firebase security

security rules adalah mandatory.

jangan mengandalkan frontend authorization.

frontend:

```text id="zyijfn"
"admin"
```

bukan security boundary.

Firestore rules dan Storage rules tetap harus mencegah unauthorized operations.

---

# 13. authentication rule

admin authentication harus dipisahkan dari public experience.

visitor tidak boleh mendapatkan administrative capability hanya karena UI admin disembunyikan.

authorization harus diperiksa server/security layer.

---

# 14. storage rule

media besar tidak boleh disimpan sebagai Firestore data.

gunakan Firebase Storage.

Firestore menyimpan:

```text id="3qfr9x"
metadata
reference
```

Storage menyimpan:

```text id="wip1cp"
actual file
```

---

# 15. media optimization

jangan upload full resolution asset tanpa optimasi.

developer harus mempertimbangkan:

- dimensions
- compression
- format
- responsive variants
- lazy loading
- poster images

---

# 16. no unnecessary dependencies

jangan menambahkan library hanya karena library tersebut populer.

sebelum install dependency baru:

1. cek apakah platform/framework sudah menyediakan functionality.
2. cek apakah CSS/JS native cukup.
3. cek bundle cost.
4. cek maintenance status.
5. pastikan dependency memberikan value nyata.

---

# 17. animation rule

animation harus memiliki purpose.

setiap major animation harus dapat menjawab:

> what does this animation communicate?

jika jawabannya hanya:

> it looks cool

itu belum cukup.

---

# 18. animation restraint

jangan membuat:

- every element animate
- every scroll trigger animate
- infinite movement
- unnecessary parallax
- excessive blur
- excessive scale

visual hierarchy harus tetap jelas.

---

# 19. animation library rule

gunakan animation library hanya ketika native CSS/Browser API tidak cukup.

jangan menggunakan banyak animation libraries sekaligus untuk kebutuhan yang sama.

satu abstraction yang konsisten lebih baik daripada banyak implementation terpisah.

---

# 20. mobile first rule

semua component harus dimulai dari mobile.

workflow:

```text id="1d5vu1"
mobile
↓
tablet
↓
desktop
↓
wide desktop
```

bukan:

```text id="oqpnd2"
desktop
↓
shrink until it fits mobile
```

---

# 21. no horizontal overflow

horizontal overflow yang tidak disengaja dianggap bug.

setiap major UI change harus diuji terhadap:

- small mobile
- large mobile
- tablet
- desktop
- wide desktop

---

# 22. touch rule

jangan membuat functionality penting bergantung pada:

```text id="1m1yjq"
hover
```

setiap hover interaction harus memiliki meaningful touch equivalent atau graceful fallback.

---

# 23. accessibility rule

accessibility adalah requirement, bukan polish.

minimum:

- semantic HTML
- keyboard navigation
- focus states
- accessible labels
- proper heading hierarchy
- sufficient contrast
- reduced motion
- alt text

---

# 24. reduced motion rule

semua major motion system harus menghormati:

```text id="0k5s3g"
prefers-reduced-motion
```

jika reduced motion aktif, functionality harus tetap utuh.

---

# 25. server component rule

Next.js Server Components adalah default.

gunakan Client Components hanya ketika memang diperlukan.

reason yang valid:

- state
- browser API
- gesture
- event listeners
- animation state
- client-only third-party library

jangan menggunakan:

```text id="j4gqgk"
"use client"
```

pada parent tree hanya karena satu child membutuhkan client behavior.

---

# 26. client boundary rule

buat client boundaries sekecil mungkin.

contoh:

```text id="k9l9je"
Page
├── Server
├── Server
└── InteractiveClientComponent
```

lebih disukai daripada:

```text id="6ye9g7"
EntirePageClientComponent
```

---

# 27. component architecture

component harus reusable.

hindari component seperti:

```text id="2ujm5l"
KevinHeroFinalFinal2
```

component harus dinamai berdasarkan responsibility.

contoh:

```text id="c1d2cu"
Hero
ProjectCard
ProjectGallery
ProjectRenderer
SectionReveal
```

---

# 28. component size

jangan membuat giant components.

jika sebuah component memiliki banyak unrelated responsibilities, pecah menjadi beberapa component.

tetapi jangan memecah component hanya untuk mengejar jumlah file.

separation harus berdasarkan responsibility.

---

# 29. design token rule

jangan menyebarkan arbitrary values untuk:

- colors
- spacing
- typography
- radius
- animation
- z-index

gunakan design tokens sebanyak mungkin.

---

# 30. no random pixel tuning

hindari:

```css id="7gb5kg"
margin-left: 13px;
top: 27px;
width: 843px;
```

yang hanya ditambahkan untuk memperbaiki satu viewport.

jika layout membutuhkan banyak arbitrary values, evaluasi ulang structure.

---

# 31. typography rule

typography harus mengikuti design system.

jangan setiap section menggunakan font-size sendiri.

headline utama harus intentional.

jangan mengandalkan accidental browser wrapping untuk important messaging.

---

# 32. visual consistency

creative variation boleh.

visual inconsistency tidak boleh.

project A dan project B boleh memiliki storytelling berbeda.

tetapi mereka tetap harus terlihat berasal dari produk yang sama.

---

# 33. card restraint

jangan otomatis membungkus setiap content menjadi card.

gunakan card hanya jika membantu grouping dan hierarchy.

---

# 34. no generic portfolio pattern

hindari default:

```text id="k9u2t2"
6 skill cards
6 project cards
3 testimonials
contact form
footer
```

hanya karena itu pola portfolio umum.

content structure harus mengikuti product narrative.

---

# 35. project narrative rule

project detail harus menjawab secara natural:

```text id="pr7btp"
what was this?
why did it exist?
what problem did it solve?
what did i do?
how did i build it?
what happened?
what did i learn?
```

tidak semua project membutuhkan seluruh pertanyaan.

gunakan content yang relevan.

---

# 36. admin panel rule

admin panel harus mengoptimalkan content entry.

user harus dapat:

```text id="l4nr3r"
Add Project
↓
Fill information
↓
Upload media
↓
Arrange content blocks
↓
Preview
↓
Publish
```

tanpa membuka IDE.

---

# 37. admin UX

admin UI tidak perlu memiliki visual extravagance seperti public website.

prioritas admin:

```text id="v5peki"
clarity
speed
reliability
```

public website:

```text id="w4quqf"
emotion
storytelling
immersion
```

keduanya memiliki tujuan berbeda.

---

# 38. draft rule

content baru default ke draft.

jangan otomatis publish content hanya karena save berhasil.

recommended lifecycle:

```text id="b9kpnv"
draft
↓
preview
↓
publish
```

---

# 39. deletion rule

prefer archive/soft delete dibanding permanent deletion.

permanent deletion harus menjadi deliberate operation.

jangan menghapus media secara otomatis tanpa mengetahui reference usage.

---

# 40. slug rule

slug harus:

- lowercase
- URL safe
- unique
- stable

perubahan slug harus dianggap sensitive operation.

---

# 41. metadata rule

SEO metadata harus berasal dari content.

jangan hardcode project title di metadata implementation.

gunakan fallback:

```text id="jk2qzo"
project SEO title
↓
project title
↓
site default title
```

---

# 42. sitemap rule

sitemap harus bersifat dynamic.

project baru harus otomatis dapat masuk sitemap setelah publish.

jangan edit sitemap secara manual untuk setiap project.

---

# 43. analytics rule

analytics tidak boleh menentukan UI behavior.

analytics adalah observational layer.

website harus tetap berfungsi jika analytics gagal.

---

# 44. external service rule

external services harus optional whenever possible.

core website tidak boleh rusak karena external analytics, embeds, atau integrations unavailable.

---

# 45. error handling rule

tidak boleh menampilkan raw error ke public user.

hindari:

```text id="f1o50r"
FirebaseError: PERMISSION_DENIED
```

public interface harus memberikan controlled error state.

---

# 46. loading rule

loading state harus intentional.

hindari spinner generic di seluruh website.

gunakan progressive loading bila memungkinkan.

---

# 47. empty state rule

jika content belum tersedia:

jangan render:

```text id="41oi8e"
null
undefined
empty container
```

gunakan appropriate fallback atau hide section.

---

# 48. no overengineering

jangan membangun:

- unnecessary microservices
- unnecessary abstraction layers
- unnecessary state management
- unnecessary CMS complexity
- unnecessary APIs

system harus sekuat kebutuhan product, bukan lebih rumit dari kebutuhan product.

---

# 49. architecture change rule

jika implementation membutuhkan perubahan architecture:

1. jelaskan alasan.
2. tentukan impact.
3. pastikan tidak melanggar existing documentation.
4. update relevant documentation.

jangan silently rewrite core architecture.

---

# 50. schema change rule

schema changes harus mengikuti:

```text id="w2o2gr"
schema change
↓
update schema.md
↓
update TypeScript types
↓
update validation
↓
update admin form
↓
update renderer
↓
test existing content
```

---

# 51. backward compatibility

existing project documents tidak boleh rusak hanya karena project baru memiliki field tambahan.

optional fields harus memiliki safe fallback.

---

# 52. migration rule

jika perubahan schema breaking diperlukan:

buat migration strategy.

jangan membuat schema baru yang hanya bekerja untuk future data sementara old data rusak.

---

# 53. testing rule

minimum validation sebelum production:

```text id="x8x6z7"
typecheck
lint
unit tests where applicable
build
responsive verification
critical interaction verification
Firebase integration verification
```

---

# 54. visual QA

major UI change wajib dicek secara visual.

minimum:

```text id="4nmqyy"
mobile
tablet
desktop
```

cek:

- clipping
- overflow
- spacing
- text wrapping
- image crop
- animation
- navigation
- touch behavior

---

# 55. browser QA

uji pada modern:

- Chrome
- Safari
- Firefox
- Edge

prioritas tinggi:

- iOS Safari
- Android Chrome

---

# 56. performance rule

sebuah effect tidak boleh masuk hanya karena secara visual bagus jika impact performance tidak dapat diterima.

perhatikan:

- bundle size
- hydration
- image weight
- video weight
- animation cost
- memory
- Firestore reads

---

# 57. dependency budget

setiap new dependency harus memiliki justification.

format internal:

```text id="zy2xct"
why
what it replaces
bundle impact
maintenance status
fallback
```

---

# 58. git rule

gunakan meaningful commits.

contoh:

```text id="2jr1yr"
feat: add dynamic project renderer
feat: add project admin editor
fix: prevent mobile hero overflow
refactor: centralize firestore queries
perf: optimize project media loading
```

hindari:

```text id="9mny3r"
update
fix
test
changes
final
final2
```

---

# 59. deployment rule

production deployment hanya dilakukan setelah verification.

minimum flow:

```text id="m8m6i7"
develop
↓
typecheck
↓
lint
↓
test
↓
build
↓
visual verification
↓
deploy
↓
production verification
```

---

# 60. production domain

production domain:

```text id="ttt8ri"
https://simatupangkevin.web.app
```

domain tidak boleh diganti tanpa explicit product decision.

---

# 61. secrets

jangan commit:

- private keys
- service account credentials
- passwords
- authentication secrets
- private tokens

gunakan environment configuration.

---

# 62. firebase credentials

Firebase browser configuration yang memang diperlukan client application boleh tersedia pada client sesuai Firebase architecture.

private administrative credentials tidak boleh dikirim ke browser.

---

# 63. documentation rule

setiap architectural decision penting harus didokumentasikan.

jangan biarkan decision penting hanya berada di:

- chat
- commit message
- Claude context
- developer memory

source of truth harus berada di repository.

---

# 64. naming rules

gunakan naming yang descriptive.

lebih baik:

```text id="q0yo97"
ProjectRenderer
ProjectRepository
MediaUploader
```

daripada:

```text id="9pqgwi"
PR
Repo2
Thing
Helper
ManagerFinal
```

---

# 65. comments rule

comment digunakan untuk menjelaskan:

> why

bukan:

> what the code obviously does

hindari comment seperti:

```ts id="g3b7qb"
// set project title
project.title = title
```

gunakan comment ketika reasoning atau constraint tidak obvious.

---

# 66. accessibility over cleverness

jika interactive trick mengorbankan:

- keyboard
- screen reader
- readable content
- touch usability

hapus atau ubah interaction tersebut.

---

# 67. mobile over spectacle

jika sebuah desktop effect terlihat luar biasa tetapi mobile menjadi buruk:

mobile wins.

---

# 68. clarity over spectacle

jika visual effect mengganggu pemahaman content:

content wins.

---

# 69. performance over spectacle

jika effect menyebabkan significant performance regression:

simplify effect.

---

# 70. maintainability over novelty

jika sebuah technique sangat experimental tetapi membuat codebase sulit dipelihara, gunakan hanya jika benefit experience benar-benar signifikan.

---

# 71. creative freedom rule

Claude/OpenCode memiliki kebebasan untuk:

- memilih implementation detail
- membuat animation
- membuat transitions
- menyusun component internals
- memilih layout variation

selama keputusan tersebut tidak melanggar:

- PRD
- architecture
- schema
- design
- rules

---

# 72. decision escalation

ketika terdapat dua implementation yang sama-sama valid:

prioritaskan:

```text id="8s7cwp"
simplicity
↓
performance
↓
maintainability
↓
accessibility
↓
creative quality
```

namun untuk public visual layer:

```text id="2c9ey6"
clarity
↓
experience
↓
visual quality
↓
technical novelty
```

---

# 73. no silent deviation

Claude tidak boleh secara diam-diam:

- mengganti Firebase
- mengganti routing strategy
- mengganti content architecture
- membuat static project data
- menghapus admin system
- mengubah mobile-first menjadi desktop-first
- menghilangkan accessibility
- menghapus dynamic project engine

Jika perubahan tersebut benar-benar diperlukan, dokumentasikan dan flag sebagai architectural change.

---

# 74. completion rule

feature belum dianggap selesai hanya karena:

```text id="lguqlg"
"code works"
```

feature dianggap selesai jika:

```text id="f3c7ow"
works
+
responsive
+
accessible
+
performant
+
consistent
+
documented
```

---

# 75. final implementation mantra

selalu pikirkan:

```text id="l7edtr"
is this reusable?
is this necessary?
is this scalable?
is this accessible?
is this performant?
does this improve the experience?
```

jika jawabannya tidak, pertimbangkan untuk tidak membangunnya.

---

# 76. ultimate rule

> build something people remember, not something developers merely recognize.

website harus menunjukkan:

```text id="j7w0v8"
taste
+
technical ability
+
thinking
+
craft
+
personality
```

tanpa menjadi sulit digunakan.

---

# 77. final system contract

hasil akhir harus memenuhi kondisi:

```text id="z5p3hm"
Firebase
    ↓
structured content
    ↓
validated domain data
    ↓
reusable renderers
    ↓
immersive experience
```

dan:

```text id="4r7f6b"
new project
    ↓
admin
    ↓
content + media
    ↓
publish
    ↓
automatically available
```

tanpa pembuatan halaman baru.

---

# 78. non-negotiable rules

yang berikut bersifat mandatory:

```text id="8u1lko"
Firebase remains primary backend.
Production domain is simatupangkevin.web.app.
Projects are data-driven.
Project detail uses dynamic routing.
No project-specific page duplication.
No hardcoded production project content.
Admin must support content management.
Firestore is structured content storage.
Firebase Storage is media storage.
Server-first rendering.
Mobile-first design.
Accessibility is mandatory.
Reduced motion is mandatory.
Performance matters.
Animation must have purpose.
No silent architectural changes.
Documentation stays synchronized with implementation.
```

Jika salah satu rule ini harus dilanggar, perubahan tersebut harus diperlakukan sebagai architectural decision, bukan implementation shortcut.