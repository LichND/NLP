const fs = require('fs')
const vntk = require('vntk')
const constant = require('./const')
var BayesClassifier = require('./BayesClassifier')

const train = async function (name, dataPath, outPath) {
    let out = outPath + name
    let classifier = new BayesClassifier()
    console.log(`Read data trainning #${name.toUpperCase()}`)
    fs.readdirSync(dataPath + name)
        .forEach(tag => fs.readFileSync(dataPath + name + "/" + tag)
            .toString().split('\r\n').forEach(text => text.length > 0 && classifier.addDocument(text, tag)))
    console.log(`Start trainning #${name.toUpperCase()}`)
    classifier.train();
    classifier.save(out)
    console.log(`Train #${name.toUpperCase()} complete, model at ${out}`)
}

console.log("Start trainning")
fs.readdirSync(constant.trainDir).forEach(name => train(name, constant.trainDir, constant.outDir))