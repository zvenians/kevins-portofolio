const prev = document.getElementById('prev');
const next = document.getElementById('next');
const basket = document.getElementById('basket');
const finish = document.getElementById('finish');
const notice = document.getElementById('notice');
const menu=[
 [['Ayam bakar serai','Ayam panggang, nasi wangi, lalapan.',45000],['Ikan bakar limau','Ikan panggang, jeruk limau dan sambal.',62000],['Jamur lada hitam','Jamur tiram tumis, nasi putih.',34000]],
 [['Sate ayam','Tusuk ayam bakar dengan saus kacang.',32000],['Tahu kemangi','Tahu goreng dengan daun kemangi.',23000],['Terong bakar','Terong panggang dengan sambal tomat.',25000]],
 [['Teh pandan','Seduhan pandan dan teh melati.',18000],['Jeruk nipis','Perasan jeruk nipis segar.',22000],['Kopi susu','Espresso, susu, dan gula aren.',28000]],
 [['Rosela dingin','Seduhan kelopak rosela.',24000],['Kelapa muda','Air dan daging kelapa muda.',26000],['Markisa','Sari markisa dengan soda.',29000]]
];
let spread=0;const order=[];
function book(){const start=spread*2;const paper=document.querySelector('.spread');paper.innerHTML=menu.slice(start,start+2).map((items,i)=>'<article><small>Halaman 0'+(start+i+1)+'</small><h2>'+['Hidangan utama','Lauk & pendamping','Minuman','Penyegar'][start+i]+'</h2>'+items.map(([name,note,price],j)=>'<form class="item" data-page="'+(start+i)+'" data-item="'+j+'"><div class="item-top"><h3>'+name+'</h3><b>'+rp(price)+'</b></div><p>'+note+'</p><div class="fields">'+(spread?field('Es',['Normal','Sedikit es','Tanpa es'])+field('Gula',['Normal','Sedikit gula','Tanpa gula']):field('Sambal',['Tanpa pedas','Sedang','Pedas','Sambal terpisah']))+'</div><button>Tambah '+name+'</button></form>').join('')+'</article>').join('');paper.classList.remove('turn');void paper.offsetWidth;paper.classList.add('turn');prev.disabled=!spread;next.disabled=!!spread;}
function summary(){basket.innerHTML=order.length?'<ol>'+order.map(([name,price,opts],i)=>'<li>'+name+' · '+opts+' · '+rp(price)+' <button data-remove="'+i+'" aria-label="Hapus '+name+'">Hapus</button></li>').join('')+'</ol><b>Total '+rp(order.reduce((n,item)=>n+item[1],0))+'</b>':'Pilih hidangan untuk mengisi pesanan.';finish.disabled=!order.length;}
prev.onclick=()=>{spread=0;book()};next.onclick=()=>{spread=1;book()};document.querySelector('.spread').onsubmit=e=>{e.preventDefault();const f=e.target,[name,,price]=menu[f.dataset.page][f.dataset.item];order.push([name,price,[...f.querySelectorAll('select')].map(s=>s.value).join(', ')]);summary();notice.textContent=name+' ditambahkan.'};basket.onclick=e=>{if(e.target.matches('[data-remove]')){order.splice(Number(e.target.dataset.remove),1);summary();notice.textContent='Item dihapus.'}};finish.onclick=()=>{notice.textContent='Pesanan demo selesai: '+order.length+' item, total '+rp(order.reduce((n,item)=>n+item[1],0))+'.';order.length=0;summary()};book();summary();
