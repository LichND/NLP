const vntk = require('vntk')
const fs = require('fs')

module.exports = class extends vntk.BayesClassifier {
    getClassifications(observation) {
        let ret = super.getClassifications(super.textToFeatures(observation))
        if (ret.length >= 2) {
            ret[0].value = ret[0].value / ret[1].value
        }
        return ret[0]
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