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
        return "No player found";
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
        return "No player found";
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
        return "No player found";
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
        return "No player found";
    }
}

export class HypixelBazaar{
    constructor(){
        this.apiUrl = "https://api.hypixel.net/";
    }
}