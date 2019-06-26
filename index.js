exports.hello = (request, response) => {
  response.status(200).send({ text: 'Hello World!' })
}
