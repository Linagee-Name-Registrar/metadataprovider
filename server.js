//import { ens_normalize } from '@adraffy/ens-normalize';

import express from 'express';
import fs from 'fs';
import { readFileSync } from "fs";
//import emojiRegex from 'emoji-regex';
import ethers from 'ethers';
import Web3 from 'web3';


//---------NEW LNR NORMALIZE------------
import { bytes32ToString, isNormalizedBytes, onlyEmoji } from './utils.mjs'




const abi = JSON.parse(readFileSync("./abi.json"));
const history = JSON.parse(readFileSync("./history.json"));
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import dotenv from "dotenv";
dotenv.config();

const emojiRegex = require('emoji-regex')();

var app = express();
app.use(express.static('public'));

const provider = new ethers.providers.InfuraProvider(
    "homestead",
    process.env.INFURA_KEY
);

const smartcontractaddress = "0x2cc8342d7c8bff5a213eb2cde39de9a59b3461a7";
const contract = new ethers.Contract(smartcontractaddress, abi, provider);

app.get('/favicon.ico', function (req, res) {
    res.send('Welcome Home');
});


app.get('/image/:id',function(req,res){
    const tokenId = req.params.id

    try{
        const parsedata = JSON.parse(fs.readFileSync("data/"+tokenId+".json"))

        const domainname = parsedata.name;
        const warning = parsedata.attributes[0].value;

        res.setHeader('Content-Type', 'image/svg+xml');

        let fsize = 70;
        if(domainname.length > 9){
            let rest = domainname.length-9
            fsize -= rest*2;
        }


        var color1 = "#bd8eff;"
        var color2 = "#69e0ff;"

        if(warning == "Invalid" || warning == "Not Normalized"){
            var color1= "#ff6062"
            var color2= "#ff9766"
            var warninghint = '<text style="fill: rgb(255, 255, 255); font-family: Roboto; font-size: 80px; white-space: pre;text-align:center;width:100%" text-anchor="middle" x="50%" y="30%">⚠</text>';
            
            var svg = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<svg viewBox="0 0 500 500" width="500" height="500" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:bx="https://boxy-svg.com">\n' +
            '  <defs>\n' +
            '    <style type="text/css">@import url("https://fonts.googleapis.com/css?family=Lato|Open+Sans|Oswald|Raleway|Roboto|Indie+Flower|Gamja+Flower");</style>\n' + 
            '    <linearGradient id="gradient-3-0" gradientUnits="userSpaceOnUse" x1="252.494" y1="-200.772" x2="252.494" y2="505.543" gradientTransform="matrix(1, 0, 0, 1, 0, 0)" xlink:href="#gradient-3"/>\n' +
            '    <linearGradient id="gradient-3" bx:pinned="true">\n' +
            '      <stop offset="0.35" style="stop-color: '+color1+' "/>\n' +
            '      <stop offset="1" style="stop-color:'+color2+' "/>\n' +
            '    </linearGradient>\n' +
            '    <linearGradient id="gradient-3-1" gradientUnits="userSpaceOnUse" x1="252.494" y1="-2.772" x2="252.494" y2="505.543" xlink:href="#gradient-3"/>\n' +
            '  </defs>\n' +
            '  <rect x="-1.109" y="-2.772" width="507.206" height="508.315" style="fill: url(#gradient-3-0); stroke: url(#gradient-3-1);"/>\n' +
            '   <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="enable-background:new -25 -30 89 94" width="84" height="84" viewBox="-25 -30 89 94"><path d="M27.279 51.644a.36.36 0 0 0 .01.378c.114.198.28.198.343.198l6.57.001 24.282-42.058a6.615 6.615 0 0 0 .305-6.102c-1.108-2.433-3.597-3.94-6.271-3.94h-22.12v.007c-1.642.068-3.035 1.347-3.108 3a3.148 3.148 0 0 0 3.108 3.29v.002h2.494L5.515 53.838c-1.249 2.163-1.209 4.759.12 6.895 1.237 1.989 3.461 3.148 5.804 3.148h37.524c1.617 0 3.035-1.184 3.212-2.791a3.15 3.15 0 0 0-3.13-3.508H11.313c-.063 0-.229 0-.343-.198-.114-.198-.031-.342 0-.396L40.146 6.419h12.541c.063 0 .229 0 .343.198.114.198.031.342 0 .396L27.279 51.644z" style="fill:#fff"/></svg>\n' +
            warninghint +
            '  <text style="fill: rgb(255, 255, 255); font-family: Roboto; font-size: '+fsize+'px; letter-spacing:3px;white-space: pre;text-align:center;width:100%" text-anchor="middle" x="50%" y="80%">'+escapeHtml(domainname)+'</text>\n' +
            '</svg>'

        }
        // if(warning == "Not Normalized"){
        //     var svg = '<?xml version="1.0" encoding="utf-8"?>\n' +
        //     '<svg viewBox="0 0 500 500" width="500" height="500" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:bx="https://boxy-svg.com">\n' +
        //     '  <defs>\n' +
        //     '    <style type="text/css">@import url("https://fonts.googleapis.com/css?family=Lato|Open+Sans|Oswald|Raleway|Roboto|Indie+Flower|Gamja+Flower");</style>\n' + 
        //     '    <linearGradient id="gradient-3-0" gradientUnits="userSpaceOnUse" x1="252.494" y1="-200.772" x2="252.494" y2="505.543" gradientTransform="matrix(1, 0, 0, 1, 0, 0)" xlink:href="#gradient-3"/>\n' +
        //     '    <linearGradient id="gradient-3" bx:pinned="true">\n' +
        //     '      <stop offset="0.35" style="stop-color: '+color1+' "/>\n' +
        //     '      <stop offset="1" style="stop-color:'+color2+' "/>\n' +
        //     '    </linearGradient>\n' +
        //     '    <linearGradient id="gradient-3-1" gradientUnits="userSpaceOnUse" x1="252.494" y1="-2.772" x2="252.494" y2="505.543" xlink:href="#gradient-3"/>\n' +
        //     '  </defs>\n' +
        //     '  <rect x="-1.109" y="-2.772" width="507.206" height="508.315" style="fill: url(#gradient-3-0); stroke: url(#gradient-3-1);"/>\n' +
        //     '   <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="enable-background:new -25 -30 89 94" width="84" height="84" viewBox="-25 -30 89 94"><path d="M27.279 51.644a.36.36 0 0 0 .01.378c.114.198.28.198.343.198l6.57.001 24.282-42.058a6.615 6.615 0 0 0 .305-6.102c-1.108-2.433-3.597-3.94-6.271-3.94h-22.12v.007c-1.642.068-3.035 1.347-3.108 3a3.148 3.148 0 0 0 3.108 3.29v.002h2.494L5.515 53.838c-1.249 2.163-1.209 4.759.12 6.895 1.237 1.989 3.461 3.148 5.804 3.148h37.524c1.617 0 3.035-1.184 3.212-2.791a3.15 3.15 0 0 0-3.13-3.508H11.313c-.063 0-.229 0-.343-.198-.114-.198-.031-.342 0-.396L40.146 6.419h12.541c.063 0 .229 0 .343.198.114.198.031.342 0 .396L27.279 51.644z" style="fill:#fff"/></svg>\n' +
        //     '  <text style="fill: rgb(255, 255, 255); font-family: Roboto; font-size: '+fsize+'px; letter-spacing:3px;white-space: pre;text-align:center;width:100%" text-anchor="middle" x="50%" y="80%">'+escapeHtml(domainname)+'</text>\n' +
        //     '</svg>'
        // }
        if(warning == "Normalized"){
            var svg = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<svg viewBox="0 0 500 500" width="500" height="500" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:bx="https://boxy-svg.com">\n' +
            '  <defs>\n' +
            '    <style type="text/css">@import url("https://fonts.googleapis.com/css?family=Lato|Open+Sans|Oswald|Raleway|Roboto|Indie+Flower|Gamja+Flower");</style>\n' + 
            '    <linearGradient id="gradient-3-0" gradientUnits="userSpaceOnUse" x1="252.494" y1="-200.772" x2="252.494" y2="505.543" gradientTransform="matrix(1, 0, 0, 1, 0, 0)" xlink:href="#gradient-3"/>\n' +
            '    <linearGradient id="gradient-3" bx:pinned="true">\n' +
            '      <stop offset="0.35" style="stop-color: '+color1+' "/>\n' +
            '      <stop offset="1" style="stop-color:'+color2+' "/>\n' +
            '    </linearGradient>\n' +
            '    <linearGradient id="gradient-3-1" gradientUnits="userSpaceOnUse" x1="252.494" y1="-2.772" x2="252.494" y2="505.543" xlink:href="#gradient-3"/>\n' +
            '    <filter id="eIBWfmCTQZn2-filter" x="-150%" width="400%" y="-150%" height="400%"><feGaussianBlur id="eIBWfmCTQZn2-filter-drop-shadow-0-blur" in="SourceAlpha" stdDeviation="10,10"/><feOffset id="eIBWfmCTQZn2-filter-drop-shadow-0-offset" dx="0" dy="0" result="tmp"/><feFlood id="eIBWfmCTQZn2-filter-drop-shadow-0-flood" flood-color="#fff"/><feComposite id="eIBWfmCTQZn2-filter-drop-shadow-0-composite" operator="in" in2="tmp"/><feMerge id="eIBWfmCTQZn2-filter-drop-shadow-0-merge"><feMergeNode id="eIBWfmCTQZn2-filter-drop-shadow-0-merge-node-1"/><feMergeNode id="eIBWfmCTQZn2-filter-drop-shadow-0-merge-node-2" in="SourceGraphic"/></feMerge></filter>\n' +
            '  </defs>\n' +
            '  <rect x="-1.109" y="-2.772" width="507.206" height="508.315" style="fill: url(#gradient-3-0); stroke: url(#gradient-3-1);"/>\n' +
            '   <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="enable-background:new -25 -30 89 94" width="84" height="84" viewBox="-25 -30 89 94"><path d="M27.279 51.644a.36.36 0 0 0 .01.378c.114.198.28.198.343.198l6.57.001 24.282-42.058a6.615 6.615 0 0 0 .305-6.102c-1.108-2.433-3.597-3.94-6.271-3.94h-22.12v.007c-1.642.068-3.035 1.347-3.108 3a3.148 3.148 0 0 0 3.108 3.29v.002h2.494L5.515 53.838c-1.249 2.163-1.209 4.759.12 6.895 1.237 1.989 3.461 3.148 5.804 3.148h37.524c1.617 0 3.035-1.184 3.212-2.791a3.15 3.15 0 0 0-3.13-3.508H11.313c-.063 0-.229 0-.343-.198-.114-.198-.031-.342 0-.396L40.146 6.419h12.541c.063 0 .229 0 .343.198.114.198.031.342 0 .396L27.279 51.644z" style="fill:#fff"/></svg>\n' +
            '  <text style="fill: rgb(255, 255, 255); font-family: Roboto; font-size: '+fsize+'px; letter-spacing:3px;white-space: pre;text-align:center;width:100%" text-anchor="middle" x="50%" y="80%"><tspan>'+escapeHtml(domainname)+'</tspan><tspan font-weight="700"  filter="url(#eIBWfmCTQZn2-filter)">.og</tspan></text>\n'+
            '</svg>'
        }


        res.send(svg)
    }
    catch(e){
        console.log("ERROR FILE NOT FOUND")
    }


})

let SERVERNAME = process.env.SERVER_NAME
let ignoreCache = process.env.IGNORE_CACHE;

if(process.env.IGNORE_CACHE == "false"){
    ignoreCache = true
}
else{
    ignoreCache = true
}

console.log("CACHE:"+ignoreCache);


app.get('/:id', async function (req, res) {

    const tokenId = req.params.id


    try{

        if (fs.existsSync("data/"+tokenId+".json") && !ignoreCache) {

            console.log("From Cache:"+tokenId)


            let data = fs.readFileSync("data/"+tokenId+".json","utf8")
            res.setHeader('Content-Type', 'application/json');
            res.send(data);
        }
        else {

                var result = await contract.idToName(tokenId)
                console.log("result is", result)



                console.log("From Blockchain2:"+tokenId);


                if(result !== null && result !=="0x0000000000000000000000000000000000000000000000000000000000000000"){
                    
                    console.log("in if")

                    //-----------new normalization-------------------

                    var isValid = false;
                    var isNormalized = false;
                    var nameString

                    try{
                        var nameString = bytes32ToString(result);
                        var isValid = true;
                        console.log("namestirng is", nameString)
                    } catch(e){
                        console.log("Validity Error: ", e)
                    }

                    if(nameString){
                        try{
                            var isNormalized = isNormalizedBytes(result)
                            console.log("is normalized", isNormalized, isNormalizedBytes(result))
                        } catch(e){
                            console.log("Normalization Error: ", e)
                        }
                    }

            //--------------------------------------------------------------------------

                    if(nameString && nameString.length >0){

                        let historic = "No"
                        if(isHistoric(nameString)){
                            historic = isHistoric(nameString)
                        }

                        var retJson
                        if(isValid && isNormalized){
                                

                            let digits1char = "No"
                            if(digits1(nameString)){
                                digits1char = "Yes"
                            }

                            let digits2char = "No"
                            if(digits2(nameString)){
                                digits2char = "Yes"
                            }

                            let digits3char = "No"
                            if(digits3(nameString)){
                                digits3char = "Yes"
                            }

                            let digits4char = "No"
                            if(digits4(nameString)){
                                digits4char = "Yes"
                            }

                            let digits5char = "No"
                            if(digits5(nameString)){
                                digits5char = "Yes"
                            }

                            let lowerletters1char = "No"
                            if(lowerletters1(nameString)){
                                lowerletters1char = "Yes"
                            }

                            let lowerletters2char = "No"
                            if(lowerletters2(nameString)){
                                lowerletters2char = "Yes"
                            }

                            let lowerletters3char = "No"
                            if(lowerletters3(nameString)){
                                lowerletters3char = "Yes"
                            }

                            let lowerletters4char = "No"
                            if(lowerletters4(nameString)){
                                lowerletters4char = "Yes"
                            }


                            let arabicdigits1char = "No"
                            if(arabicdigits1(nameString)){
                                arabicdigits1char = "Yes"
                            }


                            let arabicdigits2char = "No"
                            if(arabicdigits2(nameString)){
                                arabicdigits2char = "Yes"
                            }

                            let arabicdigits3char = "No"
                            if(arabicdigits3(nameString)){
                                arabicdigits3char = "Yes"
                            }

                            console.log("here")

                            let emojistr = "No"
                            if(onlyEmoji(nameString)){
                                emojistr = "Yes"
                            }

                            var retJson = {
                                "description": "From the first NFT contract on Ethereum, launched August 8, 2015. Bytecode: "+result,
                                "image": SERVERNAME + "/image/" + tokenId,
                                "name": nameString,
                                "external_url": "https://linagee.vision/",
                                "attributes": [{"trait_type": "Format", "value": "Normalized"},{"trait_type": "Length", "value": nameString.length},{"trait_type": "1 Digit", "value": digits1char},{"trait_type": "2 Digits", "value": digits2char},{"trait_type": "3 Digits", "value": digits3char},{"trait_type": "4 Digits", "value": digits4char},{"trait_type": "5 Digits", "value": digits5char},
                                    {"trait_type": "1 Letter (lowercase)", "value": lowerletters1char},
                                    {"trait_type": "2 Letters (lowercase)", "value": lowerletters2char},
                                    {"trait_type": "3 Letters (lowercase)", "value": lowerletters3char},
                                    {"trait_type": "4 Letters (lowercase)", "value": lowerletters4char},
                                    {"trait_type": "Arabic 1 Digit", "value": arabicdigits1char},{"trait_type": "Arabic 2 Digits", "value": arabicdigits2char},{"trait_type": "Arabic 3 Digits", "value": arabicdigits3char},
                                    {"trait_type": "Emoji only", "value": emojistr},{"trait_type": "Historic", "value": historic}]

                            }

                        }

                        else if(isValid && !isNormalized){

                            var retJson = {
                                "description": "From the first NFT contract on Ethereum, launched August 8, 2015. Bytecode: "+result,
                                "image": SERVERNAME + "/image/" + tokenId,
                                "name": nameString,
                                "external_url": "https://linagee.vision/",
                                "attributes": [{"trait_type": "Format", "value": "Not Normalized"},{"trait_type": "Length", "value": nameString.length},{"trait_type": "Historic", "value": historic}]
                            }

                        }
                        else{
                            console.log('invalid utf8');
                            // INVALID UF8
                            var retJson = {
                                "description": "The first NFTs on Ethereum, launched August 8, 2015.",
                                "image": SERVERNAME + "/image/" + tokenId,
                                "name": "INVALID",
                                "external_url": "https://linagee.vision/",
                                "attributes": [{"trait_type": "Format", "value": "Invalid"}]
                            }
                        }

                        fs.writeFileSync("data/" + tokenId + ".json", JSON.stringify(retJson));


                        res.send(retJson);
                        return;

                    }
                    else{

                     

                        fs.appendFileSync("error.log","tokenId\n");
              

                    }

                }
                else{
                    return
                }



        }


    }
    catch(e){
        console.log(e);
    }


});



app.listen(process.env.PORT || 8080, function () {
    console.log('Listening on port 8080!');
});


function digits3(str)
{
    return /^[0-9]{3}$/.test(str);
}


function digits4(str)
{
    return /^[0-9]{4}$/.test(str);
}

function digits5(str)
{
    return /^[0-9]{5}$/.test(str);
}

function digits1(str)
{
    return /^[0-9]{1}$/.test(str);
}

function digits2(str)
{
    return /^[0-9]{2}$/.test(str);

}

//-----DIDNT GET TO LETTERS-----------------------

function lowerletters1(str)
{
    return /^[a-z]{1}$/.test(str);
}

function lowerletters2(str)
{
    return /^[a-z]{2}$/.test(str);
}


function lowerletters3(str)
{
    return /^[a-z]{3}$/.test(str);
}

function lowerletters4(str)
{
    return /^[a-z]{4}$/.test(str);
}

//-----DIDNT GET TO TEST ARABIC DIGITS-------------------
function arabicdigits1(str)
{
    return /^[\u0660-\u0669]{1}$/.test(str);
}

function arabicdigits2(str)
{
    return /^[\u0660-\u0669]{2}$/.test(str);
}

function arabicdigits3(str)
{
    return /^[\u0660-\u0669]{3}$/.test(str);
}


function hasOnlyEmoji(text) {

    const hasEmoji = emojiRegex.test(text);
    if (hasEmoji && text.replaceAll(emojiRegex, '').length === 0) {
    }
    else {
        return false;
    }
}

function isHistoric(str)
{
    if(history[0][str]){
        return(history[0][str]);
    }
    else {
        return false;
    }
}
const escapeHtml = (unsafe) => {
    return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}
