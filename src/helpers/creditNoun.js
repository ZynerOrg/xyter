module.exports = async (amount) => {
  return `${amount <= 1 ? `${amount} credit` : `${amount} credits`}`;
};
