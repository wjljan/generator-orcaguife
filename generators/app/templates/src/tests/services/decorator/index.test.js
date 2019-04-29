import {throttle} from 'Services';

describe('Decorator service', () => {
    it('Throttle', () => {
        // Decorate a method of a class.
        class A {
            // Control the call frequency of fnc.
            @throttle(100)
            fnc (){

            }
        }
        let a = new A();
        a.fnc();
        a.fnc();
        a.fnc();
    });
});