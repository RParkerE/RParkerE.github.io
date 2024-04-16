const terminal = document.getElementById('terminal');
const outputDiv = document.getElementById('output');
const commandInput = document.getElementById('command-input');

// Current directory and directory stack
let currentDirectory = '~';
const directoryStack = [];

commandInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const command = commandInput.value.trim();
        executeCommand(command);
    }
});

function updatePrompt() {
    const prompt = document.querySelector('.prompt');
    const directoryPathElement = document.querySelector('.directory-path');
    const promptLine = document.querySelector('#prompt-line');
    prompt.textContent = 'guest@yourwebsite:';
    directoryPathElement.textContent = getDirectoryPath();
    commandInput.value = ''; // Clear input value
}

function executeCommand(command) {
    const output = document.createElement('div');
    output.innerHTML = `<span class="prompt">guest@yourwebsite:</span><span class="directory-path">${getDirectoryPath()}</span><span class="input">$</span> ${command}`;
    outputDiv.appendChild(output);

    // Handle different commands here
    const parts = command.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts[1];

    switch (cmd) {
        case 'help':
            outputDiv.innerHTML += `
                <div>Available commands:</div>
                <div>- ls: List directories</div>
                <div>- cd <directory>: Change directory</div>
                <div>- cat <file>: View file contents</div>
                <div>- clear: Clear the terminal</div>
            `;
            break;
        case 'ls':
            if (arg === undefined || arg === '') {
                outputDirectoryContents(currentDirectory);
            } else {
                outputDiv.innerHTML += `
                    <div>'ls' command does not accept arguments. Type 'ls' to see available directories.</div>
                `;
            }
            break;
        case 'cd':
            if (arg === undefined || arg === '') {
                outputDiv.innerHTML += `
                    <div>'cd' command requires an argument. Usage: cd <directory></div>
                `;
            } else if (arg === '..') {
                if (directoryStack.length === 0) {
                    outputDiv.innerHTML += `
                        <div>Cannot move up. Already at ~ directory.</div>
                    `;
                } else {
                    currentDirectory = directoryStack.pop();
                    outputDiv.innerHTML += `
                        <div>Moved up to '${getDirectoryPath()}'</div>
                    `;
                }
            } else if (arg === 'Resume' || arg === 'Projects' || arg === 'AboutMe') {
                directoryStack.push(currentDirectory);
                currentDirectory = arg;
                outputDiv.innerHTML += `
                    <div>Changed directory to '${getDirectoryPath()}'</div>
                `;
            } else {
                outputDiv.innerHTML += `
                    <div>Directory '${arg}' not found.</div>
                `;
            }
            outputDiv.innerHTML = '';
            break;
        case 'cat':
            if (arg === undefined || arg === '') {
                outputDiv.innerHTML += `
                    <div>'cat' command requires a file argument. Usage: cat <file></div>
                `;
            } else {
                switch (currentDirectory) {
                    case 'Resume':
                        fetchAndDisplayFile(arg);
                        break;
                    case 'Projects':
                        outputProjectFileContents(arg);
                        break;
                    case 'AboutMe':
                        fetchAndDisplayFile(arg);
                        break;
                    default:
                        outputDiv.innerHTML += `
                            <div>Invalid directory '${currentDirectory}'</div>
                        `;
                }
            }
            break;
        case 'clear':
            outputDiv.innerHTML = '';
            break;
        default:
            outputDiv.innerHTML += `
                <div>'${cmd}' is not recognized as a command. Type 'help' for a list of available commands.</div>
            `;
    }

    // Update the prompt
    updatePrompt();

    // Scroll to bottom of terminal
    terminal.scrollTop = terminal.scrollHeight;
}

function getDirectoryPath() {
    if (currentDirectory === '~') {
        return '~';
    } else {
        return `~/${currentDirectory}`;
    }
}

function fetchAndDisplayFile(file) {
    fetch(`https://raw.githubusercontent.com/RParkerE/RParkerE.github.io/main/${file}`)
        .then(response => response.text())
        .then(data => {
            outputDiv.innerHTML += `
                <div>${data}</div>
            `;
        })
        .catch(error => {
            outputDiv.innerHTML += `
                <div>Error fetching file '${file}'</div>
            `;
        });
}

function outputDirectoryContents(directory) {
    switch (directory) {
        case '~':
            outputDiv.innerHTML += `
                <div>Resume  Projects  AboutMe</div>
            `;
            break;
        case 'Resume':
            outputDiv.innerHTML += `
                <div>AutomationTestAndSystemEngineer_NVIDIA.txt</div>
                <div>ITNetworkDevelopmentAnalyst_DellEMC.txt</div>
            `;
            break;
        case 'Projects':
            outputDiv.innerHTML += `
                <div>AutonomousDriving.proj</div>
                <div>MonkeyBusiness.proj</div>
                <div>ForFun.proj</div>
                <div>LiFi-With-Arduino.proj</div>
                <!-- Add more Projects as needed -->
            `;
            break;
        case 'AboutMe':
            outputDiv.innerHTML += `
                <div>README.md</div>
            `;
            break;
        default:
            outputDiv.innerHTML += `
                <div>Invalid directory '${directory}'</div>
            `;
    }
}

function outputProjectFileContents(file) {
    switch (file) {
        case 'AutonomousDriving.proj':
            outputDiv.innerHTML += `
                <div>Redirecting to AutonomousDriving GitHub repository...</div>
            `;
            window.location.href = "https://github.com/RParkerE/AutonomousDriving";
            break;
        case 'MonkeyBusiness.proj':
            outputDiv.innerHTML += `
                <div>Redirecting to MonkeyBusiness GitHub repository...</div>
            `;
            window.location.href = "https://github.com/RParkerE/MonkeyBusiness";
            break;
        case 'ForFun.proj':
            outputDiv.innerHTML += `
                <div>Redirecting to ForFun GitHub repository...</div>
            `;
            window.location.href = "https://github.com/RParkerE/ForFun";
            break;
        case 'LiFi-With-Arduino.proj':
            outputDiv.innerHTML += `
                <div>Redirecting to LiFi-With-Arduino GitHub repository...</div>
            `;
            window.location.href = "https://github.com/RParkerE/LiFi-With-Arduino";
            break;
        default:
            outputDiv.innerHTML += `
                <div>File '${file}' not found.</div>
            `;
    }
}