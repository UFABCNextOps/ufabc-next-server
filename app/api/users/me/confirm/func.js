const _ = require('lodash')
const app = require('@/app')
const errors = require('@/errors')

module.exports = async(context) => {
  let { token } = context.body

  if(!token) {
    throw new errors.BadRequest.MissingParameter('token')
  }
    
  try {
    payload = JSON.parse(app.helpers.crypt.decrypt(token))
  } catch(e) {
    throw new errors.BadRequest('Token inválido')
  }

  let user = await app.models.users.findOne({ email : payload.email })

  if(!user) {
    throw new errors.NotFound('user')
  }

  user.confirmed = true
  await user.save()

  return { token: user.generateJWT() }
}
