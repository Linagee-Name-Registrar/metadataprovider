import ethers from 'ethers';
import Web3 from 'web3'
import fs from 'fs';

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


// console.log(namefortoken)
// console.log(namefortoken.length)


// console.log(web3StringToBytes32(namefortoken))
// console.log(test3 == web3StringToBytes32(namefortoken))



function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

async function runTest(){

    const dataList = []

    for(let i=1; i<10; i++){
        console.log(i)
        try{
            let tokenBytes = await og.lnr.wrapperContract.idToName(i);
            if(tokenBytes){
                var isValid = false
                
                try{
                    var isValid = og.lnr.isNormalizedBytes(tokenBytes)
                }
                catch(e){

                }
                dataList.push({tokenId: i, bytes: tokenBytes, isValid: isValid})
            }
        }
        catch(e){
            dataList.push({tokenId: i, bytes: "error", isValid: "errorValid"})
            console.log(e);
        }

    }
    downloadObjectAsJson(dataList, "report_3_18_23")

}

//await runTest()



function testTokens(){

    const report = []

    var upperone = 0
    var uppertwo = 0;
    var upperthree = 0;
    var upperfour = 0;

    const newData = JSON.parse(fs.readFileSync("tokens_3_18_23.json"))
    for(let i=0; i<newData.length; i++){
    console.log(i)

    const newBytes = newData[i]['bytes']
    const newId = newData[i]['tokenId']
    const newStatus = newData[i]['isValid']

    if (fs.existsSync("data/"+newId+".json")){
        const earlyData = JSON.parse(fs.readFileSync("data/"+newId+".json"))
        const earlyBytes = (earlyData.description).slice((earlyData.description).lastIndexOf(' ') + 1);
        const earlyStatus = earlyData.attributes[0].value;
        var boolStatus = ""
        var alert1 = "";
        var alert2 = "";

        if(earlyData.attributes[2] && earlyData.attributes[2].value &&  earlyData.attributes[2].value == "Yes"){
            upperone += 1;
        }

        if(earlyData.attributes[3] && earlyData.attributes[3].value &&  earlyData.attributes[3].value == "Yes"){
            uppertwo += 1;
        }

        if(earlyData.attributes[4] && earlyData.attributes[4].value &&  earlyData.attributes[4].value == "Yes"){
            upperthree += 1;
        }

        if(earlyData.attributes[5] && earlyData.attributes[5].value &&  earlyData.attributes[5].value == "Yes"){
            upperfour += 1;
        }

        if(earlyStatus == "Yes"){
            var boolStatus = true
        }
        if(earlyStatus == "Invalid" || earlyStatus == "No"){
            var boolStatus = false
        }


        if(earlyBytes !== newBytes){
            var alert1 = "bytesError"
        }

        if(newStatus !== boolStatus){
            var alert2 = " statusError"
        }

        var alert = alert1+alert2


        if(alert.length > 1){
            report.push({tokenId: newId, bytes: newBytes, status: newStatus, alert: alert})
        }
        

    }
    else{
        report.push({tokenId: newId, bytes: newBytes, status: newStatus, alert: "missing" })
    }

    }

    //fs.writeFileSync("report_3_31_23.json", JSON.stringify(report));

    console.log("upper count ", upperone, uppertwo, upperthree, upperfour)

}

testTokens()