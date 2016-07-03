module.exports = function(string) {
  // If the string starts with the nominative singular pronoun "I" (without or without a following
  // abbreviation), then just return it, otherwise convert first letter to lower case
  return string.startsWith("I ") || string.startsWith("I'") ? string :
    string.charAt(0).toLowerCase() + string.slice(1);
};