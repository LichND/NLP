const fs = require('fs')
const fastText = require('fasttext')
const constant = require('./const')
const rimraf = require("rimraf")

rimraf.sync(constant.outDir)
fs.mkdirSync(constant.outDir)

let copyIfExists = (src, dest) => fs.exists(src, res => res && fs.copyFile(src, dest, constant.callback))
copyIfExists(constant.dataDir + constant.tagFile, constant.outDir + constant.tagFile)
copyIfExists(constant.dataDir + constant.keyword, constant.outDir + constant.keyword)

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
    if (input[index] == null || ouput[index] == null) {
        fs.readdir(constant.outDir, (err, files) => {
            if (err)
                throw err
            files.forEach(e => e.endsWith(".vec") && fs.unlink(constant.outDir + e, constant.callback))
        })
        return
    }
    train(input[index], ouput[index], () => {
        console.log(`#${index + 1} train complete!!`)
        callFunc(input, output, index + 1)
    })
}

callFunc(input, output, 0)