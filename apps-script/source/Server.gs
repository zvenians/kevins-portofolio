/* The Living Index — Apps Script / Sheets / Drive */
const INDEX = { version: '1.0.0', maxPdf: 5 * 1024 * 1024, maxImage: 4 * 1024 * 1024 };

function owner_() {
  const email = Session.getActiveUser().getEmail();
  const expected = PropertiesService.getScriptProperties().getProperty('OWNER_EMAIL');
  if (!expected || !email || email.toLowerCase() !== expected.toLowerCase()) throw new Error('Owner access required. Open this app with the Google account that installed it.');
  return email;
}
function setupLivingIndex() {
  const props = PropertiesService.getScriptProperties();
  const active = Session.getActiveUser().getEmail();
  if (!active || active !== Session.getEffectiveUser().getEmail()) throw new Error('Run setup from the Apps Script editor as its owner.');
  if (props.getProperty('OWNER_EMAIL') && props.getProperty('OWNER_EMAIL') !== active) throw new Error('Owner mismatch.');
  props.setProperty('OWNER_EMAIL', active);
  const lock=LockService.getScriptLock(); lock.waitLock(10000);
  try {
    if (!props.getProperty('DATABASE_ID')) {
      const db=SpreadsheetApp.create('The Living Index — Content');
      props.setProperty('DATABASE_ID',db.getId());
      db.getSheets()[0].setName('Projects');
      [['Projects',['id','slug','name','category','visibility','featured','order','updatedAt','contentJson']],['Resume',['id','name','fileId','size','uploadedAt','published']],['Media',['id','name','fileId','mime','size','createdAt']],['Audit',['timestamp','actor','action','recordId']],['Settings',['key','value']]].forEach(function(def){
        const sheet=db.getSheetByName(def[0])||db.insertSheet(def[0]);
        sheet.getRange(1,1,1,def[1].length).setValues([def[1]]).setBackground('#171A1C').setFontColor('#EAE9E4').setFontWeight('bold');sheet.setFrozenRows(1);sheet.setColumnWidths(1,def[1].length,150);
      });
      const projectSheet=db.getSheetByName('Projects');
      projectSheet.getRange(2,1,SEED_PROJECTS.length,9).setValues(SEED_PROJECTS.map(projectRow_));
      projectSheet.getRange('E2:E1000').setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['public','draft','private'],true).setAllowInvalid(false).build());
      projectSheet.setColumnWidth(9,400);
    }
    if(!props.getProperty('MEDIA_FOLDER_ID'))props.setProperty('MEDIA_FOLDER_ID',DriveApp.createFolder('The Living Index — Private Media').getId());
    audit_('setup','site');
    console.log('Content database: '+db_().getUrl());
    return {databaseUrl:db_().getUrl(),version:INDEX.version};
  }finally{lock.releaseLock();}
}
function db_(){const id=PropertiesService.getScriptProperties().getProperty('DATABASE_ID');if(!id)throw new Error('Run setupLivingIndex in the Apps Script editor first.');return SpreadsheetApp.openById(id);}
function rows_(name){const sh=db_().getSheetByName(name);if(sh.getLastRow()<2)return[];return sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues();}
function audit_(action,id){db_().getSheetByName('Audit').appendRow([new Date().toISOString(),Session.getActiveUser().getEmail()||'public',action,id]);}
function safeCell_(v){const s=String(v==null?'':v);return /^[=+@\-]/.test(s)?"'"+s:s;}
function projectRow_(p){return [p.id,p.slug,safeCell_(p.name),safeCell_(p.category),p.visibility,p.featured,p.order,p.updatedAt,JSON.stringify(p)];}
function projects_(privateAccess){return rows_('Projects').map(function(r){try{const p=JSON.parse(r[8]);p.visibility=String(r[4]);p.featured=r[5]===true;p.order=Number(r[6])||0;return p;}catch(e){return null;}}).filter(function(p){return p&&(privateAccess||p.visibility==='public');}).sort(function(a,b){return Number(b.featured)-Number(a.featured)||a.order-b.order;});}
function settings_(){const result={};rows_('Settings').forEach(function(r){if(['email','linkedin','whatsapp','publicUrl'].indexOf(r[0])>=0)result[r[0]]=String(r[1]);});return result;}
function getPublicContent(){return {projects:projects_(false),resume:resumeMeta_(),settings:settings_(),version:INDEX.version};}
function doGet(e){
  const params=e&&e.parameter||{};
  try {
    if(params.format==='json')return ContentService.createTextOutput(JSON.stringify(getPublicContent())).setMimeType(ContentService.MimeType.JSON);
    if(params.format==='file'){
      const file=params.type==='resume'?getResumeFile():params.type==='media'?getMediaFile(String(params.id||'')):null;
      if(!file)throw new Error('Unsupported public file request.');
      return ContentService.createTextOutput(JSON.stringify(file)).setMimeType(ContentService.MimeType.JSON);
    }
    const isAdmin=params.page==='admin';
    if(isAdmin)owner_();
    const bootstrap=isAdmin?getAdminContent():getPublicContent();
    bootstrap.admin=isAdmin;bootstrap.appUrl=ScriptApp.getService().getUrl();bootstrap.projectSlug=params.project||'';
    const safe=JSON.stringify(bootstrap).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
    const html=ASSETS.html.replace('/*BOOTSTRAP*/', function(){return 'window.INDEX_BOOTSTRAP='+safe+';';}).replace('/*STYLES*/',function(){return ASSETS.css;}).replace('/*CLIENT*/',function(){return ASSETS.client;});
    return HtmlService.createHtmlOutput(html).setTitle(isAdmin?'Manage — The Living Index':'Kevin Simatupang — The Living Index').addMetaTag('viewport','width=device-width, initial-scale=1');
  }catch(error){return HtmlService.createHtmlOutput('<!doctype html><html><body style="background:#0b0d0e;color:#eae9e4;font:18px system-ui;padding:8vw"><h1>The Living Index</h1><p>'+escape_(error.message)+'</p><p>For owner access, use the Google account that installed this project.</p></body></html>').setTitle('The Living Index — Access');}
}
function escape_(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function getAdminContent(){owner_();return {projects:projects_(true),resumes:rows_('Resume').map(resumeRow_),media:rows_('Media').map(function(r){return{id:r[0],name:r[1],mime:r[3],size:r[4],createdAt:r[5]};}),audit:rows_('Audit').slice(-30).reverse(),settings:settings_(),databaseUrl:db_().getUrl()};}
function validateProject_(p){
 if(!p||typeof p!=='object')throw new Error('Project content is missing.');
 ['id','slug'].forEach(function(k){if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p[k]||''))throw new Error(k+' must contain lowercase words separated by hyphens.');});
 ['name','title','summary','category','challenge','approach','implementation','outcome','tradeoff'].forEach(function(k){if(typeof p[k]!=='string'||!p[k].trim()||p[k].length>6000)throw new Error('Please check '+k+'.');});
 if(['public','draft','private'].indexOf(p.visibility)<0)throw new Error('Invalid visibility.');
 if(['Real Project','Interactive Demo','Case Study','Concept','Historical Prototype','In Progress'].indexOf(p.status)<0)throw new Error('Invalid status.');
 if(['portal','archive','governance','editorial','exploration','history'].indexOf(p.visual)<0)throw new Error('Invalid exhibit style.');
 ['disciplines','technologies','evidence'].forEach(function(k){if(!Array.isArray(p[k])||p[k].some(function(v){return typeof v!=='string'||v.length>500;}))throw new Error('Invalid '+k+'.');});
 ['repositoryUrl','liveUrl','coverUrl'].forEach(function(k){if(p[k]&&!/^https:\/\/[^\s<>"']+$/.test(p[k]))throw new Error(k+' must be a valid HTTPS URL.');});
 if(!Number.isFinite(Number(p.order))||typeof p.featured!=='boolean')throw new Error('Invalid ordering.');
 if(JSON.stringify(p).length>45000)throw new Error('Project exceeds the content size limit.');
 return JSON.parse(JSON.stringify(p));
}
function saveProject(project){owner_();const p=validateProject_(project);const lock=LockService.getScriptLock();lock.waitLock(10000);try{const all=projects_(true);if(all.some(function(x){return x.slug===p.slug&&x.id!==p.id;}))throw new Error('That project URL is already used.');const old=all.find(function(x){return x.id===p.id;});if(old&&old.updatedAt!==p.updatedAt)throw new Error('This project changed in another session. Reload before saving.');p.updatedAt=new Date().toISOString();const sh=db_().getSheetByName('Projects');const values=rows_('Projects');const index=values.findIndex(function(r){return r[0]===p.id;});sh.getRange(index<0?sh.getLastRow()+1:index+2,1,1,9).setValues([projectRow_(p)]);audit_('project.'+p.visibility,p.id);return p;}finally{lock.releaseLock();}}
function saveSettings(input){owner_();const allowed=['email','linkedin','whatsapp'];const rows=[];allowed.forEach(function(k){const value=String(input[k]||'').trim();if(value.length>300)throw new Error('Setting too long.');if(k==='email'&&value&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))throw new Error('Invalid email.');if(k==='linkedin'&&value&&!/^https:\/\/(www\.)?linkedin\.com\//.test(value))throw new Error('Use a LinkedIn HTTPS link.');if(k==='whatsapp'&&value&&!/^\d{8,15}$/.test(value))throw new Error('WhatsApp needs country code and digits only.');rows.push([k,safeCell_(value)]);});const lock=LockService.getScriptLock();lock.waitLock(10000);try{const sh=db_().getSheetByName('Settings');sh.getRange(2,1,3,2).setValues(rows);audit_('settings.update','site');return settings_();}finally{lock.releaseLock();}}
function resumeRow_(r){return{id:r[0],name:r[1],fileId:r[2],size:r[3],uploadedAt:r[4],published:r[5]===true};}
function resumeMeta_(){const row=rows_('Resume').find(function(r){return r[5]===true;});if(!row)return null;const r=resumeRow_(row);delete r.fileId;return r;}
function validateUpload_(data,pdf){if(!data||typeof data.base64!=='string'||data.base64.length>(pdf?INDEX.maxPdf:INDEX.maxImage)*1.4)throw new Error('File is too large.');const bytes=Utilities.base64Decode(data.base64);if(bytes.length>(pdf?INDEX.maxPdf:INDEX.maxImage)||bytes.length<8)throw new Error('Invalid file size.');if(pdf){if(data.mime!=='application/pdf'||String.fromCharCode.apply(null,bytes.slice(0,5).map(function(n){return n&255;}))!=='%PDF-')throw new Error('Upload a valid PDF file.');}else{const b=bytes.map(function(n){return n&255;});const png=b[0]===137&&b[1]===80&&b[2]===78&&b[3]===71;const jpg=b[0]===255&&b[1]===216&&b[2]===255;if(!((png&&data.mime==='image/png')||(jpg&&data.mime==='image/jpeg')))throw new Error('Use a PNG or JPEG image.');}return bytes;}
function uploadResume(data){owner_();const bytes=validateUpload_(data,true);const name=String(data.name||'resume.pdf').replace(/[^a-zA-Z0-9._ -]/g,'_').slice(0,100);const folder=DriveApp.getFolderById(PropertiesService.getScriptProperties().getProperty('MEDIA_FOLDER_ID'));const file=folder.createFile(Utilities.newBlob(bytes,'application/pdf',name));const r={id:Utilities.getUuid(),name:name,fileId:file.getId(),size:bytes.length,uploadedAt:new Date().toISOString(),published:false};const lock=LockService.getScriptLock();lock.waitLock(10000);try{db_().getSheetByName('Resume').appendRow([r.id,r.name,r.fileId,r.size,r.uploadedAt,false]);audit_('resume.upload',r.id);}finally{lock.releaseLock();}return r;}
function publishResume(id){owner_();const lock=LockService.getScriptLock();lock.waitLock(10000);try{const rows=rows_('Resume');if(id&&!rows.some(function(r){return r[0]===id;}))throw new Error('Resume version not found.');if(rows.length)db_().getSheetByName('Resume').getRange(2,6,rows.length,1).setValues(rows.map(function(r){return[r[0]===id];}));audit_(id?'resume.publish':'resume.unpublish',id||'all');return resumeMeta_();}finally{lock.releaseLock();}}
function getResumeFile(id){let row;if(id){owner_();row=rows_('Resume').find(function(r){return r[0]===id;});}else row=rows_('Resume').find(function(r){return r[5]===true;});if(!row)throw new Error('No resume is published yet.');const blob=DriveApp.getFileById(row[2]).getBlob();return{name:row[1],mime:'application/pdf',base64:Utilities.base64Encode(blob.getBytes())};}
function uploadMedia(data){owner_();const bytes=validateUpload_(data,false);const name=String(data.name||'image').replace(/[^a-zA-Z0-9._ -]/g,'_').slice(0,100);const file=DriveApp.getFolderById(PropertiesService.getScriptProperties().getProperty('MEDIA_FOLDER_ID')).createFile(Utilities.newBlob(bytes,data.mime,name));const id=Utilities.getUuid();db_().getSheetByName('Media').appendRow([id,name,file.getId(),data.mime,bytes.length,new Date().toISOString()]);audit_('media.upload',id);return{id:id,name:name};}
function getMediaFile(id){const projects=projects_(false);if(!projects.some(function(p){return p.mediaId===id;}))owner_();const row=rows_('Media').find(function(r){return r[0]===id;});if(!row)throw new Error('Image unavailable.');return{mime:row[3],base64:Utilities.base64Encode(DriveApp.getFileById(row[2]).getBlob().getBytes())};}
