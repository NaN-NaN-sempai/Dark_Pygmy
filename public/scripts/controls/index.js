var controls = {}
var controlsFunctions = {
    createKey: (key = undefined) => {
        controls[key] = {
            down: {state: false, once: false},
            state: false,
            up: {state: false, once: false},
            simpleDown: {state: false, once: false},
            simpleState: false,
            simpleUp: {state: false, once: false}
        };
    },
    checkKey: (key = undefined) => {
        if(!controls[key]){  
            controlsFunctions.createKey(key);
        }
        if(!controls[key.toLowerCase()]){  
            controlsFunctions.createKey(key.toLowerCase());
        }
    },
    getKeyDown: (key) => {
        controlsFunctions.checkKey(key);
        controls[key].down.state = false;

        if(controlsFunctions.getKey(key) && !controls[key].down.once){
            controls[key].down.state = controls[key].down.once = true; 
        } else if(controlsFunctions.getKeyUp(key)){
            controls[key].down.once = false;
        } 

        return controls[key].down.state;
    },
    getKey: (key) => {
        controlsFunctions.checkKey(key);
        return controls[key].state;
    },
    getKeyUp: (key) => {
        controlsFunctions.checkKey(key);
        controls[key].up.state = false;

        if(controlsFunctions.getKey(key)){
            controls[key].up.once = true; 
        } else if(controls[key].up.once){
            controls[key].up.once = false;
            controls[key].up.state = true;
        }

        return controls[key].up.state;
    },
    simpleGetKeyDown: (key) => {
        key = key.toLowerCase();
        controlsFunctions.checkKey(key);
        controls[key].simpleDown.state = false;

        if(controlsFunctions.simpleGetKey(key) && !controls[key].simpleDown.once){
            controls[key].simpleDown.state = controls[key].simpleDown.once = true; 
        } else if(controlsFunctions.simpleGetKeyUp(key)){
            controls[key].simpleDown.once = false;
        } 

        return controls[key].simpleDown.state;
    },
    simpleGetKey: (key) => {
        controlsFunctions.checkKey(key.toLowerCase());
        return controls[key.toLowerCase()].simpleState;
    },
    simpleGetKeyUp: (key) => {
        key = key.toLowerCase();
        controlsFunctions.checkKey(key);
        controls[key].simpleUp.state = false;

        if(controlsFunctions.simpleGetKey(key)){
            controls[key].simpleUp.once = true; 
        } else if(controls[key].simpleUp.once){
            controls[key].simpleUp.once = false;
            controls[key].simpleUp.state = true;
        }

        return controls[key].simpleUp.state;
    },
    fixButton: (button)=>typeof button == "number"? "Mouse"+button: button,
    getMouseDown: (button) => {
        button = controlsFunctions.fixButton(button);

        return controlsFunctions.getKeyDown(button);
    },
    getMouse: (button) => {
        button = controlsFunctions.fixButton(button);

        return controlsFunctions.getKey(button);
    },
    getMouseUp: (button) => {
        button = controlsFunctions.fixButton(button);

        return controlsFunctions.getKeyUp(button);
    },
    getMouseAxis: (direction) => {
        direction = direction.toLowerCase();
        return typeof controls.mouseMoves[direction] == "number"? controls.mouseMoves[direction]: 0;
    },
    keyPress: (e, type = ["keydown", "keyup"], mouseButton = false) => {  
        //e.preventDefault(); 
        var key = mouseButton? "Mouse"+e.button:
                               e.key == " "? "Space": e.key; 
        controlsFunctions.checkKey(key);
        controls[key].state = e.type == type[0]? true: false; 
        
        controls[key.toLowerCase()].simpleState = e.type == type[0]? true: false;  
    },
    getMouseWheel: (axis = "y") => {
        return typeof controls.mouseWheel[axis] == "number"? controls.mouseWheel[axis]: 0;
    }
}

window.onkeydown = window.onkeyup = function(e){controlsFunctions.keyPress(e)};

var initializeMouseCapture = (dom, ignoreLeftClick = true, lockFunction = ()=>{}, unlockFunction = ()=>{}) => {
    dom.onmousedown = dom.onmouseup = function(e){
        if(ignoreLeftClick){
            e.preventDefault();
        }
        controlsFunctions.keyPress(e, ["mousedown", "mouseup"], true)
    };
    controls.mouseWheel = {}
    var wheelTimeout;
    dom.addEventListener("wheel", function(e){
        clearTimeout(wheelTimeout); 
        controls.mouseWheel.y = e.deltaY / 100;
        controls.mouseWheel.x = e.deltaX / 100; 
        wheelTimeout = setTimeout(()=>{
            controls.mouseWheel.y = controls.mouseWheel.x = 0
        }, 10);
    });
    var camera = new THREE.Camera();
    var captureMouse = new THREE.PointerLockControls( camera, dom );

    controls.mouseMoves = {
        horizontal: 0,
        vertical: 0
    }

    var trashHolder = {x: 1, y: 1};
    var clearMouseMoveInterval; 
    captureMouse.addEventListener('change', function(e){ 
        clearTimeout(clearMouseMoveInterval); 

        camera.rotation.z = 0; 

        camera.rotation.x = camera.rotation.x > trashHolder.x || camera.rotation.x < -trashHolder.x? 0: camera.rotation.x 
        controls.mouseMoves.horizontal = camera.rotation.x * 500; 
         
        camera.rotation.y = camera.rotation.y > trashHolder.y || camera.rotation.y < -trashHolder.y? 0: camera.rotation.y;
        controls.mouseMoves.vertical = camera.rotation.y * 500; 

        camera.rotation.y = 0
        camera.rotation.x = 0

        clearMouseMoveInterval = setTimeout(()=>{
            controls.mouseMoves.vertical = 0;
            controls.mouseMoves.horizontal = 0;  
        }, 10)
    })
    captureMouse.addEventListener( 'lock', function () {
        lockFunction();
    } );

    captureMouse.addEventListener( 'unlock', function () {
        unlockFunction();
    } );
    dom.onclick = function(){ captureMouse.lock() }
}

export {initializeMouseCapture, controls, controlsFunctions};