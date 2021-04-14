const fs = require('fs')
const fastText = require('fasttext')
const constant = require('./const')
const rimraf = require("rimraf")

rimraf.sync(constant.outDir)
fs.mkdirSync(constant.outDir)
fs.rename(constant.dataDir + constant.tagFile, constant.outDir + constant.tagFile, constant.callback)

let input = [constant.dataDir + constant.topicFile, constant.dataDir + constant.typeFile]
let output = [constant.outDir + constant.topicFile, constant.outDir + constant.typeFile]

const train = (input, output, callback) => {
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