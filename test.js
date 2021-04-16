const vntk = require('vntk');
const constant = require('./const')
const sentanceBoundary = require('./sentence-boundary')

const model = [constant.outDir + constant.topicFile + ".bin", constant.outDir + constant.typeFile + ".bin"]
var classifier = []
model.forEach(e => classifier.push(new vntk.FastTextClassifier(e)))

let txt = ""
if (process.argv.length > 2) {
    for (let i = 2; i < process.argv.length; i++)
        txt += process.argv[i] + " "
    txt = txt.trim()
} else {
    txt = 'oop là gì lấy ví dụ'
}

console.log("input: " + txt)

var doNLP = async (classifier, input, limit) => {
    return new Promise((resolve, reject) => {
        classifier.predict(input, limit, (err, res) => {
            if (err) {
                reject(err)
                return
            }
            resolve(res)
        })
    })
}

var getResult = async (input, limit = 4) => {
    let wait = []
    for (let i = 0, len = classifier.length; i < len; i++)
        wait[i] = doNLP(classifier[i], input, limit)
    return new Promise((resolve, reject) => {
        Promise.all(wait).then((res) => resolve(res)).catch((err) => reject(err))
    })
}

let sentanceSplit = sentanceBoundary(txt)

let res = []
for (let i = 0, len = sentanceSplit.length; i < len; i++)
    res[i] = getResult(sentanceSplit[i], 4)
Promise.all(res).then((res) => {
    let ret = []
    for (let i = 0, len = sentanceSplit.length; i < len; i++)
        ret[i] = {
            input: sentanceSplit[i],
            topic: res[i][0][0].label,
            "topic%": res[i][0][0].value,
            type: res[i][1][0].label,
            "type%": res[i][1][0].value,
        }
    console.log(ret)
}).catch((err) => { throw err })