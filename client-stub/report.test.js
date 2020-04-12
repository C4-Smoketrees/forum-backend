const { describe, it } = require('mocha')
const { assert } = require('chai')

const draft = require('./draft')
const report = require('./report')
const reply = require('./reply')

describe('#Test client /report', function () {
  it('# report thread', async function () {
    let response = await draft.newDraft('stub', 'client', ['smoke'], 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k')
    const draftId = response.draftId
    response = await draft.publishDraft(draftId, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k')
    response = await report.threadReport(response.threadId,
      { reportReason: 1, description: 'lund' },
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k')
    assert.isTrue(response.status)
  })
  it('# report reply', async function () {
    let response = await draft.newDraft('stub', 'client', ['smoke'], 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k')
    const draftId = response.draftId
    response = await draft.publishDraft(draftId, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k')
    response = await reply.newReply({ threadId: response.threadId }, { content: 'hi' }, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k')
    response = await report.replyReport(response.replyId,
      { reportReason: 1, description: 'lund' },
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k')
    assert.isTrue(response.status)
  })
})
