const yourUtility = (obj) => {
    const serializeProxy = (proxyObj) => {
        let serialized = {};
        for (let key in proxyObj) {
            try {
                if (proxyObj[key] && typeof proxyObj[key] === 'object') {
                    serialized[key] = serializeProxy(proxyObj[key]);
                } else {
                    serialized[key] = proxyObj[key];
                }
            } catch (e) {
                console.error(`Ошибка сериализации для ключа ${key}:`, e);
            }
        }
        return serialized;
    }
    
    return new Proxy(obj,{
        get(target, prop, receiver) {
            if (prop === Symbol.for('nodejs.util.inspect.custom')) {
                return () => serializeProxy(target);
            } else if (prop === 'toJSON') {
                return () => serializeProxy(target);
            } else if (prop === '0') {

            } else if (typeof target[prop] === 'object' && target[prop] !== null) {
                return yourUtility(target[prop]);
            } else if (!(prop in target)) {
                target[prop] = yourUtility({})
            }
            return Reflect.get(target, prop, receiver);
        },
        
    })}


const ProxiedObject = yourUtility({ x: 10, f:{q:10} })

ProxiedObject.a.b = 1

ProxiedObject.f.b.c.d = 2

ProxiedObject.q.b.c.d = {o:213}

console.log(ProxiedObject)
console.log(ProxiedObject.f)
console.log(ProxiedObject.f.b)

console.log(JSON.stringify(ProxiedObject))
