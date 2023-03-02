function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

const tokens = []
for(let i=0; i<69534; i++){
    console.log(i)
    try{
        let tokenBytes = await window.og.lnr.wrapperContract.idToName(i);
        tokens.push({tokenId: i, bytes: tokenBytes})
    }
    catch(e){
        console.log(e);
    }
}

downloadObjectAsJson(tokens, "tokens_3_1_23")

//18655