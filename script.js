const terminal = document.getElementById('terminal');
const output = document.getElementById('output');
const userInput = document.getElementById('user-input');

const fileSystem = {
    name: 'root',
    type: 'directory',
    children: {
        home: {
            name: 'home',
            type: 'directory',
            parent: null,
            children: {
                'about.txt': {
                    name: 'about.txt',
                    type: 'file',
                    content: 'I am currently pursuing my Masters of Computer Science at the University Of Illinois Urbana Champaign, concurrently working as an Automation System and Test Engineer at Nvidia.\n\nAbout Me\n I am passionate about programming and perpetual learning, striving for continuous improvement in both my professional and academic endeavors. My current focus lies in the intersection of automation tools and computer vision, particularly within the domain of autonomous vehicles.\n\nInterests\n Automation Tools: I am fascinated by the efficiency and reliability that automation brings to various processes and systems.\n Computer Vision: Exploring the vast possibilities of computer vision technology excites me, especially its applications in real-world scenarios.\n Autonomous Vehicles: The fusion of automation and computer vision in autonomous vehicles presents endless opportunities for innovation and societal impact.\n\nContinuous Learning\n I am committed to staying abreast of new technologies and applications through a blend of formal education and self-directed learning initiatives. My journey in academia and industry has fueled my curiosity, driving me to explore emerging trends and push the boundaries of my knowledge.',
                    parent: null
                },
                projects: {
                    name: 'projects',
                    type: 'directory',
                    parent: null,
                    children: {
                        'github_projects.txt': {
                            name: 'github_projects.txt',
                            type: 'file',
                            content: 'My GitHub Projects:\n\n1. For Fun\n   Description: This is a repository full of small little projects I have decided to build to learn and become more efficient and skilled in a variety of languages.\n   Link: https://github.com/RParkerE/ForFun\n\n2. LiFi\n   Description: My capstone project for ECE. Design and develop the software and hardware for an Arduino based LiFi device.\n   Link: https://github.com/RParkerE/LiFi-With-Arduino\n\n3. Autonomous Driving\n   Description: Introductory project to familiarize myself with the workings of Autonomous Vehicles\n   Link: https://github.com/RParkerE/AutonomousDriving',
                            parent: null
                        }
                    }
                },
                resume: {
                    name: 'resume',
                    type: 'directory',
                    parent: null,
                    children: {
                        'AutomationTestAndSystemEngineer_NVIDIA.txt': {
                            name: 'AutomationTestAndSystemEngineer_NVIDIA.txt',
                            type: 'file',
                            content: 'Maintain and triage machine and test related issues. Develop and create solutions to automate the monitoring and triaging of issues resulting from failed tests or hardware problems. Implement more secure channels and pipelines for projects and tests.',
                            parent: null
                        },
                        'ITNetworkDevelopmentAnalyst_DellEMC.txt': {
                            name: 'ITNetworkDevelopmentAnalyst_DellEMC.txt',
                            type: 'file',
                            content: 'Worked on the design, installation, management, and support of organization-wide networks.\nMaintained hardware and software, analyzed technical issues, and ensured operability of the networks.\nDelivered Tier 1 and 2 network ticketing support.\nManaged, developed, and supported code bases relating to the automation of the network and related work.',
                            parent: null
                        }
                    }
                },
                'contact.txt': {
                    name: 'contact.txt',
                    type: 'file',
                    content: 'Email: parker.ellwanger@gmail.com\nLinkedIn: linkedin.com/in/robert-ellwanger-2a39a1a6\nGithub: github.com/RParkerE',
                    parent: null
                }
            }
        }
    }
};

let currentDirectory = fileSystem.children.home;
let currentPath = '/home';
let commandHistory = [];
let historyIndex = -1;

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
    return Object.keys(currentDirectory.children).map(item => {
        const isDirectory = currentDirectory.children[item].type === 'directory';
        return `<span class="${isDirectory ? 'directory' : 'file'}">${item}</span>`;
    }).join('\n');
}

function changeDirectory(path) {
    if (!path) {
        currentDirectory = fileSystem.children.home;
        currentPath = '/home';
        updatePrompt();
        return '';
    }

    const parts = path.split('/').filter(Boolean);
    let newDir = path.startsWith('/') ? fileSystem : currentDirectory;

    for (let part of parts) {
        if (part === '..') {
            if (newDir.parent) {
                newDir = newDir.parent;
            } else if (newDir !== fileSystem) {
                newDir = fileSystem;
            } else {
                return 'Already at root directory';
            }
        } else if (newDir.children[part] && newDir.children[part].type === 'directory') {
            newDir = newDir.children[part];
        } else {
            return `No such directory: ${part}`;
        }
    }

    currentDirectory = newDir;
    currentPath = getFullPath(currentDirectory);
    updatePrompt();
    return '';
}

function getFullPath(dir) {
    let path = [];
    let currentDir = dir;
    while (currentDir !== fileSystem) {
        path.unshift(currentDir.name);
        currentDir = currentDir.parent || fileSystem;
    }
    return '/' + path.join('/');
}

function catFile(fileName) {
    if (currentDirectory.children[fileName] && currentDirectory.children[fileName].type === 'file') {
        let content = currentDirectory.children[fileName].content;
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
            const cdResult = changeDirectory(args[0]);
            return cdResult ? cdResult : ''; // Return an empty string if cd was successful
        case 'cat':
            return args[0] ? catFile(args[0]) : 'Usage: cat <filename>';
        case 'help':
            return 'Available commands: ls, cd, cat, help, clear, history, pwd';
        case 'clear':
            output.innerHTML = '';
            return '';
        case 'history':
            return commandHistory.join('\n');
        case 'pwd':
            return currentPath;
        default:
            return `Command not found: ${cmd}. Type 'help' for available commands.`;
    }
}

function autocomplete(input) {
    const [cmd, ...args] = input.split(' ');
    const arg = args.join(' ');

    if (cmd === 'cd' || cmd === 'cat') {
        let dir = currentDirectory;
        let prefix = '';

        if (arg.includes('/')) {
            const parts = arg.split('/');
            prefix = parts.slice(0, -1).join('/') + '/';
            const dirPath = parts.slice(0, -1);
            
            for (let part of dirPath) {
                if (part === '..') {
                    dir = dir.parent || dir;
                } else if (dir.children[part] && dir.children[part].type === 'directory') {
                    dir = dir.children[part];
                } else {
                    return input;
                }
            }
        }

        const matches = Object.keys(dir.children).filter(item => item.startsWith(arg.split('/').pop() || ''));
        if (matches.length === 1) {
            return `${cmd} ${prefix}${matches[0]}`;
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
        if (command.trim() !== '') {
            commandHistory.push(command);
            historyIndex = commandHistory.length;
        }
        printOutput(`<span class="prompt">${document.getElementById('prompt').textContent}</span> <span class="command">${command}</span>`);
        const result = processCommand(command);
        if (result !== null) printOutput(result);
        this.value = '';
    } else if (event.key === 'Tab') {
        event.preventDefault();
        this.value = autocomplete(this.value);
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            this.value = commandHistory[historyIndex];
        }
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            this.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            this.value = '';
        }
    }
});

// Set parent references
function setParentReferences(dir, parent) {
    dir.parent = parent;
    for (let child in dir.children) {
        if (dir.children[child].type === 'directory') {
            setParentReferences(dir.children[child], dir);
        } else {
            dir.children[child].parent = dir;
        }
    }
}
setParentReferences(fileSystem.children.home, fileSystem);

// Initial message
printOutput('Welcome to Parker Ellwanger\'s Terminal Portfolio! Type "help" for available commands.');
updatePrompt();

// Focus on input when the page loads
window.onload = () => userInput.focus();
