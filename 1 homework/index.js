const curry = (func, delay, delaySinceCompletion = false, waitForPrevious = false, queueLimit = 0) => {
    let queue = [];
    let lastCallTime = null;
    let lastCompletTime = null;
    let isProcessing = false;

    const _curry = () => {
        if (isProcessing || queue.length === 0) {
            return;
        }

        isProcessing = true;
        const { func, args, resolve, reject } = queue.shift();

        const execute = async () => {
            lastCallTime = Date.now();
            try {
                const result = await func(...args);
                lastCompletTime = Date.now();
                isProcessing = false;
                resolve(result);
                _curry();
            } catch (err) {
                lastCompletTime = Date.now();
                isProcessing = false;
                reject(err);
                _curry();
            }
        };

        if (delaySinceCompletion && lastCompletTime !== null) {
            const delayTime = delay - (Date.now() - lastCompletTime);
            if (delayTime > 0) {
                setTimeout(execute, delayTime);
            } else {
                execute();
            }
        } else {
            const delayTime = delay - (Date.now() - (lastCallTime || 0));
            if (delayTime > 0) {
                setTimeout(execute, delayTime);
            } else {
                execute();
            }
        }
    };

    return (...args) => {
        return new Promise((resolve, reject) => {
            if (queueLimit && queue.length >= queueLimit) {
                reject(`привышен лимит очереди когда пытался запустить с аргументом: ${args}`);
                return;
            }

            queue.push({ func, args, resolve, reject });
            if (!waitForPrevious || !isProcessing) {
                _curry();
            }
        });
    };
}

const myFunc = (x) => {
    console.log(`запустил с аргументом ${x}`);
    setTimeout(() => console.log(`выполнил с аргументом ${x}`), 1000); 
}

const f = curry(myFunc, 5000, true, true, 3);

f("123").catch(console.error);
f("asd").catch(console.error);
f("zxc").catch(console.error);
f("qwe").catch(console.error);
f("кен").catch(console.error);
f("апр").catch(console.error);
