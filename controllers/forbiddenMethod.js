module.exports = (req, res)=> {
    res.status(404).json({err: `${req.method} operation is not allow on this route`})
}