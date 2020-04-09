const { describe, it } = require('mocha')
const { assert } = require('chai')
const client = require('./client')

describe('#test client', function () {
  it('# new draft', async function () {
    const response = await client.newDraft('stub', 'client', ['smoke'], 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFjaGhhcG9saWExMCIsIl9pZCI6IjVlODYxNzg0ZTg1NDY2ZmJhYmQyNTc2OCIsImlhdCI6MTU4NTg0NjI0Mn0.vJ5pQfIUX8jGSodwiKhxI9pP5HLFiko7uHUSLWeXM2k')
    console.log(response)
  })
})
