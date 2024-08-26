const terminal = document.getElementById('terminal');
const output = document.getElementById('output');
const userInput = document.getElementById('user-input');

const fileSystem = {
    'home': {
        'about.txt': 'Welcome to my portfolio! I am an experienced IT professional with a focus on network development, automation, and system engineering.',
        'projects': {
            'github_projects.txt': 'My GitHub Projects:\n\n1. For Fun 1\n   Description: This is a repository full of small little projects I have decided to build to learn and become more efficient and skilled in a variety of languages.\n   Link: https://github.com/RParkerE/ForFun\n\n2. LiFi 2\n   Description: My capstone project for ECE. Design and develop the software and hardware for an Arduino based LiFi device.\n   Link: https://github.com/RParkerE/LiFi-With-Arduino\n\n3. Autonomous Driving 3\n   Description: Introductory project to familiarize myself with the workings of Autonomous Vehicles\n   Link: https://github.com/RParkerE/AutonomousDriving'
        },
        'resume': {
            'AutomationTestAndSystemEngineer_NVIDIA.txt': 'Maintain and triage machine and test related issues. Develop and create solutions to automate the monitoring and triaging of issues resulting from failed tests or hardware problems. Implement more secure channels and pipelines for projects and tests.',
            'ITNetworkDevelopmentAnalyst_DellEMC.txt': 'Worked on the design, installation, management, and support of organization-wide networks.\nMaintained hardware and software, analyzed technical issues, and ensured operability of the networks.\nDelivered Tier 1 and 2 network ticketing support.\nManaged, developed, and supported code bases relating to the automation of the network and related work.'
        },
        'contact.txt': 'Email: parker.ellwanger@gmail.com\nLinkedIn: linkedin.com/in/robert-ellwanger-2a39a1a6'
    }
};

let currentDirectory = fileSystem.home;
let currentPath = '~';

function updatePrompt() {
    document.getElementById('prompt').textContent = `guest@portfolio:${currentPath}$`;
}

function printOutput(text) {
    const line = document.createElement('div');
    line.className = 'output-line';
    line.innerHTML = text;
    output.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
}

function listDirectory() {
    return Object.keys(currentDirectory).map(item => {
        const isDirectory = typeof currentDirectory[item] === 'object';
        return `<span class="${isDirectory ? 'directory' : 'file'}">${item}</span>`;
    }).join('\n');
}

function changeDirectory(dirName) {
    if (dirName === '..') {
        if (currentPath !== '~') {
            const pathParts = currentPath.split('/');
            pathParts.pop();
            currentPath = pathParts.join('/') || '~';
            currentDirectory = currentPath === '~' ? fileSystem.home : pathParts.reduce((acc, part) => acc[part], fileSystem.home);
        }
    } else if (currentDirectory[dirName] && typeof currentDirectory[dirName] === 'object') {
        currentDirectory = currentDirectory[dirName];
        currentPath = currentPath === '~' ? `~/${dirName}` : `${currentPath}/${dirName}`;
    } else {
        return 'No such directory';
    }
    updatePrompt();
    return '';
}

function catFile(fileName) {
    if (currentDirectory[fileName] && typeof currentDirectory[fileName] === 'string') {
        let content = currentDirectory[fileName];
        if (fileName === 'github_projects.txt') {
            content = content.replace(/(https:\/\/github\.com\/\S+)/g, '<span class="link" onclick="window.open(\'$1\', \'_blank\')">$1</span>');
        }
        return content;
    } else {
        return 'No such file';
    }
}

function processCommand(command) {
    const [cmd, ...args] = command.trim().split(' ');
    switch (cmd) {
        case 'ls':
            return listDirectory();
        case 'cd':
            return changeDirectory(args[0] || '~');
        case 'cat':
            return args[0] ? catFile(args[0]) : 'Usage: cat <filename>';
        case 'help':
            return 'Available commands: ls, cd, cat, help, clear';
        case 'clear':
            output.innerHTML = '';
            return '';
        default:
            return `Command not found: ${cmd}. Type 'help' for available commands.`;
    }
}

function autocomplete(input) {
    const [cmd, arg] = input.split(' ');
    
    if (cmd === 'cd' || cmd === 'cat') {
        const matches = Object.keys(currentDirectory).filter(item => item.startsWith(arg || ''));
        if (matches.length === 1) {
            return `${cmd} ${matches[0]}`;
        } else if (matches.length > 1) {
            printOutput(matches.join('  '));
            return input;
        }
    }
    
    return input;
}

userInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const command = this.value;
        printOutput(`<span id="prompt">${document.getElementById('prompt').textContent}</span> ${command}`);
        const result = processCommand(command);
        if (result) printOutput(result);
        this.value = '';
    } else if (event.key === 'Tab') {
        event.preventDefault();
        this.value = autocomplete(this.value);
    }
});

// Initial message
printOutput('Welcome to Parker Ellwanger\'s Terminal Portfolio! Type "help" for available commands.');
updatePrompt();
