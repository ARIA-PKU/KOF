import { BaseObject } from "/static/js/base_object/base.js";

export class Player extends BaseObject {
    constructor(root, info) {
        super();

        this.root = root;
        this.id = info.id; // 玩家id
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        this.color = info.color;
        this.direction = 1;  // 1 表示朝右，-1 表示朝左

        this.vx = 0;
        this.vy = 0;

        this.speed = 400;  // 水平初始速度
        this.jump_speed = -1000;  // 垂直初始速度
        this.gravity = 50;  // 重力加速度

        this.ctx = this.root.gamemap.ctx;

        this.pressed_keys = this.root.gamemap.controller.pressed_keys;

        this.status = 3;  // 0: idle, 1: 向前，2：向后，3：跳跃，4：攻击，5：被打，6：死亡
        
        this.frame_current_cnt = 0;
        this.frame_rate = 5;

        this.animations = new Map();
    }

    start() {
        this.init_animations();  // 初始化动画
    }

    init_animations() {

    }

    update() {
        this.update_control();
        this.update_direction();

        if (this.status === 3) {  // 只有跳起状态才会受重力影响
            this.vy += this.gravity;
        }

        this.x += this.vx * this.speed * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;

        if (this.y > this.root.gamemap.ground_height) {
            // console.log(this.root.gamemap.ground_height);
            console.log(this.x);
            this.y = this.root.gamemap.ground_height;
            this.vy = this.vx = 0;
            this.status = 0;  // 变成 idle
            this.frame_current_cnt = 0;
        }

        // 防止走出地图
        if (this.x < 0) this.x = 0;
        if (this.x > this.ctx.canvas.width - this.width) {
            this.x = this.ctx.canvas.width - this.width;
        }


        this.render();
    }

    update_direction() {
        if (this.status === 6) return false;
        let players = this.root.players;
        if (players[0] && players[1]) {
            let me = this, you = players[1 - this.id];
            if (me.x > you.x) me.direction = -1;
            else me.direction = 1;
        }
    }

    update_control() {
        let w, a, d, space;
        // 判断当前玩家是0号还是1号
        if (this.id === 0) {
            w = this.pressed_keys.has('w');
            a = this.pressed_keys.has('a');
            d = this.pressed_keys.has('d');
            space = this.pressed_keys.has(' ');
        } else {
            w = this.pressed_keys.has('ArrowUp');
            a = this.pressed_keys.has('ArrowLeft');
            d = this.pressed_keys.has('ArrowRight');
            space = this.pressed_keys.has('Enter');
        }

        if (this.status === 0 || this.status === 1) {  // idle或者walk
            if (space) {
                this.vx = 0;
                this.status = 4;
                this.frame_current_cnt = 0;
            } else if (w) {
                if (a) this.vx = -1;
                else if (d) this.vx = 1;
                this.vy = this.jump_speed;
                this.status = 3;
                this.frame_current_cnt = 0;
            } else if (a) {
                this.vx = -1;
                this.status = 1;
            } else if (d) {
                this.vx = 1;
                this.status = 1;
            } else {
                this.vx = 0;
                this.status = 0;
            }
        }
    }

    render() {
        let status = this.status;
        if (status === 1 && this.vx * this.direction < 0) status = 2;

        let obj = this.animations.get(status);

        if (this.direction < 0) {  // 方向相反需要将图片镜像
            this.ctx.save();
            this.ctx.scale(-1, 1);  // 转换坐标系
            this.ctx.translate(-this.ctx.canvas.width, 0);  // 平移坐标轴位置

            if (obj && obj.loaded) {
                // 降低动作速率
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                let scale = obj.scale;
                this.ctx.drawImage(image, this.ctx.canvas.width - this.x - this.width, this.y + obj.offset_y, image.width * scale, image.height * scale);
            }

            this.ctx.restore();
        } else {  // 方向相同无需转换，绘制图像即可
            if (obj && obj.loaded) {
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
               
                let image = obj.gif.frames[k].image;
                let scale = obj.scale;
                this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * scale, image.height * scale);
            }
        }

        this.frame_current_cnt++;
        if (this.status === 4 || this.status === 5 || this.status === 6) {
            if (parseInt(this.frame_current_cnt / obj.frame_rate) >= obj.frame_cnt) {
                if (this.status !== 6) {
                    this.status = 0;
                } else {
                    this.frame_current_cnt = (obj.frame_cnt - 1) * obj.frame_rate;
                }
            }
        }
    }
    
}