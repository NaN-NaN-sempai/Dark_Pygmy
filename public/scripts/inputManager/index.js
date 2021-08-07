import  {controlsFunctions} from "/scripts/controls/index.js";
var inputManger;

function inputManagerUpdate () {
    inputManger = {
        horizontal: input.linear(controlsFunctions.simpleGetKey("a"), controlsFunctions.simpleGetKey("d")),
        vertical: input.linear(controlsFunctions.simpleGetKey("s"), controlsFunctions.simpleGetKey("w")),

        /* Needs initializeMouseCapture();
        
        camera: {
            horizontal: controlsFunctions.getMouseAxis("horizontal"),
            vertical: controlsFunctions.getMouseAxis("vertical")
        } */
    }
}

var input = {
    singular: (direction = false) => {
        return direction1? 1: 0;
    },
    linear: (direction1 = false, direction2 = false) => {
        return direction1 && direction2? 0: 
               direction1? -1:
              direction2? 1: 0;
    }
}

export {inputManger, input, inputManagerUpdate};