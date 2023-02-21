import {ens_normalize, ens_tokenize} from '@adraffy/ens-normalize';
import ethers from 'ethers';
import {Blob} from 'buffer';

export function bytes32ToString(_hex) {
    return ethers.utils.toUtf8String(ethers.utils.arrayify(_hex).filter(n => n != 0));
  }


export function stringToBytes32(_string) {
    let result = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(_string));
    while (result.length < 66) {
      result += '0';
    }
    if (result.length !== 66) {
      throw new Error("invalid web3 implicit bytes32");
    }
    return result;
  }


export function domainToBytes32(_name) {
    let checkIsValid = isValidDomain(_name);
    if (checkIsValid[0] == false) {
      throw checkIsValid[1];
    } else {
      let normalized = checkIsValid[1];
      let nameOnly = normalized.slice(0, -3);
      return stringToBytes32(nameOnly);
    }
  }

export function bytes32ToDomain(_name) {
        return bytes32ToString(_name) + ".og";
      }


export function normalize(_name) {
        return ens_normalize(_name);
      }


export function isValidDomain(_name) {
        const byteSize = function(str){return (new Blob([str]).size)};
        if (!_name || _name.length == 0)
          return [false, "Empty string passed"];
        let normalized = normalize(_name);
        if ((normalized.split(".").length - 1) > 1) {
          return [false, 'Subdomains not supported at this time'];
        }
        else if (!normalized.endsWith(".og")) {
          return [false,'Domain does not end in .og'];
        }
        else if (byteSize(normalized) > 35) {
          return [false, 'Domain too long'];
        }
        else {
          return [true, normalized];
        }
      }

export function isNormalizedName(_name) {
      let validName = isValidDomain(_name);
      if (validName[1] === _name) {
        return(true)
      }
      return(false)
    }


export function isNormalizedBytes(_bytes) {
      let validName = isValidDomain(bytes32ToDomain(_bytes));
      if (domainToBytes32(validName[1]) === _bytes) {
        return(true)
      }
      return(false)
    }

export function onlyEmoji(_name) {
  var tokens = ens_tokenize(_name);
  if(tokens && tokens.length > 0){
    var checkExists = tokens.every(el => el.type === "emoji");
    if(checkExists){
      return(true)
    }
    else{
      return(false)
    }
  }
  else{
    return(false)
  } 
}