const intToBoolean = (val) => val == 1 ? true : false;

const isStringContains = (val, comparedString) => val.toLowerCase().includes(comparedString.toLowerCase())

module.exports = { intToBoolean, isStringContains }