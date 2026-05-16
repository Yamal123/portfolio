function responseMiddleware(req, res, next) {
  res.success = function(data, message = 'success') {
    res.json({
      code: 1000,
      message,
      data: data !== undefined ? data : null,
      timestamp: Date.now()
    })
  }
  
  res.error = function(code, message, data = null) {
    res.json({
      code,
      message,
      data,
      timestamp: Date.now()
    })
  }
  
  next()
}

module.exports = responseMiddleware