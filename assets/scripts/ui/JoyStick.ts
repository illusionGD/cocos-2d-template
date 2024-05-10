/*
 * @Author: IT-hollow
 * @Date: 2024-05-10 21:19:31
 * @LastEditors: hollow
 * @LastEditTime: 2024-05-10 21:38:06
 * @FilePath: \cocos-2d-template\assets\scripts\ui\JoyStick.ts
 * @Description: 虚拟摇杆
 *
 * Copyright (c) 2024 by efun, All Rights Reserved.
 */
import {
    _decorator,
    Component,
    Vec3,
    v3,
    EventTouch,
    Input,
    Sprite,
    math,
} from 'cc'
const { ccclass, property } = _decorator

@ccclass('JoyStick')
export class JoyStick extends Component {
    @property(Sprite)
    joyStickBg: Sprite = null

    @property(Sprite)
    thumbnail: Sprite = null

    @property(Number)
    radius: number = 130

    /**是否开启跟随鼠标位置 */
    @property(Boolean)
    fromMousePosition: Boolean = false

    VirtualInput = {
        horizontal: 0,
        vertical: 0,
    }
    /**初始化的位置 */
    initJoyStickBgPosition: Vec3 = v3()
    start() {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this)
        this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this)
        // 记住初始的位置
        this.initJoyStickBgPosition = this.joyStickBg.node.worldPosition.clone()
    }
    onTouchStart(e: EventTouch) {
        const { x, y } = e.getUILocation()
        const localPosition = v3()
        if (this.fromMousePosition) {
            this.node.inverseTransformPoint(localPosition, v3(x, y, 0))
        }
        this.joyStickBg.node.setPosition(localPosition)
    }
    onTouchMove(e: EventTouch) {
        const { x, y } = e.getUILocation()

        const worldPosition = v3(x, y, 0)
        const localPosition = v3()
        // 将触摸点（世界坐标），转成控制器的本地坐标，之后计算向量的长度
        this.joyStickBg.node.inverseTransformPoint(localPosition, worldPosition)

        const thumbnailPosition = v3()
        // 计算向量的长度
        const len = localPosition.length()
        // 向量归一化：为了*向量长度
        localPosition.normalize()
        // 逐元素向量乘加: A + B * scale, scale不能大于半径
        Vec3.scaleAndAdd(
            thumbnailPosition,
            v3(),
            localPosition,
            math.clamp(len, 0, this.radius)
        )

        // 设置位置
        this.thumbnail.node.setPosition(thumbnailPosition)

        this.VirtualInput.horizontal = thumbnailPosition.x / this.radius
        this.VirtualInput.vertical = thumbnailPosition.y / this.radius
    }

    onTouchEnd() {
        // 回到初始位置
        this.joyStickBg.node.worldPosition = this.initJoyStickBgPosition
        this.thumbnail.node.setPosition(v3())
        this.VirtualInput.horizontal = 0
        this.VirtualInput.vertical = 0
    }
    /**获取虚拟摇杆输入值：[0-1] */
    getVirtualInput() {
        return this.VirtualInput
    }
}
