# schema.md

## 1. schema philosophy

schema harus memenuhi prinsip:

> content defines the experience, components define the presentation.

schema harus:

- scalable
- flexible
- strongly typed
- mudah divalidasi
- mudah diisi melalui admin panel
- tidak bergantung pada jumlah project
- tidak memerlukan custom schema untuk setiap project
- mendukung content storytelling yang berbeda
- aman digunakan dengan Firestore
- mudah di-query
- mudah dikembangkan di masa depan

---

# 2. firestore overview

struktur utama:

```text
firestore
│
├── projects
├── experiments
├── experiences
├── skills
├── technologies
├── education
├── socialLinks
├── siteSettings
├── mediaAssets
└── slugs
```

`mediaAssets` adalah media library untuk admin media management
dan asset reference tracking.

`slugs` adalah slug reservation index.

Firebase Storage:

```text
storage
│
├── projects/{projectId}/
├── experiments/{experimentId}/
├── profile/
└── resume/
```

storage path menggunakan immutable document id, bukan mutable slug.

slug dapat berubah. document id tidak dapat berubah.

apabila storage path bergantung pada slug, perubahan slug akan
menyebabkan seluruh asset menjadi orphan.

detail pada section 53.

---

# 3. common types

## 3.1 timestamp

gunakan Firebase Timestamp atau normalized timestamp representation sesuai data access layer.

```ts
type TimestampValue = Timestamp
```

jangan menyimpan tanggal penting sebagai arbitrary formatted string apabila tanggal tersebut perlu sorting atau filtering.

---

# 4. media asset

semua visual asset harus menggunakan struktur terstandarisasi.

`MediaAsset` digunakan dalam dua konteks:

1. **embedded** di dalam content document sebagai snapshot reference
2. **document** di dalam collection `mediaAssets` sebagai media library entry

```ts
interface MediaAsset {
  id: string

  type: MediaType

  url: string

  storagePath: string

  alt?: string
  caption?: string

  width?: number
  height?: number

  posterUrl?: string

  focalPoint?: {
    x: number
    y: number
  }

  contentType?: string
  sizeBytes?: number

  credit?: string

  createdAt: Timestamp
}
```

`storagePath` wajib disimpan agar asset dapat dihapus, dipindahkan,
atau divalidasi tanpa melakukan parsing terhadap download URL.

`width` dan `height` wajib diisi untuk asset bertipe `image`
agar renderer dapat mencegah layout shift.

hal ini merupakan requirement `PRD.md` section 12 (`no layout shift`).

### MediaType

```ts
type MediaType =
  | "image"
  | "video"
  | "document"
  | "embed"
```

`focalPoint` digunakan jika crop responsive perlu mempertahankan area tertentu.

nilai `x` dan `y` menggunakan normalized value:

```text
0 = beginning
1 = end
```

---

# 5. project

collection:

```text
projects/{projectId}
```

schema:

```ts
interface Project {
  id: string

  schemaVersion: number

  slug: string

  title: string
  subtitle?: string

  description: string

  category?: string
  year?: number

  status?: ProjectStatus

  featured: boolean
  published: boolean
  archived: boolean

  role?: string

  duration?: string

  cover?: MediaAsset

  hero?: ProjectHero

  technologies?: ProjectTechnology[]

  content: ContentBlock[]

  metrics?: Metric[]

  links?: ProjectLink[]

  credits?: Credit[]

  seo?: SEOData

  order: number

  createdAt: Timestamp
  updatedAt: Timestamp
  publishedAt?: Timestamp
}
```

`published` dan `archived` menentukan visibility.

`status` hanya semantic information.

lifecycle lengkap pada section 44.

---

# 6. project status

```ts
type ProjectStatus =
  | "concept"
  | "active"
  | "completed"
  | "archived"
```

status digunakan sebagai semantic information.

status tidak otomatis menentukan visibility.

visibility ditentukan oleh `published`.

---

# 7. project hero

```ts
interface ProjectHero {
  media?: MediaAsset

  eyebrow?: string

  title?: string

  description?: string

  alignment?: ContentAlignment

  presentation?: HeroPresentation
}
```

### HeroPresentation

```ts
type HeroPresentation =
  | "cinematic"
  | "editorial"
  | "minimal"
  | "immersive"
```

hero presentation adalah semantic configuration.

component tetap menggunakan reusable implementation.

---

# 8. project technology

jangan menyimpan technology sebagai arbitrary display string apabila technology sudah memiliki entity sendiri.

```ts
interface ProjectTechnology {
  technologyId: string
  role?: string
}
```

contoh:

```json
{
  "technologyId": "nextjs",
  "role": "framework"
}
```

---

# 9. content block system

project storytelling menggunakan block based architecture.

```ts
type ContentBlock =
  | TextBlock
  | ImageBlock
  | VideoBlock
  | GalleryBlock
  | QuoteBlock
  | MetricsBlock
  | ProcessBlock
  | TimelineBlock
  | CodeBlock
  | EmbedBlock
  | ComparisonBlock
  | SpacerBlock
```

---

# 10. text block

```ts
interface TextBlock {
  id: string

  type: "text"

  eyebrow?: string
  title?: string
  body: string

  alignment?: ContentAlignment

  width?: ContentWidth
}
```

body dapat menggunakan markdown-compatible or structured rich text representation.

jangan menggunakan arbitrary HTML dari user input.

---

# 11. image block

```ts
interface ImageBlock {
  id: string

  type: "image"

  media: MediaAsset

  size?: MediaSize

  caption?: string

  fullBleed?: boolean
}
```

---

# 12. video block

```ts
interface VideoBlock {
  id: string

  type: "video"

  media: MediaAsset

  autoplay?: boolean
  muted?: boolean
  loop?: boolean

  controls?: boolean

  poster?: MediaAsset

  caption?: string
}
```

default video behavior harus aman untuk performance.

---

# 13. gallery block

```ts
interface GalleryBlock {
  id: string

  type: "gallery"

  items: MediaAsset[]

  layout?: GalleryLayout

  caption?: string
}
```

### GalleryLayout

```ts
type GalleryLayout =
  | "grid"
  | "masonry"
  | "carousel"
  | "stack"
  | "editorial"
```

layout menentukan presentation preference tanpa membuat component khusus untuk project.

---

# 14. quote block

```ts
interface QuoteBlock {
  id: string

  type: "quote"

  quote: string

  author?: string

  role?: string
}
```

---

# 15. metrics block

```ts
interface MetricsBlock {
  id: string

  type: "metrics"

  metrics: Metric[]
}
```

metric:

```ts
interface Metric {
  id: string

  label: string
  value: string

  description?: string
}
```

contoh:

```text
20+
archive categories

3.2s
initial experience

100%
responsive
```

angka tidak boleh dibuat-buat. admin hanya boleh memasukkan data yang memang valid.

---

# 16. process block

```ts
interface ProcessBlock {
  id: string

  type: "process"

  title?: string

  steps: ProcessStep[]
}
```

process step:

```ts
interface ProcessStep {
  id: string

  number?: string

  title: string

  description: string

  media?: MediaAsset
}
```

---

# 17. timeline block

```ts
interface TimelineBlock {
  id: string

  type: "timeline"

  title?: string

  items: TimelineItem[]
}
```

```ts
interface TimelineItem {
  id: string

  date: string

  title: string

  description?: string

  media?: MediaAsset
}
```

---

# 18. code block

```ts
interface CodeBlock {
  id: string

  type: "code"

  language?: string

  code: string

  filename?: string

  description?: string
}
```

code block digunakan hanya apabila benar-benar memperkuat project storytelling.

---

# 19. embed block

```ts
interface EmbedBlock {
  id: string

  type: "embed"

  provider: EmbedProvider

  url: string

  title?: string

  aspectRatio?: string
}
```

```ts
type EmbedProvider =
  | "youtube"
  | "vimeo"
  | "figma"
  | "github"
  | "custom"
```

external embeds harus divalidasi dan dibatasi ke provider yang diperbolehkan.

---

# 20. comparison block

```ts
interface ComparisonBlock {
  id: string

  type: "comparison"

  title?: string

  before?: ComparisonItem

  after?: ComparisonItem
}
```

```ts
interface ComparisonItem {
  label?: string
  description?: string
  media?: MediaAsset
}
```

berguna untuk menunjukkan redesign, before/after, atau evolution sebuah project.

---

# 21. spacer block

```ts
interface SpacerBlock {
  id: string

  type: "spacer"

  size: SpacerSize
}
```

```ts
type SpacerSize =
  | "small"
  | "medium"
  | "large"
```

spacer hanya boleh digunakan sebagai intentional editorial spacing.

jangan digunakan untuk memperbaiki layout yang seharusnya diperbaiki melalui design system.

---

# 22. alignment

```ts
type ContentAlignment =
  | "left"
  | "center"
  | "right"
```

---

# 23. content width

```ts
type ContentWidth =
  | "narrow"
  | "medium"
  | "wide"
  | "full"
```

---

# 24. media size

```ts
type MediaSize =
  | "small"
  | "medium"
  | "large"
  | "full"
```

---

# 25. project links

```ts
interface ProjectLink {
  id: string

  label: string

  url: string

  type: ProjectLinkType

  external?: boolean
}
```

```ts
type ProjectLinkType =
  | "live"
  | "github"
  | "case-study"
  | "demo"
  | "download"
  | "other"
```

---

# 26. credits

```ts
interface Credit {
  id: string

  name: string

  role?: string

  url?: string
}
```

digunakan ketika project melibatkan collaborator.

---

# 27. seo

```ts
interface SEOData {
  title?: string

  description?: string

  ogImage?: MediaAsset

  keywords?: string[]
}
```

page title harus memiliki fallback ke project title.

---

# 28. experiments

collection:

```text
experiments/{experimentId}
```

experiment menggunakan struktur yang mirip dengan project tetapi lebih ringan.

```ts
interface Experiment {
  id: string

  schemaVersion: number

  slug: string

  title: string
  description: string

  category?: string

  year?: number

  featured: boolean
  published: boolean
  archived: boolean

  cover?: MediaAsset

  content?: ContentBlock[]

  technologies?: ProjectTechnology[]

  links?: ProjectLink[]

  order: number

  createdAt: Timestamp
  updatedAt: Timestamp
  publishedAt?: Timestamp
}
```

---

# 29. experiences

collection:

```text
experiences/{experienceId}
```

```ts
interface Experience {
  id: string

  schemaVersion: number

  organization: string

  role: string

  type?: ExperienceType

  location?: string

  startDate: string

  endDate?: string

  current: boolean

  description?: string

  highlights?: string[]

  technologies?: ProjectTechnology[]

  archived: boolean

  order: number

  createdAt: Timestamp
  updatedAt: Timestamp
}
```

```ts
type ExperienceType =
  | "work"
  | "freelance"
  | "internship"
  | "community"
  | "volunteer"
  | "project"
```

---

# 30. skills

collection:

```text
skills/{skillId}
```

```ts
interface Skill {
  id: string

  schemaVersion: number

  name: string

  description?: string

  category?: SkillCategory

  level?: string

  featured: boolean

  archived: boolean

  order: number

  createdAt: Timestamp
  updatedAt: Timestamp
}
```

```ts
type SkillCategory =
  | "development"
  | "design"
  | "product"
  | "creative"
  | "other"
```

level tidak harus berupa numeric score.

hindari representasi seperti:

```text
JavaScript: 95%
```

kecuali memang ada alasan profesional untuk menggunakan angka tersebut.

---

# 31. technologies

collection:

```text
technologies/{technologyId}
```

```ts
interface Technology {
  id: string

  schemaVersion: number

  slug: string

  name: string

  category?: string

  icon?: MediaAsset

  website?: string

  description?: string

  featured: boolean

  archived: boolean

  order: number

  createdAt: Timestamp
  updatedAt: Timestamp
}
```

---

# 32. education

collection:

```text
education/{educationId}
```

```ts
interface Education {
  id: string

  schemaVersion: number

  institution: string

  degree?: string

  field?: string

  startDate?: string

  endDate?: string

  description?: string

  achievements?: string[]

  archived: boolean

  order: number

  createdAt: Timestamp
  updatedAt: Timestamp
}
```

---

# 33. social links

collection:

```text
socialLinks/{socialId}
```

```ts
interface SocialLink {
  id: string

  schemaVersion: number

  platform: SocialPlatform

  label?: string

  url: string

  username?: string

  icon?: MediaAsset

  featured: boolean

  archived: boolean

  order: number

  createdAt: Timestamp
  updatedAt: Timestamp
}
```

```ts
type SocialPlatform =
  | "github"
  | "linkedin"
  | "instagram"
  | "twitter"
  | "tiktok"
  | "youtube"
  | "email"
  | "website"
  | "other"
```

---

# 34. resume

resume adalah site setting atau dedicated content reference.

recommended structure:

```ts
interface ResumeData {
  title: string

  description?: string

  file: MediaAsset

  version?: string

  updatedAt: Timestamp
}
```

resume file berada di Firebase Storage.

Firestore hanya menyimpan metadata dan reference.

---

# 35. site settings

collection:

```text
siteSettings/global
```

```ts
interface SiteSettings {
  siteName: string

  siteTitle?: string

  tagline?: string

  shortBio?: string

  bio?: string

  profileImage?: MediaAsset

  resume?: ResumeData

  email?: string

  location?: string

  availability?: string

  socialLinks?: string[]

  defaultSeo?: SEOData

  updatedAt: Timestamp
}
```

`global` adalah singleton document.

---

# 36. navigation configuration

navigation dapat berada dalam site settings.

```ts
interface NavigationItem {
  id: string

  label: string

  href: string

  visible: boolean

  order: number
}
```

jangan hardcode navigation labels di banyak component.

---

# 37. homepage configuration

homepage configuration dapat disimpan dalam:

```text
siteSettings/global
```

atau dedicated:

```text
siteSettings/home
```

recommended:

```ts
interface HomeSettings {
  hero?: HomeHeroSettings

  selectedProjectsLimit?: number

  showExperiments?: boolean

  showExperience?: boolean

  showSkills?: boolean

  showResume?: boolean

  showContact?: boolean
}
```

---

# 38. home hero

```ts
interface HomeHeroSettings {
  eyebrow?: string

  title: string

  subtitle?: string

  description?: string

  media?: MediaAsset

  primaryCta?: CTA

  secondaryCta?: CTA
}
```

---

# 39. cta

```ts
interface CTA {
  label: string

  href: string

  external?: boolean
}
```

---

# 40. document identity

setiap entity menggunakan:

```ts
id: string
schemaVersion: number
createdAt: Timestamp
updatedAt: Timestamp
```

`schemaVersion` bersifat wajib pada seluruh entity agar migration dapat
dilakukan tanpa menebak bentuk document.

nilai awal:

```ts
schemaVersion: 1
```

entity yang dapat dipublish juga menggunakan:

```ts
published: boolean
archived: boolean
publishedAt?: Timestamp
```

entity yang memiliki ordering menggunakan:

```ts
order: number
```

entity yang memiliki public URL menggunakan:

```ts
slug: string
```

jangan menambahkan field yang tidak memiliki fungsi jelas.

## 40.1 identity contract per entity

| entity | id | schemaVersion | createdAt | updatedAt | published | archived | order | slug |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Project | ya | ya | ya | ya | ya | ya | ya | ya |
| Experiment | ya | ya | ya | ya | ya | ya | ya | ya |
| Experience | ya | ya | ya | ya | tidak | ya | ya | tidak |
| Skill | ya | ya | ya | ya | tidak | ya | ya | tidak |
| Technology | ya | ya | ya | ya | tidak | ya | ya | ya |
| Education | ya | ya | ya | ya | tidak | ya | ya | tidak |
| SocialLink | ya | ya | ya | ya | tidak | ya | ya | tidak |
| MediaAsset | ya | ya | ya | ya | tidak | tidak | tidak | tidak |
| SiteSettings | singleton | ya | tidak | ya | tidak | tidak | tidak | tidak |

entity tanpa `published` selalu dianggap visible apabila
`archived = false`.

entity tersebut merupakan supporting content, bukan standalone page.

---

# 41. slug rules

slug harus:

- lowercase
- URL safe
- predictable
- unique
- immutable secara default

contoh:

```text
gmahk-digital-archive
```

bukan:

```text
GMAHK Digital Archive!!!
```

perubahan slug harus diperlakukan sebagai breaking content change karena dapat memengaruhi SEO dan external links.

---

# 42. document IDs vs slugs

Firestore document ID digunakan sebagai internal identity.

slug digunakan sebagai public identity.

contoh:

```text
document id:
a82f91k2

slug:
gmahk-digital-archive
```

jangan menggunakan title sebagai Firestore document ID.

---

# 43. ordering

semua manually ordered entities harus menggunakan numeric `order`.

contoh:

```text
1
2
3
4
```

sorting dilakukan di data layer.

UI tidak boleh menentukan ordering secara manual.

---

# 44. publication lifecycle

content lifecycle:

```text
draft
↓
preview
↓
published
↓
archived
```

lifecycle direpresentasikan oleh dua boolean independen:

```ts
published: boolean
archived: boolean
```

state resolution:

```text
published = false, archived = false   → draft
published = true,  archived = false   → published
archived  = true                      → archived
```

`archived` selalu mengalahkan `published`.

content yang archived tidak boleh tampil di public walaupun
`published = true`.

## 44.1 public visibility predicate

seluruh public query wajib menggunakan predicate berikut:

```text
published == true
archived  == false
```

predicate ini digunakan secara konsisten pada:

```text
data access layer
Firestore Security Rules
sitemap generation
```

## 44.2 default state

content baru selalu dibuat dengan:

```ts
published: false
archived:  false
```

save tidak boleh otomatis mempublikasikan content.

## 44.3 publishedAt

`publishedAt` diisi pada saat pertama kali content dipublikasikan.

field ini digunakan untuk sorting dan reporting.

`publishedAt` tidak menentukan visibility.

## 44.4 rationale

dua boolean dipilih dibandingkan single enum karena:

- query Firestore terhadap boolean bersifat sederhana dan murah
- tidak memerlukan composite index tambahan yang kompleks
- backward compatible terhadap document yang sudah memiliki `published`
- `archived` dapat ditambahkan tanpa breaking existing content

document lama yang belum memiliki `archived` diperlakukan sebagai
`archived = false` oleh validation layer sesuai section 51.

---

# 45. validation

schema runtime validation wajib digunakan untuk content yang berasal dari Firestore.

contoh pendekatan:

```text
Firestore
↓
raw document
↓
runtime validation
↓
safe typed object
↓
renderer
```

TypeScript type saja tidak cukup untuk memvalidasi data runtime.

---

# 46. required vs optional fields

field wajib hanya boleh ditentukan apabila benar-benar dibutuhkan oleh renderer.

jangan membuat terlalu banyak required fields.

contoh:

project harus memiliki:

```text
id
slug
title
description
featured
published
content
order
createdAt
updatedAt
```

sedangkan:

```text
metrics
gallery
video
credits
process
links
```

bersifat optional.

---

# 47. admin form mapping

schema harus memiliki hubungan satu banding satu dengan admin form.

contoh:

```text
Project
│
├── Basic Information
├── Hero
├── Technologies
├── Story
├── Metrics
├── Links
├── SEO
└── Publishing
```

admin form harus memandu user.

jangan membuat admin interface berupa raw JSON editor untuk kebutuhan sehari-hari.

---

# 48. content editor

project content editor menggunakan block system.

flow:

```text
Add Block
│
├── Text
├── Image
├── Video
├── Gallery
├── Quote
├── Metrics
├── Process
├── Timeline
├── Code
├── Embed
├── Comparison
└── Spacer
```

block dapat:

- add
- delete
- duplicate
- reorder
- edit

tanpa perubahan frontend code.

---

# 49. content ordering

setiap block memiliki:

```ts
id: string
```

posisi block ditentukan oleh array order.

jangan menyimpan position sebagai string jika hanya diperlukan untuk ordering array.

---

# 50. references

reference antar entity harus menggunakan ID.

contoh:

```text
Project
  ↓
technologies[]
  ↓
technologyId
```

jangan menduplikasi seluruh Technology object ke setiap project.

hal ini menjaga consistency.

---

# 51. denormalization

denormalization hanya boleh dilakukan ketika ada alasan performance yang jelas.

jangan menduplikasi data seperti:

```text
technology name
technology icon
technology website
```

ke setiap project jika data tersebut sudah tersedia di `technologies`.

---

# 52. firestore query considerations

field yang kemungkinan sering digunakan untuk query:

```text
published
featured
order
year
category
slug
```

indexing harus dibuat sesuai query aktual.

jangan membuat composite indexes secara berlebihan.

---

# 53. storage naming

storage path harus predictable.

recommended:

```text
projects/{slug}/
experiments/{slug}/
profile/
resume/
```

file naming harus aman dan tidak bergantung pada display title.

---

# 54. storage cleanup

ketika media dihapus dari content:

```text
content reference removed
↓
asset evaluated
↓
asset cleanup
```

jangan langsung menghapus file jika masih direferensikan oleh entity lain.

future implementation dapat menggunakan asset reference tracking.

---

# 55. versioning

content schema harus memiliki kemampuan migration.

ketika schema berubah secara signifikan, pertimbangkan:

```ts
schemaVersion: number
```

misalnya:

```text
schemaVersion: 1
```

jangan melakukan breaking schema change tanpa migration strategy.

---

# 56. schema extensibility

field baru dapat ditambahkan tanpa mengubah existing content.

contoh future:

```text
awards
press
testimonials
collaborators
downloads
```

tidak boleh membuat schema project menjadi flat object dengan ratusan optional fields.

gunakan nested structures atau block types ketika content memang bersifat composable.

---

# 57. anti patterns

dilarang:

### giant project document

jangan membuat satu project document berisi seluruh kemungkinan data dalam bentuk tidak terstruktur.

### arbitrary html

jangan menyimpan raw HTML sebagai primary content format.

### duplicated entities

jangan duplicate technology atau experience data ke banyak project tanpa alasan.

### hardcoded content

production content tidak boleh tersebar di JSX atau TSX.

### project-specific schema

jangan membuat:

```text
GmahkProject
PortfolioProject
ChurchProject
ExperimentProject
```

gunakan generic Project + content blocks.

### numeric skill scoring

hindari rating skill yang memberikan kesan objektivitas palsu.

### uncontrolled external embeds

setiap external provider harus melalui allowlist.

---

# 58. example project

contoh conceptual document:

```json
{
  "id": "project_001",
  "slug": "gmahk-digital-archive",
  "title": "GMAHK Digital Archive",
  "subtitle": "A digital archive for meaningful church moments.",
  "description": "A system for organizing documentation and worship files by Sabbath date and quarter.",
  "category": "web application",
  "year": 2026,
  "status": "completed",
  "featured": true,
  "published": true,
  "role": "designer and developer",
  "technologies": [
    {
      "technologyId": "nextjs",
      "role": "framework"
    },
    {
      "technologyId": "firebase",
      "role": "backend"
    }
  ],
  "content": [
    {
      "id": "block_001",
      "type": "text",
      "title": "the problem",
      "body": "..."
    },
    {
      "id": "block_002",
      "type": "image",
      "media": {}
    },
    {
      "id": "block_003",
      "type": "process",
      "steps": []
    },
    {
      "id": "block_004",
      "type": "metrics",
      "metrics": []
    }
  ],
  "links": [
    {
      "id": "link_001",
      "label": "view live project",
      "url": "https://example.com",
      "type": "live"
    }
  ],
  "order": 1
}
```

---

# 59. admin to website flow

final content flow:

```text
admin
  ↓
create project
  ↓
fill structured fields
  ↓
upload media
  ↓
build story with blocks
  ↓
save draft
  ↓
preview
  ↓
publish
  ↓
Firestore
  ↓
data layer
  ↓
ProjectRenderer
  ↓
/projects/[slug]
```

---

# 60. final schema principle

schema harus memungkinkan:

```text
project 01
text
image
process
metrics
video
gallery

project 02
hero
video
quote
gallery

project 03
text
comparison
code
image
timeline

project 04
image
image
image
```

semuanya harus dapat dirender oleh architecture yang sama.

tidak boleh ada kebutuhan untuk membuat page baru hanya karena storytelling project berbeda.

---

# 61. ultimate goal

menambahkan project baru harus terasa seperti menambahkan sebuah record ke sebuah platform.

bukan seperti melakukan development task.

ideal experience:

```text
admin
→ add project
→ write
→ upload
→ arrange
→ preview
→ publish
```

dan website secara otomatis:

```text
generate route
generate metadata
generate project card
generate project detail
generate navigation reference
update sitemap
update selected work
```

tanpa perubahan manual pada source code.