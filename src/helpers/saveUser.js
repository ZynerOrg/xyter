const sleep = require('./sleep');

const logger = require('../handlers/logger');

module.exports = async function saveUser(data, data2) {
  process.nextTick(
    async () => {
      await sleep(Math.floor(Math.random() * 10 + 1) * 100); // 100 - 1000 random  Number generator
      data.save((_) => (_
        ? logger.error(
          `ERROR Occurred while saving data (saveUser) \n${'='.repeat(50)}\n${
            `${_}\n${'='.repeat(50)}`
          }`,
        )
        : 'No Error'));
      if (data2) {
        data2.save((_) => (_
          ? logger.error(
            `ERROR Occurred while saving data (saveUser) \n${'='.repeat(50)}\n${
              `${_}\n${'='.repeat(50)}`
            }`,
          )
          : 'No Error'));
      }
    },
    data,
    data2,
  );
};
