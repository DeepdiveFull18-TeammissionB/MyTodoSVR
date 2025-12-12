const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const Todo = require("./models/Todo")
const config = require("./config/key")
const morgan = require('morgan')


app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


// 몽고 db 연결
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
    .then(()=> console.log('MongoDB Connected...'))
    .catch(err => console.log(err))


// 로그 기록
if (process.env.NODE_ENV === 'production') { 
   app.use(morgan('combined'));
} else {
   app.use(morgan('dev'));
}


// 전체, 날짜별 목록 조회
app.get('/todos', async (req, res) => {
    try {
        // query string 이 있으면 필터링해서 반환하고, 없으면 전체 반환
        const todoInfo = await Todo.find(req.query)
        
        return res.status(200).json({
            success: true,
            todo: todoInfo,
            message: 'Todo 로드 성공', 
        });
    } catch (err) {
        console.error(err);

        // 서버 오류 시
        return res.status(500).json({ 
            message: 'Todo 로드 실패', 
            error: err.message
        });
    }
})

// 할 일 추가
app.post('/todos', async (req, res) => {

    const todo = new Todo(req.body)

    try {
        await todo.save(); 
        
        return res.status(200).json({
            success: true,
            message: 'Todo 저장 성공',
        });
    } catch (err) {
        console.error(err);

        // 유효성 검사 실패 시 
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                message: '유효성 검사 실패', 
                error: err.message 
            });
        }

        // 서버 오류 시
        return res.status(500).json({ 
            message: 'Todo 저장 실패', 
            error: err.message
        });
    }

})

// 상태 변경
app.patch('/todos/:id', async (req, res) => {

    try {
        // 완료 상태 이외에도 추후 todo 수정 기능 등에 쓸 목적으로 request body에 적힌 데이터 종류를 변경하는 코드로 작성
        const todoInfo = await Todo.findByIdAndUpdate(req.params.id, req.body) 
        
        return res.status(200).json({
            success: true,
            message: 'Todo 수정 성공',
        });
    } catch (err) {
        console.error(err);

        // 요청이 잘못되었을 시
        if (err.name === 'CastError') {
            return res.status(400).json({ 
                success: false, 
                message: '잘못된 Todo ID 형식입니다.', 
                error: err.message 
            });
        }

        // 서버 오류 시
        return res.status(500).json({
            success: false, 
            message: 'Todo 수정 실패', 
            error: err.message
        });
    }
})

// 할 일 삭제
app.delete('/todos/:id', async (req, res) => {
    try {
        // id로 todo 삭제
        await Todo.findByIdAndDelete(req.params.id) 
        
        return res.status(200).json({
            success: true,
            message: 'Todo 삭제 성공'
        });
    } catch (err) {
        console.error(err);

        // 요청이 잘못되었을 시
        if (err.name === 'CastError') {
            return res.status(400).json({ 
                success: false, 
                message: '잘못된 Todo ID 형식입니다.', 
                error: err.message 
            });
        }

        // 서버 오류 시
        return res.status(500).json({ 
            success: false, 
            message: 'Todo 삭제 실패', 
            error: err.message
        });
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})