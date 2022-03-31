// Maybe a nbt parser in javascript if I have time

class nbt{
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
    }
}