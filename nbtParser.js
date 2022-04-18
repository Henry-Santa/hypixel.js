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
        this.value = value;
        this.typeAsName = reverseLookUpTable[type];
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
        super(10, name, null);
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
            this.endIndex = this.currIndex;
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
        } else if (type === 1){
            // if the tag is a byte
            this.value[name] = new nbtTag(type, name, this.data[this.currIndex]);
            this.currIndex++;
        } else if( type === 2){
            // if the tag is a short
            this.value[name] = new nbtTag(type, name, this.data.slice(this.currIndex, this.currIndex+2).readInt16BE());
            this.currIndex += 2;
        } else if( type === 3){
            // if the tag is an int
            this.value[name] = new nbtTag(type, name, this.data.slice(this.currIndex, this.currIndex+4).readInt32BE());
            this.currIndex += 4;
        } else if( type === 4){
            // if the tag is a long
            this.value[name] = new nbtTag(type, name, this.data.slice(this.currIndex, this.currIndex+8).readBigUInt64BE());
            this.currIndex += 8;
        } else if( type === 5){
            // if the tag is a float
            this.value[name] = new nbtTag(type, name, this.data.slice(this.currIndex, this.currIndex+4).readFloatBE());
            this.currIndex += 4;
        } else if( type === 6){
            // if the tag is a double
            this.value[name] = new nbtTag(type, name, this.data.slice(this.currIndex, this.currIndex+8).readDoubleBE());
            this.currIndex += 8;
        } else if( type === 7){
            // if the tag is a byte array
            let newArray = new nbtList(name, this.currIndex, this.data, this, type);
        } else if (type === 8){
            // if the tag is a string
            let lenOfString = this.data[this.currIndex];
            this.currIndex++;
            this.value[name] = new nbtTag(type, name, String.fromCharCode(this.data.splice(this.currIndex, lenOfString)));
            this.currIndex += lenOfString;
        } else if (type === 9){
            // if the tag is a list
            let newList = new nbtList(name, this.currIndex, this.data, this, type);
            this.value[name] = newList;
        } else if (type === 11){
            // if the tag is an int array
            let newArray = new nbtList(name, this.currIndex, this.data, this, type);
            this.value[name] = newArray;
        } else if (type === 12){
            // if the tag is a long array
            let newArray = new nbtList(name, this.currIndex, this.data, this, type);
            this.value[name] = newArray;
        }
    }
}
class nbtList extends nbtTag{
    constructor(name, startIndex, data, parent=null, typeOList=9){
        super(typeOList, name, null);
        this.value = [];
        this.currIndex = startIndex;
        this.data = data;
        this.parent = parent;
        this.insideType = 0;
        this.endIndex = 0;
        this.lenOfList = this.data[startIndex];
    }
    async parseInside(){
        for (i=0; i<this.lenOfList; i++){

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
            this.currIndex += lenOfString+2;
            this.insideType = 8;
        }else if (type === 1){
            // if the tag is a byte
            this.value.push(new nbtTag(1, null, this.data[this.currIndex+1]));
            this.insideType = 1;
            this.currIndex += 2;
        } else if (type === 2){
            // if the tag is a short
            this.value.push(new nbtTag(2, null, this.data[this.currIndex+1] + this.data[this.currIndex+2]*256));
            this.insideType = 2;
            this.currIndex += 3;
        } else if (type === 3){
            // if the tag is a int
            this.value.push(new nbtTag(3, null, this.data[this.currIndex+1] + this.data[this.currIndex+2]*256 + this.data[this.currIndex+3]*65536 + this.data[this.currIndex+4]*16777216));
            this.insideType = 3;
            this.currIndex += 5;
        } else if (type === 4){
            // if the tag is a long
            this.value.push(new nbtTag(4, null, this.data[this.currIndex+1] + this.data[this.currIndex+2]*256 + this.data[this.currIndex+3]*65536 + this.data[this.currIndex+4]*16777216 + this.data[this.currIndex+5]*4294967296 + this.data[this.currIndex+6]*1099511627776 + this.data[this.currIndex+7]*281474976710656));
            this.insideType = 4;
            this.currIndex += 9;
        } else if (type === 5){
            // if the tag is a float
            this.value.push(new nbtTag(5, null, this.data[this.currIndex+1] + this.data[this.currIndex+2]*256 + this.data[this.currIndex+3]*65536 + this.data[this.currIndex+4]*16777216));
            this.insideType = 5;
            this.currIndex += 5;
        } else if (type === 6){
            // if the tag is a double
            this.value.push(new nbtTag(6, null, this.data[this.currIndex+1] + this.data[this.currIndex+2]*256 + this.data[this.currIndex+3]*65536 + this.data[this.currIndex+4]*16777216 + this.data[this.currIndex+5]*4294967296 + this.data[this.currIndex+6]*1099511627776 + this.data[this.currIndex+7]*281474976710656));
            this.insideType = 6;
            this.currIndex += 9;
        } else if (type === 7 || type === 8 || type === 9 || type === 11 || type === 12){
            // if the tag is some sort of array or list
            this.value.push(new nbtList(null, this.currIndex+1, this.data, this, this.data[this.currIndex+2]));
            await this.value[this.value.length-1].parseInside();
            this.currIndex= this.value[this.value.length-1].endIndex;
        } else if (type === 10){
            // if the tag is a compound
            this.value.push(new nbtCompound(null, this.currIndex, this.data, this));
            await this.value[this.value.length-1].parseInside();
            this.currIndex= this.value[this.value.length-1].endIndex;
        }
    }
    this.endIndex = this.currIndex;
    }   
}

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
    var data = "H4sIABSUR2IA/wEhAN7/CgALaGVsbG8gd29ybGQIAARuYW1lAAlCYW5hbnJhbWEAd9pcOiEAAAA=";
    var b64Decode = atob(data);
    var NBT = new nbt(b64Decode,true);
    NBT.parse();
}
test();
