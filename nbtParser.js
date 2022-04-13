// Maybe an nbt parser in javascript if I have time
const lookUpTable = {
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
const reverseLookUpTable = {
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
class nbtTag{
    constructor(type, name, value){
        this.type = type;
        this.name = name;
    }
    getType(){
        return this.type;
    }
    getName(){
        return this.name;
    }
    getValue(){
        return this.value;
    }
    toString(){
        return this.name + ': ' + this.value;
    }
}
class nbtCompound extends nbtTag{
    /**
     * 
     * @param {String} name 
     * @param {Number} startIndex 
     * @param {Unit8Array} data 
     */
    constructor(name, startIndex, data, parent=null){
        super(10, name);
        this.value = {};
        this.currIndex = startIndex;
        this.data = data;
        this.parent = parent;
    }
    async parseInside(){
        // get the type of the tag
        let type = this.data[this.currIndex];
        this.currIndex++;
        if(type === 0){
            // end tag
            return;
        }
        // get the length of the name
        let lenOfName = this.data[this.currIndex];
        this.currIndex++;
        // get the name of the tag
        let name = String.fromCharCode(this.data.splice(this.currIndex, lenOfName));
        this.currIndex += lenOfName;
        if (type==10){
            // if the tag is a compound
            this.value[name] = new nbtCompound(name, this.currIndex, this.data, this);
            await this.value[name].parseInside();
        }
    }
}
class nbtList extends nbtTag{
    constructor(name, startIndex, data, parent=null, typeOList=9){
        super(typeOList, name);
        this.value = [];
        this.currIndex = startIndex;
        this.data = data;
        this.parent = parent;
        this.insideType = 0;
    }
    async parseInside(){
        let type = this.data[this.currIndex];
        if(type === 10){
            // if the tag is a compound
            this.value.push(new nbtCompound(null, this.currIndex, this.data, this));
            await this.value[this.value.length-1].parseInside();
            this.insideType = 10;
        }
        else if (type === 8){
            // if the tag is a string
            let lenOfString = this.data[this.currIndex+1];
            let Strng = String.fromCharCode(this.data.splice(this.currIndex+2, lenOfString));
            this.value.push(new nbtTag(8, null,Strng));
            this.currIndex += lenOfName+2;
            this.insideType = 8;
        }else if (type === 1){
            // if the tag is a byte
            this.value.push(new nbtTag(1, null, this.data[this.currIndex+1]));
            this.insideType = 1;
        } else if (type === 2){
            // if the tag is a short
            this.value.push(new nbtTag(2, null, this.data[this.currIndex+1] + this.data[this.currIndex+2]*256));
            this.insideType = 2;

        } else if (type === 3){
            // if the tag is a int
            this.value.push(new nbtTag(3, null, this.data[this.currIndex+1] + this.data[this.currIndex+2]*256 + this.data[this.currIndex+3]*65536 + this.data[this.currIndex+4]*16777216));
            this.insideType = 3;
        } else if (type === 4){
            // if the tag is a long
            this.value.push(new nbtTag(4, null, this.data[this.currIndex+1] + this.data[this.currIndex+2]*256 + this.data[this.currIndex+3]*65536 + this.data[this.currIndex+4]*16777216 + this.data[this.currIndex+5]*4294967296 + this.data[this.currIndex+6]*1099511627776 + this.data[this.currIndex+7]*281474976710656));
            this.insideType = 4;
        } else if (type === 5){
            // if the tag is a float
            this.value.push(new nbtTag(5, null, this.data[this.currIndex+1] + this.data[this.currIndex+2]*256 + this.data[this.currIndex+3]*65536 + this.data[this.currIndex+4]*16777216));
            this.insideType = 5;
        } else if (type === 6){
            // if the tag is a double
            this.value.push(new nbtTag(6, null, this.data[this.currIndex+1] + this.data[this.currIndex+2]*256 + this.data[this.currIndex+3]*65536 + this.data[this.currIndex+4]*16777216 + this.data[this.currIndex+5]*4294967296 + this.data[this.currIndex+6]*1099511627776 + this.data[this.currIndex+7]*281474976710656));
            this.insideType = 6;
        } else if (type === 7 || type === 8, 9, 11, 12){
            // if the tag is some sort of array or list
    }}}

class nbt{
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
        }}
    /**
     * 
     * @param {Uint8Array} data 
     */
    async __Parse(data){
        let lenOfName = data[1];
        // get the name of the tag
        let rootName = String.fromCharCode(data.splice(2, lenOfName+2));
        let ourRoot = new nbtCompound(rootName, lenOfName+3);
}};

//test
async function test(){
    console.log(window.zlib);
    var data = "H4sIABSUR2IA/wEhAN7/CgALaGVsbG8gd29ybGQIAARuYW1lAAlCYW5hbnJhbWEAd9pcOiEAAAA=";
    var b64Decode = atob(data);
    var NBT = new nbt(b64Decode,true);
    NBT.parse();
}
test();
