// 开始场景，可转换到选择模式的场景

cc.Class({
    extends: cc.Component,

    // 把各个节点加载进来
    properties: {
        audioButton: {
            type: cc.AudioSource,
            default: null
        },
    },
    onLoad() {
        this.dataBase = require('DataBase')
        this.dataBase.playerChoice = 1
        this.loadProperties()
        this.initStartStage()
    },

    // 绑定属性
    loadProperties: function () {
        this.node.getChildByName('Volume').getComponent(cc.AudioSource).play()
        this.node.getChildByName('Volume').getComponent(cc.AudioSource).loop = true
        // 插图
        this.dataBase = require('DataBase')
        this.title = this.node.getChildByName('title')
        this.background = this.node.getChildByName('background')
        // 按钮
        this.startBn = this.node.getChildByName('startBn')
        this.backBn = this.node.getChildByName('backBn')
        this.volumnBn = this.node.getChildByName('volumeBn')
        this.purchaseBn = this.node.getChildByName('purchaseBn')
        this.tutorBn = this.node.getChildByName('tutorBn')
        this.confirmBn = this.node.getChildByName('confirmBn')
        // 场景编码
        this.currentStage = 'stage_startMenu' // stage_tutor, stage_choicePage, stage_purchase, stage_pre, stage_volumn

        // 多个场景页面节点
        this.choicePage = this.node.getChildByName('MulChoiceBn').getComponent('chooseBn')
        this.shopPage = this.node.getChildByName('Shop').getComponent('Shop')
        this.volumnPage = this.node.getChildByName('Volume').getComponent('Volume')
        this.tutorPage = this.node.getChildByName('Tutor').getComponent('Tutor')
    },
    // 在入场动画开始前初始化场景
    initProperties: function () {
        this.background.active = false
        this.title.active = false

        this.startBn.active = false
        this.backBn.active = false
        this.volumnBn.active = false
        this.purchaseBn.active = false
        this.tutorBn.active = false
        this.confirmBn.active = false
        this.node.getChildByName('Volume').getChildByName('bgmSlider').active = false
        this.node.getChildByName('Volume').getChildByName('soundSlider').active = false
        this.node.getChildByName('Volume').getChildByName('bgm').active = false
        this.node.getChildByName('Volume').getChildByName('sound').active = false
        this.node.getChildByName('Tutor').getChildByName('TutorText').active = false
        this.node.getChildByName('Tutor').getChildByName('TutorTitle').active = false

        this.currentStage = 'stage_pre'
    },
    // 切换到选择关卡界面
    onClick_toChoicePage: function () {
        this.playButtonAudio()
        if (this.currentStage === 'stage_startMenu')
            this.initChoiceStage()
    },
    // 加载游戏场景
    onClick_toGameScene: function () {
        if (this.currentStage === 'stage_choicePage'){
            this.node.getChildByName('Volume').getComponent(cc.AudioSource).stop()
            cc.director.loadScene('Game')
        } 
    },
    // 退回到开始界面
    onClick_toStartStage: function () {
        this.playButtonAudio()
        if (this.currentStage === 'stage_choicePage') {
            this.choicePage.hideButton()
            this.initStartStage()
        } else if (this.currentStage === 'stage_volumn') {
            this.initStartStage()
        } else if (this.currentStage === 'stage_tutor') {
            this.initStartStage()
        }
    },
    //进入商店界面
    onClick_toPurchaseStage: function () {
        this.playButtonAudio()
        if (this.currentStage === 'stage_startMenu') {
            this.initPurchase()
        }
    },
    //确定人物选择
    onClick_confirmBn: function () {
        this.playButtonAudio()
        let playerIndex = this.shopPage.getChara()
        if (playerIndex < 6 && playerIndex >= 0) {
            this.dataBase.playerChoice = playerIndex
        }
        this.initStartStage()
    },
    //进入音乐播放界面
    onClick_volumnBn: function () {
        this.playButtonAudio()
        if (this.currentStage === 'stage_startMenu') {
            this.initvolum()
        }
    },
    // 教程按钮
    onClick_tutorBn: function () {
        this.playButtonAudio()
        if (this.currentStage === 'stage_startMenu') {
            this.initTutor()
        }
    },
    // 初始化
    initStartStage: function () {
        this.initProperties()

        this.startBn.on('click', this.onClick_toChoicePage, this)
        this.startBn.on('click', this.onClick_toGameScene, this)
        this.backBn.on('click', this.onClick_toStartStage, this)
        this.purchaseBn.on('click', this.onClick_toPurchaseStage, this)
        this.confirmBn.on('click', this.onClick_confirmBn, this)
        // this.volumnBn.on('click', this.onClick_volumnBn, this)
        this.tutorBn.on('click', this.onClick_tutorBn, this)

        this.startBn.active = true
        this.background.active = true
        this.title.active = true
        this.purchaseBn.active = true
        // this.volumnBn.active = true
        this.tutorBn.active = true
        this.currentStage = 'stage_startMenu'
    },
    // 初始化选择难度模式页面
    initChoiceStage: function () {
        this.initProperties()
        this.background.active = true
        this.backBn.active = true
        this.startBn.active = true
        // 初始化
        this.choicePage.initButtons(-500, 360, 10)
        this.scheduleOnce(function () {
            this.waitChoicePageLoad()
        }, 0.4)
    },
    // 初始化商店
    initPurchase: function () {
        this.initProperties()
        this.background.active = true
        this.confirmBn.active = true
        this.shopPage.initButtons()
    },
    // 初始化音量
    initvolum: function () {
        this.initProperties()
        this.currentStage = 'stage_volumn'
        this.background.active = true
        this.title.active = true
        this.backBn.active = true
        this.node.getChildByName('Volume').getComponent('Volume').initSlides()
    },
    // 初始化教程
    initTutor: function () {
        this.initProperties()
        this.currentStage = 'stage_tutor'
        this.background.active = true
        this.backBn.active = true
        this.tutorPage.initTutor()
    },
    // 播放音乐
    playButtonAudio: function () {
        this.audioButton.play()
    },
    waitChoicePageLoad: function () {
        this.currentStage = 'stage_choicePage'
    }
});
