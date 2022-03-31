// Change this to where ever you are importing hypixel.js from (ex: "../hypixel.js" or "./hypixel.js")
import * as HyJs from "../../hypixel.js";

async function printRecentGames(){
    // Set up Hypixel class and get your uuid
    const myHypixel = new HyJs.Hypixel("YOUR_API_KEY");
    const myUuid = await HyJs.util.nameToUuid("Player");

    // Get their recent games
    let recentGames = await myHypixel.getRecentGames(myUuid);

    // Printing
    for (const game of recentGames) {
        console.log(game);
    }
}