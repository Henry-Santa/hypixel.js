const uppercaseWords = str => str.replace(/^(.)|\s+(.)/g, c => c.toUpperCase()); // Function to uppercase first letter of each word

/**
 * @description Represents a the Hypixel API
 * @class Hypixel
 * @param {string} apiKey - Your Hypixel API key (optional)
 */
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
            "API-Key": `${this.apiKey}`
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
        this.headers = {
            "Content-Type": "application/json",
            "API-Key": `${this.apiKey}`
        }
    };
    /**
     * @description gets data on the api key
     * @returns {Object}
     */
    async getApiKeyStats(){
        if (!this.hasApiKey){
            return "No api key";
        }
        let response = await fetch(this.apiUrl + `key`, {headers: this.headers});
        let json = await response.json();
        if (json.success){
            return json.record;
        }
        return "api key is invalid";
    };
    /**
     * @description Gets the ranked skywars stats of a player
     * @param {String} uuid - The uuid of the player
     * @returns {Object} The current players ranked skywars stats
     */
    async getRankedSkywarsStats(uuid){
        if (!this.hasApiKey){
            return "No api key";
        }
        let response = await fetch(this.apiUrl + `player/ranked/skywars?uuid=${uuid}`, {headers: this.headers});
        let json = await response.json();
        if (json.success){
            return json.player;
        }else if (response.status === 404){
            return "No data on player";
        }
        return "api key is invalid or another error occured";
    };
    /**
     * @description gets all the achievements for all games on Hypixel
     * @warning This function returns a lot of data and is not returned in an easy to use way (Still a json though)
     * @returns {Object} The Hypixel achievements
     */
    async getAchievements(){
        let response = await fetch(this.apiUrl + `resources/achievements`);
        let json = await response.json();
        if (json.success){
            return json.achievements;
        }
        return "An error has occured";
    };
    /**
     * @description Gets all challenges across the Hypixel network
     * @returns {Object}
     */
    async getChallenges(){
        let response = await fetch(this.apiUrl + `resources/challenges`);
        let json = await response.json();
        if (json.success){
            return json.challenges;
        }
        return "An error has occured";
    };
    /**
     * @description Gets the quests across the Hypixel network
     * @returns {Object} The quests
     */
    async getQuests(){
        let response = await fetch(this.apiUrl + `resources/quests`);
        let json = await response.json();
        if (json.success){
            return json.quests;
        }
        return "Some error occured";
    }
    /**
     * @description Gets the pet data of what pets a player can have (very not useful)
     * @returns {Object} The pets
     */
    async getPets(){
        let response = await fetch(this.apiUrl + `rresources/vanity/pets`);
        let json = await response.json();
        if (json.success){
            return {"types": json.types, "rarities": json.rarities};
        }
        return "Some error occured";
    }
    /**
     * @description Gets the pet data of what companions a player can have (very not useful)
     * @returns {Object} The pets
     */
     async getCompanions(){
        let response = await fetch(this.apiUrl + `resources/vanity/companions`);
        let json = await response.json();
        if (json.success){
            return {"types": json.types, "rarities": json.rarities};
        }
        return "Some error occured";
    }
    /**
     * @param {String} uuid - The uuid of the player
     * @returns {Object} The current online status of a player
     */
    async getOnlineStatus(uuid){
        if (!this.hasApiKey){
            return "No api key";
        }
        let response = await fetch(this.apiUrl + `player?uuid=${uuid}`, {headers: this.headers});
        let json = await response.json();
        if (json.success){
            return json.session;
        }
        return "an error has occured";
    };
    /**
     * @description not very useful
     * @returns {Object} Guild achievments, not of a spec guild, just the ones you can earn
     */
    async getGuildAchievements(){
        let response = await fetch(this.apiUrl + `resources/guilds/achievements`);
        let json = await response.json();
        if (json.success){
            return json.tiered;
        }
        return "Some error occured";
    };
    /**
     * @description Very easy to use :D
     * @returns {Object} The current punishment stats on hypixel
     */
    async getPunishmentStats(){
        if (!this.hasApiKey){
            return "No api key";
        }
        let response = await fetch(this.apiUrl + `punishmentstats`, {headers: this.headers});
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
        
        let response = await fetch(this.apiUrl + `leaderboards`);
        let json = await response.json();
        if (json.success){
            return json.leaderboards;
        }
        return "Some error occured";
    };
    /**
     * @description Gets the player counts on hypixel with extra data
     * @returns {playerCounts} A type for storing this data. Use playerCounts.getTotal() to get the total number of players and playerCounts.getGames() to get the number of online players
     */
    async getPlayerCounts(){
        if(!this.hasApiKey){
            return "No api key";
        }
        let response = await fetch(this.apiUrl + `counts`, {headers: this.headers});
        let json = await response.json();
        if (json.success){
            return new PlayerCounts(json.games, json.playerCount);
        }
        return "api key is invalid";
    };

    /**
     * @description Gets the current boosters
     * @returns {Object[]} all of the boosters currently active and data on them
     */
    async getCurrentBoosters(){
        if (!this.hasApiKey){
            return "No api key";
        }
        let response = await fetch(this.apiUrl + `boosters`, {headers: this.headers});
        let json = await response.json();
        if (json.success){
            return json.boosters;
        }
        return "No player found or api key is invalid";
    };
    /**
     * @description Gets stats on hypixel guild 
     * @important Only use one param
     * @param {String} guildName Name of guild
     * @param {String} guildId Object id of guild
     * @param {String} uuidOfMember A  uuid of a member of the guild
     * @returns {Object} guild stats
     */
    async getGuildStats(guildName = "", guildId = "", uuidOfMember = ""){
        if (!this.hasApiKey){
            return "No api key";
        }
        if (guildName != ""){
            let response = await fetch(this.apiUrl + `guild?name=${guildName}`, {headers: this.headers});
        } else if(guildId != ""){
            let response = await fetch(this.apiUrl + `guild?id=${guildId}`, {headers: this.headers});
        } else if(uuidOfMember != ""){
            let response = await fetch(this.apiUrl + `guild?player=${uuidOfMember}`, {headers: this.headers});
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
        let response = await fetch(this.apiUrl + `player?uuid=${uuid}`, {headers: this.headers});
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
        let response = await fetch(this.apiUrl + `recentgames?uuid=${uuid}`, {headers: this.headers});
        let json = await response.json();
        if (json.success){
            return json.games;
        }
        return "No player found or api key is invalid";
    };
    /**
     * 
     * @param {String} uuid 
     * @returns {String[]} of all the friends of the player (in uuid form)
     */
    async getFriendList(uuid){
        if (!this.hasApiKey){
            return "No api key";
        }
        let response = await fetch(this.apiUrl + `friends?uuid=${uuid}`, {headers: this.headers});
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
        let response = await fetch(this.apiUrl + `player?uuid=${uuid}`, {headers: this.headers});
        let json = await response.json();
        if (json.success){
            return json.player.stats[game];
        };
        return "No player found or api key is invalid";
    };
    /**
     * @description Useful for the getPlayersGameStats function :)
     * @returns {String[]} of all the games that you can get stats for (their ids not nessicarly their names)
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
/**
 * @description Represents the hypixel api for skybloc
 * @class HypixelSkyblock
 * @param {string} apiKey - Your Hypixel API key (optional)
 */
export class HypixelSkyblock{
    constructor(apiKey = ""){
        this.apiKey = apiKey;
        this.apiUrl = "https://api.hypixel.net/";
        this.__setupItemDict()
        this.hasApiKey = false;
        if (this.apiKey != ""){
            this.hasApiKey = true;
        }
        this.itemDict = {}
        this.bazaar = null;
        this.hypixelAuctionHouse = null;
        this.headers = {
            "Content-Type": "application/json",
            "API-Key": this.apiKey
        };
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
        let response = await fetch(`${this.apiUrl}skyblock/profile?profile=${skyProfileId}`, {headers: this.headers});
        let json = await response.json();
        if (json.error){
            return json.error;
        }
        return json;
    }
    /**
     * 
     * @param {String} uuid the uuid of the player you would like to get profile list of
     * @returns {Object[]} 
     */
    async getPlayersProfiles(uuid){
        if (!this.hasApiKey){
            return "No api key";
        }
        let response = await fetch(`${this.apiUrl}skyblock/profiles?uuid=${uuid}`, {headers: this.headers});
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
     * @description only gets data of the player's skyblock profile not the other players in the profile
     * Use getSkyblockProfileData for getting all of the data :)
     * @param {String} uuid the uuid of the player who u would like to get the profile of
     * @param {String} profileId The profile id
     * @returns {object}
     */
    async getSkyblockProfile(uuid, profileId){
        if (!this.hasApiKey){
            return "No api key";
        }
        let response = await fetch(`${this.apiUrl}skyblock/profile/?profile=${profileId}`, {headers: this.headers});
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
    /**
     * @description Creates a new Hypixel Auctionhouse object that is linked to this.bazaar
     * @returns {hypixelAuctionHouse}
     */
    async getAuctionHouse(){
        this.hypixelAuctionHouse = new hypixelAuctionHouse();
        return this.hypixelAuctionHouse;
    }
    /**
     * @description Gets data of what each collection will unlock you at a certain level
     * @returns {Object} Dictionary of collection data by type
     */
    async getCollectionData(){
        let response = await fetch(`${this.apiUrl}resources/skyblock/collections`);
        let json = await response.json();
        if (json.success){
            return json.collections;
        }
        return "Some error has occured";
    }
    /**
     * @description Gets data of skill leveling and what you unlokc
     * @returns {Object}
     */
    async getSkillData(){
        let response = await fetch(`${this.apiUrl}resources/skyblock/skills`);
        let json = await response.json();
        if (json.success){
            return {"skills" : json.skills, "unlocks" : json.collections};
        }
        return "Some error has occured";
    }
    /**
     * @description Gets electoral data
     * @returns {Object} data
     */
    async getElectoralData(){
        let response = await fetch(`${this.apiUrl}resources/skyblock/electoral`);
        let json = await response.json();
        if (json.success){
            return {"current" : json.current, "election" : json.mayor};
        }
        return "Some error has occured";
    }
    /**
     * @description Gets the current data of the active bingo goals
     * @returns {Object} Dictionary of bingo goals
     */
    async getBingoData(){
        let response = await fetch(`${this.apiUrl}resources/skyblock/bingo`);
        let json = await response.json();
        if (json.success){
            return json.goals;
        }
        return "Some error has occured";
    }
    /**
     * @description Gets the news
     * @returns {Object} Dictionary of the current news
     */
    async getNews(){
        let response = await fetch(`${this.apiUrl}resources/skyblock/news`);
        let json = await response.json();
        if (json.success){
            return json.items;
        }
        return "Some error has occured";
    }
    /**
     * @param {String} uuid the uuid of the player
     * @description Gets bingo data by player
     * @returns {Object} Dictionary of bingo data
     */
    async getBingoDataByPlayer(uuid){
        if(!this.hasApiKey){
            return "No api key";
        }
        let response = await fetch(`${this.apiUrl}skyblock/bingo?uuid=${uuid}`, {headers: this.headers});
        let json = await response.json();
        if (json.success){
            return json.goals;
        }
        return "Some error has occured";
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
     * @returns {BazaarItem[]} Returns an array of all the items in the bazaar
     */
    async getItems(){
        let itemTable = new itemLookupTable();
        let response = await fetch(`${this.apiUrl}skyblock/bazaar`);
        let json = await response.json();
        var items = [];
        if (json.success){
            Object.keys(json.products).forEach(function(key){
                if (Object.keys(itemTable.dicto).includes(key)){
                    items.push(new BazaarItem(key,itemTable[key],{"quick_status" : json.products[key]["quick_status"], "sell_summary" : json.products[key]["sell_summary"], "buy_summary" : json.products[key]["buy_summary"]}));
                } else{
                    items.push(new BazaarItem(key,uppercaseWords(key.replaceAll("_"," ").toLowerCase()),{"quick_status" : json.products[key]["quick_status"], "sell_summary" : json.products[key]["sell_summary"], "buy_summary" : json.products[key]["buy_summary"]}));
                }
            });
            return items;
        };
        return "Something went wrong";
    }
    /**
    * @param sortType {'name' | 'buyPrice' | 'flipAmount' | 'sellPrice'} The field to sort by!
    */
    async sortItems(sortType){
        let items = this.getItems();
        if (sortType == "name"){
            items.sort(function(a,b){
                if (a.dispName < b.dispName){
                    return -1;
                }
                if (a.dispName > b.dispName){
                    return 1;
                }
                return 0;
            });
        } else if (sortType == "buyPrice"){
            items.sort(function(a,b){
                if (a.getBuyOrderPrice() < b.getBuyOrderPrice()){
                    return -1;
                }
                if (a.getBuyOrderPrice() > getBuyOrderPrice()){
                    return 1;
                }
                return 0;
            });
        } else if (sortType == "flipAmount"){
            items.sort(function(a,b){
                if (a.getFlipProfitAmount() < b.getFlipProfitAmount()){
                    return -1;
                }
                if (a.getFlipProfitAmount() > b.getFlipProfitAmount()){
                    return 1;
                }
                return 0;
            });
        } else if (sortType == "sellPrice"){
            items.sort(function(a,b){
                if (a.getSellOrderPrice() < b.getSellOrderPrice()){
                    return -1;
                }
                if (a.getSellOrderPrice() > b.getSellOrderPrice()){
                    return 1;
                }
                return 0;
            });
        } else{
            return "Invalid sort type";
        }
    }
}

export class SkyblockItem{
    constructor(name, id, data){
        this.name = name;
        this.id = id;
        this.data = data;
    }
}
/**
 * @class BazaarItem
 * @description A class that represents an item in the bazaar
 * @param {String} name The name of the item
 * @param {String} dispName The display name of the item
 * @param {stats} stats The stats of the item // not parsed
 * use the methods for general stats
 */
export class BazaarItem {
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
export class itemLookupTable{
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

export class hypixelAuctionHouse{
    constructor(apiKey){
        this.apiUrl = "https://api.hypixel.net/";
        this.auctions = {};
        this.apiKey = apiKey;
        this.headers = {
            "Content-Type": "application/json",
            "API-Key": this.apiKey
        };
    }
    /**
     * @description Refreshes the auction house data, is void. Get the new data from this.auctions, data might not be finished parsing when this is called
     * @warning this function uses a lot of bandwith, so use it sparingly
     */
    async getAllAuctions(){
        let response = await fetch(`${this.apiUrl}skyblock/auctions`);
        this.auctions = {};
        let json = await response.json();
        if (json.success){
            for(let i = 1; i < json.totalPages; i++){
                let response =await fetch(`${this.apiUrl}skyblock/auctions?page=${i}`)
                let json = await response.json()
                json.auctions.forEach(auction => {
                    if (auction.highest_bid_amount == 0){
                        auction.highest_bid_amount = auction.starting_bid_amount;
                    }
                    if (!auction.bin){
                        this.auctions[auction.uuid] = new hypixelAuction(auction.uuid,auction.item_name,auction.highest_bid_amount,auction.end-auction.start, auction, auction.auctioneer, auction.bin);
                    }else{
                    this.auctions[auction.uuid] = new hypixelAuction(auction.uuid,auction.item_name,auction.starting_bid,auction.end-auction.start, auction, auction.auctioneer, auction.bin);
                    }}
                );
            }return "Success"
        }return "Failed";
    }
    /**
     * @param {String} searchParam The parameter to search for (needs to match type specified)
     * @param {"player" | "uuid" | "profile"} type player = uuid of player, uuid = uuid of auction, profile = profile uuid
     * @returns {hypixelAuction[]} Returns an array of all the auctions that match the search param
     */
    async getAuctionById(searchParam="",type="uuid"){
        if (type == "uuid"){
            return [this.auctions[searchParam]];
        } else if (type == "player"){
            let response = await fetch(`${this.apiUrl}skyblock/auction?player=${searchParam}`, {headers: this.headers});
            let json = await response.json();
            if (json.success){
                json.auctions.forEach(auction => {
                    toReturn.push(this.auctions[auction.uuid]);
                });
            }
        } else if (type == "profile"){
            let response = await fetch(`${this.apiUrl}skyblock/auction?profile=${searchParam}`, {headers: this.headers});
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
    }};
    
    /**
     * @description gets the recently ended auctions
     * @returns {{uuid : hypixelAuction}} Returns an object of the recently ended auctions
     */
    async getRecentlyEndedAuctions(){
        let response = await fetch(`${this.apiUrl}skyblock/auctions_ended`);
        let json = await response.json();
        var toReturn = {};
        if (json.success){
            json.auctions.forEach(auction => {
                toReturn[auction.auction_id] = new hypixelAuction(auction.auction_id,auction.item_name,auction.price,auction.end-auction.start, auction, auction.seller, auction.bin);
            });
        }
        return toReturn;
    }
}
export class hypixelAuction{
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
export class util{
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

/**
 * @description represents the player counts on hypixel
 */
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

