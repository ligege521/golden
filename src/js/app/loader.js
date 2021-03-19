const head = '../../../img';
const loaderImgs = {
    background1: {
        url: `${head}/background-1.jpg`,
        texture: '',
        sprite: ''
    },
    background2: {
        url: `${head}/background-2.png`,
        texture: '',
        sprite: ''
    },
    boom: {
        url: `${head}/boom.png`,
        texture: '',
        sprite: ''
    },
    dialogGolden: {
        url: `${head}/dialog_bag_golden_full.png`,
        texture: '',
        sprite: ''
    },
    gold: {
        url: `${head}/gold.png`,
        texture: '',
        sprite: ''
    },
    gold1: {
        url: `${head}/gold_1.png`,
        texture: '',
        sprite: ''
    },
    gold2: {
        url: `${head}/gold_2.png`,
        texture: '',
        sprite: ''
    },
    gold3: {
        url: `${head}/gold_3.png`,
        texture: '',
        sprite: ''
    },
    gold4: {
        url: `${head}/gold_4.png`,
        texture: '',
        sprite: ''
    },
    goldenCar: {
        url: `${head}/golden_car.png`,
        texture: '',
        sprite: ''
    },
    goldenHook: {
        url: `${head}/golden_hook.png`,
        texture: '',
        sprite: ''
    },
    dialogBoom: {
        url: `${head}/dialog_boom.png`,
        texture: '',
        sprite: ''
    },
    goldenFloat: {
        url: `${head}/golden_float.png`,
        texture: '',
        sprite: ''
    },
    halo: {
        url: `${head}/halo.png`,
        texture: '',
        sprite: ''
    }
};
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
export {
    loaderImgs,
    loadAssets
};
