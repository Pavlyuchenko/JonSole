const socialsOptions = [
    { name: "github", link: "https://github.com/Pavlyuchenko" },
    { name: "linkedin", link: "https://www.linkedin.com/in/michal-pavlicek/" },
    { name: "website", link: "https://michal-pavlicek.cz" },
];

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

function clearCmd() {
    document.querySelectorAll(".console-text").forEach((e) => e.remove());
    document.querySelectorAll(".console-response").forEach((e) => e.remove());

    return "";
}

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
