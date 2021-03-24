// /*
// *
// *  引入lib库文件和LESS文件
// *  必须要引入,过滤器会过滤lib文件夹里面的JS文件,做一个简单的复制
// *  复制到相应的文件夹
// *  引入的less会对less进行编译存放到css文件夹
// * */
// import '../less/style.less';
// import ElementContoller from './app/Element';

// /** The animate() method */
// import './util/fx';
// /** Animated show, hide, toggle, and fade*() methods. */
// import './util/fx_methods';

// let type = 'WebGl';
// if (!PIXI.utils.isWebGLSupported()) {
//     type = 'canvas';
// }
// PIXI.utils.sayHello(type);
// ElementContoller();

import 'babel-polyfill';
// import * as PIXI from '../js/lib/pixi-5.3.3';
import Bump from './util/Bump';
import Game from './game';
import { loadAssets } from './loader';

import '../less/style.less';

// require('expose-loader?$!jquery');

const width = $(window).width();
const height = $(window).height();

// 加载资源后开始初始化舞台相关内容
loadAssets(() => {
    const bump = new Bump(PIXI);
    const game = new Game(width, height, bump);
    game.init(
        100,
        [
            { type: 'coin', amount: 1, visible: true },
            { type: 'coin', amount: 2, visible: true },
            { type: 'coin', amount: 3, visible: true },
            { type: 'coin', amount: 4, visible: true },
            { type: 'coin', amount: 4, visible: true },
            { type: 'landmine' },
            { type: 'coin', amount: 2 },
            { type: 'coin', amount: 2, visible: true },
            { type: 'coin', amount: 4, visible: true },
            { type: 'coin', amount: 1, visible: true },
            { type: 'landmine' },
            { type: 'coin', amount: 2, visible: true }
        ],
        100,
        0.28928509735715935
    );
});
