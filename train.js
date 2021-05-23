const fs = require('fs')
const fastText = require('fasttext')
const constant = require('./const')
const rimraf = require("rimraf")

rimraf.sync(constant.outDir)
fs.mkdirSync(constant.outDir)
fs.exists(constant.dataDir + constant.tagFile, exists => exists && fs.copyFile(constant.dataDir + constant.tagFile, constant.outDir + constant.tagFile, constant.callback))

let input = [constant.dataDir + constant.topicFile, constant.dataDir + constant.typeFile, constant.dataDir + constant.regularFile]
let output = [constant.outDir + constant.topicFile, constant.outDir + constant.typeFile, constant.outDir + constant.regularFile]

const train = (input, output, callback) => {
    if (!fs.existsSync(input))
        throw `File "${input}" not found`
    let classifier = new fastText.Classifier();
    classifier.train("supervised", {
        input: input,
        output: output,
        loss: "softmax",
        dim: 200,
        bucket: 200000
    }).then(callback)
}

const callFunc = (input, ouput, index) => {
    if (input[index] == null || ouput[index] == null)
        return
    train(input[index], ouput[index], () => {
        console.log(`#${index + 1} train complete!!`)
        callFunc(input, output, index + 1)
    })
}

callFunc(input, output, 0)