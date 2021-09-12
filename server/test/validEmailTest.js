const assert = require("chai").assert;
const validEmail = require("../validation/validEmail");

describe("ValidEmail", () => {
  it('Should return with no errors', () => {
    let result = validEmail({ email: "illarion@uw.edu" });
    assert.isTrue(result.isValid);
  })
})