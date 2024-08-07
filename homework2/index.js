
const yourUtility = (obj) => {

    const setObj = (obj, prop, val) => {
        console.log(obj)
        console.log(prop)
        console.log(val)
        if (!(prop in obj)) {
            obj[prop] = yourUtility({})
            console.log(obj[prop])
            console.log(obj)
            return obj[prop]
        }
    }

    return new Proxy(obj,{
        get(target, prop, receiver) {
            setObj(target, prop, receiver)
        },
        set(target, prop, value) {
            console.log(obj)
            console.log(prop)
            console.log(val)
            target[prop] = value;
            return true;
        },
        toJSON() {
            return Object.assign({}, this);
        }
    })
}


const ProxiedObject = yourUtility({ x: 10 })

// ProxiedObject.a = 1
// ProxiedObject: { a: 1, x: 10 }

ProxiedObject.b.c.d = 2
// ProxiedObject: { a: 1, b: { c: { d: 2 } }, x: 10 }

console.log(JSON.stringify(ProxiedObject))
// out: {"a":1,"b":{"c":{"d":2}},"x":10}
