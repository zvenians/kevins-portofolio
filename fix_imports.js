const fs = require("fs");
function replaceInFile(f, a, b) {
  let c = fs.readFileSync(f, "utf8");
  fs.writeFileSync(f, c.replace(a, b));
}

replaceInFile("src/lib/firestore/settings.ts", "from \"../firebase/admin\"", "from \"../firebase/adminDb\"");
replaceInFile("src/lib/firestore/projects.ts", "from \"../firebase/admin\"", "from \"../firebase/adminDb\"");
replaceInFile("src/lib/firestore/messages.ts", "from \"../firebase/admin\"", "from \"../firebase/adminDb\"");
replaceInFile("src/lib/firestore/media.ts", "from \"../firebase/admin\"", "from \"../firebase/adminDb\"");
replaceInFile("src/lib/firestore/home.ts", "from \"../firebase/admin\"", "from \"../firebase/adminDb\"");

replaceInFile("src/app/actions.ts", "from \"@/lib/firebase/admin\"", "from \"@/lib/firebase/adminDb\"");
replaceInFile("src/app/admin/actions.ts", "from \"@/lib/firebase/admin\"", "from \"@/lib/firebase/adminDb\"");
replaceInFile("src/app/admin/(protected)/projects/[id]/page.tsx", "from \"@/lib/firebase/admin\"", "from \"@/lib/firebase/adminDb\"");
replaceInFile("src/app/admin/(protected)/projects/page.tsx", "from \"@/lib/firebase/admin\"", "from \"@/lib/firebase/adminDb\"");

replaceInFile("src/lib/auth/serverAuth.ts", "from \"@/lib/firebase/admin\"", "from \"@/lib/firebase/adminAuth\"");

