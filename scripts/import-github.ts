import fs from "fs";
import { execSync } from "child_process";
import { adminDb } from "../src/lib/firebase/adminDb";
import { type Project, type ContentBlock, ProjectSchema } from "../src/types/schema";
import crypto from "crypto";

async function run() {
  console.log("Fetching GitHub repositories...");
  const output = execSync("gh repo list --limit 100 --json name,description,isFork,isArchived,pushedAt,url,homepageUrl,languages,primaryLanguage,isEmpty,createdAt,updatedAt,owner", { encoding: "utf8" });
  const repos = JSON.parse(output);
  
  let totalImported = 0;
  let totalSkipped = 0;
  let totalAlreadyExisting = 0;

  const results: Record<string, unknown>[] = [];

  for (const repo of repos) {
    console.log(`\nEvaluating ${repo.name}...`);
    
    // Filtering logic
    if (repo.isFork || repo.isArchived || repo.isEmpty) {
      console.log(`Skipping ${repo.name} (Fork/Archived/Empty)`);
      totalSkipped++;
      results.push({ repo: repo.name, status: "SKIPPED", reason: "Fork/Archived/Empty" });
      continue;
    }
    if (repo.name === "zvenians" || repo.name === repo.owner.login) {
      console.log(`Skipping ${repo.name} (Profile Repo)`);
      totalSkipped++;
      results.push({ repo: repo.name, status: "SKIPPED", reason: "Profile config repo" });
      continue;
    }
    if (repo.name === "galilea" && !repo.primaryLanguage) {
      console.log(`Skipping ${repo.name} (Historical/Empty languages)`);
      totalSkipped++;
      results.push({ repo: repo.name, status: "SKIPPED", reason: "Empty/Historical" });
      continue;
    }

    // Try fetching README
    let readme = "";
    try {
      const readmeOut = execSync(`gh api repos/${repo.owner.login}/${repo.name}/readme`, { encoding: "utf8" });
      const readmeJson = JSON.parse(readmeOut);
      if (readmeJson.content) {
        readme = Buffer.from(readmeJson.content, "base64").toString("utf8");
      }
    } catch {
      console.log(`No README found for ${repo.name}`);
    }

    const slug = repo.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    
    // Check duplicate
    const existing = await adminDb.collection("projects").where("slug", "==", slug).get();
    if (!existing.empty) {
      console.log(`Skipping ${repo.name} (Already exists with slug ${slug})`);
      totalAlreadyExisting++;
      results.push({ repo: repo.name, status: "ALREADY EXISTING", slug });
      continue;
    }

    const title = repo.name.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    
    const content: ContentBlock[] = [];
    
    let linkText = `**Repository:** [${repo.url}](${repo.url})\n`;
    if (repo.homepageUrl) {
      linkText += `**Live Demo:** [${repo.homepageUrl}](${repo.homepageUrl})\n`;
    }
    content.push({
      id: crypto.randomUUID(),
      type: "text",
      body: linkText
    } as ContentBlock);

    if (readme) {
      content.push({
        id: crypto.randomUUID(),
        type: "text",
        body: readme
      } as ContentBlock);
    }
    
    // Technologies
    let tech: { technologyId: string; role: string }[] = [];
    if (repo.languages && repo.languages.length > 0) {
      tech = repo.languages.map((l: { node: { name: string } }) => ({ technologyId: l.node.name, role: "Used" }));
    } else if (repo.primaryLanguage) {
      tech.push({ technologyId: repo.primaryLanguage.name, role: "Primary" });
    }

    const project: Project = {
      id: crypto.randomUUID(),
      schemaVersion: 1,
      title,
      slug,
      description: repo.description || "A project by Kevin Simatupang",
      published: false,
      archived: false,
      featured: false,
      order: 100,
      technologies: tech,
      content,
      createdAt: new Date(repo.createdAt || Date.now()),
      updatedAt: new Date(repo.updatedAt || Date.now())
    };

    try {
      // strict validate before inserting just to be sure
      ProjectSchema.parse(project);
      
      await adminDb.collection("projects").doc(project.id).set(project);
      console.log(`Imported ${repo.name} -> ${slug}`);
      totalImported++;
      results.push({ 
        repo: repo.name, 
        status: "IMPORTED", 
        title, 
        slug, 
        tech: tech.map((t) => t.technologyId).join(", "),
        liveUrl: repo.homepageUrl,
        repoUrl: repo.url
      });
    } catch (err) {
      console.error(`Failed to insert ${repo.name}`, err);
    }
  }

  console.log("\n=== IMPORT SUMMARY ===");
  console.log(`TOTAL REPOSITORIES: ${repos.length}`);
  console.log(`TOTAL PROJECTS IMPORTED: ${totalImported}`);
  console.log(`TOTAL SKIPPED: ${totalSkipped}`);
  console.log(`TOTAL ALREADY EXISTING: ${totalAlreadyExisting}`);
  
  console.log("\n--- Project Details ---");
  results.forEach(r => {
    console.log(`- Repo: ${r.repo} | Status: ${r.status}`);
    if (r.status === "IMPORTED") {
      console.log(`  Title: ${r.title} | Slug: ${r.slug} | Tech: ${r.tech}`);
      console.log(`  Live URL: ${r.liveUrl || "-"} | Repo URL: ${r.repoUrl}`);
    } else if (r.status === "SKIPPED") {
      console.log(`  Reason: ${r.reason}`);
    } else if (r.status === "ALREADY EXISTING") {
      console.log(`  Slug: ${r.slug}`);
    }
  });
}

const sa = fs.readFileSync("sa-key.json", "utf8");
process.env.FIREBASE_SERVICE_ACCOUNT_KEY = sa;
run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });

