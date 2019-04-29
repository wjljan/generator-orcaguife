import PerfectScrollbar from "perfect-scrollbar";
import store from "../../redux";

// Consider to the point of 'this' in decorator, we must be cautious
// of the  using of 'function' and 'arrow function'.

// To decorate a class, then:
// 'target' points to the class,
// 'key' points to undefined,
// 'descriptor' points to undefined.

// Another usage: to decorate a member method of a class, will be like this:
// 'target' points to the class extends from React origin Component,
// 'key' points to the member property name,
// 'descriptor' points to the member property method.

// ES7 decorator is implemented based on Object.defineProperty(obj, prop, descriptor) .

// Add a method into a class.
export function validationUpdateState (lang){
	// Decorate a class.
	return function (target){
		target.prototype.validationUpdateState = async function (key, help, valid){
			let obj = {valid};
			if (Number.isInteger(help)){
				// On initialization or data migration page, value of help will be a number.
				obj['status'] =  help ? 'error' : '';
				obj['help'] = help;
			} else {
				// On other pages, it will be an object, like {cn: 'xxx', en: 'xxx'}.
				let {cn, en} = help;
				obj['status'] =  (cn || en) ? 'error' : '';
				obj['help'] = lang(cn, en);
			}
			let validation = Object.assign({}, this.state.validation, {[key]: obj});
			await this.setState({validation});
		};
	}
}

// Throttle a method of a class.
export function throttle (time){
	// Decorate a member method of a class.
	const instanceMap = new Map();
	return function (target, key, descriptor){
	    return Object.assign({}, descriptor, {
			value: function (...args){
				if (instanceMap.get(this)){
                    instanceMap.set(this, false);
                    setTimeout(() => {
                        descriptor.value.apply(this, args);
                        instanceMap.set(this, true);
                    }, time);
                }
			}
		});
    }
}

// Debounce a method of a class.
export function debounce (time = 500){
	// Decorate a member method of a class.
	// We need the parameter time, so use a currying here.
	// this => undefined
	const instanceMap = new Map();
	return function (target, key, descriptor){
		return Object.assign({}, descriptor, {
			value: function (...args){
				// target => class extends from React origin Component
				// this => custom React component instance
				clearTimeout(instanceMap.get(this));
				// Some times we need to be waiting for the end of this call, so we need
				// to return a promise here to make this decorator asynchronous.
				return new Promise(resolve => {
					instanceMap.set(this, setTimeout(async () => {
						// Correct the context to custom React component instance.
						await descriptor.value.apply(this, args);
						instanceMap.delete(this);
						resolve(9);
					}, time));
				});
			}
		});
	}
}

// Add a create scrollbar operation into a method of a class.
export function createScrollbar (clsNameArr, options = {}){
	// Decorate a member method of a class.
	return function (target, key, descriptor){
		return Object.assign({}, descriptor, {
			value: function (...args){
				if (typeof clsNameArr === 'string'){
					clsNameArr = [clsNameArr];
				}
				if (!this.fsScrollbarArr){
					this.fsScrollbarArr = [];
				}
				clsNameArr.forEach(clsName => {
					// The container DOM should have a position style, and make sure the
					// value is not 'static'. Because during the creation, it will create
					// two axes into the container, and their position values are 'absolute'.
					// Otherwise they will display outside of the container.
					// Also the container should be a normal container.
					const containerDOM = document.getElementsByClassName(clsName)[0];
					if (containerDOM){
						let fsScrollbar = new PerfectScrollbar(containerDOM, {wheelSpeed: 2, ...options});
						fsScrollbar['containerClsName'] = clsName;
						this.fsScrollbarArr.push(fsScrollbar);
					}
				});
				descriptor.value.apply(this, args);
			}
		});
	}
}

// Add a destroy scrollbar operation into a method of a class.
export function destroyScrollbar (target, key, descriptor){
	// Decorate a member method of a class.
	return Object.assign({}, descriptor, {
		value: function (...args){
			if (Array.isArray(this.fsScrollbarArr)){
				this.fsScrollbarArr.forEach(scrollbar => {
					scrollbar.destroy();
					scrollbar = null;
				});
				this.fsScrollbarArr = null;
			}
			descriptor.value.apply(this, args);
		}
	});
}

// Fetch error decorator.
// This decorator is used on the APIs that are aimed at getting data only,
// especially getting data in background.
// The APIs which are used by CUD operations will catch error by the operations
// themselves in specific business codes.
export function catchAPIError (target, key, descriptor){
    return Object.assign({}, descriptor, {
        value: function (...arg){
            try {
                return descriptor.value.apply(this, arg);
            } catch ({msg}){
                let {language} = store.getState();
                console.info('HTTP request error: ' + (msg || (language === 'chinese' ? '无明确错误信息' : 'No clear error message')));
            }
        }
    });
}

// Dispatch redux action decorator.
export function dispatchAction (actionModules, action, dataKey){
	if (!Array.isArray(actionModules)){
		actionModules = [[actionModules, action, dataKey]]
	}
    return function (target, key, descriptor){
        return Object.assign({}, descriptor, {
            value: async function (...arg){
				let data = await descriptor.value.apply(this, arg);
				let rawData = Object.assign({}, data);
            	// actionModule, action, dataKey
				actionModules.forEach(module => {
					let [actionModule, action, dataKey] = module;
					data = !!dataKey ? data[dataKey] : data;
					!!data && store.dispatch(actionModule[action](data));
				});
                return rawData;
            }
        });
    };
}