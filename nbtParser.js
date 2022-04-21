// Maybe an nbt parser in javascript if I have time
// Splicing for unit 8 arrays because they are not extensions of regular arrays :/
// Taken from https://stackoverflow.com/questions/32232134/does-splice-exist-for-typedarrays-or-is-there-an-equivalent
let maxOut = 0;
function splice(arr, starting, deleteCount, elements) {
    if (arguments.length === 1) {
      return arr;
    }
    starting = Math.max(starting, 0);
    deleteCount = Math.max(deleteCount, 0);
    elements = elements || [];
  
  
    const newSize = arr.length - deleteCount + elements.length;
    const splicedArray = new arr.constructor(newSize);
  
    splicedArray.set(arr.subarray(0, starting));
    splicedArray.set(elements, starting);
    splicedArray.set(arr.subarray(starting + deleteCount), starting + elements.length);
    return splicedArray;
  };
// Decodes the stuff idk
// taken from https://github.com/sjmulder/nbt-js/blob/master/nbt.js
function decodeUTF8(array) {
    var codepoints = [], i;
    for (i = 0; i < array.length; i++) {
        if ((array[i] & 0x80) === 0) {
            codepoints.push(array[i] & 0x7F);
        } else if (i+1 < array.length &&
                    (array[i]   & 0xE0) === 0xC0 &&
                    (array[i+1] & 0xC0) === 0x80) {
            codepoints.push(
                ((array[i]   & 0x1F) << 6) |
                ( array[i+1] & 0x3F));
        } else if (i+2 < array.length &&
                    (array[i]   & 0xF0) === 0xE0 &&
                    (array[i+1] & 0xC0) === 0x80 &&
                    (array[i+2] & 0xC0) === 0x80) {
            codepoints.push(
                ((array[i]   & 0x0F) << 12) |
                ((array[i+1] & 0x3F) <<  6) |
                ( array[i+2] & 0x3F));
        } else if (i+3 < array.length &&
                    (array[i]   & 0xF8) === 0xF0 &&
                    (array[i+1] & 0xC0) === 0x80 &&
                    (array[i+2] & 0xC0) === 0x80 &&
                    (array[i+3] & 0xC0) === 0x80) {
            codepoints.push(
                ((array[i]   & 0x07) << 18) |
                ((array[i+1] & 0x3F) << 12) |
                ((array[i+2] & 0x3F) <<  6) |
                ( array[i+3] & 0x3F));
        }
    }
    return String.fromCharCode.apply(null, codepoints);
}
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
        return this.name + ' : ' + this.value;
    }
    toJson(){
        return {
            "name": this.name,
            "type": this.typeAsName,
            "value": this.value
        };
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
        console.log(data);
        console.log(this.currIndex);
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
        let lenOfName = this.data[this.currIndex]*256;
        lenOfName += this.data[this.currIndex+1];
        this.currIndex+= 2;
        console.log(lenOfName);
        if(lenOfName > 150){
        console.log(this.currIndex);
    }
        // get the name of the tag
        // console.log(Array.from(this.data.subarray(this.currIndex,this.currIndex+lenOfName)));
        let name = decodeUTF8(Array.from(this.data.subarray(this.currIndex,this.currIndex+lenOfName)));
        console.log(name);
        console.log(this.currIndex);
        this.currIndex += lenOfName;
        console.log(this.currIndex);
        
        
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
            this.value[name] = new nbtTag(type, name, this.data.subarray(this.currIndex, this.currIndex+2));
            this.currIndex += 2;
        } else if( type === 3){
            // if the tag is an int
            this.value[name] = new nbtTag(type, name, this.data.subarray(this.currIndex, this.currIndex+4));
            this.currIndex += 4;
        } else if( type === 4){
            // if the tag is a long
            this.value[name] = new nbtTag(type, name, this.data.subarray(this.currIndex, this.currIndex+8));
            console.log(this.data.subarray(this.currIndex, this.currIndex+8));
            this.currIndex += 8;
        } else if( type === 5){
            // if the tag is a float
            this.value[name] = new nbtTag(type, name, this.data.subarray(this.currIndex, this.currIndex+4));
            this.currIndex += 4;
        } else if( type === 6){
            // if the tag is a double
            this.value[name] = new nbtTag(type, name, this.data.subarray(this.currIndex, this.currIndex+8));
            this.currIndex += 8;
        } else if( type === 7){
            // if the tag is a byte array
            let newArray = new nbtList(name, this.currIndex, this.data, this, type);
            this.value[name] = newArray;
            await newArray.parseInside();
            console.log(newArray);
            
        } else if (type === 8){
            // if the tag is a string
            let lenOfString = this.data[this.currIndex]*256
            this.currIndex++;
            lenOfString += this.data[this.currIndex];
            console.log(lenOfString);
            this.currIndex++;
            this.value[name] = new nbtTag(type, name, decodeUTF8(this.data.subarray(this.currIndex, this.currIndex+lenOfString)));
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
        } else{
            console.log("Unknown tag type: " + type + "    at: " + this.currIndex);
            return;
        } console.log(this.value[name]);
        if (maxOut < 15){
            console.log(this);
            maxOut++;
        }

        this.parseInside();
    }
    toJson(){
        let json = {
            "name": this.name,
            "type": "compound",
            "value": {}
        };
        for(let key in this.value){
            json.value[key] = this.value[key].toJson();
        }
        return json;
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
        // Gets n tags (n = lenOfList)
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
            let lenOfString = this.data[this.currIndex]*256
            this.currIndex++;
            lenOfString += this.data[this.currIndex];
            console.log(lenOfString);
            this.currIndex++;
            this.value.push(new nbtTag(type, null, decodeUTF8(this.data.subarray(this.currIndex, this.currIndex+lenOfString))));
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
        } else if (type === 7 || type === 9 || type === 11 || type === 12){
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
            console.log(this.data);
            await this.__Parse(unit8);
        }}
    /**
     * 
     * @param {Uint8Array} data 
     */
    async __Parse(data){
        this.data = data.subarray(0, data.length);
        data = this.data;
        console.log(data)
        // Make the Root
        let lenOfName = this.data[1]*256 + this.data[2];
        console.log(lenOfName);
        this.currIndex++;
        // get the name of the tag
        console.log(Array.from(this.data.subarray(3, lenOfName+3)));
        let name = decodeUTF8(Array.from(this.data.subarray(3, lenOfName+3)));

        let ourRoot = new nbtCompound(name, lenOfName+3,data, this);
        await ourRoot.parseInside();
        this.root = ourRoot;
        console.log(ourRoot);
}};

//test
async function test(){
    var data = "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";
    var b64Decode = atob(data);
    var NBT = new nbt(b64Decode,true);
    NBT.parse();
}
test();
