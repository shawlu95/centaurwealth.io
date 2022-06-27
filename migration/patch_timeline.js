const fs = require('fs');
const {
  signin,
  sleep,
  getDelta,
  getTimeline,
  updateTimeline,
} = require('./utils');

const { email, password } = require('./config');

const correctInconsistent = async (read, point, options) => {
  if (!read) return;
  if (!point) return;
  if (
    Math.abs(point.asset - read.asset) >= 0.01 ||
    Math.abs(point.liability - read.liability) >= 0.01
  ) {
    await updateTimeline({
      date: read.date.split('T')[0],
      asset: point.asset,
      liability: point.liability,
      options,
    });
    await sleep(200);
    return 1;
  }
  return 0;
};

const readJson = (path) => {
  let data = fs.readFileSync(path);
  return JSON.parse(data);
};

(async () => {
  var corrected = 0;
  const cookie = await signin({ email, password });
  await sleep(100);

  const options = {
    headers: {
      Cookie: cookie,
      withCredentials: true,
    },
  };

  const transactions = readJson('./data/transactions.json');
  const timeline = await getTimeline({ start: '2015-01-01', options });
  const delta = {};
  var prev = undefined;

  var asset = 0;
  var liability = 0;
  for (var i = 0; i < transactions.length; i++) {
    const transaction = transactions[i];

    const assetDelta = getDelta('asset', transaction.entries);
    const liabilityDelta = getDelta('liability', transaction.entries);

    if (assetDelta == 0 && liabilityDelta == 0) {
      continue;
    }

    asset += assetDelta;
    liability += liabilityDelta;

    if (!delta[transaction.date]) {
      delta[transaction.date] = { asset: 0, liability: 0 };
    }
    delta[transaction.date].liability = transaction.date;
    delta[transaction.date].asset = asset;
    delta[transaction.date].liability = liability;

    if (prev && transaction.date !== prev) {
      corrected += await correctInconsistent(
        timeline[prev],
        delta[prev],
        options
      );
    }
    prev = transaction.date;
  }
  corrected += await correctInconsistent(timeline, delta[prev], options);
  console.log('corrected', corrected);
})();
