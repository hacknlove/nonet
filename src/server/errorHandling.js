import { ObjectId } from 'mongodb'

function errorHandling (name, error, state) {
  const { control: { done }, response } = state
  console.log(name, error)

  if (name === 'age') {
    state.session = {
      maniId: ObjectId('0'.repeat(24)),
      lastBlock: 0,
      captchas: 0
    }
    return
  }

  if (error.name === 'MongoError') {
    return done({
      ...response,
      status: 500,
      error: {
        message: 'databaseError',
        details: error
      }
    })
  }

  return done({
    ...response,
    status: 500,
    error: {
      message: 'unknownError',
      details: error
    }
  })
}

module.exports = errorHandling
