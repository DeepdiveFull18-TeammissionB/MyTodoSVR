const express = require('express')
const app = express()
// const port = 3000
// (수정) 아래 코드로 변경!
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const Todo = require("./models/Todo")
const config = require("./config/key")
const morgan = require('morgan')
const cors = require('cors')

// CORS 설정
app.use(cors())

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// MongoDB 연결
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
    .then(()=> console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

// 로그 설정
if (process.env.NODE_ENV === 'production') { 
   app.use(morgan('combined'));
} else {
   app.use(morgan('dev'));
}

// ==========================================
// API 라우트
// ==========================================

// 1. [조회] 전체 또는 날짜별 목록 (사용자님 코드 적용 ✨)
// 요청: GET /api/todos (전체) 또는 /api/todos?date=2025-12-08 (필터링)
app.get('/api/todos', async (req, res) => {
    try {
        // req.query가 { date: '...' }이면 날짜 검색, 비어있으면 전체 검색
        // 몽구스(Mongoose)가 알아서 처리해줍니다. 아주 똑똑한 코드입니다.
        const todoInfo = await Todo.find(req.query);
        
        return res.status(200).json({
            success: true,
            todo: todoInfo, // 프론트에서는 response.data.todo 로 꺼내쓰게 됨
            message: 'Todo 로드 성공', 
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 
            success: false,
            message: 'Todo 로드 실패', 
            error: err.message
        });
    }
})

// 2. [등록] 할 일 추가하기
app.post('/api/todos', async (req, res) => {
    try {
        const { text, date } = req.body;
        if (!text || !date) {
            return res.status(400).json({ success: false, message: "내용과 날짜는 필수입니다." });
        }
        const newTodo = new Todo(req.body);
        const savedTodo = await newTodo.save();
        
        // 조회랑 형식을 비슷하게 맞춰주는 게 좋습니다
        res.status(200).json({ success: true, todo: savedTodo, message: '생성 성공' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err });
    }
});

// 3. [삭제] 할 일 삭제하기
app.delete('/api/todos/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "삭제 성공" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err });
    }
});

// 4. [수정] 할 일 완료 토글
app.patch('/api/todos/:id/toggle', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ success: false, message: "없음" });

        todo.done = !todo.done;
        const updatedTodo = await todo.save();

        res.status(200).json({ success: true, todo: updatedTodo, message: "상태 변경 성공" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err });
    }
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})