let consoleText = document.getElementById("console-text-current");
const consoleDiv = document.getElementById("console");

function ensurePrompt(input, starterText) {
    if (!input.value.startsWith(starterText)) {
        input.value = starterText + consoleText.value.slice(starterText.length);
    }
}

function consoleResponse(text) {
    const response = document.createElement("div");
    response.className = "console-response";
    response.innerHTML = text;

    // Append the new input to the body (or wherever you want)
    consoleDiv.appendChild(response);
}

function addEventListeners(input) {
    input.addEventListener("keydown", (e) => {
        onKeyDown(e);
    });
    input.addEventListener("input", () => {
        ensurePrompt(consoleText, starterText);
    });
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
        syncCaretPosition(e);
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
        newInput.value = starterText; // Add the cursor symbol in the new input
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
            syncCaretPosition(e);
        }, 1);
    }
}

addEventListeners(consoleText);

ensurePrompt(consoleText, starterText);
