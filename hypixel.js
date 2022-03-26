const uppercaseWords = str => str.replace(/^(.)|\s+(.)/g, c => c.toUpperCase()); // Function to uppercase first letter of each word

export class Hypixel{
    // creates a new instance of the class
    constructor(apiKey = ""){
        this.name = "hypixel.js";
        this.version = "1.0.0";
        this.author = "Henry-Santa";
        this.description = "A hypixel api wrapper in javascript meant to be used in a website.";
        this.url = "https://github.com/Henry-Santa/hypixel.js";
        this.apiKey = apiKey;
        this.apiUrl = "https://api.hypixel.net/";
        this.hasApiKey = false;
        this.headers = {
            "Content-Type": "application/json",
            "ApiKey": `${this.apiKey}`
        }
        if (this.apiKey != ""){
            this.hasApiKey = true;
    }};
    // turns a uuid into a name
    async uuidToName(uuid){
        if (!this.hasApiKey){
            return "No api key";
        }
        let response = await fetch(`${this.apiUrl}player?${uuid}`, {"headers": this.headers});
        let json = await response.json();
        if (json.success){
            return json.player.displayname;
        }
        return "No player found or api key is invalid";
    };
    // turns a name into a uuid
    async nameToUuid(name){
        let response = await fetch(`https://api.ashcon.app/mojang/v2/user/${name}`);
        let json = await response.json();
        if (json.error){
            return json.error;
        }
        return json.uuid;
    };
    // returns all the whole player's stats
    async getPlayer(uuid){
        if (!this.hasApiKey){
            return "No api key";
        }
        let response = await fetch(this.apiUrl + `player?uuid=${uuid}&key=${this.apiKey}`);
        let json = await response.json();
        if (json.success){
            return json.player;
        }
        return "No player found or api key is invalid";
    }
    // gets the player's stats
    async getPlayersGameStats(uuid, game){
        if (!this.hasApiKey){
            return "No api key";
        }
        let response = await fetch(this.apiUrl + `player?uuid=${uuid}&key=${this.apiKey}`);
        let json = await response.json();
        if (json.success){
            return json.player.stats[game];
        }
        return "No player found or api key is invalid";
    }
    // Returns the list of games
    async hypixelGameList(){
        return ["Arcade", "Arena", "Battleground",
        "Bedwars","BuildBattle","Duels",
        "GingerBread","Housing","HungerGames",
        "Legacy","MCGO","MurderMystery",
        "Paintball","Pit","Quake",
        "SkyBlock" /* only gets profile ID's */,"SkyClash","SkyWars",
        "SuperSmash","TNTGames","TrueCombat",
        "UHC","VampireZ","Walls",
        "Walls3"]
    }
    // Creates a new HypixelSkyblock object
    async createHypixelSkyblock(){
        return new HypixelSkyblock(this.apiKey);
    }
}

export class HypixelSkyblock{
    constructor(apiKey = ""){
        this.apiKey = apiKey;
        this.apiUrl = "https://api.hypixel.net/";
        this.hasApiKey = false;
        if (this.apiKey != ""){
            this.hasApiKey = true;
        }
        this.itemDict = {}
        this.__setupItemDict()
    }

    async __setupItemDict(){
        let response = await fetch(`${this.apiUrl}skyblock/items`);
        let json = await response.json();
        if (json.success){
            json.items.forEach(item => {
                this.itemDict[item.id] = item;
            });
        };
    };

    async getSkyblockProfileData(skyProfileId){
        if (!this.hasApiKey){
            return "No api key";
        }
        let response = await fetch(`${this.apiUrl}skyblock/profile/${skyProfileId}`);
        let json = await response.json();
        if (json.error){
            return json.error;
        }
        return json;
    }
    async getPlayersProfiles(uuid){
        // returns an array of all the players profiles
        if (!this.hasApiKey){
            return "No api key";
        }
        let response = await fetch(`${this.apiUrl}skyblock/profiles?uuid=${uuid}?key=${this.apiKey}`);
        let json = await response.json();
        if (json.success){
            return json.profiles;
        }
        return "No player found or api key is invalid";
    }
    async getSkyblockProfile(uuid, profileId){
        if (!this.hasApiKey){
            return "No api key";
        }
        let response = await fetch(`${this.apiUrl}skyblock/profile/${profileId}`);
        let json = await response.json();
        if (json.success){
            json.memebers.forEach(member => {
                if (member.uuid == uuid){
                    return member;
                }
            });
        }
        return "No profile found or api key is invalid";
    }
}


export class HypixelBazaar{
    constructor(){
        this.apiUrl = "https://api.hypixel.net/";
        this.currentBazaar = {};
        this.refreshBazaar();
    }
    async refreshBazaar(){
        let response = await fetch(`${this.apiUrl}skyblock/bazaar`);
        let json = await response.json();
        if (json.success){
            this.currentBazaar = json.products;
        }
    }
    async getAllItems(){
        let itemTable = new itemLookupTable();
        let response = await fetch(`${this.apiUrl}skyblock/bazaar`);
        let json = await response.json();
        var items = [];
        if (json.success){
            Object.keys(json.products).forEach(function(key){
                if (key in itemTable){
                    items.push(new BazaarItem(key,itemTable[key],{"quick_status" : json.products[key]["quick_status"], "sell_summary" : json.products[key]["sell_summary"], "buy_summary" : json.products[key]["buy_summary"]}));
                } else{
                    items.push(new BazaarItem(key,uppercaseWords(key),{"quick_status" : json.products[key]["quick_status"], "sell_summary" : json.products[key]["sell_summary"], "buy_summary" : json.products[key]["buy_summary"]}));
                }
            });
            return items
        };
        return "Something went wrong";
    }
}

export class SkyblockItem{
    constructor(name, id, data){
        this.name = name;
        this.id = id;
        this.data = data;
    }
}
export class BazaarItem {
    constructor(name = "", dispName = "", stats = {}){
        this.name = name;
        this.dispName = dispName;
        this.stats = stats;
    };
    getBuyOrderPrice(){
        return this.stats.buy_summary[0].pricePerUnit;
    };
    getSellOrderPrice(){
        return this.stats.sell_summary[0].pricePerUnit;
    };
    getQuickStatus(){
        return this.stats.quick_status;
    };
    getFlipProfitAmount(){
        return this.stats.sell_summary[0].pricePerUnit - 0.1 - (this.stats.buy_summary[0].pricePerUnit + 0.1);
    };
}

class itemLookupTable{
    dicto = {};
    constructor(){
        // Code taken from ianrenton/Skyblock-Bazaar-Flipping-Calculator
        this.dicto['BAZAAR_COOKIE'] = 'Booster Cookie'; 
        this.dicto['ENCHANTED_CARROT_STICK'] = 'Enchanted Carrot on a Stick';
        this.dicto['HUGE_MUSHROOM_1'] = 'Brown Mushroom Block';
        this.dicto['HUGE_MUSHROOM_2'] = 'Red Mushroom Block';
        this.dicto['ENCHANTED_HUGE_MUSHROOM_1'] = 'Enchanted Brown Mushroom Block';
        this.dicto['ENCHANTED_HUGE_MUSHROOM_2'] = 'Enchanted Red Mushroom Block';
        this.dicto['SULPHUR'] = 'Gunpowder';
        this.dicto['RABBIT'] = 'Raw Rabbit';
        this.dicto['ENCHANTED_RABBIT'] = 'Enchanted Raw Rabbit';
        this.dicto['RAW_FISH:1'] = 'Raw Salmon';
        this.dicto['RAW_FISH:2'] = 'Clownfish';
        this.dicto['RAW_FISH:3'] = 'Pufferfish';
        this.dicto['INK_SACK:3'] = 'Cocoa Beans';
        this.dicto['INK_SACK:4'] = 'Lapis Lazuli';
        this.dicto['LOG'] = 'Oak Log';
        this.dicto['LOG:1'] = 'Spruce Log';
        this.dicto['LOG:2'] = 'Birch Log';
        this.dicto['LOG_2:1'] = 'Dark Oak Log';
        this.dicto['LOG_2'] = 'Acacia Log';
        this.dicto['LOG:3'] = 'Jungle Log';
        this.dicto['CARROT_ITEM'] = 'Carrot';
    };
}