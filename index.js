const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const Todo = require("./models/Todo")
const config = require("./config/key")

app.use(bodyParser.urlencoded({extended: true}))

app.use(bodyParser.json())

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
    .then(()=> console.log('MongoDB Connected...'))
    .catch(err => console.log(err))




app.get('/todos', (req, res) => {
  res.send('Hello World!')
})

app.post('/todos', async (req, res) => {
  const { name, date } = req.body
  console.log(`name: ${name}, date: ${date}`)

  const todo = new Todo(req.body)

    try {
        // 2. await 키워드를 사용하여 Promise가 완료될 때까지 기다림
        const todoInfo = await todo.save(); 
        
        // 3. 성공 시 응답
        return res.status(200).json({
            success: true,
            todo: todoInfo // 저장된 Todo 정보를 함께 보내주는 것이 좋습니다.
        });
    } catch (err) {
        // 4. 실패 시 (유효성 검사 오류, DB 연결 문제 등) 응답
        console.error(err);
        return res.status(500).json({ // 500 Internal Server Error로 변경하는 것이 RESTful합니다.
            success: false, 
            message: 'Todo 저장 실패', 
            error: err.message
        });
    }

})

app.patch('/todos/:id', (req, res) => {
  const { isCompleted } = req.body
  console.log(`isCompleted: ${isCompleted}`)
})

app.delete('/todos/:id', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})