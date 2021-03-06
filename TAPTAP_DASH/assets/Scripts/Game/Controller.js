

// 控制系统，可以控制地图和人物的移动

cc.Class({
    extends: cc.Component,
    properties: {

    },
    editor: {
        executionOrder: -1
    },
    // 启动监测
    onLoad() {
        this.countTimer = 0
        this.ro = 0
        this.path = this.node.getChildByName('path')
        this.player = this.node.getChildByName('player')
        this.pause = false

        this.schedule(function () {
            this.easeRotation()
        }, 0.020)

        this.schedule(function () {
            this.changeScale()
        }, 0.03)
    },

    // 控制人物和地图的暂停和重启
    pauseMap: function () {
        this.path.getComponent('Path').changeStatus(false)
        this.player.getComponent('Player').pausePlayer()
        this.pause = true
    },
    restartMap: function () {
        this.path.getComponent('Path').changeStatus(true)
        this.player.getComponent('Player').restartPlayer()
        this.pause = false
    },

    // 渐变修改地图的大小
    changeScale: function () {
        if (this.pause == true && this.node.scale > 0.3) {
            this.node.setScale(this.node.scale - 0.1)
        } else if (this.pause == false && this.node.scale < 1) {
            this.node.setScale(this.node.scale + 0.1)
        }
    },
    // 启动地图和人物
    launchGame: function (playerIndex, hardDegree) {
        this.path.getComponent('Path').launchGame(hardDegree)
        this.player.getComponent('Player').choosePlayer(playerIndex, hardDegree)
    },

    // 旋转摄像机和人物
    RotateCamera: function () {
        let playerDirect = this.path.getComponent('Path').requireDirect()
        this.player.getComponent('Player').rotatePlayer(playerDirect)
        
        // 如果是跳跃阶段，就不去转弯
        if (playerDirect !== 'jumpY' && playerDirect !== 'jumpXM' && playerDirect !== 'jumpXP') {
            let angle = this.path.getComponent('Path').getnextRotation()
            this.ro = this.node.rotation
            if (this.ro === angle) return
            this.countTimer = 0
            if (angle > this.ro) this.ro = 4.5
            else if (angle < this.ro) this.ro = -4.5
        }
        return true
    },
    // 检查是否游戏结束
    checkLose: function () {
        let is_exist = this.path.getComponent('Path').requireExist()
        if (is_exist === 'end') {
            return is_exist
        }
        return this.player.getComponent('Player').checkPosition(is_exist)
    },
    // 让转向动作缓慢进行
    easeRotation: function () {
        if (this.countTimer < 10) {
            this.countTimer += 1
            this.node.setRotation(this.node.rotation + this.ro)
        }
    }
});