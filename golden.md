#  使用pixi制作黄金矿工   
## 目录  
1. [安装使用PIXI](#一安装使用pixi)
2. [PIXI精灵](#二pixi精灵)
3. [对爪子与绳子的控制](#三对爪子与绳子的控制)
4. [添加道具](#四添加道具)
5. [检测碰撞](#五检测碰撞)
6. [抓中物品后的动画效果](#六抓中物品后的动画效果)
7. [重置游戏](#七重置游戏)   
8. [小结](#八小结)
## 一、安装使用PIXI  
这个项目中使用的版本是**5.3.3**  
从[GITHUB](https://github.com/pixijs/pixi.js)获取是最快速的方式     
1.使用script标签引入  
    
```javascript
< src="pixi.min.js"></>
```  
2.引入后测试PIXI能否正常工作  
```javascript
let type = 'WebGl';
if (!PIXI.utils.isWebGLSupported()) {
    type = 'canvas';
}
PIXI.utils.sayHello(type);
ElementContoller(); 
```  

3.创建Pixi应用和舞台     
    <em>PIXI.Application</em> 是创建了一个PIXI应用，这一步会自动生成一个canvas。 <em>append(_public.app.view)</em>  把舞台      加到HTML文档
    <em>designWidth</em> 与 <em>designHeight</em> 是整个页面的大小，是以IPhoneX为基准。 <em>​_public.scale</em> 是页面   高的缩放比。

```javascript
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
$('.m-index').append(_public.app.view);
```
## 二、PIXI精灵  
1.将图片加载到纹理缓存中  

创建一个loaderImgs用来存储加载图形资源      

```javascript
const loaderImgs = {
    background1: {
        url: `${head}/background-1.jpg`,
        texture: '',
        sprite: ''
    }
}
```

loadAssets方法用来加载图形资源，传入参数是加载完成后的回调函数  
PIXI中有loader加载器，用来加载图像资源，我们把全部加载文件都放在loader.js里面进行加载。  
load方法中的resources是加载资源资源对象，默认是使用图片的路径找到纹理集  

```javascript
const loadAssets = function (callback) {
    let loader = PIXI.Loader.shared;
    let imgObj = [...Object.keys(loaderImgs).map(item => { return loaderImgs[item].url; })];
    loader.add(imgObj);
    loader.load((loader, resources) => {
        console.log(resources);
        Object.keys(loaderImgs).forEach(item => {
            loaderImgs[item].texture = resources[loaderImgs[item].url].texture;
            loaderImgs[item].sprite = new PIXI.Sprite(loaderImgs[item].texture);
        });
        callback();
    });
};
```

## 三、对爪子与绳子的控制  
   
1.创建一个可以包含钩子跟绳子的容器。  
```javascript
let hookBox = new PIXI.Container();
hookBox.position.set(370 * _public.scale, 148 * _public.scale);
hookBox.addChild(hook);
```     


创建爪子，并设置使用 <em>anchor</em> 锚点，设置精灵的原点。
      
```javascript
 let {goldenHook} = loaderImgs;
 let hook = goldenHook.sprite;
 hook.anchor.set(0.5);
 hook.scale.set(_public.scale, _public.scale);
 hook.position.set(hook.width / 2, goldenHander.ropeLength / 2 + hook.height / 2);
```  
创建绳子，并添加到容器中，绳子就是一个正方形，绳子变长就是直接改变它的高。  
```javascript
  let rope = new PIXI.Graphics();
  rope.beginFill(0x64371f);
  rope.drawRect(40 * _public.scale, 0, 5 * _public.scale, goldenHander.ropeLength *  _public.scale);
  hookBox.addChild(rope);
  hookBox.pivot.set(hookBox.width / 2, 0);
```  
<img src="https://golden.treedom.cn/hook.jpg" width="20%">  
   
爪子的摇摆，是使用 TweenMax 来控制的。  
```javascript
  let hookAni = TweenMax.to(hookBox, 2.5, {
          startAt: {
              rotation: -0.8
          },
          rotation: 0.8,
          repeat: -1,
          ease: 'Power1.easeInOut',
          yoyo: true
  }, {rotation: -0.8});
```

### 2.绳子的伸长  
  
PIXI中 <em>ticker</em> 这被称为 游戏循环。任何在游戏循环里的代码都会1秒更新60次。可以使用它来让绳子伸长。  在绳子伸长时，暂停爪子的摇摆，如果绳子超出指定范围，回调 <em>backHook</em> 改变它的游戏状态。
```javascript
    function goldExtend () {
        hookAni.pause();
        goldenHander.ropeCurrentSpeed += goldenHander.ropeSpeed;
        rope.height += goldenHander.ropeCurrentSpeed;
        hook.y += goldenHander.ropeCurrentSpeed;
        hitGold();
        let gloPosition = hook.getGlobalPosition();
        if ((gloPosition.x * _public.scale) > (_public.designWidth / 2 - hookBoxwidth / 2) || (gloPosition.x * _public.scale) < 0 || rope.height >(goldenHander.ropeMaxLength * _public.scale)) {
            backHook();
        }
    };
```     
<img src="https://golden.treedom.cn/goldExtend.gif" width="20%">    


## 四、添加道具  
### 1.创建装填道具的容器
```javascript
let propsContainer = _private.propsContainer = new PIXI.Container();
propsContainer.y = 100;
_public.app.stage.addChild(propsContainer);
_private.addProps();
```   
### 2.初始化道具对象, 我们这里是三列四行。  
```javascript
_private.goldenArea = {
    row: 3,
    column: 4, // 道具布局区域长宽
    initWidth: 720,
    initHeight: 680,
    list: [],
    hitIndex: -1   // 触碰到的元素序号
};
```   
### 3.计算出道具上下左右位移的距离  
```javascript
 // 上下位移的值
let offsetX = (_public.designWidth - goldenArea.initWidth) / 2;
let offsetY = 370;
// 格子总数
let sum = goldenArea.row * goldenArea.column;
// 容器宽度
let containerWidth = goldenArea.initWidth / goldenArea.column;
// 容器高度
let containerHeight = goldenArea.initHeight / goldenArea.row;
```    

### 4.遍历循环添加道具。因为图片是png格式，有透明区域，所以在这里就使用 <em>Graphics</em> 创建一个图形，作为道具的碰撞检测区域。<em>callback</em> 则作为碰撞后的回调函数，就是抓中物品后的动画。
```javascript
for (var i = 0; i < sum; i++) {
        let rowIndex = parseInt(i / goldenArea.column, 10);
        let columnIndex = i % goldenArea.column;
        let x = offsetX + columnIndex * containerWidth;
        let y = offsetY + rowIndex * containerHeight;
        let ranNum = Math.floor(Math.random() * 6);
        let sprite;
        let type;
        let callback;
        switch (ranNum) {
            case 0:
                sprite = new PIXI.Sprite(PIXI.Texture.fromImage(boom.url));
                type = 'boom';
                callback = _private.boomDialog;
                break;
            case 1:
                sprite = new PIXI.Sprite(PIXI.Texture.fromImage(gold1.url));
                type = 'gold1';
                callback = _private.goldDialog;
                break;
            case 2:
                sprite = new PIXI.Sprite(PIXI.Texture.fromImage(gold2.url));
                type = 'gold2';
                callback = _private.goldDialog;
                break;
            case 3:
                sprite = new PIXI.Sprite(PIXI.Texture.fromImage(gold3.url));
                type = 'gold3';
                callback = _private.goldDialog;
                break;
            case 4:
                sprite = new PIXI.Sprite(PIXI.Texture.fromImage(gold4.url));
                type = 'gold4';
                callback = _private.goldDialog;
                break;
            default:
                break;
        }
        sprite.x = x * _public.scale + (Math.random() * (containerWidth / 2) *_public.scale) + 20;
        sprite.y = y * _public.scale + (Math.random() * (containerHeight / 2) *_public.scale);
        sprite.scale.set(_public.scale);
        sprite.anchor.set(0.5);
        // 道具的碰撞检测区域
        let hitGrap = new PIXI.Graphics();
        // hitGrap.lineStyle(2, 0x009966, 1);
        hitGrap.drawRect(-(sprite.width / 2), -(sprite.height / 2), sprite.width -20, sprite.height - 10);
        hitGrap.x = sprite.x;
        hitGrap.y = sprite.y;
        hitGrap.endFill();
        propsContainer.addChild(hitGrap);
        propsContainer.addChild(sprite);
        // 道具列表
        _private.goldenArea.list.push({
            type,
            sprite,
            hitGrap,
            visible: true,
            callback
        });
    }
```         
<img src="https://golden.treedom.cn/props.jpg" width="20%">     


## 五、检测碰撞  
PIXI中有许多碰撞检测的方法，这里我们使用了最常用的碰撞检测。  
```javascript
export default function hitTestRectangle(r1, r2) {
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
    hit = false;
    let r1Position = r1.getGlobalPosition();
    let r2Position = r2.getGlobalPosition();
    r1.centerX = r1Position.x + r1.width / 2;
    r1.centerY = r1Position.y - r1.height / 2;
    r2.centerX = r2Position.x + r2.width / 2;
    r2.centerY = r2Position.y + r2.height / 2;
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;
    if (Math.abs(vx) < combinedHalfWidths) {
        if (Math.abs(vy) < combinedHalfHeights) {
            hit = true;
        } else {
            hit = false;
        }
    } else {
        hit = false;
    }
    return hit;
};
```     
传入爪子，与每个道具的碰撞检测区域。  
```javascript
hitTestRectangle(hook, prop.hitGrap);
```
<img src="https://golden.treedom.cn/hit.jpg" width="20%">   

## 六、抓中物品后的动画效果  

这里的动画效果，我们是用 TweenMax 来控制的。  
### 1.创建一个黑色半透明的蒙层  
```javascript
// 黑色蒙层
let mesk = new PIXI.Graphics();
mesk.beginFill(0x000000);
mesk.drawRect(0, 0, _public.app.stage.width, _public.app.stage.height);
mesk.alpha = 0.5;
mesk.endFill();
```

### 2.炸弹晃动，爆炸的动画效果，整个动画的流程是先出现一个炸弹晃动的过程，然后出现炸弹爆炸的图  
炸弹晃动是随机改变他的x与y使用 TweenMax 循环播放。晃动完成后在出现 爆炸的效果图
```javascript
 // 晃动
    let shakBoom = new PIXI.Sprite(PIXI.Texture.fromImage(boom.url));
    shakBoom.anchor.set(0.5);
    shakBoom.position.set(_public.app.stage.width / 2, _public.app.stage.height / 2- 100);
    // 出现元素
    dialogBoom.sprite.visible = false;
    dialogBoom.sprite.alpha = 0;
    dialogBoom.sprite.scale.set(_public.scale);
    dialogBoom.sprite.position.set(_public.app.stage.width / 2 - dialogBoom.spritewidth / 2, _public.app.stage.height / 2 - dialogBoom.sprite.height / 2 - 100);
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
```
<img src="https://golden.treedom.cn/boom.gif" width="20%">    <img src="https://golden.treedom.cn/boom2.jpg" width="20%">    

### 3.金币下落的效果图。    

金币下落是使用，PIXI <em>ParticleContainer</em> 的粒子容器。它可以快速高效的构建大量的精灵，但也会失去其他高级的功能如（如遮罩，子级，滤镜等）。   
这里遍历添加到粒子容器中，再给它一个下落的动画。
```javascript
_private.particleBox = new PIXI.ParticleContainer();
// 添加到粒子容器中
let {gold} = loaderImgs;
for (var i = 0; i < 50; i++) {
    let sprite = PIXI.Sprite.from(gold.url);
    sprite.y = Math.ceil(Math.random() * -(_public.app.stage.height));
    sprite.x = Math.ceil(Math.random() * (_public.app.stage.width - 10) + 5);
    container.addChild(sprite);
    TweenMax.to(sprite, Math.random() * 3, {
        y: _public.app.stage.height + 20,
        ease: 'Power0.easeOut'
    });
}
```  
<img src="https://golden.treedom.cn/particle.gif" width="20%">    

## 七、重置游戏  
### 1. 血量用完后，会出现一个蒙层。我们再使用PIXI中的Text生成自定义字体。
```javascript
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
let message = new PIXI.Text('重新开始', style);
message.x = _public.app.stage.width / 2 - message.width / 2;
message.y = _public.app.stage.height / 2 - message.height / 2;
gameOver.addChild(message);
gameOver.addChild(graphics);
_public.app.stage.addChild(gameOver);
gameOver.visible = false;
```  
### 2.点击蒙层重置游戏状态  
```javascript
gameOverBox.visible = true;
gameOverBox.interactive = true;
gameOverBox.on('tap', () => {
    // 蒙层隐藏
     gameOverBox.visible = false;
    // 血量回到100
     _private.bloodObj.healthValue = 100;
    // 再次绘画血量图形
     _public.clearBlood(0);
    // 重置游戏道具
     _public.addProps();
 });
```  
## 八、小结
在这个项目中大致用到了PIXI中的Spriet，Container，ParticleContainer， Graphics的一些API，需要查阅可点击下方的**PIXIJS 的官方文档**。整个项目的难点就在于，爪子的旋转，与伸缩，还有物品的抓取，整个游戏是使用游戏状态来控制的。
    
      
### P.S. 下面是一些小编在开发过程中用到的资料，也分享给大家：  

**[PIXIJS 官方文档](http://pixijs.download/release/docs/index.html)**  

**[TweenMax 中文文档](https://www.tweenmax.com.cn/api/tweenmax/)**