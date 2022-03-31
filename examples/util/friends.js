// Change this to where ever you are importing hypixel.js from (ex: "../hypixel.js" or "./hypixel.js")
import * as HyJs from "../../hypixel.js";

// Print the names of the friends
async function printFriends() {
    // Set up Hypixel class and get your uuid
    const myHypixel = new HyJs.Hypixel("YOUR_API_KEY");
    const myUuid = await HyJs.util.nameToUuid("Player");

    // Get their friendlist
    let friends = await myHypixel.getFriendList(myUuid);

    // Printing
    for (const friend of friends) {
        HyJs.util.uuidToName(friend).then(name => {
            console.log(name);
        });
    }
}
// Print the names of the friends
printFriends()