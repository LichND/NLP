const constant = require('./const')
const BayesClassifier = require('./BayesClassifier')

let topicClassifier = new BayesClassifier();
let typeClassifier = new BayesClassifier();

topicClassifier.loadSync(constant.outDir + "topic")
typeClassifier.loadSync(constant.outDir + "type")

let txt = ""
if (process.argv.length > 2) {
    for (let i = 2; i < process.argv.length; i++)
        txt += process.argv[i] + " "
    txt = txt.trim()
} else
    txt = 'cho hỏi oop là gì'

console.log(`input: ${txt}`)
console.log(`topic: ${topicClassifier.getClassifications(txt)[0].label}`)
console.log(topicClassifier.getClassifications(txt, 3))
console.log(`type: ${typeClassifier.getClassifications(txt)[0].label}`)
console.log(typeClassifier.getClassifications(txt, 3))