
//import operations from "/scripts/operations.js";
import  {inputManger, input, inputManagerUpdate} from "/scripts/inputManager/index.js";
import  {controlsFunctions as controls} from "/scripts/controls/index.js";
import { gameObject } from "/scripts/gameObject/index.js";
import {b2Vector, b2BodyDef, b2Body, b2FixtureDef, b2Fixture, 
        b2World, b2MassData, b2PolygonShape, b2CircleShape,
        b2DebugDraw} from "/scripts/box2d/variables.js";



        
var windowSize = {x: window.innerWidth, y: innerHeight};
const renderer = new THREE.WebGLRenderer({alpha: true});
const camera = new THREE.PerspectiveCamera( 75, windowSize.x/ windowSize.y, .1, 1000 );
const scene = window.scene = new THREE.Scene();

renderer.setSize(windowSize.x, windowSize.y); 

var world = window.world = new b2World(
    new b2Vector( 0, -10 ), // Gravity
    true                  // Allow objects to sleep
);



var time_last_run; // for calculating b2d time

async function init(){
    document.getElementById("gameWindow").appendChild( renderer.domElement );
    

    scene.add( camera );




    // will become the player in the future
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial( { wireframe: true, color: new THREE.Color(1,0,0) } );
    const cube = new THREE.Mesh( geometry, material );
    
    var truC = window.c = new gameObject({
        tjs: cube,
        b2type: b2PolygonShape,
        dynamic: true
    })
    //scene.add( cube );



    // second block to "player" movement reference
    const geometry2 = new THREE.BoxGeometry();
    const material2 = new THREE.MeshBasicMaterial( {color: new THREE.Color(0,0,1) } );
    const cube2 = new THREE.Mesh( geometry2, material2 );
    scene.add( cube2 );
    cube2.position.x=2;
 

    camera.position.z = 4;


    var floor = window.floor = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ wireframe: true,color: new THREE.Color(0,1,0)}) );
    floor.position.y = -5;
    floor.scale.x = 10;

    var realFloor = new gameObject({
        tjs: floor,
        b2type: b2PolygonShape
    });

    var wall = window.floor = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ wireframe: true,color: new THREE.Color(0,1,1)}) );
    wall.position.x=-5;
    wall.position.y=-2;
    wall.scale.y=5;

    var realFloor = new gameObject({
        tjs: wall,
        b2type: b2PolygonShape
    });


    var hx;

    // loop
    function update() {
        requestAnimationFrame( update );
        inputManagerUpdate();

        //cube.position.x += inputManger.horizontal/100;

        camera.lookAt(cube.position);

        hx = inputManger.horizontal/10;


        var delta, now = (new Date()).getTime();
    
        if ( time_last_run ) {
            delta = ( now - time_last_run ) / 1000;
        } else {
            delta = 1 / 60;
        }
        time_last_run = now; 
        
        world.Step(
            delta, // double the speed of the simulation
            10,        // velocity iterations
            10         // position iterations
        );

        c.b2Object.m_body.ApplyImpulse({x:hx,y:inputManger.vertical},{x:0,y:0})

        // Update the scene objects
        var object = world.GetBodyList(), mesh, position;
        while ( object ) {
            mesh = object.GetUserData();
            
            if ( mesh ) {
                // Nice and simple, we only need to work with 2 dimensions
                position = object.GetPosition();
                window.tet=object;
                mesh.position.x = position.x;
                mesh.position.y = position.y;
                //mesh.rotation.z = 
                
                // GetAngle() function returns the rotation in radians
                mesh.rotation.z = object.GetAngle();
            }
            
            object = object.GetNext(); // Get the next object in the scene
        }
    

/* 
        camera.position.y=cube.position.y;
        camera.position.x=cube.position.x; 

 */
 
        renderer.render( scene, camera );
    }
    update();
}
init();

window.addEventListener("resize", ()=>{ 
    windowSize = {x: window.innerWidth, y: innerHeight};
    renderer.setSize(windowSize.x, windowSize.y);
    camera.aspect = windowSize.x/ windowSize.y;
    camera.updateProjectionMatrix();
})