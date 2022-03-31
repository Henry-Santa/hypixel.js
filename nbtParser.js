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
     * @param {boolean} isCompressed
     */
    constructor(data, isCompressed){
        this.data = data;
        this.offset = 0;
        this.isCompressed = isCompressed;
    }
    // parses nbt data into a javascript object from a unit8array
    async parse(){
        // check if data is compressed
        if(this.isCompressed){
            // decompress data
            this.data = await this.__decompress();
    }};
    async __decompress(){
		var head = new Uint8Array(this.data.slice(0, 2));
		this.data = head.length === 2 && head[0] === 0x1f && head[1] === 0x8b;
    };
}