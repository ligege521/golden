import {loaderImgs, loadAssets} from './loader';
import {TweenMax} from 'gsap/all';
import hitTestRectangle from '../util/hitTestRectangle';
import './hitPoint';
function Parent (sprite, type, integral, visible, url, callback) {
    let that = this;
    that.sprite = sprite;
    that.type = type;
    that.callback = callback;
    that.visible = visible;
    this.url = url;
    that.integral = integral;

    that.get = function (type) {
        switch (type) {
            case 'sprite':
                return that.sprite;
            case 'type':
                return that.type;
            case 'callback':
                return that.callback;
            case 'integral':
                return that.integral;
            case 'visible':
                return that.visible;
            case 'url':
                return that.url;
            default:
                break;
        }
    };
    that.set = function (type, value) {
        switch (type) {
            case 'sprite':
                that.sprite = value;
                return that.sprite;
            case 'x':
                that.type = value;
                return that.type;
            case 'callback':
                that.callback = value;
                return that.callback;
            case 'integral':
                that.integral = value;
                return that.integral;
            case 'visible':
                that.visible = value;
                return that.visible;
            case 'url':
                that.url = value;
                return that.url;
            default:
                break;
        }
    };
}

export default function ElementContoller () {
    var _public = {};
    var _private = {};
    /*
    初始化
    */
    _private.initApp = function () {
        let winWidth = $(window).width();
        let designWidth = _public.designWidth = 750;
        let designHeight = _public.designHeight = 1624;
        _public.app = new PIXI.Application({
            width: winWidth,
            height: winWidth * (designHeight / designWidth),
            forceCanvas: true,
            backgroundColor: '0x000000',
            transparent: true, // 设置画布是否透明
            resolution: 2,  // 渲染器的分辨率
            antialias: true, // 消除锯齿
            autoResize: true    // 重置大小
        });
        _public.scale = winWidth / designWidth;
        // 显示弹框蒙层
        _public.showMesk = false;

        // 添加到页面中
        $('.m-index').append(_public.app.view);

        _private.initBackground();
        _private.initProps();
        _private.addGolden();
        _private.initIntegral();
        // // 道具弹窗
        _private.initDialogBg();
        _private.initBlood();
        // // 游戏结束初始化
        _private.initGameOver();
    };
    /*
    *积分
    */
    _private.initIntegral = function () {
        let style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 22,
            fill: 'white',
            stroke: '#ff3300',
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6
        });
        _private.integral = new PIXI.Text(0, style);
        _private.integral.x = _public.app.stage.width - 80;
        _private.integral.y = 20;
        _public.app.stage.addChild(_private.integral);
    };
    /*
    *勾中道具弹框
    */
    _private.initDialogBg = function () {
        _private.dialogBox = new PIXI.Container();
        _private.dialogBox.visible = false;
        _public.app.stage.addChild(_private.dialogBox);
    };
    /*
    *重置弹框蒙层
    */
    _private.resetDialog = function () {
        _private.dialogBox.visible = false;
        _public.showMesk = false;
        _private.dialogBox.removeChildren();
    };
    /*
    背景
    */
    _private.initBackground = function () {
        let {background1, background2} = loaderImgs;
        let bgSprite1 = background1.sprite;
        let bgSprite2 = background2.sprite;
        bgSprite1.scale.set(_public.scale, _public.scale);
        bgSprite2.scale.set(_public.scale, _public.scale);
        bgSprite2.y = bgSprite1.height - bgSprite2.height;
        _public.app.stage.addChild(bgSprite1);
        _public.app.stage.addChild(bgSprite2);
    };

    /*
    矿车
    */
    _private.addGolden = function () {
        let {goldenCar} = loaderImgs;
        let car = goldenCar.sprite;
        // 矿车容器
        let goldenBox = new PIXI.Container();
        goldenBox.y = 170 * _public.scale;
        _public.app.stage.addChild(goldenBox);

        car.scale.set(_public.scale, _public.scale);
        car.x = 340 * _public.scale;
        goldenBox.addChild(car);
        // 添加爪子
        let hookCont = _private.initHook();
        goldenBox.addChild(hookCont);
    };

    /*
    爪子
    */
    _private.initHook = function () {
        // 爪子的属性
        let goldenHander = {
            right: true,
            left: false,
            hookSpeed: 0.01, // 旋转速度
            hookStop: true, // 是否旋转
            ropeCurrentSpeed: 1, // 初始速度
            ropeSpeed: 0.1,   // 绳子伸缩的加速度
            ropeStop: false, // 绳子是否伸缩
            ropeLength: 100,    // 绳子初始长度
            ropeMaxLength: 900,  // 最大长度
            ropeTop: false, // 绳子向上延伸
            ropeBottom: true,    // 向下延伸
            hitProp: false
        };
        // 爪子
        let {goldenHook} = loaderImgs;
        let hook = goldenHook.sprite;
        hook.anchor.set(0.5);
        hook.scale.set(_public.scale);
        hook.position.set(hook.width / 2, goldenHander.ropeLength / 2 + hook.height / 2);

        // 爪子容器
        let hookBox = new PIXI.Container();
        hookBox.width = 30;
        hookBox.position.set(370 * _public.scale, 148 * _public.scale);
        hookBox.addChild(hook);

        // 爪子碰撞检测区域
        let hookGrap = new PIXI.Graphics();
        hookGrap.lineStyle(2, 0x009966, 1);
        hookGrap.drawRoundedRect(-hook.width, -hookGrap.height, hookBox.width, hookBox.height, 0);
        // hookGrap.position.set(-hook.width, -hookGrap.height - 10);
        hookGrap.position.set(hookGrap.width, hookGrap.height);
        hookBox.addChild(hookGrap);
        setTimeout(() => {
            console.log(hookGrap.getGlobalPosition());
            console.log();
        }, 2000);

        // // 抓取到的金币
        let grabSprite = new PIXI.Sprite(PIXI.Texture.fromImage('../../img/gold.png'));
        setTimeout(() => {
            grabSprite.anchor.set(0.5);
            hookBox.addChild(grabSprite);
            grabSprite.scale.set(_public.scale);
            console.log(grabSprite.width);
            grabSprite.position.set(grabSprite.width, goldenHander.ropeLength);
        }, 5000);

        // 绳子
        let rope = new PIXI.Graphics();
        rope.beginFill(0x64371f);
        rope.drawRect(40 * _public.scale, 0, 5 * _public.scale, goldenHander.ropeLength * _public.scale);
        hookBox.addChild(rope);
        hookBox.pivot.set(hookBox.width / 2, 0);

         // 爪子旋转
        let hookAni = TweenMax.to(hookBox, 2.5, {
            startAt: {
                rotation: -0.8
            },
            rotation: 0.8,
            repeat: -1,
            ease: 'Power1.easeInOut',
            yoyo: true
        }, {rotation: -0.8});

        // 爪子伸缩
        let state = function () {};
        _public.app.ticker.add(delta => ropeLoop(delta));
        function ropeLoop (delta) {
            if (goldenHander.ropeStop) {
                state(delta);
                return;
            }
            _public.app.ticker.remove(delta => ropeLoop(delta));
        };
        function setStatus () {
            if (_public.showMesk) {
                _private.resetDialog();
            } else {
                if (!goldenHander.ropeStop) {
                    state = start;
                    goldenHander.ropeStop = true;
                    goldenHander.ropeCurrentSpeed = 0;
                } else {
                    console.log('正在抓去中');
                }
            }
        }
        function start () {
            if (goldenHander.ropeBottom && !goldenHander.ropeTop) {
                goldExtend();
            } else if (goldenHander.ropeTop && !goldenHander.ropeBottom) {
                goldShorten();
            }
        };
        /*
        *钩子碰撞检测
        */
        function hitGold () {
            if (goldenHander.hitProp) {
                console.log('返回');
                return;
            }
            for (let i = 0; i < _private.goldenArea.list.length; i++) {
                let prop = _private.goldenArea.list[i];
                if (hitTestRectangle(hookGrap, prop.hitAre, _public.scale) && prop.visible) {
                    // if (prop.type === 'boom') {
                    //     prop.sprite.visible = false;
                    // }
                    // prop.sprite.visible = false;
                    prop.visible = false;
                    goldenHander.hitProp = true;
                    _private.goldenArea.hitIndex = i;
                    backHook(prop);
                    addIntegral(prop.integral);
                    return;
                }
            };
        };
        /*
        *加积分
        */
        function addIntegral (number) {
            let count = parseInt(_private.integral.text);
            count = count + number;
            count = count < 0 ? 0 : count;
            _private.integral.text = count;
        };
        /*
        *检测为空
        */
        function empty () {
            let goldens = _private.goldenArea.list;
            let contents = 0;
            goldens.forEach(item => {
                if (item.type === 'gold' && item.visible) {
                    contents = contents + 1;
                }
            });
            if (contents === 0) {
                _private.succesed();
            }
        };
        /*
        *钩子伸长
        */
        function goldExtend () {
            // 钩子暂停摇摆
            hookAni.pause();
            hitGold();
            goldenHander.ropeCurrentSpeed += goldenHander.ropeSpeed;
            rope.height += goldenHander.ropeCurrentSpeed;
            hook.y += goldenHander.ropeCurrentSpeed;
            hookGrap.y += goldenHander.ropeCurrentSpeed;
            let gloPosition = hook.getGlobalPosition();
            if ((gloPosition.x) > (_public.designWidth * _public.scale - hookBox.width / 2) || (gloPosition.x * _public.scale) < 0 || rope.height > (goldenHander.ropeMaxLength * _public.scale)) {
                backHook();
            }
        };
        /*
        *钩子伸缩状态重置
        */
        function backHook (prop) {
            goldenHander.ropeBottom = false;
            goldenHander.ropeTop = true;
            goldenHander.ropeSpeed = 0.1;
            goldenHander.ropeCurrentSpeed = 1;
        };
        /*
        *钩子收缩
        */
        function goldShorten () {
            let prop = _private.goldenArea.list[_private.goldenArea.hitIndex];
            goldenHander.ropeCurrentSpeed -= goldenHander.ropeSpeed;
            if (goldenHander.hitProp) {
                prop.sprite.position.set(hookGrap.getGlobalPosition().x, hookGrap.y + hookGrap.height);
                if (prop.type === 'gold') {
                    goldenHander.ropeCurrentSpeed = -1;
                }
            }
            rope.height += goldenHander.ropeCurrentSpeed;
            hook.y += goldenHander.ropeCurrentSpeed;
            hookGrap.y += goldenHander.ropeCurrentSpeed;
            if (rope.height <= goldenHander.ropeLength * _public.scale) {
                empty();
                if (_private.bloodObj.healthValue <= 0) {
                    _private.gameOver();
                } else if (goldenHander.hitProp) {
                    if (prop.sprite.visible && prop.type === 'boom') {
                        prop.sprite.visible = false;
                    }
                    prop.callback();
                    _public.showMesk = true;
                }
                goldenHander.ropeBottom = true;
                goldenHander.ropeTop = false;
                // 伸缩状态重置
                goldenHander.ropeStop = false;
                // 抓取状态重置
                goldenHander.hitProp = false;
                hookAni.play();
            }
        };
        $('.m-index')[0].addEventListener('touchstart', setStatus);
        // _private.propsContainer.on('tap', (event) => {
        //     setStatus();
        // });
        return hookBox;
    };
    /*
    *初始化道具
    */
    _private.goldenArea = {
        row: 3,
        column: 4, // 道具布局区域长宽
        initWidth: 720,
        initHeight: 680,
        list: [],
        hitIndex: -1   // 触碰到的元素序号
    };
    /*
    *初始化道具
    */
    _private.initProps = function () {
        let propsContainer = _private.propsContainer = new PIXI.Container();
        propsContainer.y = 100;
        propsContainer.width = _public.app.stage.width - 20;
        propsContainer.height = _public.app.stage.height - 100;
        _public.app.stage.addChild(propsContainer);
        _private.addProps();

        propsContainer.interactive = true;
    };
    _private.addProps = function () {
        let propsContainer = _private.propsContainer;
        // 添加道具前，清空重置
        propsContainer.removeChildren();
        _private.goldenArea.list = [];
        _private.goldenArea.hitIndex = -1;
        let goldenArea = _private.goldenArea;
        let {boom, gold1, gold2, gold3, gold4} = loaderImgs;
        // 上下位移的值
        let offsetX = (_public.designWidth - goldenArea.initWidth) / 2;
        let offsetY = 370;
        // 格子总数
        let sum = goldenArea.row * goldenArea.column;
        // 容器宽度
        let containerWidth = goldenArea.initWidth / goldenArea.column;
        // 容器高度
        let containerHeight = goldenArea.initHeight / goldenArea.row;
        for (var i = 0; i < sum; i++) {
            let rowIndex = parseInt(i / goldenArea.column, 10);
            let columnIndex = i % goldenArea.column;

            let x = offsetX + columnIndex * containerWidth;
            let y = offsetY + rowIndex * containerHeight;

            // let graphics = new PIXI.Graphics();
            // graphics.lineStyle(2, 0xFF3300, 1);
            // graphics.drawRect(x * _public.scale, y * _public.scale, containerWidth * _public.scale, containerHeight * _public.scale);
            // graphics.endFill();
            // propsContainer.addChild(graphics);

            let ranNum = Math.floor(Math.random() * 6);
            let sprite;
            let spriteObj;
            switch (ranNum) {
                case 0:
                    sprite = new PIXI.Sprite(PIXI.Texture.fromImage(boom.url));
                    spriteObj = new Parent(sprite, 'boom', -20, true, boom.url, _private.boomDialog);
                    console.log(sprite.width * _public.scale);
                    break;
                case 1:
                    sprite = new PIXI.Sprite(PIXI.Texture.fromImage(gold1.url));
                    spriteObj = new Parent(sprite, 'gold', 10, true, gold1.url, _private.goldDialog);
                    break;
                case 2:
                    sprite = new PIXI.Sprite(PIXI.Texture.fromImage(gold1.url));
                    spriteObj = new Parent(sprite, 'gold', 10, true, gold1.url, _private.goldDialog);
                    break;
                case 3:
                    sprite = new PIXI.Sprite(PIXI.Texture.fromImage(gold2.url));
                    spriteObj = new Parent(sprite, 'gold', 20, true, gold2.url, _private.goldDialog);
                    break;
                case 4:
                    sprite = new PIXI.Sprite(PIXI.Texture.fromImage(gold3.url));
                    spriteObj = new Parent(sprite, 'gold', 30, true, gold3.url, _private.goldDialog);
                    break;
                case 5:
                    sprite = new PIXI.Sprite(PIXI.Texture.fromImage(gold4.url));
                    spriteObj = new Parent(sprite, 'gold', 40, true, gold4.url, _private.goldDialog);
                    break;
                case 6:
                    sprite = new PIXI.Sprite(PIXI.Texture.fromImage(boom.url));
                    spriteObj = new Parent(sprite, 'boom', -20, true, boom.url, _private.boomDialog);
                    console.log(sprite.width);
                    break;
                default:
                    break;
            }
            // sprite.x = x * _public.scale + (Math.random() * (containerWidth / 2) * _public.scale) + 20;
            // sprite.y = y * _public.scale + (Math.random() * (containerHeight / 2) * _public.scale);
            sprite.x = Math.round(x * _public.scale + ((containerWidth / 2) * _public.scale) + 20);
            sprite.y = Math.round(y * _public.scale + ((containerHeight / 2) * _public.scale));
            sprite.scale.set(_public.scale);
            sprite.anchor.set(0.5);
            let global = sprite.getGlobalPosition();
            let hitAre = {
                startX: global.x,
                endX: global.x + sprite.width,
                startY: global.y,
                endY: global.y + sprite.height
            };
            console.log(hitAre);
            spriteObj.hitAre = hitAre;
            // 道具的碰撞检测区域
            let hitGrap = new PIXI.Graphics();
            // hitGrap.lineStyle(2, 0x009966, 1);
            hitGrap.drawRoundedRect(-(sprite.width / 2), -(sprite.height / 2), sprite.width - 10, sprite.height, 40);
            // hitGrap.drawRect(-(sprite.width / 2), -(sprite.height / 2), sprite.width - 10, sprite.height);
            hitGrap.x = sprite.x;
            hitGrap.y = sprite.y;
            hitGrap.endFill();
            propsContainer.addChild(hitGrap);

            propsContainer.addChild(sprite);
            // 道具列表
            spriteObj.hitGrap = hitGrap;
            _private.goldenArea.list.push(spriteObj);
        }
    };
    _private.blackMesk = function () {
        // 黑色蒙层
        let mesk = new PIXI.Graphics();
        mesk.beginFill(0x000000);
        mesk.drawRect(0, 0, _public.app.stage.width, _public.app.stage.height);
        mesk.alpha = 0.5;
        mesk.endFill();
        _private.dialogBox.addChild(mesk);
    };
    /*
    *炸弹爆炸效果
    */
    _private.boomDialog = function () {
        // 弹出盒子
        let dialogBox = _private.dialogBox;
        _private.blackMesk();
        let {boom, dialogBoom} = loaderImgs;
        // 晃动
        let shakBoom = new PIXI.Sprite(PIXI.Texture.fromImage(boom.url));
        shakBoom.anchor.set(0.5);
        shakBoom.position.set(_public.app.stage.width / 2, _public.app.stage.height / 2 - 100);
        // 出现元素
        dialogBoom.sprite.visible = false;
        dialogBoom.sprite.alpha = 0;
        dialogBoom.sprite.scale.set(_public.scale);
        dialogBoom.sprite.position.set(_public.app.stage.width / 2 - dialogBoom.sprite.width / 2, _public.app.stage.height / 2 - dialogBoom.sprite.height / 2 - 100);
        TweenMax.to(shakBoom, 0.1, {
            repeat: 8,
            x: shakBoom.x + (3 + Math.random() * 5),
            y: shakBoom.y + (3 + Math.random() * 5),
            rotation: -(Math.random()) * 0.5,
            ease: 'Expo.easeInOut',
            delay: 0.1,
            onComplete: function () {
                TweenMax.to(shakBoom, 0.6, {
                    alpha: 0,
                    visible: false
                });
                TweenMax.to(dialogBoom.sprite, 0.6, {
                    alpha: 1,
                    visible: true,
                    delay: 0.4
                });
            }
        });
        dialogBox.visible = true;
        dialogBox.addChild(shakBoom);
        dialogBox.addChild(dialogBoom.sprite);
        _public.clearBlood(25);
    };
    /*
    *金币粒子下落效果
    */
    _private.initParticle = function () {
        _private.particleBox = new PIXI.ParticleContainer();
        // _public.app.stage.addChild(_private.particleBox);
        _private.dialogBox.addChild(_private.particleBox);
    };
    _private.particleGold = function () {
        // // 金币粒子
        _private.initParticle();
        let container = _private.particleBox;
        let {gold} = loaderImgs;
        for (var i = 0; i < 20; i++) {
            let sprite = PIXI.Sprite.from(gold.url);
            sprite.y = Math.ceil(Math.random() * -(_public.app.stage.height) - 80);
            sprite.x = Math.ceil(Math.random() * (_public.app.stage.width - 10) + 5);
            container.addChild(sprite);
            TweenMax.to(sprite, Math.random() * 3, {
                delay: 0.8,
                y: _public.app.stage.height + 20,
                ease: 'Power0.easeOut'
            });
        }
    };
    /*
    *金币弹框
    */
    _private.goldDialog = function () {
        // 弹出层
        let dialogBox = _private.dialogBox;
        _private.blackMesk();
       // 金币动画容器
        let goldCont = new PIXI.Container();
        let {halo, dialogGolden} = loaderImgs;
        _private.particleGold();
        // _private.addSprite(goldCont, goldenFloat.sprite, 1);
        // goldenFloat.sprite.position.set(_public.app.stage.width / 2 - goldenFloat.sprite.width / 2, -_public.app.stage.height);
        // TweenMax.to(goldenFloat.sprite, 2, {
        //     y: 0
        // });
        halo.sprite.scale.set(_public.scale);
        _private.addSprite(goldCont, halo.sprite, _public.scale);
        _private.addSprite(goldCont, dialogGolden.sprite, _public.scale);
        dialogBox.alpha = 0;
        dialogBox.visible = true;
        dialogBox.addChild(goldCont);
        TweenMax.to(dialogBox, {
            alpha: 1,
            direction: 0.8
        });
    };
    /*
    *添加精灵
    */
    _private.addSprite = function (parent, child, scale) {
        let sprite = child;
        sprite.scale.set(scale);
        sprite.position.set(_public.app.stage.width / 2 - sprite.width / 2, _public.app.stage.height / 2 - sprite.height / 2 - 100);
        parent.addChild(sprite);
    };
    // 血量对象
    _private.bloodObj = {
        bloodBox: new PIXI.Container(),
        health: new PIXI.Graphics(),
        healthValue: 100 // 血量
    };
    /*
    *初始化血条
    */
    _private.initBlood = function () {
        // 血条容器
        let bloodBox = _private.bloodObj.bloodBox;
        bloodBox.position.set(20, 20);
        // 灰色血条
        let bloodBg = new PIXI.Graphics();
        bloodBg.lineStyle(2, 0xdddddd, 1);
        bloodBg.beginFill(0x434343);
        bloodBg.drawRoundedRect(0, 0, 102, 20, 10);
        bloodBg.endFill();

        // 红色血条
        let health = _private.bloodObj.health;
        health.beginFill(0xfb544c);
        health.drawRoundedRect(1, 1, _private.bloodObj.healthValue, 18, 10);
        // 添加容器
        bloodBox.addChild(bloodBg);
        bloodBox.addChild(health);
        _public.app.stage.addChild(bloodBox);
    };
    /*
    *血量减少
    * @parma {number}  要减去的血量
    */
    _public.clearBlood = function (number) {
        let health = _private.bloodObj.health;
        let bloodWidth = _private.bloodObj.healthValue - number;
        _private.bloodObj.healthValue = bloodWidth;
        health.clear();
        health.beginFill(0xfb544c);
        health.drawRoundedRect(1, 1, bloodWidth, 18, 10);
    };
    _private.initGameOver = function () {
        let gameOver = _private.gameOverBox = new PIXI.Container();
        gameOver.width = _public.app.stage.width;
        gameOver.height = _public.app.stage.height;

        // 黑色框
        let graphics = new PIXI.Graphics();
        graphics.beginFill(0x000033);
        graphics.drawRect(0, 0, _public.app.stage.width, _public.app.stage.height);
        graphics.endFill();
        graphics.alpha = 0.5;
        // 字体
        let style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 28,
            fill: 'white',
            stroke: '#ff3300',
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6
        });
        let message = _private.message = new PIXI.Text('重新开始', style);
        message.x = _public.app.stage.width / 2 - message.width / 2;
        message.y = _public.app.stage.height / 2 - message.height / 2;
        gameOver.addChild(message);
        gameOver.addChild(graphics);
        _public.app.stage.addChild(gameOver);
        gameOver.visible = false;
    };
    /*
    *游戏结束
    */
    _private.gameOver = function () {
        _private.message.text = '重新开始';
        _private.gameOverBox.visible = true;
        _private.gameOverBox.interactive = true;
        _private.gameOverBox.on('tap', () => {
            _private.resetGame();
        });
    };
    /*
    *过关
    */
    _private.succesed = function () {
        _private.message.text = '下一关';
        _private.gameOverBox.visible = true;
        _private.gameOverBox.interactive = true;
        _private.gameOverBox.on('tap', () => {
            _private.next();
        });
    };
    /*
    *下一关
    */
    _private.next = function () {
        _private.gameOverBox.visible = false;
        _private.bloodObj.healthValue = 100;
        _public.clearBlood(0);
        _private.addProps();
    };
    /*
    *重置游戏
    */
    _private.resetGame = function () {
        _private.gameOverBox.visible = false;
        _private.bloodObj.healthValue = 100;
        _private.integral.text = 0;
        _public.clearBlood(0);
        _private.addProps();
    };
    // 加载纹理对象
    loadAssets(_private.initApp);
};
