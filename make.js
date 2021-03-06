const fs = require('fs')
const rimraf = require("rimraf")
const readData = require('./readRaw')
const constant = require('./const')

rimraf.sync(constant.dataDir)
fs.mkdirSync(constant.dataDir)

const labelPreFix = "__label__"

const tag2text = tag => labelPreFix + tag
const text2tag = text => text.substring(labelPreFix.length)

const makeTagText = (tag, string) => {
    if (typeof tag === "string")
        tag = [tag]
    let ret = "";
    tag.forEach(e => ret += tag2text(e) + " ")
    ret += string
    return ret
}

const mixxingFunc = (data, index, now) => {
    if (index == null)
        index = 0
    now = now || ""
    if (data[index] == null)
        return [now.trim()]

    var ret = []
    data[index].forEach(e => ret.push(...mixxingFunc(data, index + 1, now + " " + e)))
    return ret
}

const shuffle = (arr, deep) => {
    deep = deep || 1
    for (let count = 0, len = arr.length, tmp, i, j; count < deep; count++)
        for (i = 0; i < len; i++) {
            j = ~~(Math.random() * i)
            tmp = arr[i]
            arr[i] = arr[j]
            arr[j] = tmp
        }
    return arr
}

let topicDir = constant.inpDir + "topic/"
let typeDir = constant.inpDir + "type/"
let mix = constant.inpDir + "mix"

Promise.all([readData(topicDir), readData(typeDir), readData(mix)]).then(([topic, type, mix]) => {
    let write = []
    let regular = []
    let allTopic = Object.keys(topic)
    let allType = Object.keys(type)

    console.log("write tag file")

    var tagfile = "";
    tagfile += "const topic = {\n"
    allTopic.forEach(e => tagfile += `\t${tag2text(e)}: "${e}",\n`)
    tagfile += "}\n\n"
    tagfile += "const type = {\n"
    allType.forEach(e => tagfile += `\t${tag2text(e)}: "${e}",\n`)
    tagfile += "}\n\n"

    tagfile += "const o = {\n"
    tagfile += "\ttopic: topic,\n"
    tagfile += "\ttype: type,\n"
    tagfile += "}\n\n"
    tagfile += "export default o"

    fs.writeFile(constant.dataDir + constant.tagFile, tagfile, constant.callback)

    let keywordData = []
    allTopic.forEach(e => {
        let len = 0;
        topic[e].forEach(st => len = Math.max(len, st.split(" ").length))
        keywordData[tag2text(e)] = { key: topic[e], length: len }
        keywordData.push({
            key: tag2text(e),
            value: topic[e],
            length: len
        })
    })
    keywordData.sort((a, b) => {
        let dif = b.length - a.length
        if (dif != 0)
            return dif
        return b.key.length - a.key.length
    })
    let keywordFile = "";
    keywordFile += "const keyword = [\n"
    keywordData.forEach(e => {
        keywordFile += `\t{\n`
        keywordFile += `\t\ttopic: "${e.key}",\n`
        keywordFile += `\t\tkey: ${JSON.stringify(e.value)}\n`
        keywordFile += `\t},\n`
    })
    keywordFile += `] as ikeyword[]\n\n`
    keywordFile += `export default keyword\n\n`
    keywordFile +=`interface ikeyword {\n\ttopic: string\n\tkey: string[]\n}`
    fs.writeFile(constant.dataDir + constant.keyword, keywordFile, constant.callback);

    for (let key in type) {
        type[key].forEach(text => {
            if (text.indexOf("%s") >= 0)
                for (let t in topic)
                    topic[t].forEach(topic => write.push({ tag: [key, t], text: text.replace("%s", topic) }))

            regular.push({ tag: [key], text: text.replace("%s", "") })
        })
    }
    // mixxing
    constant.perform(mix, e => e.split("+"))

    for (let tag in topic)
        topic[tag].forEach(tagText => {
            mix.forEach(mixxing => {
                if (mixxing.length < 2)
                    return;
                let data = []
                mixxing.forEach(key => data.push(type[key]))
                data = mixxingFunc(data)
                data.forEach(e => {
                    if (e.indexOf("%s") < 0)
                        return
                    e = e.replace("%s", tagText)
                    while (e.indexOf("%s") >= 0)
                        e = e.replace("%s", "")
                    while (e.indexOf("  ") >= 0)
                        e = e.replace("  ", " ")
                    write.push({ tag: [...mixxing, tag], text: e.trim() })
                })
            })
        })
    console.log("shuffle input...")
    shuffle(write, ~~Math.sqrt(write.length))
    shuffle(regular, ~~Math.sqrt(regular.length))

    type = []
    topic = []
    let checkTag = (o, tags) => o.tag.some(e => tags.some(ee => ee === e))
    write.forEach(e => {
        checkTag(e, allType) && type.push(e)
        checkTag(e, allTopic) && topic.push(e)
    })

    let obj2string = (o, filterTag) => makeTagText(o.tag.filter(e => filterTag.some(ee => ee === e)), o.text)

    let arr2string = (a, filterTag) => {
        if (a.length <= 0)
            return ""
        let ret = obj2string(a[0], filterTag)
        if (a.length == 1)
            return ret
        for (let i = 1, len = a.length; i < len; i++)
            ret += "\r\n" + obj2string(a[i], filterTag)
        return ret
    }
    console.log("write file...")
    let dataDir = constant.dataDir
    if (!fs.existsSync(dataDir))
        fs.mkdirSync(dataDir)
    fs.writeFile(dataDir + constant.typeFile, arr2string(type, allType), constant.callback)
    fs.writeFile(dataDir + constant.topicFile, arr2string(topic, allTopic), constant.callback)
    fs.writeFile(dataDir + constant.regularFile, arr2string(regular, allType), constant.callback)
})