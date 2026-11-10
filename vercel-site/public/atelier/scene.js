// A UV sphere split into individually translated triangles. Resting neighbours
// share positions and material coordinates, including during reassembly.
const vertex = `
attribute vec3 pos, centre;
uniform float aspect, clock, burst;
uniform vec2 gesture, orientation, follow;
varying vec3 surface, normal;
mat3 rotateX(float angle) {
  float c=cos(angle),s=sin(angle);
  return mat3(1.,0.,0.,0.,c,-s,0.,s,c);
}
mat3 rotateY(float angle) {
  float c=cos(angle),s=sin(angle);
  return mat3(c,0.,-s,0.,1.,0.,s,0.,c);
}
void main() {
  mat3 rotation=rotateY(.12*sin(clock*.37)+orientation.x)*rotateX(orientation.y);
  surface=rotation*pos;
  normal=surface;
  float noise=fract(sin(dot(centre,vec3(12.989,78.23,39.42)))*43758.54);
  vec3 p=rotation*(mix(pos,centre,clamp(burst*.72,0.,.84))+centre*burst*(.42+noise));
  p.xy+=gesture*burst*(.12+.28*noise);
  float scale=.64*min(1.,aspect)/(1.-.14*p.z);
  gl_Position=vec4(p.x*scale/aspect+follow.x,p.y*scale+.045+follow.y+.012*sin(clock*.8),-.25*p.z,1.);
}`;

const fragment = `
precision mediump float;
varying vec3 surface, normal;
void main() {
  vec3 p=normalize(surface), n=normalize(normal);
  float field=5.*p.x+6.*p.y+2.7*p.z+2.8*sin(2.4*p.x-1.3*p.z)+1.6*sin(3.*p.y+2.*p.z);
  float ribbon=.5+.5*sin(field);
  vec3 aqua=vec3(.10,.75,.88), violet=vec3(.48,.22,.82), blush=vec3(1.,.52,.77);
  vec3 ink=mix(aqua,violet,smoothstep(.18,.70,ribbon));
  ink=mix(ink,blush,smoothstep(.68,.94,ribbon));
  vec3 pearl=mix(vec3(.965,.96,.92),ink,smoothstep(.11,.45,ribbon));
  vec3 lightDir=normalize(vec3(-.42,.68,.76));
  vec3 fillDir=normalize(vec3(.72,-.18,.42));
  vec3 halfDir=normalize(lightDir+vec3(0.,0.,1.));
  float diffuse=max(0.,dot(n,lightDir));
  float fill=max(0.,dot(n,fillDir));
  float wrap=max(0.,(dot(n,lightDir)+.34)/1.34);
  float broadSpec=pow(max(0.,dot(n,halfDir)),18.);
  float sharpSpec=pow(max(0.,dot(n,halfDir)),78.);
  float fresnel=pow(1.-max(0.,n.z),3.2);
  float occlusion=.78+.22*max(0.,n.y);
  float grain=.985+.015*sin(gl_FragCoord.x*1.71+gl_FragCoord.y*2.13);
  vec3 col=pearl*(.22+.48*wrap+.24*diffuse+.08*fill)*occlusion*grain;
  col+=vec3(.92,.94,1.)*(sharpSpec*.72+broadSpec*.11)+mix(vec3(.08,.12,.18),ink,.34)*fresnel*.42;
  col=col/(col+vec3(.16));
  gl_FragColor=vec4(col,1.);
}`;

function mesh(rows) {
  const values=[];
  const columns=rows*2;
  function point(i,j) {
    const a=Math.PI*i/rows,b=2*Math.PI*j/columns;
    return [Math.sin(a)*Math.cos(b),Math.cos(a),Math.sin(a)*Math.sin(b)];
  }
  function tri(a,b,c) {
    const centre=a.map((value,index)=>(value+b[index]+c[index])/3);
    for(const pointValue of [a,b,c]) values.push(...pointValue,...centre);
  }
  for(let i=0;i<rows;i+=1) {
    for(let j=0;j<columns;j+=1) {
      const a=point(i,j),b=point(i+1,j),c=point(i+1,j+1),d=point(i,j+1);
      if(i<rows-1) tri(a,b,c);
      if(i>0) tri(a,c,d);
    }
  }
  return new Float32Array(values);
}

export function springStep(state,target,dt,frequency=7,damping=1,maxVelocity=8) {
  const safeDt=Math.min(.05,Math.max(0,dt));
  const force=(target-state.value)*frequency*frequency;
  state.velocity+=(force-2*damping*frequency*state.velocity)*safeDt;
  state.velocity=Math.max(-maxVelocity,Math.min(maxVelocity,state.velocity));
  state.value+=state.velocity*safeDt;
  return state.value;
}

function qualityProfile() {
  const coarse=matchMedia('(pointer: coarse)').matches;
  const cores=navigator.hardwareConcurrency||4;
  const memory=navigator.deviceMemory||4;
  const constrained=cores<=4||memory<=4;
  return {
    rows: coarse?(constrained?14:18):(constrained?24:30),
    dpr: coarse?(constrained?1.25:1.5):(constrained?1.5:1.75)
  };
}

function frameReporter(canvas) {
  const samples=[];
  let elapsed=0;
  return (milliseconds)=>{
    if(milliseconds<=0||milliseconds>80) return;
    samples.push(milliseconds);
    if(samples.length>180) samples.shift();
    elapsed+=milliseconds;
    if(elapsed<750||samples.length<12) return;
    const sorted=[...samples].sort((a,b)=>a-b);
    const average=samples.reduce((sum,value)=>sum+value,0)/samples.length;
    canvas.dataset.frameAverageMs=average.toFixed(2);
    canvas.dataset.frameP95Ms=sorted[Math.min(sorted.length-1,Math.floor(sorted.length*.95))].toFixed(2);
    elapsed=0;
  };
}

function interaction(canvas) {
  const target={x:0,y:0,pressed:false,proximity:0,velocityX:0,velocityY:0,pointerType:'mouse'};
  const start={x:0,y:0,captured:false,lastX:0,lastY:0,lastAt:0};
  function normalise(event) {
    const rect=canvas.getBoundingClientRect();
    const x=(event.clientX-rect.left)/Math.max(1,rect.width)*2-1;
    const y=(event.clientY-rect.top)/Math.max(1,rect.height)*2-1;
    target.x=Math.max(-1,Math.min(1,x));
    target.y=Math.max(-1,Math.min(1,y));
    target.proximity=Math.max(0,1-Math.hypot(target.x,target.y*.92)/1.05);
  }
  function down(event) {
    normalise(event);
    target.pressed=true;
    target.pointerType=event.pointerType||'mouse';
    start.x=event.clientX;
    start.y=event.clientY;
    start.lastX=event.clientX;
    start.lastY=event.clientY;
    start.lastAt=event.timeStamp;
    start.captured=false;
  }
  function move(event) {
    normalise(event);
    const elapsed=Math.max(8,event.timeStamp-start.lastAt);
    target.velocityX=target.velocityX*.55+(event.clientX-start.lastX)/elapsed*.45;
    target.velocityY=target.velocityY*.55+(event.clientY-start.lastY)/elapsed*.45;
    start.lastX=event.clientX;
    start.lastY=event.clientY;
    start.lastAt=event.timeStamp;
    if(!target.pressed) return;
    const dx=event.clientX-start.x;
    const dy=event.clientY-start.y;
    if(!start.captured&&Math.hypot(dx,dy)>8&&Math.abs(dx)>Math.abs(dy)*1.15) {
      start.captured=true;
      canvas.setPointerCapture?.(event.pointerId);
    }
    if(start.captured) event.preventDefault();
  }
  function up(event) {
    target.pressed=false;
    if(start.captured&&canvas.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    start.captured=false;
  }
  function leave() {
    if(!target.pressed) {
      target.x=0;
      target.y=0;
      target.proximity=0;
      target.velocityX=0;
      target.velocityY=0;
    }
  }
  const listeners=[
    [canvas,'pointerdown',down,{passive:true}],
    [canvas,'pointermove',move,{passive:false}],
    [canvas,'pointerup',up,{passive:true}],
    [canvas,'pointercancel',up,{passive:true}],
    [canvas,'pointerleave',leave,{passive:true}]
  ];
  listeners.forEach(([element,name,handler,options])=>element.addEventListener(name,handler,options));
  return {
    target,
    destroy:()=>listeners.forEach(([element,name,handler,options])=>element.removeEventListener(name,handler,options))
  };
}

export function mountScene(canvas,reduced) {
  if(!canvas) return undefined;
  const gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'high-performance'});
  if(!gl) return softwareScene(canvas,reduced);
  const profile=qualityProfile();
  const input=interaction(canvas);
  const reportFrame=frameReporter(canvas);
  canvas.dataset.renderer='webgl';
  let resources;
  let contextLost=false;
  let frame=0;
  let visible=true;
  let last=0;
  let time=0;
  let previousPointer={x:0,y:0};
  const orientationX={value:0,velocity:0};
  const orientationY={value:0,velocity:0};
  const followX={value:0,velocity:0};
  const followY={value:0,velocity:0};
  const burst={value:0,velocity:0};

  function createResources() {
    const program=gl.createProgram();
    const shaders=[];
    for(const [type,source] of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]]) {
      const shader=gl.createShader(type);
      gl.shaderSource(shader,source);
      gl.compileShader(shader);
      if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)) {
        console.warn('Sphere shader failed to compile.',gl.getShaderInfoLog(shader));
      }
      gl.attachShader(program,shader);
      shaders.push(shader);
    }
    gl.linkProgram(program);
    shaders.forEach((shader)=>gl.deleteShader(shader));
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return undefined;
    }
    gl.useProgram(program);
    const data=mesh(profile.rows);
    const buffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
    for(const [name,offset] of [['pos',0],['centre',12]]) {
      const location=gl.getAttribLocation(program,name);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location,3,gl.FLOAT,false,24,offset);
    }
    const uniforms=Object.fromEntries(['aspect','clock','burst','gesture','orientation','follow'].map((name)=>[name,gl.getUniformLocation(program,name)]));
    gl.enable(gl.DEPTH_TEST);
    return {program,buffer,data,uniforms};
  }

  function destroyResources() {
    if(!resources||contextLost) return;
    gl.deleteProgram(resources.program);
    gl.deleteBuffer(resources.buffer);
    resources=undefined;
  }

  function draw(now) {
    frame=0;
    if(!visible||document.hidden||contextLost||!resources) return;
    const width=Math.max(1,canvas.clientWidth);
    const height=Math.max(1,canvas.clientHeight);
    const dpr=Math.min(profile.dpr,devicePixelRatio||1);
    if(canvas.width!==Math.round(width*dpr)||canvas.height!==Math.round(height*dpr)) {
      canvas.width=Math.round(width*dpr);
      canvas.height=Math.round(height*dpr);
    }
    const milliseconds=last?now-last:16.67;
    const dt=Math.min(.033,Math.max(0,milliseconds/1000));
    last=now;
    reportFrame(milliseconds);
    if(!reduced) time+=dt;
    const motionScale=reduced?0:(input.target.pointerType==='touch'?.32:.26);
    const kineticX=Math.max(-.12,Math.min(.12,input.target.velocityX*.07));
    const kineticY=Math.max(-.10,Math.min(.10,input.target.velocityY*.06));
    springStep(orientationX,input.target.x*motionScale+kineticX,dt,6.5,.92,2.2);
    springStep(orientationY,-input.target.y*motionScale*.72-kineticY,dt,6.5,.92,2.2);
    springStep(followX,input.target.x*.022,dt,7.5,1,1.1);
    springStep(followY,-input.target.y*.017,dt,7.5,1,1.1);
    const burstTarget=input.target.pressed ? .76 : input.target.proximity*input.target.proximity*.16;
    springStep(burst,burstTarget,dt,8.5,.9,4.2);
    const gestureX=Math.max(-1,Math.min(1,(input.target.x-previousPointer.x)/Math.max(.008,dt)*.03));
    const gestureY=Math.max(-1,Math.min(1,(previousPointer.y-input.target.y)/Math.max(.008,dt)*.03));
    previousPointer={x:input.target.x,y:input.target.y};
    input.target.velocityX*=Math.pow(.018,dt);
    input.target.velocityY*=Math.pow(.018,dt);
    gl.viewport(0,0,canvas.width,canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.useProgram(resources.program);
    gl.uniform1f(resources.uniforms.aspect,width/height);
    gl.uniform1f(resources.uniforms.clock,time);
    gl.uniform1f(resources.uniforms.burst,burst.value);
    gl.uniform2f(resources.uniforms.gesture,gestureX,gestureY);
    gl.uniform2f(resources.uniforms.orientation,orientationX.value,orientationY.value);
    gl.uniform2f(resources.uniforms.follow,followX.value,followY.value);
    gl.drawArrays(gl.TRIANGLES,0,resources.data.length/6);
    canvas.classList.add('marble-ready');
    if(!reduced) frame=requestAnimationFrame(draw);
  }

  const wake=()=>{if(!frame&&!contextLost) frame=requestAnimationFrame(draw);};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;wake();});
  const resizeObserver=new ResizeObserver(wake);
  const visibility=()=>wake();
  const lost=(event)=>{
    event.preventDefault();
    contextLost=true;
    cancelAnimationFrame(frame);
    frame=0;
    canvas.dataset.renderer='context-lost';
  };
  const restored=()=>{
    contextLost=false;
    resources=createResources();
    canvas.dataset.renderer='webgl-restored';
    wake();
  };
  resources=createResources();
  if(!resources) {
    input.destroy();
    return softwareScene(canvas,reduced);
  }
  observer.observe(canvas);
  resizeObserver.observe(canvas);
  document.addEventListener('visibilitychange',visibility);
  canvas.addEventListener('webglcontextlost',lost,false);
  canvas.addEventListener('webglcontextrestored',restored,false);
  wake();
  return ()=>{
    cancelAnimationFrame(frame);
    observer.disconnect();
    resizeObserver.disconnect();
    input.destroy();
    document.removeEventListener('visibilitychange',visibility);
    canvas.removeEventListener('webglcontextlost',lost,false);
    canvas.removeEventListener('webglcontextrestored',restored,false);
    destroyResources();
  };
}

function softwareScene(canvas,reduced) {
  const context=canvas.getContext('2d');
  if(!context) return undefined;
  const input=interaction(canvas);
  const reportFrame=frameReporter(canvas);
  canvas.dataset.renderer='canvas2d';
  const profile=qualityProfile();
  const dim=profile.rows<=18?384:640;
  const texture=document.createElement('canvas');
  texture.width=texture.height=dim;
  const paint=texture.getContext('2d');
  const pixels=paint.createImageData(dim,dim);
  for(let row=0;row<dim;row+=1) {
    for(let column=0;column<dim;column+=1) {
      const x=(2*column+1)/dim-1,y=1-(2*row+1)/dim,rr=x*x+y*y;
      if(rr>=1) continue;
      const z=Math.sqrt(1-rr),phase=5.6*x+7*y+2*z+1.5*Math.sin(3*y+3*z)+1.3*Math.sin(3*x-2*z);
      const band=.5+.5*Math.sin(phase);
      const vein=Math.exp(-Math.pow((band-.69)*9,2)),aqua=Math.exp(-Math.pow((band-.43)*7,2)),pink=Math.exp(-Math.pow((band-.87)*7,2));
      const light=.53+.55*Math.max(0,-.36*x+.65*y+.76*z);
      const glint=78*Math.pow(Math.max(0,-.34*x+.53*y+.775*z),32);
      const index=4*(row*dim+column);
      pixels.data[index]=(248-158*aqua-101*vein)*light+glint;
      pixels.data[index+1]=(246-116*vein-68*pink)*light+glint;
      pixels.data[index+2]=(244-13*aqua)*light+glint;
      pixels.data[index+3]=255*Math.min(1,(1-rr)*dim);
    }
  }
  paint.putImageData(pixels,0,0);
  const yaw={value:0,velocity:0};
  const pitch={value:0,velocity:0};
  const followX={value:0,velocity:0};
  const followY={value:0,velocity:0};
  const scale={value:1,velocity:0};
  let frame=0,visible=true,last=0,time=0;
  function draw(now) {
    frame=0;
    if(!visible||document.hidden) return;
    const width=canvas.clientWidth,height=canvas.clientHeight,radius=Math.min(width,height)*.32,dpr=Math.min(profile.dpr,devicePixelRatio||1);
    if(canvas.width!==Math.round(width*dpr)||canvas.height!==Math.round(height*dpr)) {
      canvas.width=Math.round(width*dpr);
      canvas.height=Math.round(height*dpr);
    }
    const milliseconds=last?now-last:16.67;
    const dt=Math.min(.04,milliseconds/1000);
    last=now;
    reportFrame(milliseconds);
    if(!reduced) time+=dt;
    const motionScale=reduced?0:(input.target.pointerType==='touch'?.23:.18);
    const kineticX=Math.max(-.08,Math.min(.08,input.target.velocityX*.05));
    const kineticY=Math.max(-.07,Math.min(.07,input.target.velocityY*.04));
    springStep(yaw,input.target.x*motionScale+kineticX,dt,6.5,.95,1.8);
    springStep(pitch,-input.target.y*motionScale*.65-kineticY,dt,6.5,.95,1.8);
    springStep(followX,input.target.x*10,dt,7.5,1,70);
    springStep(followY,-input.target.y*7,dt,7.5,1,70);
    springStep(scale,input.target.pressed ? .965 : 1,dt,8,1,1.5);
    input.target.velocityX*=Math.pow(.018,dt);
    input.target.velocityY*=Math.pow(.018,dt);
    context.setTransform(dpr,0,0,dpr,0,0);
    context.clearRect(0,0,width,height);
    context.save();
    context.translate(width*.5+followX.value,height*(.48+.008*Math.sin(time))+followY.value);
    context.rotate(yaw.value*.42+pitch.value*.18+.06*Math.sin(time*.53));
    context.scale(scale.value,scale.value);
    context.shadowColor='rgba(115, 128, 255, .20)';
    context.shadowBlur=28;
    context.drawImage(texture,-radius,-radius,radius*2,radius*2);
    context.restore();
    canvas.classList.add('marble-ready');
    if(!reduced) frame=requestAnimationFrame(draw);
  }
  const wake=()=>{if(!frame) frame=requestAnimationFrame(draw);};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;wake();});
  const resizeObserver=new ResizeObserver(wake);
  const visibility=()=>wake();
  observer.observe(canvas);
  resizeObserver.observe(canvas);
  document.addEventListener('visibilitychange',visibility);
  wake();
  return ()=>{
    cancelAnimationFrame(frame);
    observer.disconnect();
    resizeObserver.disconnect();
    input.destroy();
    document.removeEventListener('visibilitychange',visibility);
  };
}
