import boom from '../../img/boom.json';
let data = boom.boom.shapes[0].polys;
let pointArr = [];
data.forEach(item => {
    let polygon = new PIXI.Polygon(...item);
    pointArr.push(polygon);
    // console.log(polygon);
});
