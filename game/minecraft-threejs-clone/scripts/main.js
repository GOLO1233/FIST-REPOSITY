import * as THREE from 'three';

const canvas = document.querySelector('#game');
const menu = document.querySelector('#menu');
const startBtn = document.querySelector('#start');
const saveBtn = document.querySelector('#save');
const loadBtn = document.querySelector('#load');
const hotbar = document.querySelector('#hotbar');
const status = document.querySelector('#status');
const coords = document.querySelector('#coords');
const fpsEl = document.querySelector('#fps');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x86b9e8);
scene.fog = new THREE.Fog(0x86b9e8, 35, 95);

const camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.05, 180);
const renderer = new THREE.WebGLRenderer({canvas, antialias:false, powerPreference:'low-power'});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1));
renderer.setSize(innerWidth, innerHeight);

scene.add(new THREE.HemisphereLight(0xdff2ff, 0x5c694d, 1.15));
const sun = new THREE.DirectionalLight(0xffffff, 1.25);
sun.position.set(35, 55, 20);
scene.add(sun);

const player = { x:0, y:20, z:0, yaw:0, pitch:-0.12, vy:0, grounded:false };
const keys = Object.create(null);
let locked = false, selected = 1, last = performance.now(), frames = 0, fpsTime = last;
const edits = new Map();
const blocks = new Map();
const materials = {};
const blockNames = ['grass','dirt','stone','coal','iron','sand','wood','leaves'];
const colors = {grass:0x55a845,dirt:0x8a5a36,stone:0x888888,coal:0x353535,iron:0xc58f72,sand:0xd9c17b,wood:0x76502f,leaves:0x3e8f45};

function mat(name){
  if(!materials[name]) materials[name]=new THREE.MeshLambertMaterial({color:colors[name]});
  return materials[name];
}
function key(x,y,z){return `${x},${y},${z}`;}
function hash(x,z){let n=Math.sin(x*127.1+z*311.7)*43758.5453;return n-Math.floor(n);}
function height(x,z){
  const a=Math.sin(x*.075)*2.8+Math.cos(z*.065)*2.5;
  const b=Math.sin((x+z)*.025)*4;
  const c=Math.sin(x*.21+z*.13)*.65;
  return Math.max(3,Math.floor(8+a+b+c));
}
function setBlock(x,y,z,type){
  if(y<0 || y>32) return;
  const k=key(x,y,z);
  if(type===0) blocks.delete(k); else blocks.set(k,type);
  edits.set(k,type);
}
function getBlock(x,y,z){
  const k=key(x,y,z);
  if(edits.has(k)) return edits.get(k);
  const h=height(x,z);
  if(y>h || y<0) return 0;
  if(y===h) return 1;
  if(y>h-3) return 2;
  if(y<h-3 && y>1){
    const r=hash(x*3+y,z*5+y);
    if(r>.992) return 5;
    if(r>.965) return 4;
  }
  return 3;
}
function buildWorld(){
  for(const o of [...scene.children]) if(o.userData.block) scene.remove(o);
  blocks.clear();
  const R=28;
  for(let x=-R;x<=R;x++) for(let z=-R;z<=R;z++){
    const h=height(x,z);
    for(let y=Math.max(0,h-9);y<=h;y++){
      const type=getBlock(x,y,z);
      if(type) addBlock(x,y,z,type);
    }
    if(hash(x,z)>.94 && h>6){
      for(let y=1;y<=3;y++) addBlock(x,h+y,z,7);
      for(let dx=-2;dx<=2;dx++) for(let dz=-2;dz<=2;dz++) for(let dy=3;dy<=4;dy++) if(Math.abs(dx)+Math.abs(dz)<4) addBlock(x+dx,h+dy,z+dz,8);
    }
  }
}
function addBlock(x,y,z,type){
  const name=blockNames[type-1];
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),mat(name));
  mesh.position.set(x+.5,y+.5,z+.5);
  mesh.userData.block=true; mesh.userData.x=x; mesh.userData.y=y; mesh.userData.z=z; mesh.userData.type=type;
  scene.add(mesh);
}
function rebuild(){buildWorld();}

const raycaster=new THREE.Raycaster();
const center=new THREE.Vector2(0,0);
function target(){
  raycaster.setFromCamera(center,camera);
  return raycaster.intersectObjects(scene.children.filter(o=>o.userData.block),false)[0];
}
function breakBlock(){
  const hit=target(); if(!hit || hit.distance>6) return;
  const o=hit.object; setBlock(o.userData.x,o.userData.y,o.userData.z,0); rebuild();
}
function placeBlock(){
  const hit=target(); if(!hit || hit.distance>6) return;
  const p=hit.object.position.clone().subScalar(.5).add(hit.face.normal);
  const x=Math.floor(p.x),y=Math.floor(p.y),z=Math.floor(p.z);
  if(Math.abs(x-player.x)<1 && Math.abs(z-player.z)<1 && y<=player.y+2) return;
  setBlock(x,y,z,selected); rebuild();
}

function save(){
  localStorage.setItem('golo-world',JSON.stringify({player,edits:[...edits]}));
  status.textContent='МИР СОХРАНЁН'; setTimeout(()=>status.textContent='',1200);
}
function load(){
  try{const d=JSON.parse(localStorage.getItem('golo-world')||'null'); if(!d)return;
    Object.assign(player,d.player); edits.clear(); for(const [k,v] of d.edits) edits.set(k,v); rebuild(); status.textContent='МИР ЗАГРУЖЕН'; setTimeout(()=>status.textContent='',1200);
  }catch(e){status.textContent='ОШИБКА СОХРАНЕНИЯ';}
}

function makeHotbar(){
  hotbar.innerHTML='';
  blockNames.forEach((name,i)=>{
    const el=document.createElement('div'); el.className='slot'+(i+1===selected?' selected':''); el.textContent=i+1; el.style.setProperty('--c','#'+colors[name].toString(16).padStart(6,'0')); hotbar.appendChild(el);
  });
}
makeHotbar();
buildWorld();

function start(){canvas.requestPointerLock?.();}
startBtn.onclick=start; saveBtn.onclick=save; loadBtn.onclick=load;
canvas.addEventListener('click',()=>{if(!locked)start();});
document.addEventListener('pointerlockchange',()=>{locked=document.pointerLockElement===canvas;menu.classList.toggle('hidden',locked);});
addEventListener('keydown',e=>{
  keys[e.code]=true;
  if(/^Digit[1-8]$/.test(e.code)){selected=Number(e.code.slice(5));makeHotbar();}
  if(e.code==='KeyF') save();
  if(e.code==='KeyG') load();
});
addEventListener('keyup',e=>keys[e.code]=false);
addEventListener('mousedown',e=>{if(!locked)return;if(e.button===0)breakBlock();if(e.button===2)placeBlock();});
addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('mousemove',e=>{if(!locked)return;player.yaw-=e.movementX*.0022;player.pitch-=e.movementY*.0022;player.pitch=Math.max(-1.45,Math.min(1.45,player.pitch));});

function solidAt(x,y,z){return getBlock(Math.floor(x),Math.floor(y),Math.floor(z))!==0;}
function update(dt){
  const speed=(keys.ShiftLeft||keys.ShiftRight)?7.2:4.4;
  let dx=0,dz=0;
  if(keys.KeyW)dz-=1;if(keys.KeyS)dz+=1;if(keys.KeyA)dx-=1;if(keys.KeyD)dx+=1;
  const len=Math.hypot(dx,dz)||1;dx/=len;dz/=len;
  const s=Math.sin(player.yaw),c=Math.cos(player.yaw);
  const vx=(dx*c-dz*s)*speed*dt, vz=(dx*s+dz*c)*speed*dt;
  if(!solidAt(player.x+vx,player.y-.9,player.z))player.x+=vx;
  if(!solidAt(player.x,player.y-.9,player.z+vz))player.z+=vz;
  if((keys.Space||keys.Numpad0)&&player.grounded){player.vy=7.5;player.grounded=false;}
  player.vy-=20*dt; player.y+=player.vy*dt;
  if(solidAt(player.x,player.y-1.7,player.z)){player.y=Math.floor(player.y-1.7)+1.7;player.vy=0;player.grounded=true;}
  if(player.y<2){player.y=20;player.vy=0;}
  camera.position.set(player.x,player.y,player.z);
  camera.rotation.order='YXZ';camera.rotation.y=player.yaw;camera.rotation.x=player.pitch;
  coords.textContent=`${Math.floor(player.x)} ${Math.floor(player.y)} ${Math.floor(player.z)}`;
}

function loop(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;update(dt);frames++;
  if(now-fpsTime>1000){fpsEl.textContent=`${frames} FPS`;frames=0;fpsTime=now;}
  renderer.render(scene,camera);requestAnimationFrame(loop);
}
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
requestAnimationFrame(loop);
