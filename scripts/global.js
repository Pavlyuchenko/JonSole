var bashVersion = `Ginger bash, version 0.1-release (x86_64-browser-${getBrowser()})`;

const tabLength = 4;
const tab = "&nbsp;".repeat(tabLength);
const newLine = "<br />";

var commandHistory = [];
var historyPosition = 0;

const starterText = "$ ";
