exports.http = (request, response) => {
  response.status(200).send({ text: 'Hello World!' })
}

exports.event = (event, callback) => {
  callback()
}
