//import { ens_normalize } from '@adraffy/ens-normalize';

import express from 'express';
import fs from 'fs';
import { readFileSync } from "fs";
//import emojiRegex from 'emoji-regex';
import ethers from 'ethers';
import Web3 from 'web3';

const abi = JSON.parse(readFileSync("./abi.json"));
const history = JSON.parse(readFileSync("./history.json"));
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import dotenv from "dotenv";
dotenv.config();


// require('dotenv').config();
// var express = require('express');
// var app = express();
// app.use(express.static('public'));
// var fs = require('fs');
const emojiRegex = require('emoji-regex')();
// const ethers = require("ethers")

// const Web3 = require('web3');
var app = express();
app.use(express.static('public'));

//const web3 = new Web3("https://mainnet.infura.io/v3/"+process.env.INFURA_KEY);
//const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/"+process.env.INFURA_KEY);
const provider = new ethers.providers.InfuraProvider(
    "homestead",
    process.env.INFURA_KEY
);


//const { checkEmoji } = require('./emoji.cjs');
import { checkEmoji } from './emoji.mjs'


// let abi = require("./abi.json");
// const history = require("./history.json");


const smartcontractaddress = "0x2cc8342d7c8bff5a213eb2cde39de9a59b3461a7";
//const contract = new web3.eth.Contract(abi, smartcontractaddress);
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

        let warninghint = "";
        let color1 = "#00bfc7;"
        let color2 = "#9c57c9;"

        if(warning == "Yes"){
            color1= "#ff6062"
            color2= "#ff9766"
            warninghint = '<text style="fill: rgb(255, 255, 255); font-family: Arial, sans-serif; font-size: 80px; white-space: pre;text-align:center;width:100%" text-anchor="middle" x="50%" y="30%">⚠</text>';
        }



        let fsize = 70;
        if(domainname.length > 9){
            let rest = domainname.length-9
            fsize -= rest*2;
        }


        let svg = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<svg viewBox="0 0 500 500" width="500" height="500" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:bx="https://boxy-svg.com">\n' +
            '  <defs>\n' +
            '    <linearGradient id="gradient-3-0" gradientUnits="userSpaceOnUse" x1="252.494" y1="-2.772" x2="252.494" y2="505.543" gradientTransform="matrix(1, 0, 0, 1, 0, 0)" xlink:href="#gradient-3"/>\n' +
            '    <linearGradient id="gradient-3" bx:pinned="true">\n' +
            '      <stop offset="0.35" style="stop-color: '+color1+' "/>\n' +
            '      <stop offset="1" style="stop-color:'+color2+' "/>\n' +
            '    </linearGradient>\n' +
            '    <linearGradient id="gradient-3-1" gradientUnits="userSpaceOnUse" x1="252.494" y1="-2.772" x2="252.494" y2="505.543" xlink:href="#gradient-3"/>\n' +
            '  </defs>\n' +
            '  <rect x="-1.109" y="-2.772" width="507.206" height="508.315" style="fill: url(#gradient-3-0); stroke: url(#gradient-3-1);"/>\n' +
            warninghint +
            '  <text style="fill: rgb(255, 255, 255); font-family: Arial, sans-serif; font-size: '+fsize+'px; letter-spacing:3px;white-space: pre;text-align:center;width:100%" text-anchor="middle" x="50%" y="55%">'+escapeHtml(domainname)+'</text>\n' +
            '</svg>'

        res.send(svg)
    }
    catch(e){
        console.log("ERROR FILE NOT FOUND")
    }


})

let SERVERNAME = process.env.SERVER_NAME
let ignoreCache = process.env.IGNORE_CACHE;

if(process.env.IGNORE_CACHE == "false"){
    ignoreCache = false
}
else{
    ignoreCache = true
}

console.log("CACHE:"+ignoreCache);

async function getName(tokenId){
    return await contract.idToName(tokenId);
}


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




                console.log("From Blockchain:"+tokenId);


                if(result !== null && result !=="0x0000000000000000000000000000000000000000000000000000000000000000"){

                    //console.log('result: ', result);


                    var validUtf8 = true;


                    var namefortoken = " ";

                    try{

                        namefortoken = ethers.utils.parseBytes32String(result);
                    }
                    catch(e){

                        console.log("ERR 1")
                        validUtf8 = false;
                        console.log(e);
                    }



                    if(namefortoken.length > 0){


                        let specialchar = "No";
                        if (!onlyLatinCharacters(namefortoken)) {
                            specialchar = "Yes";
                        }

                        // Check for real bytecode
                        let realchar = true
                        //let hexstr = web3.utils.asciiToHex(namefortoken);
                        var hexstr = ethers.utils.formatBytes32String(namefortoken)

                        if(result != hexstr.padEnd(66,"0")){
                            specialchar = "Yes"
                            realchar = false;
                        }

                        let hasSpacechar = "No"
                        if(namefortoken.indexOf(' ') >= 0){
                            hasSpacechar = "Yes"
                        }

                        let digits1char = "No"
                        if(digits1(namefortoken) && specialchar == "No"){
                            digits1char = "Yes"
                        }




                        let digits2char = "No"
                        if(digits2(namefortoken) && specialchar == "No"){
                            digits2char = "Yes"
                        }


                        let digits3char = "No"
                        if(digits3(namefortoken) && specialchar == "No"){
                            digits3char = "Yes"
                        }

                        let digits4char = "No"
                        if(digits4(namefortoken) && specialchar == "No"){
                            digits4char = "Yes"
                        }

                        let digits5char = "No"
                        if(digits5(namefortoken) && specialchar == "No"){
                            digits5char = "Yes"
                        }

                        let lowerletters1char = "No"
                        if(lowerletters1(namefortoken) && specialchar == "No"){
                            lowerletters1char = "Yes"
                        }

                        let upperletters1char = "No"
                        if(upperletters1(namefortoken) && specialchar == "No"){
                            upperletters1char = "Yes"
                        }

                        let lowerletters2char = "No"
                        if(lowerletters2(namefortoken) && specialchar == "No"){
                            lowerletters2char = "Yes"
                        }

                        let upperletters2char = "No"
                        if(upperletters2(namefortoken) && specialchar == "No"){
                            upperletters2char = "Yes"
                        }

                        let lowerletters3char = "No"
                        if(lowerletters3(namefortoken) && specialchar == "No"){
                            lowerletters3char = "Yes"
                        }

                        let upperletters3char = "No"
                        if(upperletters3(namefortoken) && specialchar == "No"){
                            upperletters3char = "Yes"
                        }

                        let lowerletters4char = "No"
                        if(lowerletters4(namefortoken) && specialchar == "No"){
                            lowerletters4char = "Yes"
                        }

                        let upperletters4char = "No"
                        if(upperletters4(namefortoken) && specialchar == "No"){
                            upperletters4char = "Yes"
                        }

                        let arabicdigits1char = "No"
                        if(arabicdigits1(namefortoken) && realchar == true){
                            arabicdigits1char = "Yes"
                        }


                        let arabicdigits2char = "No"
                        if(arabicdigits2(namefortoken) && realchar == true){
                            arabicdigits2char = "Yes"
                        }

                        let arabicdigits3char = "No"
                        if(arabicdigits3(namefortoken) && realchar == true){
                            arabicdigits3char = "Yes"
                        }




                        let emojistr = "No"
                        if(hasOnlyEmoji(namefortoken) && realchar == true){
                            emojistr = "Yes"
                            specialchar = "No"
                        }


                        let historic = "No"
                        if(isHistoric(namefortoken) && specialchar == "No"){
                            historic = isHistoric(namefortoken)
                        }




                        if(validUtf8){


                            /*
                            retJson = {
                                "description": "The first NFTs on Ethereum, launched August 8, 2015.",
                                "image": SERVERNAME + "/image/" + tokenId,
                                "name": namefortoken,
                                "external_url": "https://linageenameregistrar.com/",

                                "attributes": [{"trait_type": "Special chars", "value": specialchar},{"trait_type": "Length", "value": namefortoken.length},{"trait_type": "1 Digit", "value": digits1char},{"trait_type": "2 Digits", "value": digits2char},{"trait_type": "3 Digits", "value": digits3char},{"trait_type": "4 Digits", "value": digits4char},{"trait_type": "Spaces", "value": hasSpacechar},{"trait_type": "5 Digits", "value": digits5char},
                                {"trait_type": "1 Letter (lowercase)", "value": lowerletters1char},{"trait_type": "1 Letter (uppercase)", "value": upperletters1char},
                                {"trait_type": "2 Letters (lowercase)", "value": lowerletters2char},{"trait_type": "2 Letters (uppercase)", "value": upperletters2char},
                                {"trait_type": "3 Letters (lowercase)", "value": lowerletters3char},{"trait_type": "3 Letters (uppercase)", "value": upperletters3char},
                                {"trait_type": "4 Letters (lowercase)", "value": lowerletters4char},{"trait_type": "4 Letters (uppercase)", "value": upperletters4char},
                                {"trait_type": "Arabic 1 Digit", "value": arabicdigits1char},{"trait_type": "Arabic 2 Digits", "value": arabicdigits2char},{"trait_type": "Arabic 3 Digits", "value": arabicdigits3char},
                                {"trait_type": "Emoji only", "value": emojistr},{"trait_type": "Historic", "value": historic},{"trait_type": "Bytecode", "value": result}]

                            }
                               */

                            var retJson = {
                                "description": "From the first NFT contract on Ethereum, launched August 8, 2015. Bytecode: "+result,
                                "image": SERVERNAME + "/image/" + tokenId,
                                "name": namefortoken,
                                "external_url": "https://linageenameregistrar.com/",

                                "attributes": [{"trait_type": "Special chars", "value": specialchar},{"trait_type": "Length", "value": namefortoken.length},{"trait_type": "1 Digit", "value": digits1char},{"trait_type": "2 Digits", "value": digits2char},{"trait_type": "3 Digits", "value": digits3char},{"trait_type": "4 Digits", "value": digits4char},{"trait_type": "Spaces", "value": hasSpacechar},{"trait_type": "5 Digits", "value": digits5char},
                                    {"trait_type": "1 Letter (lowercase)", "value": lowerletters1char},{"trait_type": "1 Letter (uppercase)", "value": upperletters1char},
                                    {"trait_type": "2 Letters (lowercase)", "value": lowerletters2char},{"trait_type": "2 Letters (uppercase)", "value": upperletters2char},
                                    {"trait_type": "3 Letters (lowercase)", "value": lowerletters3char},{"trait_type": "3 Letters (uppercase)", "value": upperletters3char},
                                    {"trait_type": "4 Letters (lowercase)", "value": lowerletters4char},{"trait_type": "4 Letters (uppercase)", "value": upperletters4char},
                                    {"trait_type": "Arabic 1 Digit", "value": arabicdigits1char},{"trait_type": "Arabic 2 Digits", "value": arabicdigits2char},{"trait_type": "Arabic 3 Digits", "value": arabicdigits3char},
                                    {"trait_type": "Emoji only", "value": emojistr},{"trait_type": "Historic", "value": historic}]

                            }




                        }
                        else{
                            console.log('invalid utf8');
                            // INVALID UF8
                            var retJson = {
                                "description": "The first NFTs on Ethereum, launched August 8, 2015.",
                                "image": SERVERNAME + "/image/" + tokenId,
                                "name": "INVALID UTF8",
                                "external_url": "https://linageenameregistrar.com/",
                                "attributes": [{"trait_type": "Special chars", "value": specialchar}]
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

function onlyLatinCharacters(str) {
    return /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(str);
}

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

function upperletters1(str)
{
    return /^[A-Z]{1}$/.test(str);
}

function lowerletters2(str)
{
    return /^[a-z]{2}$/.test(str);
}

function upperletters2(str)
{
    return /^[A-Z]{2}$/.test(str);
}

function lowerletters3(str)
{
    return /^[a-z]{3}$/.test(str);
}

function upperletters3(str)
{
    return /^[A-Z]{3}$/.test(str);
}

function lowerletters4(str)
{
    return /^[a-z]{4}$/.test(str);
}

function upperletters4(str)
{
    return /^[A-Z]{4}$/.test(str);
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

function emojicheck(str)
{
    return  /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])*$/.test(str);
}

function testEmoji2(str) {
    const regex_emoji = /[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}]/u;
    return(regex_emoji.test(str));
}


function hasOnlyEmoji(text) {

    const hasEmoji = emojiRegex.test(text);
    if (hasEmoji && text.replaceAll(emojiRegex, '').length === 0) {

        if(checkEmoji(text)){
            return true;
        }
        // const normalized = ens_normalize(emoji2);
        // if(normalized == text){
        //     console.log("real emoji");
        //     return true
        // }
        // return false

        //return true;

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
