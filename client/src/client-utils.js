function getURLParam(oTarget, sVar) { 
    //from https://developer.mozilla.org/en-US/docs/Web/API/URLUtils/search 
    return decodeURI(oTarget.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1")); 
} 

export default {
    getURLParam: getURLParam
}
