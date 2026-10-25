// Decision tools use fictional records and calculate entirely in the browser.
const procurementVendors=[
  {name:'Borneo Supply',price:184500000,lead:18,warranty:24,compliance:96,tax:true},
  {name:'Nusantara Teknik',price:176800000,lead:28,warranty:18,compliance:91,tax:true},
  {name:'Karya Prima',price:191200000,lead:14,warranty:36,compliance:98,tax:true},
  {name:'Samarinda Industrial',price:169900000,lead:35,warranty:12,compliance:82,tax:false}
];
let procurementWeights={price:40,lead:20,warranty:15,compliance:25};

function appendOperationsLab(){
  const tabs=$('#lab .lab-tabs');
  if(!tabs||tabs.querySelector('[data-lab="6"]'))return;
  const button=document.createElement('button');
  button.dataset.lab='6';
  button.setAttribute('aria-pressed',state.lab===6?'true':'false');
  button.innerHTML='<span>07</span>Vendor scoring';
  button.onclick=()=>{state.lab=6;$$('[data-lab]').forEach(x=>x.setAttribute('aria-pressed',x===button?'true':'false'));remember();procurement();};
  tabs.appendChild(button);
}

function procurementScores(){
  const minPrice=Math.min(...procurementVendors.map(v=>v.price));
  const minLead=Math.min(...procurementVendors.map(v=>v.lead));
  const maxWarranty=Math.max(...procurementVendors.map(v=>v.warranty));
  const total=Object.values(procurementWeights).reduce((a,b)=>a+b,0)||1;
  return procurementVendors.map(v=>{
    const factors={price:minPrice/v.price*100,lead:minLead/v.lead*100,warranty:v.warranty/maxWarranty*100,compliance:v.compliance};
    const score=Object.keys(factors).reduce((sum,key)=>sum+factors[key]*procurementWeights[key]/total,0);
    return {...v,factors,score};
  }).sort((a,b)=>b.score-a.score);
}

function procurement(){
  const target=$('#workspace');if(!target)return;
  const scores=procurementScores(),weightTotal=Object.values(procurementWeights).reduce((a,b)=>a+b,0),best=scores[0];
  target.innerHTML=workspaceHeading('07','Compare the whole offer, not only the lowest number.','<button class="dark-button" id="vendor-export">Download .xlsx ↓</button>')+`
    <div class="vendor-layout">
      <div class="vendor-weights"><span class="eyebrow">DECISION WEIGHTS / TOTAL ${weightTotal}%</span>${Object.entries(procurementWeights).map(([key,value])=>`<label>${key}<span><input data-vendor-weight="${key}" type="range" min="0" max="70" step="5" value="${value}"><output>${value}%</output></span></label>`).join('')}<p class="${weightTotal===100?'weight-ok':'weight-warning'}" role="status">${weightTotal===100?'Weights are balanced.':'Weights are normalized for comparison. Set the total to 100% for a clearer approval record.'}</p></div>
      <div class="vendor-recommendation"><span class="eyebrow">CURRENT LEADER</span><strong>${esc(best.name)}</strong><b>${best.score.toFixed(1)} / 100</b><p>Best score with the current decision weights. This is a transparent recommendation, not an automatic purchase approval.</p></div>
    </div>
    ${table(['Rank','Vendor','Quoted total','Lead time','Warranty','Compliance','Tax docs','Weighted score'],scores.map((v,i)=>`<tr class="${i===0?'recommended':''}"><td>0${i+1}</td><td>${esc(v.name)}</td><td>${money(v.price)}</td><td>${v.lead} days</td><td>${v.warranty} months</td><td>${v.compliance}%</td><td>${v.tax?'Complete':'Review'}</td><td><strong>${v.score.toFixed(1)}</strong></td></tr>`).join(''))}
    <div class="decision-notes"><span>Price score = lowest quote ÷ vendor quote.</span><span>Lead-time score = shortest lead ÷ vendor lead.</span><span>Warranty and compliance are normalized to 100.</span><span>Commercial and technical approval still requires human review.</span></div>
    <p class="calculation">Demonstration Data. Quotes, vendors, prices, and commercial terms are fictional. Change the weights to see how the decision responds.</p>`;
  $$('[data-vendor-weight]').forEach(input=>input.oninput=e=>{procurementWeights[e.target.dataset.vendorWeight]=Number(e.target.value);procurement();});
  $('#vendor-export').onclick=()=>action($('#vendor-export'),exportProcurementWorkbook);
}

async function exportProcurementWorkbook(){
  const X=await loadXlsx(),wb=X.utils.book_new();
  const inputs=X.utils.aoa_to_sheet([['DEMONSTRATION DATA — FICTIONAL VENDORS'],['Vendor','Quote total','Lead days','Warranty months','Compliance %','Tax documents'],...procurementVendors.map(v=>[v.name,v.price,v.lead,v.warranty,v.compliance,v.tax?'Complete':'Review'])]);
  const settings=X.utils.aoa_to_sheet([['Criterion','Weight'],['Price',procurementWeights.price/100],['Lead time',procurementWeights.lead/100],['Warranty',procurementWeights.warranty/100],['Compliance',procurementWeights.compliance/100],['Weight total','=SUM(B2:B5)'],['Note','Scores are decision support, not automatic approval.']]);
  const rows=procurementVendors.map((v,i)=>{const n=i+2;return [v.name,{f:`MIN(Inputs!B$2:B$5)/Inputs!B${n}*100`},{f:`MIN(Inputs!C$2:C$5)/Inputs!C${n}*100`},{f:`Inputs!D${n}/MAX(Inputs!D$2:D$5)*100`},{f:`Inputs!E${n}`},{f:`SUMPRODUCT(B${n}:E${n},Settings!B$2:B$5)/Settings!B$6`}];});
  const scoring=X.utils.aoa_to_sheet([['Vendor','Price score','Lead score','Warranty score','Compliance score','Weighted score'],...rows]);
  inputs['!cols']=[{wch:26},{wch:18},{wch:14},{wch:18},{wch:16},{wch:16}];settings['!cols']=[{wch:24},{wch:18}];scoring['!cols']=[{wch:26},...Array(5).fill({wch:18})];
  X.utils.book_append_sheet(wb,inputs,'Inputs');X.utils.book_append_sheet(wb,settings,'Settings');X.utils.book_append_sheet(wb,scoring,'Scoring');
  wb.Workbook={CalcPr:{calcMode:'auto',fullCalcOnLoad:true}};X.writeFile(wb,'vendor-scoring-demo.xlsx');toast('Workbook generated with editable weights and formulas.');
}

const fieldRecords=[
  {id:'DEMO-OFC-014',category:'Office equipment',department:'Administration',location:'Level 2',condition:'Good',rfid:'Registered',validated:true,inspection:'2026-10-19',issue:''},
  {id:'DEMO-OFC-021',category:'Office equipment',department:'Marketing',location:'Room M-03',condition:'Good',rfid:'Pending',validated:false,inspection:'2026-10-18',issue:'RFID registration'},
  {id:'DEMO-MCH-006',category:'Machines',department:'Engineering',location:'Plant A',condition:'Monitor',rfid:'Registered',validated:true,inspection:'2026-10-20',issue:'Review vibration note'},
  {id:'DEMO-MCH-011',category:'Machines',department:'Engineering',location:'Unclear',condition:'Needs inspection',rfid:'Pending',validated:false,inspection:'2026-10-17',issue:'Confirm location with PIC'},
  {id:'DEMO-VEH-003',category:'Vehicles',department:'Operations',location:'Garage',condition:'Service due',rfid:'Not applicable',validated:false,inspection:'2026-10-20',issue:'Match service report'},
  {id:'DEMO-VEH-008',category:'Vehicles',department:'Operations',location:'Garage',condition:'Good',rfid:'Not applicable',validated:true,inspection:'2026-10-21',issue:''},
  {id:'DEMO-BLD-002',category:'Buildings',department:'Facilities',location:'North block',condition:'Good',rfid:'Not applicable',validated:true,inspection:'2026-10-16',issue:''},
  {id:'DEMO-BLD-004',category:'Buildings',department:'Facilities',location:'Warehouse',condition:'Review',rfid:'Not applicable',validated:false,inspection:'2026-10-15',issue:'Confirm responsible department'}
];
let fieldFilter='All',fieldPending=false;
validation=function(){
  const target=$('#workspace');if(!target)return;const categories=[...new Set(fieldRecords.map(r=>r.category))],visible=fieldRecords.filter(r=>(fieldFilter==='All'||r.category===fieldFilter)&&(!fieldPending||!r.validated)),done=fieldRecords.filter(r=>r.validated).length;
  target.innerHTML=workspaceHeading('02','From field observation to a reviewable record.','<button class="dark-button" id="field-export">Export follow-up ↓</button>')+`<div class="lab-controls"><label>Category<select id="field-category">${['All',...categories].map(x=>`<option ${x===fieldFilter?'selected':''}>${x}</option>`).join('')}</select></label><label class="checkbox"><input id="field-pending" type="checkbox" ${fieldPending?'checked':''}>Show pending only</label></div><div class="lab-stats"><div><strong>${Math.round(done/fieldRecords.length*100)}%</strong><span>${done} / ${fieldRecords.length} validated</span></div><div><strong>${fieldRecords.filter(r=>r.rfid==='Registered').length}</strong><span>RFID registered</span></div><div><strong>${fieldRecords.length-done}</strong><span>Follow-up records</span></div><div><strong>${fieldRecords.filter(r=>r.location==='Unclear').length}</strong><span>Unclear locations</span></div></div><div class="field-category-progress">${categories.map(category=>{const rows=fieldRecords.filter(r=>r.category===category),complete=rows.filter(r=>r.validated).length,percent=Math.round(complete/rows.length*100);return `<div><span>${category}</span><b>${complete}/${rows.length}</b><i><em style="width:${percent}%"></em></i></div>`;}).join('')}</div>${table(['Inventory ID','Category','Department / location','Condition','RFID','Last inspection','Follow-up','Local status'],visible.map(r=>`<tr class="${r.validated?'':'review'}"><td>${r.id}</td><td>${r.category}</td><td>${r.department}<br><small>${r.location}</small></td><td>${r.condition}</td><td>${r.rfid}</td><td>${r.inspection}</td><td>${r.issue||'—'}</td><td><button data-field-record="${r.id}">${r.validated?'Validated':'Mark reviewed'}</button></td></tr>`).join(''))}<p class="calculation">Demonstration Data. Status changes stay in this browser session. A production flow would require authenticated users, timestamped evidence, and a controlled audit trail.</p>`;
  $('#field-category').onchange=e=>{fieldFilter=e.target.value;validation();};$('#field-pending').onchange=e=>{fieldPending=e.target.checked;validation();};$$('[data-field-record]').forEach(button=>button.onclick=()=>{const record=fieldRecords.find(r=>r.id===button.dataset.fieldRecord);record.validated=!record.validated;validation();});$('#field-export').onclick=()=>csvDownload('asset-field-follow-up-demo.csv',[['DEMONSTRATION DATA'],['Inventory ID','Category','Department','Location','Condition','RFID','Validated','Last inspection','Follow-up'],...fieldRecords.map(r=>[r.id,r.category,r.department,r.location,r.condition,r.rfid,r.validated?'Yes':'No',r.inspection,r.issue])]);
};

const maintenanceLedger=[
  {date:'2026-08-12',equipment:'DEMO-GEN-01',type:'Preventive',po:'PO-DEMO-041',report:'SR-DEMO-041',description:'Oil, filter, and load test',cost:2400000,status:'Closed'},
  {date:'2026-09-18',equipment:'DEMO-GEN-01',type:'Corrective',po:'PO-DEMO-058',report:'SR-DEMO-058',description:'Replace starter battery',cost:1850000,status:'Closed'},
  {date:'2026-10-20',equipment:'DEMO-GEN-01',type:'Preventive',po:'PO-DEMO-072',report:'',description:'Cooling system inspection',cost:950000,status:'Report pending'},
  {date:'2026-10-22',equipment:'DEMO-PMP-03',type:'Corrective',po:'',report:'SR-DEMO-081',description:'Seal inspection and alignment',cost:780000,status:'PO review'}
];
let maintenanceFilter='All';
maintenance=function(){
  const target=$('#workspace');if(!target)return;const rows=maintenanceLedger.filter(r=>maintenanceFilter==='All'||maintenanceFilter==='Outstanding'&&r.status!=='Closed'||maintenanceFilter==='Unmatched'&&(!r.po||!r.report)),total=rows.reduce((sum,r)=>sum+r.cost,0),matched=maintenanceLedger.filter(r=>r.po&&r.report).length;
  target.innerHTML=workspaceHeading('04','Match the purchase order to the work performed.','<button class="dark-button" id="maintenance-pdf">Generate summary PDF ↓</button>')+`<div class="lab-controls"><label>Review view<select id="maintenance-filter">${['All','Outstanding','Unmatched'].map(x=>`<option ${x===maintenanceFilter?'selected':''}>${x}</option>`).join('')}</select></label><span>Next preventive review · 20 November 2026</span></div><div class="lab-stats"><div><strong>${maintenanceLedger.length}</strong><span>Service records</span></div><div><strong>${matched}/${maintenanceLedger.length}</strong><span>PO / report matched</span></div><div><strong>${maintenanceLedger.filter(r=>r.status!=='Closed').length}</strong><span>Outstanding actions</span></div><div><strong>${money(total)}</strong><span>Visible filtered cost</span></div></div>${table(['Date','Equipment','Type','Purchase order','Service report','Work performed','Cost','Status'],rows.map(r=>`<tr class="${r.status==='Closed'?'':'review'}"><td>${r.date}</td><td>${r.equipment}</td><td>${r.type}</td><td>${r.po||'Missing'}</td><td>${r.report||'Missing'}</td><td>${r.description}</td><td>${money(r.cost)}</td><td>${r.status}</td></tr>`).join(''))}<div class="decision-notes"><span>PO confirms the approved scope.</span><span>Service report confirms the work performed.</span><span>Missing pairs stay open for review.</span><span>Preventive and corrective costs remain separate.</span></div><p class="calculation">Demonstration Data. A matched reference does not prove the document is authentic; production review still needs the original controlled files.</p>`;
  $('#maintenance-filter').onchange=e=>{maintenanceFilter=e.target.value;maintenance();};$('#maintenance-pdf').onclick=()=>action($('#maintenance-pdf'),async()=>{if(!window.PDFLib)await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';script.onload=resolve;script.onerror=()=>reject(new Error('PDF library could not load.'));document.head.appendChild(script);});const pdf=await PDFLib.PDFDocument.create(),font=await pdf.embedFont(PDFLib.StandardFonts.Helvetica);const pages=[['MAINTENANCE CONTROL / DEMONSTRATION','Fictional records only','Records: '+maintenanceLedger.length,'PO and report matched: '+matched,'Outstanding: '+maintenanceLedger.filter(r=>r.status!=='Closed').length,'Next preventive review: 20 November 2026'],...maintenanceLedger.map(r=>['SERVICE RECORD / '+r.equipment,'Date: '+r.date,'Type: '+r.type,'PO: '+(r.po||'Missing'),'Service report: '+(r.report||'Missing'),'Work: '+r.description,'Cost: IDR '+r.cost.toLocaleString('en-US'),'Status: '+r.status])];pages.forEach((lines,index)=>{const page=pdf.addPage([595,842]);lines.forEach((line,i)=>page.drawText(line,{x:50,y:760-i*34,size:i===0?17:11,font}));page.drawText(`${index+1} / ${pages.length}`,{x:50,y:40,size:10,font});});Engine.downloadBlob('maintenance-control-demo.pdf',new Blob([await pdf.save()],{type:'application/pdf'}));});
};

const researchToolLabels=['Method advisor','Sample size','Diagnostics','Results table','Questionnaire','Citation check','Defense practice','Revision tracker'];
let researchToolIndex=0;

function researchToolkitPanel(compact=false){return `<div class="research-toolkit ${compact?'is-compact':''}" id="research-toolkit"><div class="toolkit-heading"><div><span class="eyebrow">OPEN RESEARCH WORKBENCH / LOCAL DEMONSTRATIONS</span><h3>Eight small tools.<br><i>One clearer process.</i></h3></div><p>Use them to think through a method, inspect assumptions, organize evidence, and prepare your own work. Nothing entered here is uploaded.</p></div><div class="toolkit-shell"><div class="toolkit-tabs" role="tablist" aria-label="Research tools">${researchToolLabels.map((label,i)=>`<button role="tab" data-research-tool="${i}" aria-selected="${i===researchToolIndex}"><span>${String(i+1).padStart(2,'0')}</span>${label}</button>`).join('')}</div><div class="toolkit-workspace" id="research-tool-workspace" role="tabpanel"></div></div><p class="disclosure">Learning tools only. They do not replace supervision, disciplinary judgment, or the student’s responsibility for the final research.</p></div>`;}

function bindResearchToolkit(){
  if(!$('#research-toolkit'))return;
  $$('[data-research-tool]').forEach(button=>button.onclick=()=>{researchToolIndex=Number(button.dataset.researchTool);renderResearchTool();});
  renderResearchTool();
}

function toolkitFrame(number,title,intro,form,output='<div id="tool-result" class="tool-result" aria-live="polite"></div>'){return `<div class="tool-title"><span class="eyebrow">${number} / WORKING TOOL</span><h4>${title}</h4><p>${intro}</p></div><div class="tool-body">${form}${output}</div>`;}
function renderResearchTool(){
  $('#research-toolkit').dataset.toolWorld=String(researchToolIndex+1).padStart(2,'0');
  $$('[data-research-tool]').forEach(button=>button.setAttribute('aria-selected',Number(button.dataset.researchTool)===researchToolIndex?'true':'false'));
  [methodAdvisor,samplePlanner,diagnosticsTool,resultsBuilder,questionnaireBuilder,citationChecker,defensePractice,revisionTracker][researchToolIndex]?.();
}

function methodAdvisor(){
  const w=$('#research-tool-workspace');
  w.innerHTML=toolkitFrame('01','Choose a method for the question.','This narrows the starting options. A final choice still depends on the design, sampling, data quality, and assumptions.',`<form class="tool-form" id="method-advisor"><label>Research goal<select name="goal"><option value="relationship">Test a relationship or effect</option><option value="compare">Compare groups</option><option value="association">Check an association</option><option value="predict">Build a prediction model</option></select></label><label>Outcome variable<select name="outcome"><option value="continuous">Continuous score</option><option value="ordinal">Ordinal / Likert outcome</option><option value="categorical">Category / yes-no</option></select></label><label>Groups or predictors<select name="count"><option value="2">Two</option><option value="3">Three or more</option><option value="many">Several predictors</option></select></label><label class="checkbox"><input name="paired" type="checkbox">Repeated or paired observations</label></form>`);
  const form=$('#method-advisor');
  function update(){const f=new FormData(form),goal=f.get('goal'),outcome=f.get('outcome'),count=f.get('count'),paired=f.has('paired');let method,alternative,checks;
    if(goal==='compare'&&outcome==='continuous'){method=count==='2'?(paired?'Paired-samples t-test':'Independent-samples t-test'):(paired?'Repeated-measures ANOVA':'One-way ANOVA');alternative=count==='2'?(paired?'Wilcoxon signed-rank':'Mann–Whitney U'):(paired?'Friedman test':'Kruskal–Wallis');checks='Independence, distribution within groups, outliers, and variance assumptions.';}
    else if(goal==='association'&&outcome==='categorical'){method='Chi-square test of independence';alternative='Fisher’s exact test when expected counts are too small';checks='Expected cell counts, independent observations, and meaningful category coding.';}
    else if(outcome==='categorical'&&(goal==='relationship'||goal==='predict')){method='Binary or multinomial logistic regression';alternative='Penalized or exact logistic approach for sparse data';checks='Outcome coding, sample events per predictor, multicollinearity, and model fit.';}
    else if(goal==='predict'||count==='many'){method='Multiple linear regression';alternative='Robust regression or a transformed model when assumptions fail';checks='Linearity, residual behavior, influential points, multicollinearity, and model validation.';}
    else if(outcome==='ordinal'){method='Spearman correlation or ordinal regression';alternative='A rank-based group test matched to the design';checks='Ordered coding, monotonic relationship, ties, and proportional odds when using ordinal regression.';}
    else{method='Pearson correlation or simple linear regression';alternative='Spearman correlation when the relationship is monotonic but assumptions are weak';checks='Scale quality, linearity, influential points, and residual behavior.';}
    $('#tool-result').innerHTML=`<span class="eyebrow">SENSIBLE STARTING POINT</span><h5>${esc(method)}</h5><dl><div><dt>Alternative</dt><dd>${esc(alternative)}</dd></div><div><dt>Check first</dt><dd>${esc(checks)}</dd></div><div><dt>Do not conclude</dt><dd>A statistical association alone does not establish causation.</dd></div></dl>`;}
  form.onchange=update;update();
}

function samplePlanner(){
  const w=$('#research-tool-workspace');
  w.innerHTML=toolkitFrame('02','Plan a survey sample.','A transparent proportion estimate using confidence level, margin of error, expected proportion, and optional finite-population correction.',`<form class="tool-form" id="sample-planner"><label>Confidence<select name="confidence"><option value="1.645">90%</option><option value="1.96" selected>95%</option><option value="2.576">99%</option></select></label><label>Margin of error<input name="margin" type="number" min="1" max="20" step="0.5" value="5"><small>Percent</small></label><label>Expected proportion<input name="proportion" type="number" min="1" max="99" value="50"><small>Use 50% when uncertain.</small></label><label>Population size<input name="population" type="number" min="0" max="10000000" value="1000"><small>Use 0 for a large or unknown population.</small></label></form>`);
  const form=$('#sample-planner');function update(){const f=new FormData(form),z=Number(f.get('confidence')),e=Number(f.get('margin'))/100,p=Number(f.get('proportion'))/100,N=Number(f.get('population')),n0=z*z*p*(1-p)/(e*e),adjusted=N>0?n0/(1+(n0-1)/N):n0,n=Math.ceil(adjusted);$('#tool-result').innerHTML=`<span class="eyebrow">PLANNING ESTIMATE</span><div class="sample-number">${n}</div><p>minimum completed responses</p><dl><div><dt>Large-population estimate</dt><dd>${Math.ceil(n0)}</dd></div><div><dt>Finite correction</dt><dd>${N>0?'Applied for N = '+N.toLocaleString('en-US'):'Not applied'}</dd></div><div><dt>Reminder</dt><dd>Increase invitations for non-response and confirm the sampling design with a supervisor.</dd></div></dl><button id="sample-notes">Download planning note ↓</button>`;$('#sample-notes').onclick=()=>Engine.downloadBlob('sample-size-planning-note.txt',new Blob([`SAMPLE SIZE PLANNING DEMO\nEstimate: ${n}\nConfidence z: ${z}\nMargin: ${e*100}%\nExpected proportion: ${p*100}%\nPopulation: ${N||'large or unknown'}\n\nThis is a planning estimate, not approval of a research design.`],{type:'text/plain;charset=utf-8'}));}
  form.oninput=update;update();
}

function diagnosticsTool(){
  const w=$('#research-tool-workspace');
  w.innerHTML=toolkitFrame('03','Read assumptions as a set.','Enter example diagnostic values. The tool flags what deserves review without pretending that one threshold can make the whole decision.',`<form class="tool-form" id="diagnostics-form"><label>Normality p-value<input name="normality" type="number" min="0" max="1" step="0.001" value="0.083"></label><label>Highest VIF<input name="vif" type="number" min="1" max="50" step="0.1" value="2.4"></label><label>Heteroscedasticity p-value<input name="hetero" type="number" min="0" max="1" step="0.001" value="0.214"></label><label>Largest Cook’s distance<input name="cook" type="number" min="0" max="5" step="0.01" value="0.08"></label></form>`);
  const form=$('#diagnostics-form');function update(){const f=new FormData(form),tests=[['Residual normality',Number(f.get('normality'))>=.05,'Inspect the Q–Q plot too; a p-value is not the whole diagnosis.'],['Multicollinearity',Number(f.get('vif'))<5,'Review predictor overlap and coefficient stability.'],['Constant variance',Number(f.get('hetero'))>=.05,'Inspect residual-versus-fitted patterns and model specification.'],['Influential observations',Number(f.get('cook'))<1,'Check high-leverage cases and the reason they differ.']];$('#tool-result').innerHTML=`<div class="diagnostic-list">${tests.map(t=>`<div class="${t[1]?'pass':'review'}"><b>${t[1]?'PASS':'REVIEW'}</b><strong>${t[0]}</strong><p>${t[2]}</p></div>`).join('')}</div><p class="tool-caution">Thresholds are common screening rules, not automatic proof that a model is valid or invalid.</p>`;}
  form.oninput=update;update();
}

function resultsBuilder(){
  const w=$('#research-tool-workspace');
  w.innerHTML=toolkitFrame('04','Turn output into a readable result.','Build a compact academic table and a cautious interpretation from values you provide.',`<form class="tool-form" id="results-builder"><label>Analysis<select name="analysis"><option>Independent-samples t-test</option><option>Pearson correlation</option><option>Multiple regression</option><option>Chi-square test</option></select></label><label>Statistic<input name="statistic" value="2.41" maxlength="20"></label><label>Degrees of freedom<input name="df" value="94" maxlength="20"></label><label>p-value<input name="p" type="number" min="0" max="1" step="0.001" value="0.018"></label><label>Effect size<input name="effect" value="0.49" maxlength="20"></label><label class="wide">Comparison or relationship<input name="context" value="Method A compared with Method B" maxlength="140"></label></form>`,`<div id="tool-result" class="tool-result results-preview" aria-live="polite"></div>`);
  const form=$('#results-builder');function update(){const f=new FormData(form),analysis=String(f.get('analysis')),stat=String(f.get('statistic')),df=String(f.get('df')),p=Math.max(0,Math.min(1,Number(f.get('p')))),effect=String(f.get('effect')),context=String(f.get('context')),sig=p<.05;$('#tool-result').innerHTML=`<span class="eyebrow">DRAFT TABLE / STUDENT MUST REVIEW</span>${table(['Analysis','Statistic','df','p','Effect size'],`<tr><td>${esc(analysis)}</td><td>${esc(stat)}</td><td>${esc(df)}</td><td>${p<.001?'&lt; .001':p.toFixed(3)}</td><td>${esc(effect)}</td></tr>`)}<p><strong>Plain-language note.</strong> ${esc(context)} ${sig?'showed evidence of a statistical difference or relationship at the selected .05 threshold':'did not show enough evidence at the selected .05 threshold'}. The size, direction, confidence interval, research design, and practical meaning still need to be discussed.</p><button id="results-export">Export table CSV ↓</button>`;$('#results-export').onclick=()=>csvDownload('results-table-demo.csv',[['DEMONSTRATION DRAFT'],['Analysis','Statistic','df','p','Effect size','Context'],[analysis,stat,df,p,effect,context]]);}
  form.oninput=update;update();
}

function questionnaireBuilder(){
  const w=$('#research-tool-workspace');
  w.innerHTML=toolkitFrame('05','Build an instrument blueprint.','Start from constructs and dimensions before writing final items. Generated wording is a draft for expert review and pilot testing.',`<form class="tool-form" id="questionnaire-builder"><label>Construct<input name="construct" value="Service quality" maxlength="80"></label><label>Dimensions<input name="dimensions" value="Reliability, Responsiveness, Clarity" maxlength="180"><small>Comma-separated</small></label><label>Items per dimension<input name="items" type="number" min="1" max="6" value="2"></label><label>Response scale<select name="scale"><option>1–5 agreement scale</option><option>1–7 agreement scale</option><option>Frequency scale</option></select></label></form>`);
  const form=$('#questionnaire-builder');function update(){const f=new FormData(form),construct=String(f.get('construct')).trim()||'Selected construct',dims=String(f.get('dimensions')).split(',').map(x=>x.trim()).filter(Boolean).slice(0,6),count=Math.max(1,Math.min(6,Number(f.get('items'))||1)),scale=String(f.get('scale')),rows=[];dims.forEach((d,di)=>{for(let i=1;i<=count;i++)rows.push([`${String(di+1).padStart(2,'0')}.${i}`,construct,d,i%2?`I can recognize ${d.toLowerCase()} in the service I receive.`:`The service does not consistently show ${d.toLowerCase()}.` ,i%2?'Positive':'Reverse draft']);});$('#tool-result').innerHTML=`${table(['Code','Construct','Dimension','Draft item','Direction'],rows.map(r=>`<tr>${r.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join(''))}<p class="tool-caution">Scale: ${esc(scale)}. Draft items require content-validity review, clear operational definitions, pilot testing, and responsible handling of reverse wording.</p><button id="questionnaire-export">Export blueprint CSV ↓</button>`;$('#questionnaire-export').onclick=()=>csvDownload('questionnaire-blueprint-demo.csv',[['DEMONSTRATION DRAFT'],['Code','Construct','Dimension','Draft item','Direction','Scale'],...rows.map(r=>[...r,scale])]);}
  form.oninput=update;update();
}

function citationChecker(){
  const w=$('#research-tool-workspace');
  const startingText='Recent studies describe the importance of clear service processes (Santoso, 2024). Earlier work also highlights response speed (Wijaya, 2023).';
  const startingRefs='Santoso, A. (2024). Service process design. Journal of Demonstration Studies.\nRahman, D. (2022). Operational clarity. Example Press.';
  w.innerHTML=toolkitFrame('06','Check citation and reference consistency.','Paste a short draft and reference list. The checker compares author–year pairs; it does not verify whether a source exists or whether the citation style is correct.',`<form class="citation-form" id="citation-checker"><label>Draft text<textarea name="draft" rows="8">${esc(startingText)}</textarea></label><label>Reference list<textarea name="references" rows="8">${esc(startingRefs)}</textarea></label></form>`);
  const form=$('#citation-checker');function update(){const f=new FormData(form),draft=String(f.get('draft')),refs=String(f.get('references')),citations=[...draft.matchAll(/\(([A-Z][A-Za-zÀ-ÿ'’-]+)(?:\s+et al\.)?,\s*(\d{4}[a-z]?)\)/g)].map(m=>(m[1]+' '+m[2]).toLowerCase()),referencePairs=refs.split('\n').map(line=>{const author=line.trim().match(/^([A-Z][A-Za-zÀ-ÿ'’-]+)/),year=line.match(/\((\d{4}[a-z]?)\)/);return author&&year?(author[1]+' '+year[1]).toLowerCase():null}).filter(Boolean),missing=[...new Set(citations.filter(c=>!referencePairs.includes(c)))],unused=[...new Set(referencePairs.filter(r=>!citations.includes(r)))];$('#tool-result').innerHTML=`<div class="citation-status"><div><strong>${citations.length}</strong><span>citations found</span></div><div><strong>${referencePairs.length}</strong><span>references parsed</span></div><div><strong>${missing.length+unused.length}</strong><span>items to review</span></div></div><div class="citation-findings"><div><h5>Missing from reference list</h5>${missing.length?missing.map(x=>`<span>${esc(x)}</span>`).join(''):'<span>None found</span>'}</div><div><h5>Not cited in this draft</h5>${unused.length?unused.map(x=>`<span>${esc(x)}</span>`).join(''):'<span>None found</span>'}</div></div><p class="tool-caution">Only parenthetical “(Author, 2024)” patterns are checked. Narrative citations, organizations, multiple authors, DOI accuracy, and source authenticity need a full review.</p>`;}
  form.oninput=update;update();
}

const defenseQuestions={quantitative:['Why does this test fit your research question?','How did you check the assumptions?','What does the effect size add beyond the p-value?','Which limitation matters most when reading this result?'],qualitative:['Why is this participant selection appropriate?','How did you move from raw material to themes?','What did you do to strengthen credibility?','Which alternative interpretation did you consider?'],mixed:['Why was one method not enough?','How did the quantitative and qualitative findings connect?','Where did the two strands disagree?','How did integration change the conclusion?']};
let defensePosition=0;
function defensePractice(){
  const w=$('#research-tool-workspace');
  w.innerHTML=toolkitFrame('07','Practice the difficult questions.','Choose a design, write a short answer in your own words, then use the prompts to check whether the answer is defensible.',`<form class="tool-form" id="defense-form"><label>Research design<select name="design"><option value="quantitative">Quantitative</option><option value="qualitative">Qualitative</option><option value="mixed">Mixed methods</option></select></label><label class="wide">Research topic<input name="topic" value="How service quality relates to user satisfaction" maxlength="180"></label></form>`,`<div id="tool-result" class="tool-result defense-card" aria-live="polite"></div>`);
  const form=$('#defense-form');function draw(){const f=new FormData(form),design=String(f.get('design')),topic=String(f.get('topic')),questions=defenseQuestions[design],q=questions[defensePosition%questions.length];$('#tool-result').innerHTML=`<span class="eyebrow">QUESTION ${defensePosition%questions.length+1} / ${questions.length}</span><h5>${esc(q)}</h5><p>Topic in view: ${esc(topic)}</p><textarea id="defense-answer" rows="6" placeholder="Build your answer: decision → evidence → limitation."></textarea><div class="answer-checks"><span>□ State the decision clearly</span><span>□ Point to evidence</span><span>□ Acknowledge a limitation</span><span>□ Avoid claims the design cannot support</span></div><button id="defense-next">Next question →</button>`;$('#defense-next').onclick=()=>{defensePosition++;draw();};}
  form.oninput=()=>{defensePosition=0;draw();};draw();
}

const revisionDefaults=[['Confirm research question',true],['Finalize instrument blueprint',true],['Document data-cleaning decisions',false],['Run and review assumptions',false],['Prepare results tables',false],['Check citation consistency',false],['Rehearse defense questions',false]];
function revisionTracker(){
  const w=$('#research-tool-workspace');let saved;try{saved=JSON.parse(localStorage.getItem('living-research-plan')||'null');}catch{}const plan=Array.isArray(saved?.tasks)?saved.tasks:revisionDefaults.map(x=>[...x]);const target=saved?.target||'2026-11-30';
  w.innerHTML=toolkitFrame('08','Keep revisions visible.','A local checklist for planning the next research actions. Progress stays in this browser only.',`<form class="tool-form" id="revision-form"><label>Target date<input id="revision-target" type="date" value="${esc(target)}"></label><div class="wide revision-list">${plan.map((item,i)=>`<label><input data-revision="${i}" type="checkbox" ${item[1]?'checked':''}><span>${esc(item[0])}</span></label>`).join('')}</div></form>`);
  function update(){plan.forEach((item,i)=>item[1]=$(`[data-revision="${i}"]`).checked);const date=$('#revision-target').value,done=plan.filter(x=>x[1]).length,percent=Math.round(done/plan.length*100),days=date?Math.ceil((new Date(date+'T12:00:00')-new Date())/86400000):null;try{localStorage.setItem('living-research-plan',JSON.stringify({target:date,tasks:plan}));}catch{}$('#tool-result').innerHTML=`<div class="revision-progress"><strong>${percent}%</strong><div><span style="width:${percent}%"></span></div><p>${done} of ${plan.length} actions complete · ${days===null?'no target selected':days>=0?days+' days remaining':Math.abs(days)+' days past target'}</p></div><button id="revision-export">Download revision plan ↓</button>`;$('#revision-export').onclick=()=>csvDownload('research-revision-plan.csv',[['PERSONAL PLANNING FILE'],['Target date',date],['Action','Status'],...plan.map(x=>[x[0],x[1]?'Complete':'Open'])]);}
  $('#revision-form').onchange=update;update();
}
