const obj = {
    inpDir: "input/",
    outDir: "out/",
    dataDir: "data/",
    topicFile: "topic",
    regularFile: "regular",
    typeFile: "type",
    tagFile: "tag.ts",
    callback: (err, ...args) => {
        if (err)
            throw err;
    },
    perform: (data, callback) => {
        if (callback == null)
            return data
        if (typeof data.length <= 0)
            return data
        for (let i = 0, len = data.length; i < len; i++)
            data[i] = callback(data[i])
        return data;
    },
    posTag: {
        "N": { mean: "Danh từ", like: "SO" },
        "Np": { mean: "Danh từ riêng", like: "SO" },
        "Nc": { mean: "Danh từ chỉ loại", like: "SO" },
        "Nu": { mean: "Danh từ đơn vị", like: "SO" },
        "V": { mean: "Động từ", like: "V" },
        "A": { mean: "Tính từ", like: "V" },
        "P": { mean: "Đại từ", like: "SO" },
        "L": { mean: "Định từ", like: "-" },
        "M": { mean: "Số từ", like: "-" },
        "R": { mean: "Phó từ", like: "V" },
        "E": { mean: "Giới từ", like: "-" },
        "C": { mean: "Liên từ", like: "E" },
        "I": { mean: "Thán từ", like: "-" },
        "T": { mean: "Trợ từ, tình thái từ", like: "-" },
        "B": { mean: "Từ tiếng nước ngoài", like: "-" },
        "Y": { mean: "Từ viết tắt", like: "A" },
        "S": { mean: "Yếu tố cấu tạo từ", like: "-" },
        "X": { mean: "Các từ không phân loại được", like: "A" },
        "CH": { mean: "Ký tự đặc biệt", like: "E" },
    },
    posTagLikeMean: {
        "S": "Subject - chủ ngữ",
        "V": "Verb - động từ",
        "O": "Object - tân ngữ",
        "-": "đánh dấu từ này cần nối với từ đứng sau nó",
        "E": "từ nối, chuyển, kết câu",
        "A": "any - bất kể là gì"
    }
}

module.exports = obj