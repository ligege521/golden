// export default function hitTestRectangle (r1, r2) {
//     let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
//     hit = false;
//     let r1Position = r1.getGlobalPosition();
//     let r2Position = r2.getGlobalPosition();
//     r1.centerX = r1Position.x + r1.width / 2;
//     r1.centerY = r1Position.y - r1.height / 2;
//     r2.centerX = r2Position.x + r2.width / 2;
//     r2.centerY = r2Position.y + r2.height / 2;
//     r1.halfWidth = r1.width / 2;
//     r1.halfHeight = r1.height / 2;
//     r2.halfWidth = r2.width / 2;
//     r2.halfHeight = r2.height / 2;
//     vx = r1.centerX - r2.centerX;
//     vy = r1.centerY - r2.centerY;
//     combinedHalfWidths = r1.halfWidth + r2.halfWidth;
//     combinedHalfHeights = r1.halfHeight + r2.halfHeight;
//     if (Math.abs(vx) < combinedHalfWidths) {
//         if (Math.abs(vy) < combinedHalfHeights) {
//             hit = true;
//         } else {
//             hit = false;
//         }
//     } else {
//         hit = false;
//     }
//     return hit;
// };
export default function hitTestRectangle (r1, hitAre) {
    let hit;
    hit = false;
    let r1Position = r1.getGlobalPosition();
    r1.startX = r1Position.x;
    r1.endX = r1Position.x + r1.width;
    r1.startY = r1Position.y;
    r1.endY = r1Position.y + r1.height;
    if ((r1.startX > hitAre.startX && r1.startX < hitAre.endX) || (r1.endX > hitAre.startX && r1.endX < hitAre.endX)) {
        if ((r1.startY > hitAre.startY && r1.startY < hitAre.endY) || (r1.endY > hitAre.startY && r1.endX < hitAre.endY)) {
            hit = true;
            console.log(r1.startY, r1.endY);
        } else {
            hit = false;
        }
    } else {
        hit = false;
    }
    return hit;
};
