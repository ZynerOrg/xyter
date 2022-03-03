module.exports = (amount) => {
  return `${amount <= 1 ? `${amount} credit` : `${amount} credits`}`;
};
