
//import operations from "/scripts/operations.js";
import  {inputManger, input, inputManagerUpdate} from "/scripts/inputManager/index.js";
import  {controlsFunctions as controls} from "/scripts/controls/index.js";

var windowSize = {x: window.innerWidth, y: innerHeight};
const renderer = new THREE.WebGLRenderer({alpha: true});
const camera = new THREE.PerspectiveCamera( 75, windowSize.x/ windowSize.y, .1, 1000 );
const scene = new THREE.Scene();

renderer.setSize(windowSize.x, windowSize.y); 

async function init(){
    document.getElementById("gameWindow").appendChild( renderer.domElement );

    scene.add( camera );




    // Box2D variables
    var b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2Body = Box2D.Dynamics.b2Body,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    b2World = Box2D.Dynamics.b2World,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
    
    time_last_run, // used to calculate simulation delta
    
    world, // This will hold the box2dweb objects
    bodyDef = new b2BodyDef, // `bodyDef` will describe the type of bodies we're creating
    
    // Create a fixture definition
    //  `density` represents kilograms per meter squared.
    //        a denser object will have greater mass
    //    `friction` describes the friction between two objects
    //    `restitution` is how much "bounce" an object will have
    //        "0.0" is no restitution, "1.0" means the object won't lose velocity
    fixDef = new b2FixtureDef;



    // will become the player in the future
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial( { color: new THREE.Color(1,0,0) } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );



    // second block to "player" movement reference
    const geometry2 = new THREE.BoxGeometry();
    const material2 = new THREE.MeshBasicMaterial( { color: new THREE.Color(0,0,1) } );
    const cube2 = new THREE.Mesh( geometry2, material2 );
    scene.add( cube2 );

    cube2.position.x = 2;

    camera.position.z = 5;





    
    world = new b2World(
        new b2Vec2( 0, -.5 ), // Gravity
        true                  // Allow objects to sleep
    );

    
    fixDef.shape = new b2CircleShape;
    
    fixDef.shape.SetRadius( 1 );

    bodyDef.type = b2Body.b2_dynamicBody; // balls can move
    bodyDef.position.y = cube.position.y;
    bodyDef.position.x = cube.position.x; // Random positon between -20 and 20
    bodyDef.userData = cube; // Keep a reference to `ball`
    world.CreateBody( bodyDef ).CreateFixture( fixDef ); // Add this physics body to the world




    var floor = window.floor = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial({color: new THREE.Color(0,1,0)}) );
    //new THREE.Mesh( new THREE.PlaneGeometry( 100, 50 ), new THREE.MeshBasicMaterial({color: new THREE.Color(0,1,0)}) );
    scene.add( floor );
    //floor.rotation.x=-2
    
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(floor.scale.x/2,floor.scale.y/2); // "50" = half width of the floor, ".1" = half height
    
    bodyDef.type = b2Body.b2_staticBody; // choose behaveior type: statik or dynamic
    bodyDef.position.x = floor.position.x;
    bodyDef.position.y = floor.position.y = -5; // position the floor
    bodyDef.angle = floor.rotation.x;
    bodyDef.userData = floor; // Keep a reference to `floor`
    world.CreateBody( bodyDef ).CreateFixture( fixDef ); // Add this physics body to the world




    // loop
    function update() {
        requestAnimationFrame( update );
        inputManagerUpdate();

        //cube.position.x += inputManger.horizontal/100;

        camera.lookAt(cube.position);




        var delta, now = (new Date()).getTime();
    
        if ( time_last_run ) {
            delta = ( now - time_last_run ) / 1000;
        } else {
            delta = 1 / 60;
        }
        time_last_run = now; 
        
        world.Step(
            delta * 2, // double the speed of the simulation
            10,        // velocity iterations
            10         // position iterations
        );


        // Update the scene objects
        var object = world.GetBodyList(), mesh, position;
        while ( object ) {
            mesh = object.GetUserData();
            
            if ( mesh ) {
                // Nice and simple, we only need to work with 2 dimensions
                position = object.GetPosition();
                mesh.position.x = position.x;
                mesh.position.y = position.y;
                
                // GetAngle() function returns the rotation in radians
                mesh.rotation.z = object.GetAngle();
            }
            
            object = object.GetNext(); // Get the next object in the scene
        }
    

        camera.position.y=cube.position.y;


 
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