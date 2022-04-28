import * as HyJs from '../../hypixel.js'
// Print the bazaar
async function main() {
    const sb = await new HyJs.Hypixel(""/*No need for api key*/).createHypixelSkyblock();
    const bz = await sb.getBazaar();
    await bz.refreshBazaar();
    let items = await bz.getItems()
    items.forEach(item => {
        console.log(item, "   The flip for this item is", item.getFlipProfitAmount())
    });
}
main();
