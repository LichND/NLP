const vntk = require('vntk');
const pos_tag = vntk.posTag();
const constant = require('./const')

var merger = (arr, canMerger, merge) => {
    let index = 0, len = arr.length
    let i = 0
    let tmp
    while (i < len) {
        tmp = arr[i++]
        while (i < len && canMerger(arr[i - 1], arr[i]))
            tmp = merge(tmp, arr[i++])
        arr[index++] = tmp
    }
    arr.length = index
    return arr
}

var RuleBasedSentenceBoundaryDetection = (input) => {
    let data = pos_tag.tag(input)
    let mergeFunc = (a, b) => { a[0] += " " + b[0]; a[1] = b[1]; return a }
    // merger by tag
    merger(data, (a, b) => a[1] === b[1], mergeFunc)
    data.forEach(e => e[1] = constant.posTag[e[1]].like)
    // merger by position in sentence
    merger(data, (a, b) => a[1] === "-" || a[1] === b[1], mergeFunc)
    let i = 0, len = data.length, index = 0
    let ret = []
    let S = "", V = "", O = ""
    // fix unknow tag
    if (data[len - 1][1] == "-")
        data[len - 1][1] = "SO"
    // apply sentance = S + V + O
    while (i < len) {
        if (data[i][1] == "E") {
            i++;
            continue;
        }
        S = data[i][1].includes("S") ? data[i++][0] : ""
        V = (data[i] && data[i][1] == "V") ? data[i++][0] : ""

        if (data[i] && data[i][1].includes("O")) { // enough for complete sentance
            O = data[i][0]
            ret[index++] = `${S} ${V} ${O}`.trim()
            i++
        } else {
            ret[index++] = `${S} ${V} ${O}`.trim()
            i += 1// data[i][1] == "E" ? 2 : 1
        }
        O = ""
    }
    return ret
}

module.exports = RuleBasedSentenceBoundaryDetection