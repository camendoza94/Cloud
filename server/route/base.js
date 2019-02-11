module.exports = (app) => {
    app.get('/', (req, res) => {
        res.json({ info: 'Competitions API' })
      })
}