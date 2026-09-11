import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x86b9e8);
scene.fog=new THREE.Fog(0x86b9e8,28,85);
const camera=new THREE.PerspectiveCamera(70,innerWidth/innerHeight,.1,150);
const renderer=new THREE.WebGLRenderer({antialias:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));renderer.setSize(innerWidth,innerHeight);document.body.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xbfe4ff,0x55412d,1.8));
const sun=new THREE.DirectionalLight(0xffffff,2.2);sun.position.set(-30,45,20);scene.add(sun);

const blocks=[];const world=new THREE.Group();scene.add(world);
const mats={grass:new THREE.MeshLambertMaterial({color:0x55a83d}),dirt:new THREE.MeshLambertMaterial({color:0x795334}),stone:new THREE.MeshLambertMaterial({color:0x777b82}),ore:new THREE.MeshLambertMaterial({color:0x39bde8,emissive:0x083d55})};
const cube=new THREE.BoxGeometry(1,1,1);
function block(x,y,z,type='grass'){const m=new THREE.Mesh(cube,mats[type]);m.position.set(x,y,z);m.userData={type};world.add(m);blocks.push(m);return m}
for(let x=-15;x<=15;x++)for(let z=-15;z<=15;z++){block(x,-1,z,'dirt');block(x,0,z,'grass');if((x*x+z*z)%47===0)block(x,1,z,'stone');if((x*7+z*11)%61===0)block(x,1,z,'ore')}

const player={pos:new THREE.Vector3(0,2.2,6),yaw:0,pitch:0,velY:0,onGround:false};camera.position.copy(player.pos);
const keys={};addEventListener('keydown',e=>{keys[e.code]=true;if(e.code==='ShiftRight'||e.code==='Escape')toggleGui();});addEventListener('keyup',e=>keys[e.code]=false);
let guiOpen=false;const gui=document.getElementById('clickgui');function toggleGui(){guiOpen=!guiOpen;gui.classList.toggle('hidden',!guiOpen);if(guiOpen)document.exitPointerLock?.()}
const modules={blockEsp:true,oreEsp:true,tracers:true,hud:true};document.querySelectorAll('[data-module]').forEach(i=>i.onchange=()=>modules[i.dataset.module]=i.checked);
addEventListener('click',()=>{if(!guiOpen)renderer.domElement.requestPointerLock?.()});
addEventListener('mousemove',e=>{if(document.pointerLockElement!==renderer.domElement||guiOpen)return;player.yaw-=e.movementX*.002;player.pitch-=e.movementY*.002;player.pitch=Math.max(-1.45,Math.min(1.45,player.pitch));});

const espCanvas=document.createElement('canvas');espCanvas.width=innerWidth;espCanvas.height=innerHeight;espCanvas.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:4';document.body.appendChild(espCanvas);const ec=espCanvas.getContext('2d');
function drawESP(){ec.clearRect(0,0,espCanvas.width,espCanvas.height);if(!modules.tracers&&!modules.blockEsp&&!modules.oreEsp)return;const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2(0,0),camera);for(const b of blocks){if((b.userData.type==='ore'&&!modules.oreEsp)||(b.userData.type!=='ore'&&!modules.blockEsp))continue;const p=b.position.clone();p.y+=.2;const s=p.clone().project(camera);if(s.z<0||s.z>1)continue;const x=(s.x*.5+.5)*innerWidth,y=(-s.y*.5+.5)*innerHeight;if(Math.abs(s.x)>1.2||Math.abs(s.y)>1.2)continue;if(modules.tracers){ec.strokeStyle=b.userData.type==='ore'?'rgba(34,211,238,.45)':'rgba(167,139,250,.18)';ec.beginPath();ec.moveTo(innerWidth/2,innerHeight/2);ec.lineTo(x,y);ec.stroke()}ec.strokeStyle=b.userData.type==='ore'?'#22d3ee':'#a78bfa';ec.strokeRect(x-7,y-7,14,14)} }

function updatePlayer(dt){if(guiOpen)return;const dir=new THREE.Vector3();if(keys.KeyW)dir.z-=1;if(keys.KeyS)dir.z+=1;if(keys.KeyA)dir.x-=1;if(keys.KeyD)dir.x+=1;if(dir.lengthSq())dir.normalize();const speed=keys.ShiftLeft?7:4.5;dir.applyAxisAngle(new THREE.Vector3(0,1,0),player.yaw);player.pos.x+=dir.x*speed*dt;player.pos.z+=dir.z*speed*dt;if(keys.Space&&player.onGround){player.velY=6;player.onGround=false}player.velY-=16*dt;player.pos.y+=player.velY*dt;if(player.pos.y<=1.8){player.pos.y=1.8;player.velY=0;player.onGround=true}camera.position.copy(player.pos);camera.rotation.order='YXZ';camera.rotation.y=player.yaw;camera.rotation.x=player.pitch}

let last=performance.now(),frames=0,fps=0,fpsTime=last;function loop(t){const dt=Math.min(.05,(t-last)/1000);last=t;frames++;if(t-fpsTime>500){fps=Math.round(frames*1000/(t-fpsTime));frames=0;fpsTime=t}updatePlayer(dt);renderer.render(scene,camera);drawESP();document.getElementById('info').innerHTML=`FPS: ${fps}<br>X: ${player.pos.x.toFixed(1)} Y: ${player.pos.y.toFixed(1)} Z: ${player.pos.z.toFixed(1)}`;document.getElementById('arraylist').innerHTML=Object.entries(modules).filter(([,v])=>v).map(([k])=>`<div class="array-item">${k.toUpperCase()}</div>`).join('');document.getElementById('hud').style.display=modules.hud?'block':'none';requestAnimationFrame(loop)}requestAnimationFrame(loop);

addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));espCanvas.width=innerWidth;espCanvas.height=innerHeight});
