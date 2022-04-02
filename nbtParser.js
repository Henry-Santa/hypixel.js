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
            console.log(this.data);
        } else {
            this.__Parse(this.data);
        }
        // parse the data 
        
    }
    // a function that decompresses a gzipped string into a unit8 array
    async __decompress(){
        // create a blob
        var blob = new Blob([this.data]);
        const ds = new DecompressionStream('gzip');
        // use the blob and the decompression stream to create a unit8array
        const reader = new FileReader();
        reader.readAsArrayBuffer(blob);
        reader.onload = async () => {
            const buffer = await reader.result;
            const unit8 = new Uint8Array(buffer);
            this.data = unit8;
            await this.__Parse(unit8);
        }
        
        
    
    }
    async __Parse(data){
        console.log(data);
        let tags = {};
        let insideComp = 1; // the og compound
        let currIndex = 0;
        // get the type of the tag
        while(insideComp){
            let type = data[currIndex];
            if(type === 0){
                insideComp -= 1;
            } else if (type === 10){
                insideComp += 1;
            }


        console.log(tags);
        }
    }
}

//test
async function test(){
    console.log(window.zlib);
    var data = "H4sIABSUR2IA/wEhAN7/CgALaGVsbG8gd29ybGQIAARuYW1lAAlCYW5hbnJhbWEAd9pcOiEAAAA=";
    var b64Decode = atob(data);
    var NBT = new nbt(b64Decode,true);
    NBT.parse();
}
test();
