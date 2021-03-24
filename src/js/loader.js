const url = '../img/Images';

export const resources = {
    background1: {
        url: `${url}/background-1.jpg?${new Date().getTime()}`,
        sprite: ''
    },
    background2: {
        url: `${url}/background-2.png?${new Date().getTime()}`,
        sprite: ''
    },
    goldenCar: {
        url: `${url}/golden_car.png?`,
        sprite: ''
    },
    goldenHook: {
        url: `${url}/golden_hook.png?${new Date().getTime()}`,
        sprite: ''
    },
    buttonStart: {
        url: `${url}/button_start.png`,
        sprite: ''
    },
    buttonBack: {
        url: `${url}/button_back.png`,
        sprite: ''
    },
    buttonShare: {
        url: `${url}/button_share.png`,
        sprite: ''
    },
    boom: {
        url: `${url}/boom.png`,
        sprite: ''
    },
    gold1: {
        url: `${url}/gold_1.png`,
        sprite: ''
    },
    gold2: {
        url: `${url}/gold_2.png`,
        sprite: ''
    },
    gold3: {
        url: `${url}/gold_3.png`,
        sprite: ''
    },
    gold4: {
        url: `${url}/gold_4.png`,
        sprite: ''
    },
    luckyBag: {
        url: `${url}/lucky_bag.png`,
        sprite: ''
    },
    dialogClose: {
        url: `${url}/close.png`,
        sprite: ''
    },
    propHalo: {
        url: `${url}/halo.png`,
        sprite: ''
    },
    dialogBoom: {
        url: `${url}/dialog_boom.png`,
        sprite: ''
    },
    dialogBagEmpty: {
        url: `${url}/dialog_bag_empty.png`,
        sprite: ''
    },
    dialogBagGoldenFull: {
        url: `${url}/dialog_bag_golden_full.png`,
        sprite: ''
    },
    dialogBagHongBaoFull: {
        url: `${url}/dialog_bag_hongbao_full.png`,
        sprite: ''
    },
    coinsContainer: {
        url: `${url}/coins_container.png`,
        sprite: ''
    },
    textBottomHasChance: {
        url: `${url}/text_bottom_has_chance.png`,
        sprite: ''
    },
    textBottomChanceOut: {
        url: `${url}/text_bottom_chance_out.png`,
        sprite: ''
    },
    goldenFloat: {
        url: `${url}/golden_float.png`,
        sprite: ''
    }
};

/**
 * 加载资源
 */
export function loadAssets (cb) {
    PIXI.loader
        .add([
            ...Object.keys(resources).map(key => {
                return resources[key].url;
            })
        ])
        .load(setup);

    // loading 监听
    PIXI.loader.on('progress', function (target) {
        // if (progress == 100) {
        //     $('body').removeClass('loading').scrollTop(0);
        //     console.log('所有资源初始化完毕');
        // }
    });

    function setup () {
        console.log('资源加载完成');
        Object.keys(resources).forEach(key => {
            resources[key].sprite = new PIXI.Sprite(PIXI.loader.resources[resources[key].url].texture);
        });

        var progress = 0;
        var loadingIntervalHandler = setInterval(() => {
            progress += 5;
            $('.bar-active').css('width', `${progress}%`);
            $('.bar-car').css('left', `${progress}%`);
            $('.bar-progress').text(`${progress}%`);

            if (progress === 100) {
                clearInterval(loadingIntervalHandler);
                $('body').removeClass('loading').scrollTop(0);
                console.log('所有资源初始化完毕');
                cb();
            }
        }, 50);
        // cb();
    }
};
