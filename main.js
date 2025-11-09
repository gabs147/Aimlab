const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 3, 3, 3 );
const material = new THREE.MeshBasicMaterial( { color: 0x4D27F5 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

isCreate = true
function createCube(){
    scene.add(cube);
    cube.position.x = Math.random()*30
}

// cube.position.x = 3;
// const cube1 = new THREE.Mesh( geometry, material );
// scene.add( cube1 );
// const cube2 = new THREE.Mesh( geometry, material );
// scene.add( cube2 );
// cube2.position.x = -3;

function Disparo(objeto){
    scene.remove(objeto)

    setTimeout(()=>{
    createCube()
    }, "500");
}

camera.position.z = 50;



const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
var isActive = false;

setTimeout(() => {
  console.log("ya se puede mover el cubo")
  isActive=true;
}, "10");

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener('mousemove', onMouseMove, false);
var time = 0;
function animate() {
  requestAnimationFrame(animate);
  time +=0.00010;

  cube.position.y = 10 * Math.sin(time);
  onmousedown = (event) => {
    console.log("Click")
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true); // 'true' for recursive check

    if (intersects.length > 0) {
      const firstIntersectedObject = intersects[0].object;
      Disparo(firstIntersectedObject)
      //firstIntersectedObject.position.y = 2;
      //scene.remove(firstIntersectedObject)
    }
  }
  renderer.render( scene, camera );

}