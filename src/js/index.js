/*
*
*  引入lib库文件和LESS文件
*  必须要引入,过滤器会过滤lib文件夹里面的JS文件,做一个简单的复制
*  复制到相应的文件夹
*  引入的less会对less进行编译存放到css文件夹
* */
import '../less/style.less';
import ElementContoller from './app/Element';

/** The animate() method */
import './util/fx';
/** Animated show, hide, toggle, and fade*() methods. */
import './util/fx_methods';

let type = 'WebGl';
if (!PIXI.utils.isWebGLSupported()) {
    type = 'canvas';
}
PIXI.utils.sayHello(type);
ElementContoller();
