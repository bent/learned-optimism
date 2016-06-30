module.exports = function(string) {
  // If the string starts with "I ", just return it, otherwise convert first 
  // letter to lower case
  return string.substring(0, 2) == "I " ? string :
    string.charAt(0).toLowerCase() + string.slice(1);
};