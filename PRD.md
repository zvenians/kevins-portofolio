# PRD.md

# personal digital experience

```text
https://simatupangkevin.web.app
```

> Dokumen ini adalah transkripsi markdown dari `PRD.pdf`.
>
> File PDF original diarsipkan di `docs/archive/PRD-original.pdf`.
>
> `PRD.md` adalah source of truth. Apabila terdapat perbedaan antara `PRD.md`
> dan file PDF arsip, `PRD.md` yang berlaku.

---

## 1. summary

membangun sebuah website personal yang tidak terasa seperti portfolio developer konvensional, tetapi menjadi digital experience yang menunjukkan:

- siapa saya
- bagaimana saya berpikir
- apa yang saya bangun
- bagaimana saya bekerja
- apa yang saya pelajari
- apa yang sedang saya eksplorasi
- bagaimana kualitas dan karakter pekerjaan saya

website harus menggabungkan professional presentation dengan immersive, cinematic, editorial, dan creative interaction.

website bukan sekadar tempat menampilkan CV.

CV hanya menjadi salah satu bagian dari keseluruhan experience.

---

## 2. technical skills

```text
Next.js
React
TypeScript
modern CSS / Tailwind
Firebase
Firestore
Firebase Storage
Firebase Hosting
content-driven architecture
```

---

## 3. product overview

```text
Product name
personal digital experience

Official website
https://simatupangkevin.web.app

Product type
interactive personal portfolio and professional identity platform

Primary objective
membangun sebuah website personal yang tidak terasa seperti portfolio
developer konvensional, tetapi menjadi digital experience.
```

---

## 4. platform and infrastructure

```text
Primary platform
Firebase

Primary hosting
Firebase Hosting

Primary domain
simatupangkevin.web.app
```

backend ecosystem:

- Firebase Hosting
- Firestore
- Firebase Storage
- Firebase Authentication (bila diperlukan)
- Firebase Analytics (bila diperlukan)

---

## 5. product philosophy

```text
experience first
content driven
scalable
premium
creative
professional
mobile first
```

---

## 6. target audience

### primary audience

recruiters, hiring managers, potential clients, collaborators, developers, designers, people interested in the creator's work.

### secondary audience

friends, community, other creators, technical audience.

---

## 7. core user goals

- memahami siapa pemilik website dalam beberapa detik
- melihat project terbaik
- memahami kontribusi dan proses
- melihat teknologi dan kemampuan
- mengetahui pengalaman dan background
- melihat CV
- menemukan contact channels
- menjelajahi eksperimen
- membuka detail project tanpa merasa berpindah website

---

## 8. content architecture

entity utama:

```text
projects
experiments
experiences
skills
technologies
education
social links
site settings
resume
media assets
```

project harus memiliki data sendiri dan frontend menghasilkan interface dari data.

---

## 9. dynamic project system

satu generic project renderer dengan route:

```text
/projects/[slug]
```

project baru hanya perlu ditambahkan ke content source tanpa:

```text
new route
new page
new component
new layout
manual navigation code
```

---

## 10. firebase content model

Firestore collections:

```text
projects
experiments
experiences
skills
technologies
education
socialLinks
siteSettings
```

media besar disimpan di Firebase Storage:

```text
projects/
experiments/
profile/
resume/
```

---

## 11. homepage requirements

```text
hero
selected projects (featured = true)
capabilities
experiments
experience
resume (view & download)
contact
```

---

## 12. performance and accessibility

### performance

- fast initial load
- responsive images
- lazy loading
- progressive enhancement
- minimized javascript
- no layout shift
- optimal Firebase reads
- caching

### accessibility

- semantic HTML
- keyboard navigation
- focus states
- readable contrast
- accessible labels
- reduced motion support
- meaningful alt text
- proper heading hierarchy

---

## 13. seo and analytics

per-project metadata:

```text
title
description
open graph image
canonical URL
```

project detail harus indexable.

analytics events considered:

```text
project opened
project link clicked
resume viewed
resume downloaded
contact clicked
external link clicked
```

---

## 14. deployment

production menggunakan Firebase Hosting dengan domain:

```text
simatupangkevin.web.app
```

workflow:

```text
local development
↓
build
↓
verification
↓
firebase deployment
↓
production
```

environment variables dan Firebase configuration dipisahkan per environment.

---

## 15. non functional requirements

```text
maintainable
scalable
reusable
accessible
performant
SEO friendly
mobile first
visually consistent
resilient terhadap content changes
efficient dalam penggunaan Firebase
mudah dikembangkan lintas fitur
```

---

## 16. anti requirements

tidak boleh:

- terasa seperti template portfolio generik
- terlalu banyak section tanpa tujuan
- animation dekoratif berlebihan
- glassmorphism berlebihan
- CV sebagai main attraction
- hardcode content di banyak component
- berlebihan Firebase reads
- media besar di Firestore
- mengorbankan performance demi visual

---

## 17. success criteria

```text
professional
memorable
immersive
scalable
content manageable
maintainable
practical
reliable
```

---

## 18. future extensibility

```text
writing/journal
blog
changelog
project statistics
interactive demos
guestbook
now page
digital garden
awards
certifications
downloadable assets
multilingual content
admin dashboard
search
project filtering
project categories
timeline
easter eggs
```

---

## 19. core product principle

> content changes must not require presentation code changes.
