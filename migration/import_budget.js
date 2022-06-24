const fs = require('fs');
const { signin, createBudget } = require('./utils');
const { email, password, file, names, amounts } = require('./config');

(async function processLineByLine() {
  const cookie = await signin({ email, password });

  const options = {
    headers: {
      Cookie: cookie,
      withCredentials: true,
    },
  };

  const lines = fs.readFileSync(file, 'utf-8').split(/\r?\n/);
  for (var i in lines) {
    const line = lines[i];
    var [seq, date, memo, accountName, type, amount, budget] = line.split(',');
    if (!names[budget]) {
      console.log('unknown budget', budget);
    }
  }

  for (var i in names) {
    const name = names[i];
    const amount = amounts[i];
    await createBudget({ name, monthly: amount, options });
    console.log(name, amount);
  }
})();
