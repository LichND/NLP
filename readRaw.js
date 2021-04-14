const fs = require('fs')
const constant = require('./const')

const trimArrayString = function (data) {
    for (let i = 0, len = data.length; i < len; i++)
        data[i] = data[i].trim();
    return data;
}

const readData = async function (path, log) {
    if (log == null)
        log = true
    let regexp = new RegExp("[\r\n]")
    if (fs.lstatSync(path).isDirectory()) {
        let ret = {}
        fs.readdirSync(path).forEach(e => {
            if (log)
                console.log("readding " + path + e)
            ret[e] = constant.perform(fs.readFileSync(path + e).toString().split(regexp).filter(e => e.length !== 0), e => e.trim())
        })
        return ret;
    }
    if (log)
        console.log("readding " + path)
    return constant.perform(fs.readFileSync(path).toString().split(regexp).filter(e => e.length !== 0), e => e.trim())
}

module.exports = readData