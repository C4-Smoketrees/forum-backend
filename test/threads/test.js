const { describe, before, it, after } = require('mocha')
const app = require('../../app')
const Thread = require('../../modules/threads/model')
const bson = require('bson')

after(async function () {
  await app.locals.dbClient.close()
})

describe('# Threads test-suite', function () {
  before(async function () {
    await app.locals.dbClient
  })

  describe('# Crud Operations', async function () {

    describe(' Create ', function () {
      it('create a new thread', function (done) {
        const thread = new Thread({ content: 'test content', author: new bson.ObjectID(bson.ObjectID.generate()) })
        thread.newThread(function (res) {
          if (res.status) done()
          else done(res.status)
        })
      })
    })
    //
  })
})
