const rp=n=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);
function field(label,values){return '<label>'+label+'<span data-slot="native-select-wrapper"><select data-slot="native-select" name="'+label+'">'+values.map(v=>'<option>'+v+'</option>').join('')+'</select></span></label>'}
function dateToday(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
