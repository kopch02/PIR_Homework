
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

const yourUtility = (obj) => new Proxy(obj,{
        get(target, prop, receiver) {
            if (typeof obj[prop] === 'object' && obj[prop] !== null) {
                return yourUtility(obj[prop]);
            }
            if (!(prop in obj)) {
                obj[prop] = yourUtility({})
            }
            if (prop === 'toJSON') {
                return () => serializeProxy(target);
            } else {
                return Reflect.get(target, prop, receiver)
            }
        },
        
    })


const ProxiedObject = yourUtility({ x: 10, f:{q:10} })

ProxiedObject.a = 1

ProxiedObject.f.b.c.d = 2

ProxiedObject.q.b.c.d = {o:213}

console.log(ProxiedObject)
console.log(ProxiedObject.q)
// console.log(ProxiedObject.f.b)

console.log(JSON.stringify(ProxiedObject))
