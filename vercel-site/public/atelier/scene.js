// A UV sphere split into individually translated triangles. Resting neighbours
// share positions and material coordinates, including during reassembly.
const vertex = `
attribute vec3 pos, centre;
uniform float aspect, clock, burst;
uniform vec2 gesture;
varying vec3 surface, normal;
void main() {
  surface=pos;
  float angle=.14*sin(clock*.37);
  mat3 rotation=mat3(cos(angle),0.,-sin(angle),0.,1.,0.,sin(angle),0.,cos(angle));
  normal=rotation*pos;
  float noise=fract(sin(dot(centre,vec3(12.989,78.23,39.42)))*43758.54);
  vec3 p=rotation*(mix(pos,centre,clamp(burst*.73,0.,.85))+centre*burst*(.45+noise));
  p.xy+=gesture*burst*(.15+.32*noise);
  float scale=.64*min(1.,aspect)/(1.-.14*p.z);
  gl_Position=vec4(p.x*scale/aspect,p.y*scale+.045+.015*sin(clock*.8),-.25*p.z,1.);
}`;
const fragment = `
precision mediump float;
varying vec3 surface, normal;
void main() {
  vec3 p=normalize(surface), n=normalize(normal);
  float field=5.*p.x+6.*p.y+2.7*p.z+2.8*sin(2.4*p.x-1.3*p.z)+1.6*sin(3.*p.y+2.*p.z);
  float ribbon=.5+.5*sin(field);
  vec3 ink=mix(vec3(.12,.79,.94),vec3(.58,.30,.91),smoothstep(.1,.65,ribbon));
  ink=mix(ink,vec3(1.,.57,.84),smoothstep(.63,.92,ribbon));
  vec3 pearl=mix(vec3(.95,.95,.91),ink,smoothstep(.1,.43,ribbon));
  float light=max(0.,dot(n,normalize(vec3(-.35,.65,.86))));
  float spec=pow(max(0.,dot(n,normalize(vec3(-.33,.58,.75)))),42.);
  vec3 col=pearl*(.48+.62*light)+vec3(.8)*spec+vec3(.21,.18,.3)*pow(1.-abs(n.z),3.);
  gl_FragColor=vec4(col,1.);
}`;
function mesh(rows) {
  const values=[], columns=rows*2;
  function point(i,j) {
    const a=Math.PI*i/rows,b=2*Math.PI*j/columns;
    return [Math.sin(a)*Math.cos(b),Math.cos(a),Math.sin(a)*Math.sin(b)];
  }
  function tri(a,b,c) {
    const centre=a.map((v,i)=>(v+b[i]+c[i])/3);
    for(const p of [a,b,c]) values.push(...p,...centre);
  }
  for(let i=0;i<rows;i++) for(let j=0;j<columns;j++){
    const a=point(i,j),b=point(i+1,j),c=point(i+1,j+1),d=point(i,j+1);
    if(i<rows-1) tri(a,b,c);
    if(i>0) tri(a,c,d);
  }
  return new Float32Array(values);
}
export function mountScene(canvas,reduced) {
  if(!canvas) return;
  const gl=canvas.getContext('webgl',{alpha:true,antialias:true});
  if(!gl) return softwareScene(canvas,reduced);
  const program=gl.createProgram();
  const shaders=[];
  for(const [type,source] of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]]){
    const shader=gl.createShader(type);
    gl.shaderSource(shader,source); gl.compileShader(shader); gl.attachShader(program,shader); shaders.push(shader);
  }
  gl.linkProgram(program);
  shaders.forEach(s=>gl.deleteShader(s));
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)){gl.deleteProgram(program);return;}
  gl.useProgram(program);
  const data=mesh(matchMedia('(pointer: coarse)').matches?16:30);
  const buffer=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
  for(const [name,offset] of [['pos',0],['centre',12]]){
    const loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc,3,gl.FLOAT,false,24,offset);
  }
  const u=Object.fromEntries(['aspect','clock','burst','gesture'].map(k=>[k,gl.getUniformLocation(program,k)]));
  gl.enable(gl.DEPTH_TEST);
  let active=false,spread=0,speed=0,dx=0,dy=0,lastPointer,visible=true,frame=0,last=0,time=0;
  const stop=()=>{active=false;lastPointer=null;};
  function move(e){
    const r=canvas.getBoundingClientRect(), radius=Math.min(r.width,r.height)*.33;
    active=Math.hypot(e.clientX-r.left-r.width/2,e.clientY-r.top-r.height*.48)<radius*(active?1.45:1.25);
    if(lastPointer){
      const dt=Math.max(16,e.timeStamp-lastPointer.timeStamp);
      dx=Math.tanh((e.clientX-lastPointer.clientX)*400/(radius*dt));
      dy=Math.tanh((lastPointer.clientY-e.clientY)*400/(radius*dt));
    }
    lastPointer=e;
  }
  function draw(now){
    frame=0;
    if(!visible||document.hidden) return;
    const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight),dpr=Math.min(1.75,devicePixelRatio);
    if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){
      canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
    }
    const dt=Math.min(.032,Math.max(0,(now-last)/1000));last=now;
    if(!reduced){time+=dt;speed+=((Number(active)-spread)*72-speed*13)*dt;spread+=speed*dt;}
    gl.viewport(0,0,canvas.width,canvas.height);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(u.aspect,w/h);gl.uniform1f(u.clock,time);gl.uniform1f(u.burst,spread);gl.uniform2f(u.gesture,dx,dy);
    gl.drawArrays(gl.TRIANGLES,0,data.length/6);
    canvas.classList.add('marble-ready');
    if(!reduced) frame=requestAnimationFrame(draw);
  }
  const wake=()=>{if(!frame)frame=requestAnimationFrame(draw);};
  const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;wake();});
  const ro=new ResizeObserver(wake);io.observe(canvas);ro.observe(canvas);
  const listeners=[[canvas,'pointermove',move],[canvas,'pointerdown',move],[canvas,'pointerleave',stop],[canvas,'pointercancel',stop],[canvas,'pointerup',stop],[document,'visibilitychange',wake]];
  listeners.forEach(([el,name,fn])=>el.addEventListener(name,fn));wake();
  return ()=>{cancelAnimationFrame(frame);io.disconnect();ro.disconnect();listeners.forEach(([el,n,f])=>el.removeEventListener(n,f));gl.deleteProgram(program);gl.deleteBuffer(buffer);};
}
function softwareScene(canvas,reduced){
  const ctx=canvas.getContext('2d');
  if(!ctx)return;
  const mobile=matchMedia('(pointer:coarse)').matches;
  const texture=document.createElement('canvas'), dim=mobile?384:640;
  texture.width=texture.height=dim;
  const paint=texture.getContext('2d'), pixels=paint.createImageData(dim,dim);
  for(let row=0;row<dim;row++)for(let col=0;col<dim;col++){
    const x=(2*col+1)/dim-1,y=1-(2*row+1)/dim,rr=x*x+y*y;
    if(rr>=1)continue;
    const z=Math.sqrt(1-rr),phase=5.6*x+7*y+2*z+1.5*Math.sin(3*y+3*z)+1.3*Math.sin(3*x-2*z);
    const band=.5+.5*Math.sin(phase);
    const vein=Math.exp(-Math.pow((band-.69)*9,2)), aqua=Math.exp(-Math.pow((band-.43)*7,2)),pink=Math.exp(-Math.pow((band-.87)*7,2));
    const light=.53+.55*Math.max(0,-.36*x+.65*y+.76*z);
    const glint=78*Math.pow(Math.max(0,-.34*x+.53*y+.775*z),32);
    const idx=4*(row*dim+col);
    pixels.data[idx]=(248-158*aqua-101*vein)*light+glint;
    pixels.data[idx+1]=(246-116*vein-68*pink)*light+glint;
    pixels.data[idx+2]=(244-13*aqua)*light+glint;
    pixels.data[idx+3]=255*Math.min(1,(1-rr)*dim);
  }
  paint.putImageData(pixels,0,0);
  const points=mesh(mobile?16:22), faces=[];
  for(let i=0;i<points.length;i+=18){
    const [x,y,z]=points.subarray(i+3,i+6);
    const field=5*x+6*y+2.7*z+2.8*Math.sin(2.4*x-1.3*z)+1.6*Math.sin(3*y+2*z);
    const band=.5+.5*Math.sin(field);
    const stops=[[0,[246,246,240]],[.29,[246,240,244]],[.43,[97,221,236]],[.55,[159,153,240]],[.7,[171,119,232]],[1,[255,184,222]]];
    const hi=Math.max(1,stops.findIndex(([v])=>v>=band)),[loV,lo]=stops[hi-1],[hiV,high]=stops[hi];
    const f=Math.min(1,(band-loV)/(hiV-loV));
    const light=.55+.49*Math.max(0,-.35*x+.65*y+.86*z);
    const color=lo.map((v,k)=>Math.round((v+(high[k]-v)*f)*light));
    faces.push({verts:[0,6,12].map(offset=>points.slice(i+offset,i+offset+3)),x,y,z,color:'rgb('+color.join(',')+')',seed:.45+.65*Math.abs(Math.sin(i*14.1))});
  }
  faces.sort((a,b)=>a.z-b.z);
  let goal=0,burst=0,velocity=0,previous,shiftX=0,shiftY=0,time=0,last=0,frame=0,visible=true;
  function pointer(e){
    const r=canvas.getBoundingClientRect(),rad=Math.min(r.width,r.height)*.32;
    goal=+(Math.hypot(e.clientX-r.left-r.width/2,e.clientY-r.top-r.height*.48)<rad*(goal?1.45:1.25));
    if(previous){const dt=Math.max(16,e.timeStamp-previous.timeStamp);
      shiftX=Math.tanh(400*(e.clientX-previous.clientX)/(dt*rad));shiftY=Math.tanh(400*(previous.clientY-e.clientY)/(dt*rad));}
    previous=e;
  }
  const leave=()=>{goal=0;previous=null;};
  function draw(now){
    frame=0;if(!visible||document.hidden)return;
    const w=canvas.clientWidth,h=canvas.clientHeight,r=Math.min(w,h)*.32,dpr=Math.min(1.5,devicePixelRatio);
    if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
    const dt=Math.min(.04,(now-last)/1000);last=now;
    if(!reduced){time+=dt;velocity+=((goal-burst)*72-13*velocity)*dt;burst+=velocity*dt;}
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    const a=.19*Math.sin(time*.63),c=Math.cos(a),s=Math.sin(a);
    const strength=Math.min(1,Math.max(0,burst*7));
    if(strength<1){
      ctx.save();ctx.globalAlpha=1-strength;ctx.translate(w*.5,h*(.48+.009*Math.sin(time)));ctx.rotate(.085*Math.sin(time*.53));
      ctx.drawImage(texture,-r,-r,r*2,r*2);ctx.restore();
    }
    ctx.globalAlpha=strength;
    if(strength>0) for(const face of faces){
      if(face.z*c-face.x*s<-.08&&burst<.04)continue;
      ctx.beginPath();face.verts.forEach(([x,y,z],j)=>{
        const dilation=burst*face.seed, shrink=.7*burst;
        x+=(face.x-x)*shrink+face.x*dilation+shiftX*burst*.3;
        y+=(face.y-y)*shrink+face.y*dilation+shiftY*burst*.3;
        z+=(face.z-z)*shrink+face.z*dilation;
        const scale=r/(1-.13*(z*c-x*s)),px=w*.5+(x*c+z*s)*scale,py=h*(.48+.009*Math.sin(time)) - y*scale;
        if(j)ctx.lineTo(px,py);else ctx.moveTo(px,py);
      });
      ctx.closePath();ctx.fillStyle=ctx.strokeStyle=face.color;ctx.fill();if(burst<.07){ctx.lineWidth=.7;ctx.stroke();}
    }
    ctx.globalAlpha=1;
    canvas.classList.add('marble-ready');if(!reduced)frame=requestAnimationFrame(draw);
  }
  const wake=()=>{if(!frame)frame=requestAnimationFrame(draw);};
  const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;wake();}),ro=new ResizeObserver(wake);
  io.observe(canvas);ro.observe(canvas);
  const events=[[canvas,'pointermove',pointer],[canvas,'pointerdown',pointer],[canvas,'pointerleave',leave],[canvas,'pointerup',leave],[canvas,'pointercancel',leave],[document,'visibilitychange',wake]];
  events.forEach(([el,n,fn])=>el.addEventListener(n,fn));wake();
  return ()=>{cancelAnimationFrame(frame);io.disconnect();ro.disconnect();events.forEach(([el,n,fn])=>el.removeEventListener(n,fn));};
}

