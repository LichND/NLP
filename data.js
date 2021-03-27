const fs = require('fs')
const constant = require('./const')
const rimraf = require("rimraf");

let topicDir = constant.dataDir + "topic/"
let typeDir = constant.dataDir + "type/"

const parseData = async function (path) {
    let ret = {}
    fs.readdirSync(path).forEach(e => ret[e] = fs.readFileSync(path + e).toString().trim().toLowerCase().split("\r\n"))
    return ret;
}

const callback = function (err, ...args) {
    if (err)
        throw err
}

rimraf.sync(constant.trainDir)
fs.mkdirSync(constant.trainDir)

Promise.all([parseData(topicDir), parseData(typeDir)]).then(([topic, type]) => {
    for (let key in type) {
        let typeString = ""
        type[key].forEach(text => {
            if (text.indexOf("%s") < 0)
                typeString += text + "\r\n"
            else {
                for (var key in topic)
                    topic[key].forEach(topic => typeString += text.replace("%s", topic) + "\r\n")
            }
        })
        let typeDir = constant.trainDir + "type/"
        if (!fs.existsSync(typeDir))
            fs.mkdirSync(typeDir)
        fs.writeFile(typeDir + key, typeString, callback)
    }

    for (let key in topic) {
        let topicString = ""
        topic[key].forEach(text => {
            for (let key in type)
                type[key].forEach(type => {
                    if (type.indexOf("%s") >= 0)
                        topicString += type.replace("%s", text) + "\r\n"
                })
        })
        let topicDir = constant.trainDir + "topic/"
        if (!fs.existsSync(topicDir))
            fs.mkdirSync(topicDir)
        fs.writeFile(topicDir + key, topicString, callback)
    }
})