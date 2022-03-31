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
        this.version = "1.0.0 Beta";
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
     * @description Handy function to get a player's name
     * @param {String} uuid - The uuid of the player
     * @returns {String} name of the player
     */
    async uuidToName(uuid){
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
    async nameToUuid(name){
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
    async getSkinUrl(uuid){
        let response = await fetch(`https://api.ashcon.app/mojang/v2/user/${uuid}`);
        let json = await response.json();
        if (json.error){
            return json.error;
        }
        return json.textures.skin.url;
    }
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
    }
    /**
     * 
     * @param {String} uuid - The uuid of the player you want the stats for
     * @param {String} game - The game you want the stats for 
     * @returns {Object} The stats of the player in that game
     */
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
     * @returns [{}] 
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
     * @returns {Number} buy order price
     */
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

class hypixelAuctionHouse{
    constructor(){
        this.apiUrl = "https://api.hypixel.net/";
        this.auctions = {};
    }
    /**
     * @description Refreshes the auction house data, is void. Get the new data from this.auctions, data might not be finished parsing when this is called
     */
    async getAllAuctions(){
        let response = await fetch(`${this.apiUrl}skyblock/auctions`);
        this.auctions = {};
        let json = await response.json();
        if (json.success){
            this.auctions = [...this.auctions, ...json.auctions];
            for(i = 1; i <= json.pages; i++){
                response =fetch(`${this.apiUrl}skyblock/auctions?page=${i}`).then(response => response.json()
                ).then(json => {json.auctions.forEach(auction => {
                    if (auction.highest_bid_amount == 0){
                        auction.highest_bid_amount = auction.starting_bid_amount;
                    }
                    this.auctions[auction.uuid] = new hypixelAuction(uuid=auction.uuid,item=item.name,price=auction.highest_bid_amount,time=auction.end-auction.start, raw=auction, auctioneer=auction.auctioneer, bin=auction.bin);
                    }
                );});
            }
        } 
    }
    /**
     * @param {String} searchParam The parameter to search for (needs to match type specified)
     * @param {String} type player = uuid of player, uuid = uuid of auction, profile = profile uuid
     * @returns {[hypixelAuction]}} Returns an array of all the auctions that match the search param
     */
    async getAuctionById(searchParam="",type="uuid"){
        if (type == "uuid"){
            return [this.auctions[searchParam]];
        } else if (type == "player"){
            let response = await fetch(`${this.apiUrl}skyblock/auction?player=${searchParam}`);
            let json = await response.json();
            if (json.success){
                json.auctions.forEach(auction => {
                    toReturn.push(this.auctions[auction.uuid]);
                });
            }
        } else if (type == "profile"){
            let response = await fetch(`${this.apiUrl}skyblock/auction?profile=${searchParam}&key=${key}`);
            let json = await response.json();
            var toReturn = [];
            if (json.success){
                json.auctions.forEach(auction => {
                    toReturn.push(this.auctions[auction.uuid]);
                });
            }else{
                return("type invalid");
            }
        return toReturn;
    }}
}
class hypixelAuction{
    /**
     * 
     * @param {String} uuid uuid of auction
     * @param {String} item name of item
     * @param {Number} price current price of item
     * @param {Number} time time left in auction
     * @param {Object} raw raw data from api
     * @param {String} auctioneer uuid of auctioneer
     * @param {Boolean} bin if auction is in bin
     */
    constructor(uuid, item, price, time, raw, auctioneer, bin){
        this.uuid = uuid;
        this.item = item;
        this.price = price;
        this.auctioneer = auctioneer;
        this.bin = bin;
        this.time = time;
        this.raw = raw;
    }
}
export {SkyblockItem, BazaarItem, Hypixel, HypixelBazaar, hypixelAuctionHouse, hypixelAuction};