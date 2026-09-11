import * as THREE from 'three';
const BASE='https://raw.githubusercontent.com/dgreenheck/minecraft-threejs-clone/main/public/';
const textureLoader=new THREE.TextureLoader();
function loadTexture(path){const texture=textureLoader.load(BASE+path);texture.colorSpace=THREE.SRGBColorSpace;texture.magFilter=THREE.NearestFilter;texture.minFilter=THREE.NearestFilter;return texture;}
const textures={cactusSide:loadTexture('textures/cactus_side.png'),cactusTop:loadTexture('textures/cactus_top.png'),dirt:loadTexture('textures/dirt.png'),grass:loadTexture('textures/grass.png'),grassSide:loadTexture('textures/grass_side.png'),coalOre:loadTexture('textures/coal_ore.png'),ironOre:loadTexture('textures/iron_ore.png'),jungleTreeSide:loadTexture('textures/jungle_tree_side.png'),jungleTreeTop:loadTexture('textures/jungle_tree_top.png'),jungleLeaves:loadTexture('textures/jungle_leaves.png'),leaves:loadTexture('textures/leaves.png'),treeSide:loadTexture('textures/tree_side.png'),treeTop:loadTexture('textures/tree_top.png'),sand:loadTexture('textures/sand.png'),snow:loadTexture('textures/snow.png'),snowSide:loadTexture('textures/snow_side.png'),stone:loadTexture('textures/stone.png')};
export const blocks={
 empty:{id:0,name:'empty',visible:false},
 grass:{id:1,name:'grass',material:[new THREE.MeshLambertMaterial({map:textures.grassSide}),new THREE.MeshLambertMaterial({map:textures.grassSide}),new THREE.MeshLambertMaterial({map:textures.grass}),new THREE.MeshLambertMaterial({map:textures.dirt}),new THREE.MeshLambertMaterial({map:textures.grassSide}),new THREE.MeshLambertMaterial({map:textures.grassSide})]},
 dirt:{id:2,name:'dirt',material:new THREE.MeshLambertMaterial({map:textures.dirt})},
 stone:{id:3,name:'stone',material:new THREE.MeshLambertMaterial({map:textures.stone}),scale:{x:30,y:30,z:30},scarcity:0.8},
 coalOre:{id:4,name:'coal_ore',material:new THREE.MeshLambertMaterial({map:textures.coalOre}),scale:{x:20,y:20,z:20},scarcity:0.8},
 ironOre:{id:5,name:'iron_ore',material:new THREE.MeshLambertMaterial({map:textures.ironOre}),scale:{x:40,y:40,z:40},scarcity:0.9},
 tree:{id:6,name:'tree',visible:true,material:[new THREE.MeshLambertMaterial({map:textures.treeSide}),new THREE.MeshLambertMaterial({map:textures.treeSide}),new THREE.MeshLambertMaterial({map:textures.treeTop}),new THREE.MeshLambertMaterial({map:textures.treeTop}),new THREE.MeshLambertMaterial({map:textures.treeSide}),new THREE.MeshLambertMaterial({map:textures.treeSide})]},
 leaves:{id:7,name:'leaves',visible:true,material:new THREE.MeshLambertMaterial({map:textures.leaves})},
 sand:{id:8,name:'sand',visible:true,material:new THREE.MeshLambertMaterial({map:textures.sand})},
 cloud:{id:9,name:'cloud',visible:true,material:new THREE.MeshBasicMaterial({color:0xf0f0f0})},
 snow:{id:10,name:'snow',material:[new THREE.MeshLambertMaterial({map:textures.snowSide}),new THREE.MeshLambertMaterial({map:textures.snowSide}),new THREE.MeshLambertMaterial({map:textures.snow}),new THREE.MeshLambertMaterial({map:textures.dirt}),new THREE.MeshLambertMaterial({map:textures.snowSide}),new THREE.MeshLambertMaterial({map:textures.snowSide})]},
 jungleTree:{id:11,name:'jungleTree',material:[new THREE.MeshLambertMaterial({map:textures.jungleTreeSide}),new THREE.MeshLambertMaterial({map:textures.jungleTreeSide}),new THREE.MeshLambertMaterial({map:textures.jungleTreeTop}),new THREE.MeshLambertMaterial({map:textures.jungleTreeTop}),new THREE.MeshLambertMaterial({map:textures.jungleTreeSide}),new THREE.MeshLambertMaterial({map:textures.jungleTreeSide})]},
 jungleLeaves:{id:12,name:'jungleLeaves',material:new THREE.MeshLambertMaterial({map:textures.jungleLeaves})},
 cactus:{id:13,name:'cactus',material:[new THREE.MeshLambertMaterial({map:textures.cactusSide}),new THREE.MeshLambertMaterial({map:textures.cactusSide}),new THREE.MeshLambertMaterial({map:textures.cactusTop}),new THREE.MeshLambertMaterial({map:textures.cactusTop}),new THREE.MeshLambertMaterial({map:textures.cactusSide}),new THREE.MeshLambertMaterial({map:textures.cactusSide})]},
 jungleGrass:{id:14,name:'jungleGrass',material:[new THREE.MeshLambertMaterial({color:0x80c080,map:textures.grassSide}),new THREE.MeshLambertMaterial({color:0x80c080,map:textures.grassSide}),new THREE.MeshLambertMaterial({color:0x80c080,map:textures.grass}),new THREE.MeshLambertMaterial({color:0x80c080,map:textures.dirt}),new THREE.MeshLambertMaterial({color:0x80c080,map:textures.grassSide}),new THREE.MeshLambertMaterial({color:0x80c080,map:textures.grassSide})]}
};
export const resources=[blocks.stone,blocks.coalOre,blocks.ironOre];
