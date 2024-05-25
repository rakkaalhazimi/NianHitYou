import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 
  100,                                     // Field of View
  window.innerWidth / window.innerHeight, // Aspect Ratio
  0.1,                                    // Object closer than near won't be rendered
  1000                                    // Object further than far won't be rendered
);

// Scene background color
scene.background = new THREE.Color( 0x000 );

// Register the renderer to body tag
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Camera Movement
// const controls = new OrbitControls(camera, renderer.domElement);

// Initial camera position
camera.position.z = 5;
camera.position.y = 2;
camera.position.x = 3;


// Draw Cube
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );



// Load teapot .obj file
// const loader = new OBJLoader();
// loader.load('models/teapot.obj', data => scene.add(data));


// Load Nian Bean .obj, .mtl and texture file
let nianBean;
let mtlLoader = new MTLLoader();
let texture = new THREE.TextureLoader().load('models/nian-bean.png');
let meshMaterial = new THREE.MeshBasicMaterial({map: texture});

mtlLoader.load('models/nian-bean.mtl', ( materials ) => {
  
  materials.preload();
  new OBJLoader()
    .setMaterials(materials)
    .load('models/nian-bean.obj', (obj) => {
      
      obj.traverse( child => {
        if (child.isMesh) {
          child.material = meshMaterial;
        }
      })
      
      obj.rotateY(1.65);
      obj.translateZ(3);
      
      scene.add(obj);
      nianBean = obj;
    });
    
})

// Load Nian Bean .stl file
// const stlLoader = new STLLoader();
// stlLoader.load('models/nian-bean.stl', (geometry) => {
//   scene.add(geometry);
// })


// Object Movement
const ARROW_UP = 'ArrowUp';
const ARROW_DOWN = 'ArrowDown';
const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';
const MOVE_SPEED = 0.05;

function moveObj(event) {
  
  let currentObj = nianBean;
  
  switch (event.code) {
    case (ARROW_UP):
      currentObj.translateY(MOVE_SPEED);
      break;
    
    case (ARROW_DOWN):
      currentObj.translateY(-MOVE_SPEED);
      break;
    
    case (ARROW_LEFT):
      currentObj.translateX(-MOVE_SPEED);
      break;
    
    case (ARROW_RIGHT):
      currentObj.translateX(MOVE_SPEED);
      break;
  }
}
document.onkeydown = moveObj;

function playAudio() {
  let audioTag = new Audio();
  audioTag.preload = 'auto';
  audioTag.src = 'audio/pipe-falling-meme.mp3';
  audioTag.play();
}

function moveObjBackAndForward() {
  
  
  let value = 0;
  let increment = 0.03;
  
  function move(obj) {
    
    if (!obj) return;
    
    obj.translateX(increment);
    value += increment;
    
    if (value > 1) {
      increment *= -1;
    }
    
    if (value < -5) {
      console.log('hit');
      increment *= -1;
      // playAudio();
    }
    
  }
  
  return move;
}
let moveNian = moveObjBackAndForward();

// Render Scene
function animate() {
	requestAnimationFrame( animate );
  
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  // cube.rotation.z += 0.01;
  // cube.translateX(0.01);
  moveNian(nianBean);
  
	renderer.render( scene, camera );
}
animate();

