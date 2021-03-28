const vntk = require('vntk')
const fs = require('fs')
const removeNoMeanWord = require('./preDocumentProcess')

module.exports = class extends vntk.BayesClassifier {
    getClassifications(observation, limit = undefined) {
        let ret = super.getClassifications(super.textToFeatures(removeNoMeanWord(observation)))
        let total = 0;
        let len = ret.length
        for (let i = 0; i < len; i++) {
            ret[i].value /= ret[len - 1].value
            total += ret[i].value
        }
        for (let i = 0; i < len; i++)
            ret[i].value /= total
        if (limit == null)
            limit = len
        for (let i = limit; i < len; i++)
            ret.pop();
        return ret;
    }

    save(path, callback) {
        if (callback == null)
            callback = (err) => { if (err) throw err }
        let data = {
            features: this.features,
            classFeatures: this.classFeatures,
            classTotals: this.classTotals,
            totalExamples: this.totalExamples
        }
        let dir = path.substring(0, path.lastIndexOf("/"))
        if (dir.length > 0 && !fs.existsSync(dir))
            fs.mkdirSync(dir)
        fs.writeFile(path, JSON.stringify(data), callback)
    }

    load(path, callback) {
        fs.readFile(path, (err, data) => {
            if (!callback)
                callback = (err) => { if (err) throw err }
            if (!err) {
                let o = JSON.parse(data)
                for (let key in o)
                    this[key] = o[key]
            }
            callback(err)
        })
    }

    loadSync(path) {
        let data = fs.readFileSync(path)
        let o = JSON.parse(data)
        for (let key in o)
            this[key] = o[key]
    }
}