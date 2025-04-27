import * as THREE from 'three';
import { getCardMesh } from './card';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const cardMesh = getCardMesh(renderer.capabilities.getMaxAnisotropy());

scene.add( cardMesh );

scene.background = new THREE.Color().addScalar(-0.1);

const light = new THREE.DirectionalLight(0xffffff, Math.PI/8);
const light2 = new THREE.AmbientLight(0xffffff, Math.PI/8*7);
light.position.set(0, 0, 1);
scene.add(light, light2);

camera.position.z = 1;


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener('resize', onWindowResize, false);

let isBacksideShown = false;
function onMouseClick() {
    isBacksideShown = !isBacksideShown;
}
window.addEventListener('click', onMouseClick, false);

let lastTime = 0;
let rotation = new THREE.Euler();
let targetRotation = new THREE.Euler();


const CARD_ROT_SPEED_RADS = 0.002;
const MAX_TIME_STEP_MILLIS = 500;
const ONE_MIN_MILLIS = 60*1000
const CARD_REVOLUT_PER_MIN = 30;
const CARD_ROT_SPEED = CARD_REVOLUT_PER_MIN/ONE_MIN_MILLIS
const CARD_MAX_ROT_RADS = 0.1
const CARD_Y_OFFSET = 0.05
const CARD_CIRCLE_X_SIZE = 3
const CARD_CIRCLE_Y_SIZE = 0.5

function animate() {
    const delta = Math.min(Date.now() - lastTime, MAX_TIME_STEP_MILLIS);
    lastTime = Date.now();
    targetRotation.y = Math.cos(Date.now()*CARD_ROT_SPEED)*CARD_MAX_ROT_RADS*CARD_CIRCLE_X_SIZE;
    targetRotation.x = Math.sin(Date.now()*CARD_ROT_SPEED)*CARD_MAX_ROT_RADS*CARD_CIRCLE_Y_SIZE+CARD_Y_OFFSET;

    rotation.x += (targetRotation.x - rotation.x) * delta * CARD_ROT_SPEED_RADS;
    rotation.y += (targetRotation.y - rotation.y) * delta * CARD_ROT_SPEED_RADS;

    cardMesh.setRotationFromEuler(rotation);

	renderer.render(scene, camera);
}