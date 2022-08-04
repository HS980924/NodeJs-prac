import {odd, even} from './var';

function checkOddOrEven(num){
    if(num%2){
        return odd;
    }else{
        return even;
    }
}

export default checkOddOrEven;

