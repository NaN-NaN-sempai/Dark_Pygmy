
//import operations from "/scripts/operations.js";
import  {inputManger, input, inputManagerUpdate} from "/scripts/inputManager/index.js";
import  {controlsFunctions as controls} from "/scripts/controls/index.js";

var windowSize = {x: window.innerWidth, y: innerHeight};
const renderer = new THREE.WebGLRenderer({alpha: true});
const camera = new THREE.PerspectiveCamera( 75, windowSize.x/ windowSize.y, 0.1, 1000 );

async function init(){
    const scene = new THREE.Scene();

    renderer.setSize(windowSize.x, windowSize.y); 
    document.getElementById("gameWindow").appendChild( renderer.domElement );

    scene.add( camera );

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame( animate );
        inputManagerUpdate();

        cube.position.x += inputManger.horizontal/100;

        camera.lookAt(cube.position);

        renderer.render( scene, camera );
    }
    animate();
}
init();

window.addEventListener("resize", ()=>{ 
    windowSize = {x: window.innerWidth, y: innerHeight};
    renderer.setSize(windowSize.x, windowSize.y);
    camera.aspect = windowSize.x/ windowSize.y;
    camera.updateProjectionMatrix();
})