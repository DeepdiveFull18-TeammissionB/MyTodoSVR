const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  // 1. name -> text 로 변경 (프론트랑 통일)
  text: { type: String, required: true }, 

  // 2. Date -> String 로 변경 추천 
  // 프론트에서 '2025-12-08' 같은 "문자열"을 키로 쓰고 있기 때문에, 
  // DB에도 그냥 문자열로 저장하는 게 조회할 때 훨씬 편합니다.
  date: { type: String, required: true }, 

  // 3. isCompleted -> done 로 변경 (프론트랑 통일)
  done: { type: Boolean, default: false }, 

  // 4. 이건 프론트에 없지만 둬도 괜찮음 (나중에 쓸 수 있음)
  group: { type: String, default: '기본' } 
}, { timestamps: true });

module.exports = mongoose.model('Todo', todoSchema);