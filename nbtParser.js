// Maybe an nbt parser in javascript if I have time

class nbt{
    lookUpTable = {
		'end': 0,
		'byte': 1,
		'short': 2,
		'int': 3,
		'long': 4,
		'float': 5,
		'double': 6,
		'byteArray': 7,
		'string': 8,
		'list': 9,
		'compound': 10,
		'intArray': 11,
		'longArray': 12
	};
    reverseLookUpTable = {
        0: 'end',
        1: 'byte',
        2: 'short',
        3: 'int',
        4: 'long',
        5: 'float',
        6: 'double',
        7: 'byteArray',
        8: 'string',
        9: 'list',
        10: 'compound',
        11: 'intArray',
        12: 'longArray'
    };
    
    /**
     * @param {any} data compressed data, (string), or uncompressed (unit8array)
     * @param {boolean} isCompressed if the data is compressed
     */
    constructor(data, isCompressed){
        this.data = data;
        this.isCompressed = isCompressed;
    }
    // parses nbt data into a javascript object from a unit8array
    async parse(){
        // check if the data is compressed
        if(this.isCompressed){
            // decompress the data
            this.data = await this.__decompress();
        }
        // parse the data
        return await this.__Parse(this.data, 0);
    }
    // a function that decompresses a gzipped string into a unit8 array
    async __decompress(){
        // create a blob
        var blob = new Blob([this.data]);
        // decompress the blob (it is gzipped data)
        var data = await (await fetch(URL.createObjectURL(blob))).arrayBuffer();
        // return the data
        return new Uint8Array(data);
    }
    async __Parse(data){
        let tags = {};
        // get the type of the tag
        for(var i = 0; i < data[0]; i++){
            tags[i] = {
                type: data[i],
                name: data[i+1],
                value: data[i+2]
            };
        }
        console.log(tags);
    }
}

//test
async function test(){
    var data = "H4sIAAAAAAAAAO1Xy1LbVhg+YEiM00w6k0vTTpuctEmnHaJGd1veGdvYbm2ZYIPBG+ZIOrIFsuTRBTC77rrprtvsOsML9Al4gy676+QJ+gSd/kcyJEAIaTZlOvHG1tH33z7934fIIbSAZpwcQmhuFs061gw3g+bLfuxFMzmUichgAc1RzxwyxMwsyri7LsokSJRFM+jGmmcElOwQw6UzGbRQdyy67JJBCPC/c+i65YRjl0wgSdMPaBZOH6Ivjw7znSig3iAaFvHRobkoKezrm5pvuRO8KPDfoieAKQdOhMtD4pk0hSlPXocpT16DVciIDKawwilYAWAI3QVgnRI3rUgWBShZX0G34bhCbeqFdHrOK+gxHDa8iLquM6DT4mTxVIsKy3nn6FCr0HE0xDANzB3gRqORTLdKrdikIR76e3gUm0M88WNMAopD19+jFnoAGMfD0ZDiPRJBoDFhNQSeZwN9l2RepgTuB3iZQB/eAK8nmRueCXSH09xDZ5DmNomHbQCih4AxqA1c44jssDh2jK2EHiiTMAalFPjCxLNwMG31DOxmChOVtKEb0FAt8Pdg1rSPWkC8KEyIySfMvHzxK04JTgJuQcBK4EfUjBzfg6CvTgcJLIi8fPETntKfRCHWv7ocQysdGuEl34vDImPXh0GWXN+3EGYkjMaBvwtNMwKhUCkcQx3s2+yAVdKqnpUMaDiuE00YvU5KHGOEgVgaeMJ07AcRhiWN2JZNH8OiCDeTKQ3XN3fCp2eCsRUHhI2FHjFMGiOxeiE1fc8KE2IHzi7g0dcpkYtTkn7Ex5uf9OeywfacaJhsIssNo1ALG2zyR+neqkeHbrNaq+qV0uomXmq3u50Mmjd91w/QX78/zqI5nYwo+hyQ6XZO+aoEZADUL/l+FKIculXdjwJSimBVjTiiYfY4R06U+aLIa0VJzaLsyLcc26EBmh+wZFm04AfOwPG6ZIDulldLy92GXtuqrTYqW+V2s1ktd7OJGdzudFfbcKeyWqq19a2kzRz6iFkHPPQRhQefQTctJpetMJULjJfJoFt2uuhbdrrocDqfQbnxyfKkB9cGyfqxCzCeuTiGmo+pbEiCKEpcoZCXOVm085wmkjxHBEuSDInXeIOHXMTbddytGFQD4bMwUuSMKDzy0Rh9rD0TpWeChgW+KIi41AIAupa6CQMnlvj0zZaI2Od9LPCTq2GB+QssUHl3C/zgC/+RL9w/6wvwqwbKfGUNf/7y6bE1PLzAGpp0AMoeXOIOolwU5EJRVC5xh9un3aFTbyxPveHeaW84bvWcPbym8XMO8Er0isoLAi+bnEwliZNJXuQ0xaacWjBoQdEszZS0S0Qv8M+0RPRiUZTxyhtFv/j/FL12gejzH0R/5UX/2VnRl+vVTnelWepWT2T/x4PSsewfXSD78hB0ANsZ0bcJf0EU8kWJL6qX6f76mv6D3u7pqdbvn9b6qw7Pqf3d/sQT1dKIxIucpBBQuyRbHNFsgxO1PK/ZimSKknK52guJ2oWiol6g9p/fovbz8s51dmAt23seDWDqBrRpqnnBkGTKGYIscRJvS5yhqhanSIJgywWb2qYKcaCCMQ0ih4YLKBvR/SgOaJj8awW8rxM3pug3Ovme728MeWvje9ecNFS47nZ4t93YHoM81ydGuaE2RnC/vnTQdgq7Vm1dturrk/5GKzZ6btzv6ZPNXp9vjhTXKmsnuZoHprw5aol6d21/c7TutLarfLv2XGkduI6+vaO0ttf29crSTmu7JbV7fbdV6w83t/uuLj4/aPU2Rb23OtK7S47ehdF7m5IuVvf63eeOvSFoMMFVNj35AtMTP5jelTe9e2dNr15ttqrdY5P74gKTq1N3RKM3Gty/cLM7p90sLf2e7y1CQaUaZW8rBdng5IJlcQVL5TklX9B4uNQEmn+7k906eW8pCmeNLIPQP0GCADjMEQAA";
    var b64Decode = atob(data);
    var NBT = new nbt(b64Decode,true);
    NBT.parse();
}
test();
