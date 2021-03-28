const fs = require('fs')
const constant = require('./const')
var BayesClassifier = require('./BayesClassifier')

const train = async function (name, dataPath, outPath) {
    let out = outPath + name
    let classifier = new BayesClassifier()
    console.log(`Read data trainning #${name.toUpperCase()}`)
    label[name] = label[name] || {}
    fs.readdirSync(dataPath + name)
        .forEach(tag => {
            label[name][tag] = tag;
            fs.readFileSync(dataPath + name + "/" + tag)
                .toString().toLowerCase().split('\r\n')
                .forEach(text => text.length > 0 && classifier.addDocument(text, tag))
        })
    console.log(`Start trainning #${name.toUpperCase()}`)
    classifier.train();
    classifier.save(out)
    console.log(`Train #${name.toUpperCase()} complete, model at ${out}`)
}

console.log("Start trainning")
let label = {}
let tasks = []
fs.readdirSync(constant.trainDir).forEach(name => tasks.push(train(name, constant.trainDir, constant.outDir)))
Promise.all(tasks).then(() => {
    console.log(`Start write label`)
    let labelString = `// this is an auto generate file from NLP trainning project, DONOT modify this file without re-trainning model\r\n\r\n`
    for (let name in label) {
        labelString += `const ${name} = {\r\n`
        for (let key in label[name]) {
            let fixKey = key
            if (key.indexOf(" ") >= 0)
                fixKey = key.replace(" ", "_")
            labelString += `\t${fixKey}: "${label[name][key]}",\r\n`
        }
        labelString += `}\r\n\r\n`
    }
    labelString += `const o = {\r\n`
    for (let name in label)
        labelString += `\t${name}: ${name},\r\n`
    labelString += `}\r\n`
    labelString += `\r\nexport default o`
    fs.writeFileSync(constant.outDir + "label.ts", labelString)
    console.log(`DONE`)
})