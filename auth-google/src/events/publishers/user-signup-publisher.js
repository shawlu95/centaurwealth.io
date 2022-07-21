const { Subjects, Publisher } = require('@bookkeeping/common');

class UserSignupPublisher extends Publisher {
  subject = Subjects.UserSignup;
}

module.exports = { UserSignupPublisher };
