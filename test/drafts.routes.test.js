const app = require('../app.js')
const chai = require('chai')
const assert = chai.assert
const chaiHttp = require('chai-http')
const { describe, it } = require('mocha')
chai.use(chaiHttp)

describe('# Route test for /drafts', function () {
  it('POST /new', async function () {
    let res
    try {
      res = await chai.request(app)
        .post('/drafts/new')
        .set({
          Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k',
          'Content-Type': 'application/json'
        })
        .send({
          draft: {
            content: 'route-draft-content', title: 'route-draft-title', tags: ['google', 'facebook']
          }
        })
    } catch (e) {
      assert.isTrue(e)
    }
    assert.equal(res.status, 200)
    assert.isNotNull(res.body.draftId)
  })
  it('POST /update', async function () {
    let res
    try {
      res = await chai.request(app)
        .post('/drafts/new')
        .set({
          Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k',
          'Content-Type': 'application/json'
        })
        .send({
          draft: {
            content: 'route-draft-content', title: 'route-draft-title', tags: ['google', 'facebook']
          }
        })
    } catch (e) {
      assert.isTrue(e)
    }
    assert.equal(res.status, 200)
    assert.isNotNull(res.body.draftId)
    const draftId = res.body.draftId
    try {
      res = await chai.request(app)
        .post('/drafts/update')
        .set({
          Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k',
          'Content-Type': 'application/json'
        })
        .send({
          draft: {
            content: 'route-draft-content-update',
            title: 'route-draft-title-update',
            tags: ['google', 'facebook', 'update'],
            _id: draftId
          }
        })
    } catch (e) {
      assert.isTrue(e)
    }
    assert.equal(res.status, 200)
    assert.isNotNull(res.body.draftId)
  })
})
