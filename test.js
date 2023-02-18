import ethers from 'ethers';
import Web3 from 'web3'

const test = "0x000000000000000000000000000000000000000000000000000000000f09fa5b"

const test2 = "0x6162636162636162636162636162636162636162636162636162636162636162"



const test4 = "0x3339320000000000000000000000000000000000000000000000000000000000"

//const namefortoken = ethers.utils.parseBytes32String(test);

//const namefortoken2 = ethers.utils.toUtf8String(ethers.utils.arrayify(test).filter(n => n != 0))

//console.log(namefortoken2)

export function convertBytecodeDomainToUtf8(bytecode) {
    try {
        return ethers.utils.toUtf8String(bytecode);
    } catch (e) {
        return "invalid utf8"
    }
}

//console.log(convertBytecodeDomainToUtf8(test))

//var x = ethers.utils.arrayify(test)



//-----------------THIS ONE---------------------------
// use for exactly 32 bytes in server

const test3 = "0xf09f91a9f09f8fbbe2808de29da4e2808df09f928be2808df09f91a8f09f8fbd"

var namefortoken = ethers.utils.toUtf8String((ethers.utils.arrayify(test3)).filter(n => n != 0))


function web3StringToBytes32(text) {
    var result = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(text));
    while (result.length < 66) { result += '0'; }
    if (result.length !== 66) { throw new Error("invalid web3 implicit bytes32"); }
    return result;
}


console.log(namefortoken)
console.log(namefortoken.length)


console.log(web3StringToBytes32(namefortoken))
console.log(test3 == web3StringToBytes32(namefortoken))

