var BayesClassifier = require('./BayesClassifier')

var classifier = new BayesClassifier();

// classifier.addDocument('khi nào trận chiến đã kết thúc?', 'when');
// classifier.addDocument('tàu rời đi lúc mấy giờ?', 'when');
// classifier.addDocument('trận đấu diễn ra vào thời gian nào?', 'when');
// classifier.addDocument('anh ấy rời đi vào lúc mấy giờ?', 'when');
// classifier.addDocument('bao giờ thì đến lễ hội hóa trang?', 'when');
// classifier.addDocument('ai phát hiện ra điện ?', 'who');
// classifier.addDocument('người sáng lập ra microsoft là ai?', 'who');
// classifier.addDocument('ai kiếm được tiền của họ một cách chăm chỉ ?', 'who');
// classifier.addDocument('người phát minh tạo ra.', 'who');
// classifier.addDocument('gia đình bạn gồm những ai?', 'who');

// classifier.train();

// classifier.save("QnA.json")

// classifier.load("QnA.json", (err) => {
//     if (err)
//         throw err
//     console.log(classifier.classify('là gì'))
// })

classifier.loadSync("QnA.json")
console.log(classifier.classify('là gì'))

// console.log(JSON.stringify(classifier))