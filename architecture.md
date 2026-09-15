# architecture.md

## 1. architecture objective

architecture website harus mendukung tiga hal utama:

1. immersive presentation
2. content driven system
3. long term maintainability

website harus dapat berkembang dari portfolio sederhana menjadi personal platform tanpa perlu melakukan rewrite besar terhadap core architecture.

---

## 2. architectural principles

### 2.1 content and presentation must be separated

data project tidak boleh ditulis langsung di component UI.

component bertanggung jawab atas bagaimana data ditampilkan.

content layer bertanggung jawab atas apa yang ditampilkan.

---

### 2.2 one renderer, many projects

seluruh project detail menggunakan architecture yang sama.

```text
/projects/[slug]
```

satu route dapat merender seluruh project.

perbedaan antar project berasal dari data, bukan dari duplicate page implementation.

---

### 2.3 mobile first

semua component harus dirancang dari mobile kemudian ditingkatkan untuk viewport yang lebih besar.

desktop tidak boleh menjadi baseline utama.

---

### 2.4 server first

gunakan Server Components sebagai default pada Next.js.

Client Components hanya digunakan ketika membutuhkan:

- browser APIs
- state interaktif
- animation state
- gesture
- event listeners
- client side libraries

jangan mengubah seluruh application menjadi client rendered hanya karena beberapa bagian membutuhkan interactivity.

---

### 2.5 progressive enhancement

core content harus tetap usable walaupun:

- animation disabled
- slow connection
- reduced motion enabled
- javascript mengalami masalah pada non critical interaction

---

### 2.6 data first

homepage dan project detail tidak boleh bergantung pada hardcoded content.

UI harus membaca data dari content layer.

---

## 3. system overview

high level architecture:

```text
                    ┌─────────────────────┐
                    │       Visitor       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Firebase Hosting  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Next.js        │
                    │    Application      │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
     ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
     │   Content    │  │    Media     │  │   Analytics  │
     │    Layer     │  │    Layer     │  │    Layer     │
     └──────┬───────┘  └──────┬───────┘  └──────────────┘
            │                 │
            ▼                 ▼
     ┌──────────────┐  ┌──────────────┐
     │   Firestore  │  │ Firebase     │
     │              │  │ Storage      │
     └──────────────┘  └──────────────┘
```

---

# 4. application stack

## frontend

- Next.js
- React
- TypeScript
- Tailwind CSS or equivalent styling architecture
- CSS animations where sufficient
- motion library only where needed

## backend

Firebase

## database

Cloud Firestore

## media storage

Firebase Storage

## authentication

Firebase Authentication

authentication hanya digunakan untuk private administration functionality.

visitor tidak perlu login.

## hosting

Firebase Hosting

## analytics

Firebase Analytics, apabila analytics diperlukan.

---

# 5. next.js architecture

gunakan Next.js App Router.

conceptual structure:

```text
src/
│
├── app/
│   ├── page.tsx
│   ├── projects/
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   ├── experiments/
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   ├── about/
│   │   └── page.tsx
│   │
│   ├── resume/
│   │   └── page.tsx
│   │
│   ├── contact/
│   │   └── page.tsx
│   │
│   └── admin/
│       ├── page.tsx
│       ├── projects/
│       ├── experiments/
│       ├── experience/
│       └── settings/
│
├── components/
│   ├── layout/
│   ├── navigation/
│   ├── hero/
│   ├── projects/
│   ├── experiments/
│   ├── experience/
│   ├── resume/
│   ├── contact/
│   ├── motion/
│   └── ui/
│
├── lib/
│   ├── firebase/
│   ├── firestore/
│   ├── storage/
│   ├── auth/
│   └── utils/
│
├── data/
│   └── static/
│
├── types/
│
└── config/
```

struktur tersebut adalah conceptual baseline.

actual folder arrangement dapat berubah selama prinsip separation tetap dipertahankan.

---

# 6. route architecture

## public routes

```text
/
 /projects
 /projects/[slug]
 /experiments
 /experiments/[slug]
 /about
 /resume
 /contact
```

### homepage

`/`

menjadi primary immersive experience.

### project index

`/projects`

listing seluruh published project.

route ini menjadi target navigation `work` pada `design.md` section 17.

index tidak boleh memiliki hardcoded project list.

data berasal dari data access layer yang sama dengan homepage.

### project detail

`/projects/[slug]`

dynamic route.

### experiment index

`/experiments`

listing seluruh published experiment.

### experiment detail

`/experiments/[slug]`

dynamic route.

### resume

`/resume`

human readable resume experience.

resume file dapat tersedia untuk download.

### contact

`/contact`

contact experience.

---

# 7. admin routes

admin route:

```text
/admin
```

admin interface digunakan untuk content management.

conceptual structure:

```text
/admin
/admin/projects
/admin/projects/new
/admin/projects/[id]
/admin/experiments
/admin/experiments/new
/admin/experience
/admin/skills
/admin/settings
/admin/media
```

admin interface tidak boleh memengaruhi public presentation architecture secara langsung.

---

# 8. authentication architecture

admin menggunakan Firebase Authentication.

initial implementation dapat menggunakan:

- email/password authentication

authentication layer harus memiliki authorization check.

public users tidak boleh memiliki permission untuk:

- create content
- edit content
- delete content
- upload private assets
- modify site settings

authentication sendiri bukan authorization.

Firestore Security Rules tetap menjadi security boundary utama.

## 8.1 admin authorization mechanism

authentication hanya membuktikan identitas.

authorization ditentukan oleh **Firebase Authentication custom claim**:

```text
admin: true
```

custom claim dipilih karena:

- dapat dibaca langsung oleh Firestore Security Rules dan Storage Rules
  melalui `request.auth.token.admin`
- tidak memerlukan additional document read pada setiap rules evaluation
- tidak dapat dimodifikasi dari client

claim hanya dapat di-set menggunakan Firebase Admin SDK.

client tidak boleh memiliki kemampuan untuk memberikan claim kepada dirinya sendiri.

## 8.2 admin bootstrap

admin pertama tidak dapat dibuat melalui admin interface karena belum ada
admin yang memiliki permission.

bootstrap dilakukan satu kali melalui operasi administratif terpisah
menggunakan Admin SDK atau Firebase console.

bootstrap bukan bagian dari application runtime.

script bootstrap tidak boleh menyimpan credentials di dalam repository.

## 8.3 authorization checkpoints

authorization diperiksa pada tiga lapisan:

```text
Firestore Security Rules   ← security boundary utama
Storage Security Rules     ← security boundary utama
server side route guard    ← user experience dan defense in depth
```

admin UI yang disembunyikan bukan authorization.

apabila server guard dilewati, security rules tetap harus menolak operasi.

---

# 9. firestore architecture

Firestore menjadi structured content database.

conceptual collections:

```text
projects
experiments
experiences
skills
technologies
education
socialLinks
siteSettings
mediaAssets
slugs
```

setiap collection memiliki structured document.

`mediaAssets` menjadi media library yang mendukung route `/admin/media`
dan asset reference tracking.

`slugs` menjadi slug reservation index untuk menjamin slug uniqueness.

Firestore tidak memiliki unique constraint native.

definisi berada pada `schema.md` section 61 dan section 62.

---

# 10. project document architecture

conceptual:

```ts id="if5a4q"
Project {
  id: string
  slug: string
  title: string
  subtitle?: string
  description: string

  category?: string
  year?: number
  status?: string

  featured: boolean
  published: boolean

  role?: string

  cover?: MediaAsset

  gallery?: MediaAsset[]

  technologies?: string[]

  problem?: ContentBlock[]
  approach?: ContentBlock[]
  process?: ProcessStep[]
  solution?: ContentBlock[]
  outcome?: ContentBlock[]

  metrics?: Metric[]

  links?: ProjectLink[]

  seo?: SEOData

  order: number

  createdAt: Timestamp
  updatedAt: Timestamp
}
```

schema final akan ditentukan di `schema.md`.

---

# 11. flexible content architecture

project content tidak boleh terlalu rigid.

satu project dapat memiliki:

```text
hero
text
image
video
quote
gallery
metrics
process
code
embed
comparison
timeline
```

content renderer dapat menggunakan block based architecture.

conceptual:

```ts id="2mpg7k"
ContentBlock =
  | TextBlock
  | ImageBlock
  | VideoBlock
  | GalleryBlock
  | QuoteBlock
  | MetricsBlock
  | ProcessBlock
  | CodeBlock
  | EmbedBlock
```

hal tersebut memungkinkan setiap project mempunyai storytelling berbeda.

---

# 12. dynamic renderer

project detail menggunakan:

```text
ProjectPage
    ↓
ProjectResolver
    ↓
ProjectRenderer
    ↓
Project sections
```

conceptual:

```text
/projects/[slug]
       ↓
loadProject(slug)
       ↓
validateProject()
       ↓
renderProject()
```

tidak boleh membuat renderer berdasarkan slug.

hindari:

```ts
if (slug === "project-a") ...
if (slug === "project-b") ...
```

project-specific behavior hanya boleh berasal dari content data atau explicit reusable configuration.

---

# 13. homepage architecture

homepage harus menggunakan composable sections.

conceptual:

```text
Home
│
├── Hero
├── SelectedProjects
├── Capabilities
├── Experiments
├── Process
├── Experience
├── PersonalContext
├── ResumeCTA
└── Contact
```

section dapat diaktifkan, dinonaktifkan, dan diatur urutannya melalui configuration.

---

# 14. selected project architecture

selected project tidak boleh dipilih manual di JSX.

gunakan project metadata.

```text
featured = true
published = true
```

query:

```text
published projects
↓
filter featured
↓
sort order
↓
render
```

---

# 15. project ordering

project harus memiliki explicit ordering field.

contoh:

```text
order: 1
order: 2
order: 3
```

hal ini memungkinkan admin mengubah urutan tanpa mengubah source code.

---

# 16. publishing architecture

content memiliki dua field lifecycle yang independen:

```text
published: boolean
archived: boolean
```

state yang dihasilkan:

```text
published = false, archived = false   → draft
published = true,  archived = false   → published
archived  = true                      → archived
```

`archived` selalu mengalahkan `published`.

content baru selalu dibuat sebagai draft.

public website hanya boleh menampilkan content dengan:

```text
published = true
archived  = false
```

admin dapat melihat draft dan archived.

`ProjectStatus` pada `schema.md` adalah semantic information mengenai
status pekerjaan, bukan visibility.

visibility hanya ditentukan oleh `published` dan `archived`.

schema definition berada pada `schema.md` section 44.

---

# 17. media architecture

Firebase Storage menjadi primary media storage.

storage path menggunakan **document id**, bukan slug.

slug bersifat mutable dan perubahan slug akan membuat seluruh asset
menjadi orphan apabila path bergantung pada slug.

document id bersifat immutable.

conceptual structure:

```text
projects/{projectId}/
    cover
    gallery
    videos
    supporting

experiments/{experimentId}/
    cover
    gallery

profile/
    avatar
    portrait

resume/
    resume.pdf
```

asset URL tidak boleh tersebar sebagai hardcoded string di seluruh component.

storage path rules berada pada `schema.md` section 53.

---

# 18. media metadata

setiap asset harus memiliki metadata yang cukup.

conceptual:

```ts id="k1yvyr"
MediaAsset {
  url: string
  type: "image" | "video" | "document"
  alt?: string
  width?: number
  height?: number
  caption?: string
}
```

metadata tambahan dapat digunakan untuk responsive rendering dan accessibility.

---

# 19. image architecture

gunakan optimized image delivery.

critical hero images harus diprioritaskan.

large gallery media harus lazy loaded.

jangan memuat seluruh project gallery pada initial viewport.

---

# 20. video architecture

video berat tidak boleh otomatis dimainkan tanpa alasan.

gunakan:

- poster image
- lazy loading
- appropriate preload
- muted autoplay hanya bila benar-benar diperlukan
- reduced motion consideration

external video provider dapat digunakan bila file terlalu besar untuk direct serving.

---

# 21. caching strategy

content yang relatif stabil dapat menggunakan caching.

target:

- homepage content caching
- project caching
- technology data caching
- site settings caching

admin update harus memiliki mekanisme revalidation.

setiap content update tidak boleh memerlukan full rebuild apabila architecture dapat menghindarinya.

## 21.1 cache tags

setiap cached read harus memiliki explicit cache tag.

baseline tag:

```text
projects
project:{slug}
experiments
experiment:{slug}
experiences
skills
technologies
education
socialLinks
siteSettings
```

tag collection digunakan untuk listing.

tag entity digunakan untuk detail.

## 21.2 revalidation

setelah admin melakukan publish, unpublish, archive, atau update,
data access layer harus melakukan revalidation terhadap tag yang terpengaruh.

contoh:

```text
publish project
↓
revalidate project:{slug}
revalidate projects
```

revalidation dijalankan pada server setelah write berhasil.

apabila revalidation diekspos sebagai endpoint, endpoint tersebut wajib
memiliki authorization dan tidak boleh dapat dipanggil publik.

revalidation tidak boleh memerlukan rebuild atau redeploy.

hal ini merupakan konsekuensi langsung dari
`docs/decisions/0001-hosting-and-rendering.md`.

---

# 22. firestore read optimization

hindari:

```text
component A → Firestore read
component B → Firestore read
component C → Firestore read
```

untuk data yang sama.

gunakan centralized data access layer.

conceptual:

```text
page
 ↓
data service
 ↓
Firestore
 ↓
validated domain data
 ↓
components
```

components tidak boleh langsung melakukan Firestore queries secara acak.

---

# 23. data access layer

buat abstraction seperti:

```ts id="os4m8d"
getProjectBySlug()
getFeaturedProjects()
getPublishedProjects()
getExperiments()
getExperiences()
getSkills()
getSiteSettings()
```

component tidak perlu mengetahui detail Firebase.

contoh:

```text
ProjectCard
```

tidak boleh mengetahui:

```text
firebase.firestore()
```

---

# 24. validation layer

semua content dari Firestore harus divalidasi sebelum masuk presentation layer.

gunakan schema validation library bila diperlukan.

flow:

```text
Firestore
↓
raw document
↓
validation
↓
domain model
↓
UI
```

invalid data harus menghasilkan controlled fallback, bukan crash total.

---

# 25. error handling

public experience harus memiliki graceful error states.

contoh:

project tidak ditemukan:

```text
404 experience
```

Firestore unavailable:

gunakan cached/static fallback apabila tersedia.

media gagal:

fallback image atau placeholder yang intentional.

---

# 26. admin content workflow

workflow add project:

```text
login
↓
admin dashboard
↓
projects
↓
add project
↓
basic information
↓
hero media
↓
content blocks
↓
technologies
↓
links
↓
seo
↓
save draft
↓
preview
↓
publish
```

user tidak perlu menyentuh source code untuk menambahkan project.

---

# 27. preview architecture

admin harus memiliki preview sebelum publish.

ideal workflow:

```text
draft
↓
preview
↓
review
↓
publish
```

preview harus sedekat mungkin dengan production renderer.

jangan membuat preview dengan UI yang berbeda.

## 27.1 preview data path

draft tidak boleh dapat dibaca publik.

Firestore Security Rules menolak public read terhadap unpublished content.

karena itu preview tidak dapat menggunakan client SDK milik visitor.

preview dijalankan server side:

```text
admin membuka preview route
↓
server memverifikasi admin authorization
↓
server membaca draft menggunakan Admin SDK
↓
ProjectRenderer yang sama dengan production
↓
output
```

Admin SDK melewati Security Rules, sehingga authorization check pada server
menjadi wajib sebelum melakukan read.

## 27.2 preview constraints

- preview route tidak boleh dapat diakses tanpa admin authorization
- preview tidak boleh di-cache sebagai public content
- preview tidak boleh masuk sitemap
- preview harus menggunakan renderer, layout, dan design tokens yang identik
  dengan production

apabila preview dan production menghasilkan output berbeda untuk document
yang sama, hal tersebut dianggap bug.

---

# 28. delete architecture

content deletion harus mempertimbangkan media references.

jangan langsung menghapus:

```text
Firestore document
+
Storage assets
```

tanpa memastikan tidak ada reference yang masih dibutuhkan.

initial implementation dapat menggunakan soft delete atau archived state.

---

# 29. security architecture

Firestore Security Rules wajib diterapkan.

public users:

```text
read content dengan published = true dan archived = false
```

admin:

```text
read
create
update
archive
```

admin ditentukan oleh custom claim `admin: true` sesuai section 8.1.

## 29.1 list query constraint

Firestore Security Rules mengevaluasi query, bukan hasil query.

public list query harus secara eksplisit memfilter:

```text
published == true
archived == false
```

apabila query tidak memuat filter tersebut, rules harus menolak query.

hal ini mencegah draft bocor melalui unconstrained listing.

## 29.2 storage rules

Storage rules harus memisahkan public assets dan private/admin assets.

resume dan public media dapat menggunakan appropriate public access strategy.

private administrative uploads tidak boleh dapat diakses tanpa authorization.

write ke Storage hanya diizinkan untuk admin.

## 29.3 rules verification

security rules wajib memiliki automated test menggunakan Firebase emulator.

minimum test:

```text
anonymous read published content        → allowed
anonymous read draft content            → denied
anonymous read archived content         → denied
anonymous unconstrained list query      → denied
anonymous write                         → denied
admin write                             → allowed
```

---

# 30. environment architecture

gunakan environment variables untuk:

- Firebase configuration
- admin configuration
- analytics identifiers
- optional external services

jangan commit secret credentials.

Firebase client configuration yang memang public oleh design tidak boleh diperlakukan sebagai server secret.

server credentials tetap private.

---

# 31. deployment architecture

production:

```text
Git repository
↓
CI / build verification
↓
Next.js build
↓
Cloud Run service
↑
Firebase Hosting rewrite
↓
simatupangkevin.web.app
```

runtime model:

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
```

Firebase Hosting tetap menjadi public edge dan pemilik domain.

Cloud Run menjalankan Next.js server sehingga Server Components,
dynamic metadata, dynamic sitemap, dan revalidation dapat berjalan.

static export tidak digunakan sebagai strategi utama karena akan
memaksa rebuild pada setiap content publish.

rationale lengkap berada pada
`docs/decisions/0001-hosting-and-rendering.md`.

deployment harus dilakukan setelah:

- typecheck
- lint
- build
- automated tests
- visual verification

---

# 32. git architecture

branch strategy dapat sederhana.

minimum:

```text
main
```

feature branches dapat digunakan untuk perubahan besar.

commit harus merepresentasikan perubahan yang terisolasi.

contoh:

```text
feat: add project content engine
fix: prevent mobile hero overflow
refactor: simplify media loader
```

---

# 33. performance architecture

target utama:

- minimal client javascript
- server rendering wherever possible
- optimized media
- lazy loading
- controlled animations
- avoid unnecessary hydration
- avoid large dependencies
- avoid duplicate Firebase requests

creative effects harus memiliki performance budget.

---

# 34. animation architecture

animation harus dipisahkan dari business logic.

conceptual:

```text
components/
└── motion/
    ├── reveal
    ├── parallax
    ├── magnetic
    ├── page-transition
    └── scroll-story
```

animation component harus reusable.

jangan menaruh kompleksitas animation langsung di content renderer.

---

# 35. reduced motion

gunakan:

```text
prefers-reduced-motion
```

sebagai first class requirement.

ketika reduced motion aktif:

- disable nonessential movement
- reduce parallax
- reduce transitions
- preserve information hierarchy

---

# 36. accessibility architecture

accessibility tidak boleh ditambahkan sebagai final polish.

semantic HTML dan keyboard support harus menjadi bagian component primitives sejak awal.

---

# 37. SEO architecture

project route harus menghasilkan metadata berdasarkan project.

conceptual:

```text
/projects/[slug]
↓
getProjectBySlug(slug)
↓
generateMetadata()
↓
render project
```

metadata harus berasal dari content data.

---

# 38. sitemap architecture

dynamic routes harus dapat masuk sitemap secara otomatis.

contoh:

```text
/
 /projects/gmahk-digital-archive
 /projects/project-two
 /projects/project-three
```

tidak perlu update sitemap manual ketika project baru ditambahkan.

---

# 39. extensibility architecture

future modules harus dapat ditambahkan tanpa mengubah core project engine.

possible modules:

```text
journal
blog
changelog
guestbook
now
certifications
awards
digital garden
```

setiap module harus memiliki:

- content model
- data access layer
- route
- renderer
- metadata
- admin management

---

# 40. architectural anti patterns

dilarang:

### hardcoded projects

```ts
const projects = [...]
```

sebagai primary production content source.

### duplicate project pages

```text
project-a/page.tsx
project-b/page.tsx
project-c/page.tsx
```

### slug based conditional rendering

```ts
if (slug === ...)
```

### firebase calls inside presentational components

### giant client component

seluruh homepage tidak boleh menjadi satu Client Component.

### uncontrolled animation dependency

animation library tidak boleh ditambahkan untuk setiap small interaction tanpa kebutuhan.

### direct storage manipulation from random components

semua media access harus melewati media/data layer.

---

# 41. responsibility boundaries

## pages

bertanggung jawab terhadap:

- route
- data loading
- metadata
- composition

## components

bertanggung jawab terhadap:

- presentation
- interaction
- layout

## data services

bertanggung jawab terhadap:

- Firebase access
- query
- caching
- transformation

## schemas

bertanggung jawab terhadap:

- validation
- type contracts

## admin

bertanggung jawab terhadap:

- content management
- publishing
- media management

---

# 42. architecture summary

final conceptual relationship:

```text
                    CONTENT
                       │
                       ▼
                ┌───────────────┐
                │   Firestore   │
                └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │ Data Services │
                └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │ Domain Models │
                └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │   Renderers   │
                └───────┬───────┘
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
        PUBLIC EXPERIENCE      ADMIN
              │                   │
              ▼                   ▼
        Visitor Interface    Content Management
```

core rule:

> the database defines what exists. components define how it looks.

---

# 43. final architectural goal

architecture harus membuat kondisi berikut menjadi normal:

```text
today
3 projects

next month
8 projects

next year
30 projects
```

tanpa perlu mengubah:

```text
/projects/[slug]
ProjectRenderer
ProjectCard
ProjectLayout
```

yang berubah hanya:

```text
content
media
metadata
```

website harus terasa seperti sebuah continuously evolving personal product, bukan website yang selesai sekali lalu jarang disentuh.