// import hypixel.js
import * as HyJs from "../../hypixel.js";

async function getProfileData(){
    // Set up Hypixel class and get your uuid
    const myHypixel = new HyJs.Hypixel("YOUR_API_KEY");
    const myUuid = await HyJs.util.nameToUuid("Player");
    const mySkyblock = await myHypixel.createHypixelSkyblock()

    // Get their profile data
    let profiles = await mySkyblock.getPlayersProfiles(myUuid);
    let profile = profiles[0];

    // Printing
    console.log(profile);
}