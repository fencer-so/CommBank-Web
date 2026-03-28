const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const goals = [
  { id: "1", name: "Buy Car", targetAmount: 5000, icon: "🚗" },
  { id: "2", name: "Trip", targetAmount: 2000, icon: "✈️" }
]

// GET goals route
app.get("/goals", (req, res) => {
  const { userId } = req.query

  if (userId) {
    return res.json(goals)
  }

  res.json(goals)
})

// export app for testing
module.exports = app

// run server only when not testing
if (require.main === module) {
  app.listen(3001, () => {
    console.log("Server running on http://localhost:3001")
  })
}