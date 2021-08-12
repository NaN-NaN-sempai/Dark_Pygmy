import {b2Vector, b2BodyDef, b2Body, b2FixtureDef, b2Fixture, 
        b2World, b2MassData, b2PolygonShape, b2CircleShape,
        b2DebugDraw} from "/scripts/box2d/variables.js";

export class gameObject {
    constructor(consObj){
        
        this.threeObject = consObj.tjs || new THREE.Mesh( new THREE.BoxGeometry(), new THREE.MeshBasicMaterial( { color: new THREE.Color(1,0,0) } ) );;
        
        scene.add(this.threeObject);

        this.threeObject.gameObjectType = consObj.gameObjectType;


        // b2CircleShape or
        var fixDef = new b2FixtureDef;

        fixDef.shape = new consObj.b2type;
 
        if(fixDef.shape.type){
            fixDef.shape.SetRadius(this.threeObject.scale.x);
        } else {
            var b2offset = 2;
            fixDef.shape.SetAsBox(this.threeObject.scale.x/b2offset,  this.threeObject.scale.y/b2offset);
        }

    
        var bodyDef = new b2BodyDef;

        bodyDef.type = consObj.dynamic? b2Body.b2_dynamicBody: // if can move
                                        b2Body.b2_staticBody; 

        bodyDef.position.y = this.threeObject.position.y;

        bodyDef.position.x = this.threeObject.position.x;

        bodyDef.angle = this.threeObject.rotation.z;

        bodyDef.userData = this.threeObject; // Keep a reference to this

        this.b2Object = window.world.CreateBody( bodyDef ).CreateFixture( fixDef ); // Add this physics body to the world
    

    }

    inColision(search){
        var result;
        if(search != undefined){ // procurar colisão expecifica

        } else { // qualquer colisão
            
        }
    }

    setPos(x,y){
        
    }
}