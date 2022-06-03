let base_objects = []

export class BaseObject {
    constructor() {
        base_objects.push(this);  // 将当前元素放入

        this.timedelta = 0;
        this.has_start_called = false;
    }

    start() {  // 初始执行一次
    }

    update() {  // 除了第一帧外，每帧刷新

    }

    destroy() {  // 销毁对应元素
        for (let i in base_objects) {
            if (base_objects[i] === this) {
                base_objects.splice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp;
let step = (timestamp) => {  // 每帧调用
    for (let obj of base_objects) {
        if (!obj.has_start_called) {
            obj.start();
            obj.has_start_called = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update()
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(step);
};

requestAnimationFrame(step);