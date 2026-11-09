import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const read=(path:string)=>readFileSync(resolve(process.cwd(),path),'utf8');
describe('student-facing data workspaces',()=>{
 it('keeps a five-step workflow and guided controls visible in live application mode',()=>{const css=read('vercel-site/public/atelier/workbench.css'),script=read('vercel-site/public/atelier/workbench.js');expect(css).not.toMatch(/\.atelier-workbench \.session-guide\s*\{display:none/);expect(css).toContain('.student-path');expect(script).toContain("['operations','researchtools','dataprep','documents']");expect(script).toContain("support.href='/academic-support'");expect(script).toContain('Export or ask for help');});
 it('retains real workbook and research behavior',()=>{const lab=read('apps-script/source/Lab.js'),research=read('apps-script/source/OperationsResearch.js');expect(lab).toContain("X.writeFile(wb,'Living-Index-Reconciliation-Demo.xlsx')");expect(lab).toContain('parseNumber(raw,cleanupLocale)');expect(lab).toContain('class="data-grid"');expect(research).toContain('procurementScores()');expect(research).toContain('function researchToolkitPanel(');expect(research).toContain('Statistical workflow');});
 it('shows transparent preparation and document validation before export',()=>{const source=read('apps-script/source/NextWave.js');expect(source).toContain('Duplicate IDs');expect(source).toContain('Raw rows remain unchanged');expect(source).toContain('PREVIEW STATUS');expect(source).toContain("$('#document-pdf').disabled=!valid");});
 it('uses the verified current company and period',()=>{for(const source of [read('apps-script/source/Client.js'),read('apps-script/source/Journey.js'),read('vercel-site/public/atelier/index.js')])expect(source).toContain('PT Wulandari Bangun Laksana Tbk');expect(read('vercel-site/public/atelier/words.js')).toContain('February 2026 - present|Februari 2026 - sekarang');});
});
