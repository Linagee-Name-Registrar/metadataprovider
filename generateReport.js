import ethers from 'ethers';
import { tokenIds } from './wrappedTokenIds.js';
import { bytes32ToDomain, isNormalizedBytes, onlyEmoji, bytes32ToString } from './utils.mjs'
// The tokenIds is an array with the first 69k tokenIds from the wrapper
// id's may not match index 100% of the time, i had a few erros that messed up the totals

let tokenReport = [];
let report = {
    normalized: 0,
    total: 0,
    onlyEmoji: 0,
    notNormalized: 0,
    illegalCharacters: 0
};


for(let i=0; i< tokenIds.length; i++){
    try{
        report.total++;

        let reportItem = {
            bytes32: tokenIds[i],
            name: bytes32ToString(tokenIds[i]),
            domain: bytes32ToDomain(tokenIds[i])
        };

        if(isNormalizedBytes(tokenIds[i])){
            reportItem.normalized = true;
            report.normalized++;
        }
        else{
            reportItem.normalized = false;
        }


        if(reportItem.normalized == false){
            report.notNormalized++;
        }
        else{
            reportItem.error = null;
        }

        reportItem.onlyEmoji = onlyEmoji(reportItem.name);
        if(reportItem.onlyEmoji)
            report.onlyEmoji++;

        tokenReport.push(reportItem);
    }
    catch(e){
        let reportItem = {
            bytes32: tokenIds[i],
            error: JSON.stringify(e)
        };
        report.illegalCharacters++;
    }
}


// report for each item, for easy lookup
console.log(tokenReport);

//overall report
console.log(report);
