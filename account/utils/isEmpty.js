const isEmpty = (obj) => {
  if (Object.keys(obj).length !== 0) return false;
  return true;
};

module.exports = isEmpty;
