document.addEventListener("DOMContentLoaded", () => {

    /* =================================================
       ELEMENTS
    ================================================= */

    const bootScreen = document.getElementById("boot-screen");
    const desktop = document.getElementById("desktop");
    const bootText = document.getElementById("boot-text");
    const bootSound = document.getElementById("boot-sound");

    const clock = document.getElementById("clock");

    const taskbarApps = document.getElementById("taskbar-apps");
    const menuButton = document.getElementById("menu-button");

    const appLauncher = document.getElementById("app-launcher");
    const appSearch = document.getElementById("app-search");

    const terminalInput = document.getElementById("terminal-input");
    const terminalOutput = document.getElementById("terminal-output");

    const notesArea = document.getElementById("notes-area");

    const soundToggle = document.getElementById("sound-toggle");


    /* =================================================
       BOOT
    ================================================= */

    setTimeout(() => {
        bootText.textContent = "Loading desktop...";
    }, 1000);

    setTimeout(() => {

        bootScreen.style.display = "none";
        desktop.style.display = "block";

        const soundEnabled =
            localStorage.getItem("jainil-os-sound") !== "off";

        if (soundEnabled) {

            bootSound.volume = 0.25;
            bootSound.currentTime = 0;

            bootSound.play().catch(() => {
                console.log("Boot sound blocked.");
            });

        }

    }, 2200);


    /* =================================================
       CLOCK
    ================================================= */

    function updateClock() {

        const now = new Date();

        let hours = now.getHours();
        let minutes = now.getMinutes();

        const ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12;

        if (hours === 0) {
            hours = 12;
        }

        hours = String(hours).padStart(2, "0");
        minutes = String(minutes).padStart(2, "0");

        clock.textContent =
            `${hours}:${minutes} ${ampm}`;
    }

    updateClock();

    setInterval(updateClock, 1000);


    /* =================================================
       WINDOW SYSTEM
    ================================================= */

    let highestZ = 20;

    const windows = document.querySelectorAll(".window");


    /* =================================================
       TASKBAR BUTTON
    ================================================= */

    function createTaskbarButton(windowElement) {

        const appName = windowElement.dataset.app;

        const title =
            windowElement
                .querySelector(".window-title")
                .textContent
                .trim();

        if (
            document.querySelector(
                `[data-task="${appName}"]`
            )
        ) {
            return;
        }

        const button =
            document.createElement("button");

        button.className = "taskbar-app";

        button.dataset.task = appName;

        button.textContent = title;

        taskbarApps.appendChild(button);


        button.addEventListener("click", () => {

            windowElement.style.display = "block";

            windowElement.classList.remove(
                "minimized"
            );

            highestZ++;

            windowElement.style.zIndex = highestZ;

        });
    }


    /* =================================================
       REMOVE TASKBAR BUTTON
    ================================================= */

    function removeTaskbarButton(windowElement) {

        const appName = windowElement.dataset.app;

        const button =
            document.querySelector(
                `[data-task="${appName}"]`
            );

        if (button) {
            button.remove();
        }
    }


    /* =================================================
       WINDOW CONTROLS
    ================================================= */

    windows.forEach(windowElement => {

        const header =
            windowElement.querySelector(".window-header");

        const closeButton =
            windowElement.querySelector(".close-btn");

        const minimizeButton =
            windowElement.querySelector(".minimize-btn");

        const maximizeButton =
            windowElement.querySelector(".maximize-btn");


        /* Bring to front */

        windowElement.addEventListener("mousedown", () => {

            highestZ++;

            windowElement.style.zIndex = highestZ;

        });


        /* CLOSE */

        closeButton.addEventListener("click", event => {

            event.stopPropagation();

            windowElement.style.display = "none";

            windowElement.classList.remove("minimized");
            windowElement.classList.remove("maximized");

            removeTaskbarButton(windowElement);

        });


        /* MINIMIZE */

        minimizeButton.addEventListener("click", event => {

            event.stopPropagation();

            windowElement.classList.add("minimized");

            windowElement.style.display = "none";

            createTaskbarButton(windowElement);

        });


        /* MAXIMIZE */

        maximizeButton.addEventListener("click", event => {

            event.stopPropagation();

            windowElement.classList.toggle("maximized");

        });


        /* =================================================
           DRAGGING
        ================================================= */

        let dragging = false;

        let offsetX = 0;
        let offsetY = 0;


        header.addEventListener("mousedown", event => {

            if (
                event.target.closest(".window-controls")
            ) {
                return;
            }

            if (
                windowElement.classList.contains("maximized")
            ) {
                return;
            }

            dragging = true;

            const rect =
                windowElement.getBoundingClientRect();

            offsetX =
                event.clientX - rect.left;

            offsetY =
                event.clientY - rect.top;

            highestZ++;

            windowElement.style.zIndex = highestZ;

            event.preventDefault();

        });


        document.addEventListener("mousemove", event => {

            if (!dragging) {
                return;
            }

            const desktopRect =
                desktop.getBoundingClientRect();

            let newX =
                event.clientX -
                desktopRect.left -
                offsetX;

            let newY =
                event.clientY -
                desktopRect.top -
                offsetY;


            const maxX =
                desktopRect.width -
                windowElement.offsetWidth;

            const maxY =
                desktopRect.height -
                windowElement.offsetHeight;


            newX =
                Math.max(
                    0,
                    Math.min(newX, maxX)
                );

            newY =
                Math.max(
                    0,
                    Math.min(newY, maxY - 70)
                );


            windowElement.style.left =
                `${newX}px`;

            windowElement.style.top =
                `${newY}px`;

            windowElement.style.transform =
                "none";

        });


        document.addEventListener("mouseup", () => {

            dragging = false;

        });

    });


    /* =================================================
       OPEN APP
    ================================================= */

    function openApp(app) {

        const windowElement =
            document.getElementById(
                `${app}-window`
            );

        if (!windowElement) {
            return;
        }

        windowElement.style.display = "block";

        windowElement.classList.remove(
            "minimized"
        );

        highestZ++;

        windowElement.style.zIndex = highestZ;

        removeTaskbarButton(windowElement);

    }


    /* =================================================
       DESKTOP ICONS
    ================================================= */

    const desktopIcons =
        document.querySelectorAll(".desktop-icon");

    desktopIcons.forEach(icon => {

        icon.addEventListener("click", () => {

            const app = icon.dataset.app;

            openApp(app);

        });

    });


    /* =================================================
       J BUTTON
    ================================================= */

    menuButton.addEventListener("click", event => {

        event.stopPropagation();

        if (
            appLauncher.style.display === "block"
        ) {

            appLauncher.style.display = "none";

        } else {

            appLauncher.style.display = "block";

            appSearch.value = "";

            document
                .querySelectorAll(".launcher-app")
                .forEach(button => {
                    button.style.display = "block";
                });

            appSearch.focus();

        }

    });


    /* =================================================
       LAUNCHER APPS
    ================================================= */

    const launcherApps =
        document.querySelectorAll(".launcher-app");

    launcherApps.forEach(appButton => {

        appButton.addEventListener("click", () => {

            const app = appButton.dataset.app;

            openApp(app);

            appLauncher.style.display = "none";

        });

    });


    /* =================================================
       APP SEARCH
    ================================================= */

    appSearch.addEventListener("input", () => {

        const search =
            appSearch.value
                .toLowerCase()
                .trim();

        launcherApps.forEach(button => {

            const name =
                button.textContent
                    .toLowerCase();

            if (name.includes(search)) {

                button.style.display = "block";

            } else {

                button.style.display = "none";

            }

        });

    });


    /* =================================================
       CLOSE LAUNCHER OUTSIDE
    ================================================= */

    document.addEventListener("click", event => {

        if (
            !appLauncher.contains(event.target) &&
            event.target !== menuButton
        ) {

            appLauncher.style.display = "none";

        }

    });


    /* =================================================
       NOTES AUTO SAVE
    ================================================= */

    const savedNotes =
        localStorage.getItem("jainil-os-notes");

    if (savedNotes !== null) {

        notesArea.value = savedNotes;

    }


    notesArea.addEventListener("input", () => {

        localStorage.setItem(
            "jainil-os-notes",
            notesArea.value
        );

    });


   /* =================================================
   FILE MANAGER
================================================= */

const fileList =
    document.getElementById("file-list");

const filePath =
    document.getElementById("file-path");

const fileBack =
    document.getElementById("file-back");

const fileHome =
    document.getElementById("file-home");

const fileMessage =
    document.getElementById("file-message");


/* FILE SYSTEM */

const fileSystem = {

    Home: {

        type: "folder",

        children: {

            Documents: {
                type: "folder",

                children: {

                    "My Project.txt": {
                        type: "file",

                        content:
                            "This is my JAINIL OS project."
                    },

                    "Ideas.txt": {
                        type: "file",

                        content:
                            "Robotics\nCoding\nAI\nWeb OS"
                    }

                }
            },


            Downloads: {

                type: "folder",

                children: {

                    "Downloads.txt": {
                        type: "file",

                        content:
                            "Your downloaded files will appear here."
                    }

                }

            },


            Pictures: {

                type: "folder",

                children: {

                    "Pictures.txt": {
                        type: "file",

                        content:
                            "Your pictures will appear here."
                    }

                }

            },


            "README.txt": {

                type: "file",

                content:
                    "Welcome to JAINIL OS!\n\n" +
                    "This is the File Manager of JAINIL OS."
            }

        }

    }

};


/* CURRENT LOCATION */

let currentPath = ["Home"];


/* GET CURRENT FOLDER */

function getCurrentFolder() {

    let folder = fileSystem;

    for (const part of currentPath) {

        if (part === "Home") {

            folder = folder.Home;

        } else {

            folder =
                folder.children[part];

        }

    }

    return folder;

}


/* DISPLAY FILES */

function renderFiles() {

    const folder =
        getCurrentFolder();

    fileList.innerHTML = "";

    fileMessage.textContent = "";

    filePath.textContent =
        currentPath.join(" / ");


    Object.entries(folder.children)
        .forEach(([name, item]) => {

            const button =
                document.createElement("button");

            button.className = "file";


            if (item.type === "folder") {

                button.textContent =
                    `📁 ${name}`;

            } else {

                button.textContent =
                    `📄 ${name}`;

            }


            button.addEventListener(
                "click",
                () => {

                    if (item.type === "folder") {

                        currentPath.push(name);

                        renderFiles();

                    }

else {

    openEditor(name, item.content);

}

                }
            );


            fileList.appendChild(button);

        });

}


/* BACK */

fileBack.addEventListener("click", () => {

    if (currentPath.length > 1) {

        currentPath.pop();

        renderFiles();

    }

});


/* HOME */

fileHome.addEventListener("click", () => {

    currentPath = ["Home"];

    renderFiles();

});


/* INITIAL LOAD */

renderFiles();
    /* =================================================
   TERMINAL
================================================= */

const terminalHistory = [];

let historyIndex = -1;


/* TERMINAL COMMAND */

terminalInput.addEventListener(
    "keydown",
    event => {

        /* COMMAND HISTORY */

        if (event.key === "ArrowUp") {

            if (terminalHistory.length === 0) {
                return;
            }

            if (historyIndex < terminalHistory.length - 1) {
                historyIndex++;
            }

            terminalInput.value =
                terminalHistory[
                    terminalHistory.length - 1 - historyIndex
                ];

            event.preventDefault();

            return;
        }


        if (event.key === "ArrowDown") {

            if (historyIndex > 0) {

                historyIndex--;

                terminalInput.value =
                    terminalHistory[
                        terminalHistory.length - 1 - historyIndex
                    ];

            } else {

                historyIndex = -1;

                terminalInput.value = "";

            }

            event.preventDefault();

            return;
        }


        /* ENTER */

        if (event.key !== "Enter") {
            return;
        }


        const command =
            terminalInput.value
                .trim();


        terminalInput.value = "";


        if (!command) {
            return;
        }


        terminalHistory.push(command);

        historyIndex = -1;


        const lowerCommand =
            command.toLowerCase();


        let output = "";


        /* HELP */

        if (lowerCommand === "help") {

            output =
`Available commands:

help       Show commands
clear      Clear terminal
about      About JAINIL OS
date       Show date
time       Show time
whoami     Show current user
os         Show OS information
apps       Show installed apps
pwd        Show current directory
ls         List files
echo       Print text
neofetch   System information`;

        }


        /* CLEAR */

        else if (lowerCommand === "clear") {

            terminalOutput.textContent = "";

            return;

        }


        /* ABOUT */

        else if (lowerCommand === "about") {

            output =
                "JAINIL OS — Web OS project by Jainil.";

        }


        /* DATE */

        else if (lowerCommand === "date") {

            output =
                new Date().toDateString();

        }


        /* TIME */

        else if (lowerCommand === "time") {

            output =
                new Date().toLocaleTimeString();

        }


        /* WHOAMI */

        else if (lowerCommand === "whoami") {

            output = "jainil";

        }


        /* OS */

        else if (lowerCommand === "os") {

            output =
                "JAINIL OS Web Desktop — Version 1.2";

        }


        /* APPS */

        else if (lowerCommand === "apps") {

            output =
`Installed apps:

File Manager
Notes
Text Editor
Terminal
Settings`;

        }


        /* PWD */

        else if (lowerCommand === "pwd") {

            output = "/home/jainil";

        }


        /* LS */

        else if (lowerCommand === "ls") {

            output =
`Documents
Downloads
Pictures
README.txt`;

        }


        /* ECHO */

        else if (lowerCommand.startsWith("echo ")) {

            output =
                command.substring(5);

        }


        /* NEOFETCH */

        else if (lowerCommand === "neofetch") {

            output =
`       ██╗ █████╗ ██╗███╗   ██╗██╗██╗
       ██║██╔══██╗██║████╗  ██║██║██║
       ██║███████║██║██╔██╗ ██║██║██║
  ██   ██║██╔══██║██║██║╚██╗██║██║██║
  ╚█████╔╝██║  ██║██║██║ ╚████║██║██║
   ╚════╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚═╝╚═╝

OS: JAINIL OS
Version: 1.2
User: jainil
Shell: JAINIL Shell
Desktop: JAINIL Desktop
Apps: 5`;

        }


        /* UNKNOWN COMMAND */

        else {

            output =
                `Command not found: ${command}`;

        }


        terminalOutput.textContent +=
            `\n${output}\n`;

        terminalOutput.scrollTop =
            terminalOutput.scrollHeight;

    }
);


    /* =================================================
       SETTINGS — BOOT SOUND
    ================================================= */

    soundToggle.addEventListener("click", () => {

        const current =
            localStorage.getItem("jainil-os-sound");

        if (current === "off") {

            localStorage.removeItem(
                "jainil-os-sound"
            );

            soundToggle.textContent =
                "Boot Sound: ON";

        } else {

            localStorage.setItem(
                "jainil-os-sound",
                "off"
            );

            soundToggle.textContent =
                "Boot Sound: OFF";

        }

    });


    /* =================================================
       STARTUP
    ================================================= */

    document.getElementById(
        "welcome-window"
    ).style.display = "block";

});
/* =================================================
   TEXT EDITOR
================================================= */

const editorWindow =
    document.getElementById("editor-window");

const editorArea =
    document.getElementById("editor-area");

const editorFilename =
    document.getElementById("editor-filename");

const saveFile =
    document.getElementById("save-file");

let editingFile = null;


/* OPEN EDITOR */

function openEditor(name, content) {

    editingFile = name;

    editorFilename.textContent = name;

    editorArea.value = content;

    editorWindow.style.display = "block";

    editorWindow.classList.remove("minimized");

    highestZ++;

    editorWindow.style.zIndex = highestZ;

    removeTaskbarButton(editorWindow);

}


/* SAVE FILE */

saveFile.addEventListener("click", () => {

    if (!editingFile) {
        return;
    }

    localStorage.setItem(
        `jainil-file-${editingFile}`,
        editorArea.value
    );

    alert(`${editingFile} saved!`);

});