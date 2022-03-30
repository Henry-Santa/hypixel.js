const uppercaseWords = str => str.replace(/^(.)|\s+(.)/g, c => c.toUpperCase()); // Function to uppercase first letter of each word

/**
 * @description Represents a the Hypixel API
 * @class Hypixel
 * @param {string} apiKey - Your Hypixel API key (optional)
 */
class Hypixel{
    // creates a new instance of the class
    constructor(apiKey = ""){
        this.name = "hypixel.js";
        this.version = "1.0.1 Beta";
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
    /**
     * @description Adds a hypixel api key to the class :)
     * @param {String} apiKey - Your Hypixel API key 
     */
    async setApiKey(apiKey){
        this.apiKey = apiKey;
        this.hasApiKey = true;
    };
    /**
     * @description gets data on the api key
     * @returns {Object}
     */
    async getApiKeyStats(){
        if (!this.hasApiKey){
            return "No api key";
        }
        let response = await fetch(this.apiUrl + `key?key=${this.apiKey}`);
        let json = await response.json();
        if (json.success){
            return json.record;
        }
        return "api key is invalid";
    };
    /**
     * @description Very easy to use :D
     * @returns {Object} The current punishment stats on hypixel
     */
    async getPunishmentStats(){
        if (!this.hasApiKey){
            return "No api key";
        }
        let response = await fetch(this.apiUrl + `punishmentstats?key=${this.apiKey}`);
        let json = await response.json();
        if (json.success){
            return json;
        }
        return "api key is invalid";
    };
    /**
     * @description Gets the current Hypixel leaderboards
     * @warning This function returns a lot of data and is not easy to use
     * @returns {Object} The Hypixel leaderboards
     */
    async getLeaderboards(){
        if(!this.hasApiKey){
            return "No api key";
        }
        let response = await fetch(this.apiUrl + `leaderboards${this.apiKey}`);
        let json = await response.json();
        if (json.success){
            return json.leaderboards;
        }
        return "api key is invalid";
    };
    /**
     * @description Gets the player counts on hypixel with extra data
     * @returns {playerCounts} A type for storing this data. Use playerCounts.getTotal() to get the total number of players and playerCounts.getGames() to get the number of online players
     */
    async getPlayerCounts(){
        if(!this.hasApiKey){
            return "No api key";
        }
        let response = await fetch(this.apiUrl + `counts?key=${this.apiKey}`);
        let json = await response.json();
        if (json.success){
            return new PlayerCounts(json.games, json.playerCount);
        }
        return "api key is invalid";
    };

    /**
     * @description Gets the current boosters
     * @returns [{Object}] all of the boosters currently active and data on them
     */
    async getCurrentBoosters(){
        if (!this.hasApiKey){
            return "No api key";
        }
        let response = await fetch(this.apiUrl + `boosters?key=${this.apiKey}`);
        let json = await response.json();
        if (json.success){
            return json.boosters;
        }
        return "No player found or api key is invalid";
    };
    /**
     * @description Gets stats on hypixel guild
     * @param {String} guildName Name of guild
     * @param {String} guildId Object id of guild
     * @param {String} uuidOfMember A  uuid of a member of the guild
     * @returns 
     */
    async getGuildStats(guildName = "", guildId = "", uuidOfMember = ""){
        if (!this.hasApiKey){
            return "No api key";
        }
        if (guildName != ""){
            let response = await fetch(this.apiUrl + `guild?key=${this.apiKey}&name=${guildName}`);
        } else if(guildId != ""){
            let response = await fetch(this.apiUrl + `guild?key=${this.apiKey}&id=${guildId}`);
        } else if(uuidOfMember != ""){
            let response = await fetch(this.apiUrl + `guild?key=${this.apiKey}&player=${uuidOfMember}`);
        } else {
            return "No guild name, guild id, or uuid of member inputted";
        }
        let json = await response.json();
        if (json.success){
            return json.guild;
        };
        return "api key is invalid or guild does not exist";
    };
    async getGameResources(){
        let response = await fetch(this.apiUrl + `resources/games`);
        let json = await response.json();
        if (json.success){
            return json.games;
        }
        return "Some error occured";
    };
    /**
     * 
     * @param {String} uuid - The uuid of the player
     * @returns {Object} The full profile of the player (not skyblock and not just the stats)
     */
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
    };
    async getRecentGames(uuid){
        if (!this.hasApiKey){
            return "No api key";
        }
        let response = await fetch(this.apiUrl + `recentgames?uuid=${uuid}&key=${this.apiKey}`);
        let json = await response.json();
        if (json.success){
            return json.games;
        }
        return "No player found or api key is invalid";
    };
    /**
     * 
     * @param {String} uuid 
     * @returns {[String]} of all the friends of the player (in uuid form)
     */
    async getFriendList(uuid){
        if (!this.hasApiKey){
            return "No api key";
        }
        let response = await fetch(this.apiUrl + `friends?uuid=${uuid}&key=${this.apiKey}`);
        let json = await response.json();
        if (json.success){
            let friends = [];
            json.records.forEach(friend => {
                if (friend.uuidSender == uuid){
                    friends.push(friend.uuidReceiver);
                } else {    
                    friends.push(friend.uuidSender);
                };
            });
        return friends;
        };
        return "No player found or api key is invalid";
    };
    /**
     * 
     * @param {String} uuid - The uuid of the player you want the stats for
     * @param {String} game - The game you want the stats for 
     * @returns {Object} The stats of the player in that game
     */
    async getPlayersGameStats(uuid, game){
        if (!this.hasApiKey){
            return "No api key";
        };
        let response = await fetch(this.apiUrl + `player?uuid=${uuid}&key=${this.apiKey}`);
        let json = await response.json();
        if (json.success){
            return json.player.stats[game];
        };
        return "No player found or api key is invalid";
    };
    /**
     * @description Useful for the getPlayersGameStats function :)
     * @returns [] of all the games that you can get stats for (their ids not nessicarly their names)
     */
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
    /**
     * @description Creates a new HypixelSkyblock object that is linked to this.skyBlock
     * @returns {HypixelSkyblock}
     */
    async createHypixelSkyblock(){
        this.skyBlock = new HypixelSkyblock(this.apiKey);
        return this.skyBlock;
    }
}

class HypixelSkyblock{
    constructor(apiKey = ""){
        this.apiKey = apiKey;
        this.apiUrl = "https://api.hypixel.net/";
        this.__setupItemDict()
        this.hasApiKey = false;
        if (this.apiKey != ""){
            this.hasApiKey = true;
        }
        this.itemDict = {}
    }

    async __setupItemDict(){
        let response = await fetch(`${this.apiUrl}resources/skyblock/items`);
        let json = await response.json();
        if (json.success){
            json.items.forEach(item => {
                this.itemDict[item.id] = item;
                if (item.skin){
                    this.itemDict[item.id]["skin"] = JSON.parse(atob(item.skin));
                }
            });
        };
    };
    /**
     * 
     * @returns {Dictionary} of all the items in the skyblock game
     */
    async getItems(){
        return this.itemDict;
    }

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
    /**
     * 
     * @param {String} uuid the uuid of the player you would like to get profile list of
     * @returns {[{}]} 
     */
    async getPlayersProfiles(uuid){
        if (!this.hasApiKey){
            return "No api key";
        }
        let response = await fetch(`${this.apiUrl}skyblock/profiles?uuid=${uuid}&key=${this.apiKey}`);
        let json = await response.json();
        if (json.success){
            let profs = [];
            json.profiles.forEach(profile => {
                profs.push(profile.profile_id);
            });
            return profs;
        }
        return "No player found or api key is invalid";
    }
    /**
     * 
     * @param {String} uuid the uuid of the player who u would like to get the profile of
     * @param {String} profileId The profile id
     * @returns {object}
     */
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
    /**
     * @description Creates a new bazaar object that is linked to this.bazaar
     * @returns {HypixelBazaar} 
     */
    async getBazaar(){
        this.bazaar = new HypixelBazaar();
        return this.bazaar;
    }
}

/**
 * @class HypixelBazaar
 * @description A class that represents the bazaar of Hypixel Skyblock
 */
class HypixelBazaar{
    constructor(){
        this.apiUrl = "https://api.hypixel.net/";
        this.currentBazaar = {};
        this.refreshBazaar();
    }
    /**
     * @description Refreshes the bazaar data, is void
     */
    async refreshBazaar(){
        let response = await fetch(`${this.apiUrl}skyblock/bazaar`);
        let json = await response.json();
        if (json.success){
            this.currentBazaar = json.products;
        }
    }
    /**
     * @returns [SkyblockItem] Returns an array of all the items in the bazaar
     */
    async getItems(){
        let itemTable = new itemLookupTable();
        let response = await fetch(`${this.apiUrl}skyblock/bazaar`);
        let json = await response.json();
        var items = [];
        if (json.success){
            Object.keys(json.products).forEach(function(key){
                if (key in Object.keys(itemTable.dicto)){
                    console.log("in")
                    items.push(new BazaarItem(key,itemTable[key],{"quick_status" : json.products[key]["quick_status"], "sell_summary" : json.products[key]["sell_summary"], "buy_summary" : json.products[key]["buy_summary"]}));
                } else{
                    items.push(new BazaarItem(key,uppercaseWords(key),{"quick_status" : json.products[key]["quick_status"], "sell_summary" : json.products[key]["sell_summary"], "buy_summary" : json.products[key]["buy_summary"]}));
                }
            });
            return items;
        };
        return "Something went wrong";
    }
}

class SkyblockItem{
    constructor(name, id, data){
        this.name = name;
        this.id = id;
        this.data = data;
    }
}

class BazaarItem {
    constructor(name = "", dispName = "", stats = {}){
        this.name = name;
        this.dispName = dispName;
        this.stats = stats;
    };
    /**
     * @returns {Number} Buy order price
     */
    getBuyOrderPrice(){
        return this.stats.buy_summary[0].pricePerUnit;
    };
    /**
     * 
     * @returns {Number} Sell order price
     */
    getSellOrderPrice(){
        return this.stats.sell_summary[0].pricePerUnit;
    };
    /**
     * 
     * @returns {Object} The quick status of this item
     */
    getQuickStatus(){
        return this.stats.quick_status;
    };
    /**
     * 
     * @returns {Number} The profit per item
     */
    getFlipProfitAmount(){
        return Math.round((this.stats.buy_summary[0].pricePerUnit - 0.1 - (this.stats.sell_summary[0].pricePerUnit + 0.1))*10)/10;
    };
}

/**
 * @class itemLookupTable
 * @description A class that represents the item lookup table for the Hypixel Bazaar
 */
class itemLookupTable{
    dicto = {};
    constructor(){
        /* Thank you Ianrenton on github for these look ups :^), very helpful */
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

class util{
    /**
     * @description Handy function to get a player's name
     * @param {String} uuid - The uuid of the player
     * @returns {String} name of the player
     */
    static async uuidToName(uuid){
        let response = await fetch(`https://api.ashcon.app/mojang/v2/user/${uuid}`);
        let json = await response.json();
        if (json.error){
            return json.error;
        }
        return json.username;
    };
    /**
     * @description Handy function to get a player's uuid
     * @param {String} name - The name of the player
     * @returns {String} uuid of the player
     */
    static async nameToUuid(name){
        let response = await fetch(`https://api.ashcon.app/mojang/v2/user/${name}`);
        let json = await response.json();
        if (json.error){
            return json.error;
        }
        return json.uuid;
    };
    /**
     * @description Not that useful, but it's here if you want to use it
     * @param {String} uuid - The uuid of the player
     * @returns the url of the players skin texture
     */
    static async getSkinUrl(uuid){
        let response = await fetch(`https://api.ashcon.app/mojang/v2/user/${uuid}`);
        let json = await response.json();
        if (json.error){
            return json.error;
        }
        return json.textures.skin.url;
    } 
}

export class playerCounts{
    constructor(games = {}, total = 0){
        this.games = games;
        this.total = total;
    }
    async getGames(){
        return this.games;
    }
    async getTotal(){
        return this.total;
    }
}

export {SkyblockItem, BazaarItem, Hypixel, HypixelBazaar, util};