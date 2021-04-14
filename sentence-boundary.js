const vntk = require('vntk')
const pos_tag = vntk.posTag();
const chunking = vntk.chunking();
const constant = require('./const')

let txt = "cái bánh này ngon quá mà có mỗi một cái nên hơi ăn xong vẫn thèm"

// let res = pos_tag.tag(txt)
// console.log(res)
// res.forEach(e => e[1] = constant.posTag[e[1]] || e[1])
// console.log(res)


var RuleBasedSentenceBoundaryDetection = (input) => {
    let data = chunking.tag(input)
    let index = 0, ret = []
    let from = 0, to
    let len = data.length
    let merge
    // merger same tag
    while (from < len) {
        to = from + 1
        merge = data[from][0]
        while (to < len && data[to][1] == data[from][1])
            merge += " " + data[to++][0]
        data[index++] = [merge, data[from][1],data[from][2]]
        from = to
    }
    data.length = index

    console.log(data)
}

RuleBasedSentenceBoundaryDetection(txt)