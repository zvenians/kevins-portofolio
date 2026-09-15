# design.md

## 1. design objective

website harus terasa seperti sebuah **personal digital experience**, bukan template portfolio.

arah visual:

```text
premium
+
editorial
+
cinematic
+
experimental
+
personal
```

inspirasi utama:

- product presentation ala Apple
- editorial websites
- digital art
- cinematic interfaces
- modern creative portfolios

tetapi website tidak boleh menjadi clone Apple atau meniru visual identity brand lain.

---

# 2. primary design principle

## 2.1 clarity before decoration

setiap visual element harus memiliki alasan.

sebelum menambahkan:

- animation
- gradient
- blur
- glow
- particle
- 3D
- parallax

harus ada pertanyaan:

> apakah ini membantu user memahami, merasakan, atau menjelajahi sesuatu?

jika tidak, jangan digunakan.

---

# 3. visual personality

website harus memiliki personality yang:

### sophisticated

tidak terlihat childish atau terlalu playful.

### confident

layout memiliki keberanian menggunakan typography besar dan whitespace.

### creative

ada experimental moments.

### calm

tidak seluruh layar bergerak sekaligus.

### technical

detail tertentu boleh menunjukkan sisi engineering.

### human

website tetap terasa seperti milik seseorang, bukan perusahaan.

---

# 4. anti generic rule

hindari visual pattern portfolio AI-generated yang terlalu umum.

jangan menggunakan kombinasi berikut hanya karena sedang populer:

- excessive glassmorphism
- floating gradient blobs
- purple-blue AI gradients
- excessive rounded cards
- infinite glowing borders
- generic 3D spheres
- random particles
- giant tech icon grids
- generic SaaS dashboard sections
- stock developer illustrations

creative harus berasal dari **composition, typography, content, photography, motion, dan interaction**, bukan sekadar effect.

---

# 5. color system

default direction:

dark dominant interface.

warna tidak boleh terlalu ramai.

gunakan semantic color tokens:

```text id="cbxtj5"
--color-background
--color-surface
--color-surface-elevated
--color-text-primary
--color-text-secondary
--color-text-muted
--color-border
--color-accent
--color-accent-soft
--color-danger
--color-success
```

exact color values ditentukan ketika visual implementation dimulai.

accent color harus memiliki karakter personal dan dapat berkembang menjadi visual identity website.

jangan menggunakan lebih dari beberapa warna utama tanpa alasan.

---

# 6. dark and light modes

initial design boleh memiliki dark-first experience.

light mode tidak boleh dibuat hanya dengan membalik warna.

jika light mode diimplementasikan, masing-masing mode harus mempertahankan:

- contrast
- hierarchy
- mood
- visual identity

dark mode adalah primary experience kecuali product direction berubah.

---

# 7. typography

typography adalah salah satu elemen terpenting.

website harus memiliki maksimal beberapa type families.

recommended structure:

```text id="8m1cvu"
display
↓
large editorial headlines

body
↓
reading and supporting information

mono
↓
technical metadata
```

monospace hanya digunakan untuk technical context, metadata, labels, numbers, atau interface detail.

jangan membuat seluruh website monospace.

---

# 8. typography hierarchy

contoh conceptual hierarchy:

```text id="a2z7c4"
display-xl
display-lg
display-md

heading-xl
heading-lg
heading-md
heading-sm

body-lg
body-md
body-sm

label
caption
mono
```

typography harus responsive.

jangan menetapkan font-size desktop kemudian sekadar mengecilkannya dengan satu media query.

---

# 9. typography character

headline dapat menggunakan:

- oversized type
- tight tracking
- intentional line breaks
- variable weight
- controlled italics
- mixed scale

contoh conceptual:

```text id="1lwjjg"
I BUILD

things
people
remember.
```

break line harus intentional.

jangan bergantung sepenuhnya pada browser wrapping untuk headline utama.

---

# 10. layout philosophy

layout menggunakan kombinasi:

- editorial grid
- asymmetric composition
- full bleed media
- contained text
- overlapping elements
- controlled whitespace
- occasional horizontal composition

tidak semua section harus mengikuti grid yang sama.

namun spacing dan alignment tetap menggunakan design tokens.

---

# 11. grid system

desktop dapat menggunakan grid seperti:

```text id="9pz8gp"
12 columns
```

tablet:

```text id="dfyupx"
8 columns
```

mobile:

```text id="f5qxx8"
4 columns
```

exact implementation dapat berubah.

yang penting component harus menggunakan shared grid system, bukan arbitrary pixel placement di setiap section.

---

# 12. spacing system

gunakan spacing tokens.

conceptual:

```text id="7j3q6v"
space-1
space-2
space-3
space-4
space-5
space-6
space-7
space-8
```

section spacing harus memiliki rhythm.

jangan setiap section memiliki margin arbitrary.

---

# 13. container system

gunakan beberapa level container:

```text id="eezqdt"
narrow
medium
wide
full
```

content reading width harus dibatasi.

paragraph panjang tidak boleh memenuhi seluruh viewport.

---

# 14. homepage visual journey

homepage bukan sekadar kumpulan section.

homepage harus memiliki pacing.

conceptual sequence:

```text id="w54ew7"
quiet
↓
identity
↓
tension
↓
reveal
↓
exploration
↓
depth
↓
reflection
↓
resolution
```

tujuan setiap section harus berbeda secara emotional.

---

# 15. hero experience

hero harus menjadi strongest visual moment pertama.

bukan sekadar:

```text
hello i'm kevin
frontend developer
```

hero harus memperkenalkan identity.

possible composition:

```text id="s5n4eg"
small label

large statement

supporting sentence

visual / artwork / project fragment

scroll invitation
```

hero tidak wajib menampilkan portrait.

personal identity dapat ditunjukkan melalui typography, motion, work, atau visual object.

---

# 16. hero motion

motion hero harus subtle namun meaningful.

possible behavior:

```text id="6bkrtg"
initial load
↓
text reveal
↓
secondary elements enter
↓
visual establishes depth
↓
scroll begins experience
```

hindari cinematic intro yang terlalu panjang sebelum user dapat berinteraksi dengan website.

---

# 17. navigation

navigation harus minimal.

desktop dapat memiliki:

- identity/logo
- work
- about
- experiments
- resume
- contact

mobile menggunakan compact navigation.

navigation dapat berubah saat scrolling:

```text id="h3pl3o"
top
↓
transparent

scroll
↓
compact

deep scroll
↓
contextual
```

perubahan harus smooth dan tidak mengganggu.

---

# 18. navigation interaction

mobile navigation dapat menggunakan overlay/fullscreen menu.

menu harus:

- accessible
- keyboard reachable
- closeable dengan escape
- preserve scroll context
- avoid layout shift

---

# 19. project showcase

project cards bukan card grid standar.

gunakan beberapa composition pattern.

contoh:

### editorial

large image
small metadata
large title

### immersive

full viewport media
overlay metadata

### asymmetric

large feature project
small secondary project

### horizontal

horizontal storytelling ketika relevan

pattern tidak boleh digunakan secara acak.

---

# 20. featured project strategy

selected work harus terasa seperti curated exhibition.

bukan:

```text
6 identical cards
6 identical buttons
```

setiap featured project dapat memiliki presentation variation.

namun variation tetap berasal dari finite reusable patterns.

---

# 21. project transition

ketika user membuka project:

```text id="vn7i4g"
project preview
↓
transition
↓
project detail
```

transition dapat menggunakan shared element atau visual continuity.

tujuannya membuat navigation terasa seperti satu continuous experience.

---

# 22. project detail experience

project detail harus lebih dekat ke case study editorial daripada technical documentation.

struktur visual dapat:

```text id="kl7jqp"
hero
↓
context
↓
problem
↓
exploration
↓
process
↓
build
↓
result
↓
reflection
↓
next project
```

tidak semua project membutuhkan seluruh sequence.

renderer harus menyesuaikan content yang tersedia.

---

# 23. full bleed moments

gunakan full viewport media secara selektif.

full bleed sangat cocok untuk:

- hero image
- project reveal
- major transition
- final result

jangan membuat seluruh page full bleed karena akan menghilangkan hierarchy.

---

# 24. image treatment

image dapat menggunakan:

- edge to edge
- controlled crop
- rounded corners ketika sesuai
- editorial framing
- asymmetric placement
- subtle depth

image harus menjadi content, bukan decoration.

---

# 25. video treatment

video dapat digunakan untuk menunjukkan:

- interaction
- motion design
- application behavior
- visual result
- prototype

autoplay hanya untuk muted, lightweight, purposeful media.

---

# 26. scroll storytelling

scroll adalah primary interaction.

possible patterns:

### reveal

content muncul ketika memasuki viewport.

### sticky storytelling

visual tetap sementara text berubah.

### scale

visual atau typography berubah scale berdasarkan scroll.

### horizontal sequence

section tertentu bergerak horizontally.

### transformation

satu visual berubah menjadi visual berikutnya.

gunakan hanya saat pattern memperjelas narrative.

---

# 27. scroll behavior

default scrolling harus tetap native dan accessible.

jangan mengunci page scroll tanpa alasan.

hindari scroll hijacking.

horizontal sections tidak boleh membuat user kehilangan sense of vertical progress.

---

# 28. motion principles

motion harus mengikuti:

```text id="p7s5gv"
intentional
responsive
subtle
continuous
interruptible
accessible
```

animation bukan decoration layer terpisah dari UX.

---

# 29. motion hierarchy

### level 1

micro interaction:

- hover
- focus
- button feedback
- icon movement

### level 2

content motion:

- reveal
- fade
- translate
- scale

### level 3

story motion:

- sticky sequence
- transformation
- page transitions
- scroll-linked movement

### level 4

hero / experimental motion:

- advanced canvas
- shader
- WebGL
- advanced 3D

level 4 harus sangat selektif.

---

# 30. easing

gunakan consistent easing tokens.

jangan setiap component memiliki custom cubic-bezier.

conceptual:

```text id="3uypv0"
ease-standard
ease-emphasized
ease-enter
ease-exit
```

---

# 31. motion duration

durasi harus disesuaikan terhadap interaction.

contoh conceptual:

```text id="x4kwlw"
micro
100ms to 200ms

standard
200ms to 450ms

large transition
450ms to 900ms
```

angka actual harus diuji melalui prototype.

---

# 32. reduced motion

ketika user mengaktifkan reduced motion:

- remove non-essential movement
- reduce parallax
- reduce large scale changes
- simplify transitions
- preserve content ordering
- preserve functionality

website tetap harus terasa intentional tanpa animation.

---

# 33. hover behavior

hover harus bersifat progressive enhancement.

mobile tidak memiliki hover dependency.

contoh:

desktop:

```text
project card
→ image shifts
→ metadata responds
```

mobile:

```text
tap
→ project opens
```

---

# 34. cursor interaction

custom cursor diperbolehkan tetapi bukan requirement.

jika digunakan:

- tidak boleh mengganggu native cursor functionality
- tidak boleh mengurangi accessibility
- tidak boleh menjadi primary interaction
- harus dimatikan pada touch devices
- harus memiliki performance budget

---

# 35. 3D and WebGL

3D/WebGL boleh digunakan sebagai highlight.

gunakan ketika:

- memperkuat brand
- menjelaskan visual concept
- menciptakan memorable moment

jangan menggunakan WebGL hanya untuk menunjukkan kemampuan teknis.

fallback harus tersedia.

---

# 36. creative easter eggs

website dapat memiliki hidden interactions.

contoh:

- keyboard shortcuts
- subtle hover discoveries
- hidden visual transformation
- interactive object
- unexpected detail

easter egg harus:

- tidak mengganggu core navigation
- tidak menghilangkan accessibility
- tidak merusak mobile experience
- tidak menghambat content discovery

---

# 37. capabilities section

skills jangan ditampilkan sebagai:

```text
html ████████
css ███████
javascript ████████
```

gunakan conceptual categories:

```text id="bsip3n"
build
design
experiment
ship
```

kemampuan harus dijelaskan melalui evidence dari project.

---

# 38. technology presentation

technology bukan fokus utama.

technology dapat muncul sebagai supporting evidence.

contoh:

```text
next.js
firebase
typescript
react
```

gunakan metadata atau contextual display.

jangan membuat technology logo wall sebagai primary hero section.

---

# 39. experience section

experience dapat menggunakan timeline.

timeline harus terasa editorial.

contoh:

```text id="gb4h4c"
2023
beginning

2024
building

2025
expanding

2026
shipping
```

visual progression lebih penting daripada sekadar tabel pekerjaan.

---

# 40. resume presentation

resume adalah secondary utility.

UI:

```text id="zxt0aq"
view resume
download resume
```

resume page harus clean dan readable.

jangan membuat resume experience terlalu experimental sampai difficult to scan.

---

# 41. contact experience

closing experience harus terasa seperti resolution.

conceptual:

```text id="pu6vwm"
have something worth building?

let's make it real.
```

contact methods:

- email
- github
- linkedin
- other relevant platforms

---

# 42. footer

footer minimal.

dapat berisi:

- name
- copyright
- social links
- current year
- selected navigation

tidak perlu mengulang seluruh homepage navigation.

---

# 43. mobile design philosophy

mobile bukan fallback.

mobile memiliki:

- composition khusus
- typography scale
- spacing scale
- interaction model
- navigation model
- media behavior

desktop-only effects harus memiliki mobile equivalent atau dihilangkan.

---

# 44. mobile typography

headline harus tetap impactful tanpa menyebabkan:

- horizontal overflow
- awkward wrapping
- excessive height
- unreadable text

gunakan fluid typography bila sesuai.

---

# 45. mobile media

default behavior:

- width: full available container
- responsive aspect ratio
- lazy loading
- optimized resolution

video dan heavy assets harus sangat diperhatikan pada mobile networks.

---

# 46. touch interaction

semua interactive element harus memiliki touch target yang memadai.

jangan membuat interaction yang hanya dapat dipahami melalui mouse hover.

---

# 47. accessibility

minimum:

- semantic HTML
- keyboard navigation
- visible focus
- meaningful alt text
- sufficient contrast
- reduced motion
- readable type
- accessible buttons and links

interaction yang visually impressive tetapi inaccessible dianggap gagal.

---

# 48. loading states

loading state harus dirancang sebagai bagian dari visual system.

hindari spinner generic sebanyak mungkin.

gunakan:

- skeleton
- progressive reveal
- intentional placeholders
- blurred preview
- dominant color placeholder

sesuai konteks.

---

# 49. error states

404 dan error states harus tetap mengikuti visual identity.

404 dapat menjadi creative moment.

namun user tetap harus menemukan jalan kembali.

---

# 50. empty states

content kosong tidak boleh menghasilkan:

```text
undefined
null
empty card
```

gunakan graceful fallback.

misalnya:

```text
no experiments yet.
```

atau hide section jika memang tidak relevan.

---

# 51. component design philosophy

component harus:

- reusable
- composable
- predictable
- responsive
- accessible

jangan membuat component berdasarkan satu screenshot tertentu jika behavior tersebut sebenarnya reusable.

---

# 52. design tokens

semua visual consistency harus berasal dari tokens.

minimum categories:

```text id="t4l9ft"
colors
typography
spacing
radius
shadows
motion
breakpoints
z-index
container widths
```

---

# 53. border radius

radius harus restrained.

jangan semua element menjadi rounded card.

gunakan radius berdasarkan hierarchy:

```text id="utxp76"
none
small
medium
large
pill
```

pill hanya untuk metadata, tag, atau compact controls jika relevan.

---

# 54. shadows and depth

depth harus subtle.

hindari massive soft shadows pada seluruh component.

depth dapat dibangun menggunakan:

- contrast
- scale
- layering
- spacing
- opacity
- subtle shadow

---

# 55. texture

subtle texture dapat digunakan untuk menambah physicality.

possible:

- noise
- grain
- paper texture
- subtle distortion

texture harus lightweight.

jangan mengorbankan readability.

---

# 56. visual rhythm

website harus memiliki rhythm antara:

```text id="py4ap1"
dense
↓
open
↓
dense
↓
immersive
↓
quiet
```

jangan membuat semua section memiliki intensitas visual yang sama.

---

# 57. image and content hierarchy

setiap viewport harus memiliki clear primary focus.

user harus dapat menjawab:

> what am i supposed to look at right now?

dalam beberapa detik.

---

# 58. interaction hierarchy

not every element should be interactive.

primary interaction:

- navigation
- project exploration
- important CTA

secondary:

- media exploration
- contextual hover

tertiary:

- easter eggs

jangan membuat seluruh layar clickable.

---

# 59. sound

sound secara default disabled.

audio boleh digunakan hanya jika user secara eksplisit mengaktifkannya.

jangan autoplay sound.

---

# 60. accessibility and creative balance

creative implementation harus selalu memiliki fallback.

contoh:

```text id="0fm5y0"
WebGL
↓
fallback image

motion
↓
static composition

hover interaction
↓
tap interaction

animated transition
↓
instant navigation
```

---

# 61. responsive breakpoints

actual breakpoints harus mengikuti content behavior, bukan device names.

conceptual:

```text id="7y00hz"
mobile
tablet
desktop
wide
```

jangan menulis CSS khusus berdasarkan merek device.

---

# 62. browser support

prioritas:

- latest Chrome
- latest Safari
- latest Edge
- modern Firefox
- iOS Safari
- Android Chrome

progressive degradation harus dipertimbangkan untuk older browsers.

---

# 63. performance budget

visual effect memiliki cost.

setiap implementation harus mempertimbangkan:

- bundle size
- animation cost
- image size
- video size
- memory usage
- hydration cost
- Firebase reads

no visual effect is free.

---

# 64. design QA

setiap major UI harus diuji pada:

```text id="u8phjp"
small mobile
large mobile
tablet
desktop
large desktop
```

minimal:

- no horizontal overflow
- no clipped text
- no broken interaction
- no unexpected layout shift
- readable typography
- correct media crop
- acceptable animation behavior

---

# 65. visual quality bar

a feature dianggap selesai hanya jika:

### hierarchy

clear.

### spacing

intentional.

### typography

consistent.

### animation

purposeful.

### responsiveness

stable.

### accessibility

usable.

### performance

acceptable.

### personality

recognizably belongs to this website.

---

# 66. design anti patterns

dilarang:

- generic portfolio grids
- excessive cards
- unnecessary glassmorphism
- random gradients
- animation everywhere
- scroll hijacking
- giant decorative objects without purpose
- desktop-only interaction
- hover-only functionality
- unreadable experimental typography
- overusing rounded corners
- overusing shadows
- excessive page transitions
- slow cinematic intro
- autoplay sound

---

# 67. final design direction

website harus terasa seperti:

```text
a digital exhibition
```

bukan:

```text
a resume website
```

pengunjung harus dapat:

```text
discover
↓
explore
↓
understand
↓
remember
```

tanpa kehilangan kemampuan untuk:

```text
find
↓
scan
↓
contact
↓
hire
```

---

# 68. ultimate design rule

> make it memorable, but never make it difficult.

creative experience boleh mengejutkan user.

tetapi:

- navigation harus jelas
- content harus readable
- project harus discoverable
- resume harus accessible
- contact harus obvious
- mobile harus excellent

experience adalah prioritas.

clarity tetap menjadi fondasi.