const vntk = require('vntk');
const constant = require('./const')

const model = [constant.outDir + constant.topicFile + ".bin", constant.outDir + constant.typeFile + ".bin"]
var classifier = []
model.forEach(e => classifier.push(new vntk.FastTextClassifier(e)))

let txt = ""
if (process.argv.length > 2) {
    for (let i = 2; i < process.argv.length; i++)
        txt += process.argv[i] + " "
    txt = txt.trim()
} else {
    txt = 'cho hỏi oop là gì'
    console.log("input: " + txt)
}

classifier.forEach(e => e.predict(txt, 5, (err, res) => {
    if (err)
        throw err;
    console.log(res)
}))