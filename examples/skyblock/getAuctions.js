// import hypixel.js
import * as HyJs from "../../hypixel.js";

// Get all auctions after making a hypixel
// then print a random one ;o
async function main(){
    const myHypixel = new HyJs.Hypixel(""/* No API-Key needed :) */);
    const mySkyblock = await myHypixel.createHypixelSkyblock();
    const myAuctionHouse = await mySkyblock.getAuctionHouse();
    await myAuctionHouse.getAllAuctions();
    
    let myRandomAuction = myAuctionHouse.auctions[Object.keys(myAuctionHouse.auctions)[Math.floor(Math.random() * Object.keys(myAuctionHouse.auctions).length)]];
    console.log(myRandomAuction);
}
main();