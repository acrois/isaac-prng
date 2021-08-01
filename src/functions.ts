export function uncomplement(val: number, bitwidth: number) {
    var isnegative = val & (1 << (bitwidth - 1));
    var boundary = (1 << bitwidth);
    var minval = -boundary;
    var mask = boundary - 1;
    return isnegative ? minval + (val & mask) : val;
}

export function uncomplementBigInt(val: bigint, bitwidth: number|bigint) {
    bitwidth = BigInt(bitwidth);
    var isnegative = (val >> ((bitwidth * 8n) - 1n) & 1n) == 1n;
    var boundary = (1n << bitwidth);
    var minval = -boundary;
    var mask = boundary - 1n;
    return isnegative ? minval + (val & mask) : val;
}

export const toBinString = (bytes) => bytes.reduce((str, byte) => str + byte.toString(2).padStart(8, '0') + "  ", '');
export const toHexString = (bytes) => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0') + "        ", '');

export function bufferToBigInt(buffer: Uint8Array): bigint {
    let encryptedHex: string[] = [];
    
    buffer.forEach(byte =>
        encryptedHex.push(byte.toString(16).padStart(2, '0'))
    );

    return BigInt('0x' + encryptedHex.join(''));
}

export function bigIntToBuffer(number: bigint) {
    var hex = BigInt(number).toString(16);

    if (hex.length % 2) { hex = '0' + hex; }

    var len = hex.length / 2;
    var u8 = new Uint8Array(len);
    var i = 0;
    var j = 0;

    while (i < len) {
        u8[i] = parseInt(hex.slice(j, j + 2), 16);
        i += 1;
        j += 2;
    }

    return u8;
}