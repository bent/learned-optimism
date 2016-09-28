/**
 * Extracts an array of objects from a data snapshot. Assumes that the snapshot is for an array.
 */
module.exports = function(snapshot) {
  let values = [];

  snapshot.forEach(data => {
    values = values.concat(Object.assign({'.key': data.key}, data.val()));
  });

  return values;
};