import { BaseObject } from '/static/js/base_object/base.js';
import { Controller } from '/static/js/controller/controller.js';

export class GameMap extends BaseObject {
    constructor(root) {
        super();

        this.root = root;

        this.ground_height = 450;  // 地面高度
        // tabindex=0使得canvas可以聚焦
        this.$canvas = $('<canvas width="1280" height="720" tabindex=0></canvas>');
        this.ctx = this.$canvas[0].getContext('2d');

        this.root.$kof.append(this.$canvas);
        // 聚焦
        this.$canvas.focus();

        this.controller = new Controller(this.$canvas);
        

    }

    start() {

    }

    update() {
        this.render();
    }

    render() {
        // 刷新页面
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}