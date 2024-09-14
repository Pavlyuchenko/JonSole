let consoleText = document.getElementById("console-text-current");
const consoleDiv = document.getElementById("console");

function ensurePrompt(input, starterText) {
    if (!input.value.startsWith(starterText)) {
        input.value = starterText + consoleText.value.slice(starterText.length);
    }
}

const starterText = "$ ";
ensurePrompt(consoleText, starterText);

var commandHistory = [];
var historyPosition = 0; // 0 means current command, 1 is the one before that

function onInput() {
    ensurePrompt(consoleText, starterText);
}

function getBrowser() {
    if (
        (navigator.userAgent.indexOf("Opera") ||
            navigator.userAgent.indexOf("OPR")) != -1
    ) {
        return "opera";
    } else if (navigator.userAgent.indexOf("Edg") != -1) {
        return "edge";
    } else if (navigator.userAgent.indexOf("Chrome") != -1) {
        return "chrome";
    } else if (navigator.userAgent.indexOf("Safari") != -1) {
        return "safari";
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
        return "firefox";
    } else if (
        navigator.userAgent.indexOf("MSIE") != -1 ||
        !!document.documentMode == true
    ) {
        //IF IE > 10
        return "ie";
    } else {
        return "unknown";
    }
}

const tabLength = 4;
const tab = "&nbsp;".repeat(tabLength);
const newLine = "<br />";

function helpCmd() {
    let commandsText = "";

    const indent = 20;

    for (let command of commands) {
        commandsText +=
            tab +
            command.command +
            "&nbsp;".repeat(indent - (tabLength + command.command.length)) +
            ": " +
            command.description +
            newLine;
    }

    return `
        ${bashVersion}<br>
        Welcome to the Ginger bash @ blog.michal-pavlicek.cz<br>
        List of available commands:<br>
        ${commandsText}
    `;
}

function clearCmd() {
    document.querySelectorAll(".console-text").forEach((e) => e.remove());
    document.querySelectorAll(".console-response").forEach((e) => e.remove());

    return "";
}

const socialsOptions = [
    { name: "github", link: "https://github.com/Pavlyuchenko" },
    { name: "linkedin", link: "https://www.linkedin.com/in/michal-pavlicek/" },
    { name: "website", link: "https://michal-pavlicek.cz" },
];
function socialsCmd(subcommands, help) {
    for (let option of socialsOptions) {
        if (subcommands[0] == option.name) {
            console.log(option);
            window.open(option.link);
            return `Opening my ${option.name} page...`;
        }
    }

    return help;
}

var bashVersion = `Ginger bash, version 0.1-release (x86_64-browser-${getBrowser()})`;
const commands = [
    {
        command: "ls",
        action: "",
        return: "This command exists!",
        description: "lists all articles",
    },
    {
        command: "help",
        action: helpCmd,
        description: "prints info & list of available commands",
    },
    {
        command: "version",
        return: `${bashVersion}`,
        description: "prints version of this console",
    },
    {
        command: "clear",
        action: clearCmd,
        description: "clears the console",
    },
    {
        command: "socials",
        description: "redirects to my socials, opens in new tab",
        help: `
            Usage: socials &lt;subcommand&gt;
            ${newLine}${newLine}
            ${tab}redirects to my socials
            ${newLine}${newLine}
            Subcommands:${newLine}

            ${socialsOptions.map((opt) => tab + opt.name + newLine).join("")}
        `,
        action: socialsCmd,
    },
    {
        command: "screen",
        description: "test",
    },
];
function parseCommand(command) {
    command = command.replace(starterText, "").trim();
    let commandArr = command.split(" ");

    let program = commandArr[0];
    if (program == "") {
        return;
    }
    let subcommands = commandArr.slice(1);

    if (command != commandHistory[commandHistory.length - 1]) {
        commandHistory.push(command);
    }

    let commandExists = false;
    for (cmd of commands) {
        if (cmd.command == program) {
            commandExists = true;

            const output =
                cmd.help && subcommands.length == 0
                    ? cmd.help
                    : cmd.action
                    ? cmd.action(subcommands, cmd.help)
                    : cmd.return;
            consoleResponse(output);
            return;
        }
    }

    if (!commandExists) {
        consoleResponse(
            `${program}: command not found. Type "help" for list of available commands.`
        );
    }
}
function consoleResponse(text) {
    const response = document.createElement("div");
    response.className = "console-response";
    response.innerHTML = text;

    // Append the new input to the body (or wherever you want)
    consoleDiv.appendChild(response);
}

function getCaretPositionInPixels(input, e) {
    let caretPosition = input.selectionStart;
    const style = window.getComputedStyle(input);
    const fontSize = style.fontSize;
    const fontFamily = style.fontFamily;
    const fontWeight = style.fontWeight;
    const lineHeight = style.lineHeight;

    // Create a hidden span to measure text width
    const measurementElement = document.createElement("span");
    measurementElement.className = "hidden-measurement";
    measurementElement.style.fontSize = fontSize;
    measurementElement.style.fontFamily = fontFamily;
    measurementElement.style.fontWeight = fontWeight;
    measurementElement.style.lineHeight = lineHeight;

    document.body.appendChild(measurementElement);

    // Set the span's text to be the input's text up to the caret position
    if (caretPosition < starterText.length) {
        input.setSelectionRange(starterText.length, starterText.length);
        caretPosition = starterText.length;
    }
    measurementElement.textContent = input.value.substring(0, caretPosition);

    // Measure the width of the text up to the caret position
    const caretPositionInPixels = measurementElement.offsetWidth;

    // Clean up
    document.body.removeChild(measurementElement);

    return caretPositionInPixels;
}

function addEventListeners(input) {
    input.addEventListener("keydown", (e) => {
        onKeyDown(e);
    });
    input.addEventListener("input", onInput);
}

function syncCarets(e) {
    const position = getCaretPositionInPixels(consoleText, e);
    document.getElementById("caret").style.left = position + 10 + "px";
    document.getElementById("caret").style.top =
        consoleText.offsetTop + 5 + "px";
}

function whisperer(text, input) {
    let options = [];

    for (let command of commands) {
        if (command.command.startsWith(text)) {
            options.push(command.command);
        }
    }

    if (options.length == 1) {
        input.value = starterText + options[0];
    } else {
        consoleResponse(options.map((opt) => tab + opt + newLine).join(""));
    }
}

var timeout;
function onKeyDown(e) {
    setTimeout(() => {
        syncCarets(e);
    }, 1);

    clearTimeout(timeout);
    document.getElementById("caret").classList.remove("blink");
    timeout = setTimeout(() => {
        document.getElementById("caret").classList.add("blink");
    }, 500);

    if (e.key === "Enter") {
        e.preventDefault();
        let command = consoleText.value;
        parseCommand(command);

        consoleText.disabled = true;
        consoleText.id = "";

        const newInput = document.createElement("input");
        newInput.type = "text";
        newInput.value = "$ "; // Add the cursor symbol in the new input
        newInput.id = "console-text-current";
        newInput.className = "console-text";
        newInput.maxLength = 80;

        // Append the new input to the body (or wherever you want)
        consoleDiv.appendChild(newInput);

        if (consoleDiv.childElementCount > 18) {
            consoleDiv.removeChild(consoleDiv.children[0]);
        }
        addEventListeners(newInput);

        // Set focus on the new input
        newInput.focus();

        consoleText = newInput;

        historyPosition = 0;
    } else if (e.key == "Tab") {
        e.preventDefault();

        whisperer(consoleText.value.replace(starterText, ""), consoleText);
    } else if (e.key == "ArrowUp" || e.key == "ArrowDown") {
        if (commandHistory.length == 0) {
            return;
        }

        e.key == "ArrowUp" ? historyPosition++ : historyPosition--;
        historyPosition = Math.max(
            Math.min(historyPosition, commandHistory.length),
            0
        );
        if (historyPosition == 0) {
            consoleText.value = starterText;
        } else {
            consoleText.value =
                starterText +
                commandHistory[
                    Math.min(
                        Math.max(0, commandHistory.length - historyPosition),
                        commandHistory.length
                    )
                ];
        }

        setTimeout(() => {
            consoleText.setSelectionRange(
                consoleText.value.length,
                consoleText.value.length
            );
            syncCarets(e);
        }, 1);
    }
}

addEventListeners(consoleText);
