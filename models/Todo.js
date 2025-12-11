const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  name: { type: String, required: true }, // 할 일 내용 [cite: 685]
  date: { type: Date, required: true, default: Date.now }, // 날짜 (핵심) 
  isCompleted: { type: Boolean, default: false }, // 완료 여부 [cite: 687]
  group: { type: String, default: '기본' } // 그룹 (기본값 설정) [cite: 688]
}, { timestamps: true });

module.exports = mongoose.model('Todo', todoSchema);