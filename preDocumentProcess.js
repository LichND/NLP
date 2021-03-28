const vntk = require('vntk')
const pos_tag = vntk.posTag();

const filterMap = {
    P: true
}
const removeNoMeanWord = function (document, customFilter) {
    let map = filterMap;
    if (customFilter) {
        map = {}
        customFilter.forEach(e => map[e] = true)
    }
    let tag = pos_tag.tag(document)
    let ret = ""
    tag.forEach(e => {
        if (!map[e[1]])
            ret += e[0] + " "
    })
    return ret;
}

module.exports = removeNoMeanWord