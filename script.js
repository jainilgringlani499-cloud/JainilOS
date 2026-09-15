document.addEventListener("DOMContentLoaded", () => {


    /* =================================================
       ELEMENTS
    ================================================= */

    const bootScreen =
        document.getElementById("boot-screen");

    const desktop =
        document.getElementById("desktop");

    const bootText =
        document.getElementById("boot-text");

    const bootSound =
        document.getElementById("boot-sound");

    const clock =
        document.getElementById("clock");

    const taskbarApps =
        document.getElementById("taskbar-apps");

    const menuButton =
        document.getElementById("menu-button");

    const appLauncher =
        document.getElementById("app-launcher");

    const appSearch =
        document.getElementById("app-search");

    const terminalInput =
        document.getElementById("terminal-input");

    const terminalOutput =
        document.getElementById("terminal-output");

    const notesArea =
        document.getElementById("notes-area");

    const soundToggle =
        document.getElementById("sound-toggle");

    const notificationButton =
        document.getElementById("notification-button");

    const notificationCenter =
        document.getElementById("notification-center");

    const notificationList =
        document.getElementById("notification-list");

    const clearNotifications =
        document.getElementById("clear-notifications");


    /* =================================================
       BOOT
    ================================================= */

    setTimeout(() => {

        bootText.textContent =
            "Loading desktop...";

    }, 1000);


    setTimeout(() => {

        bootScreen.style.display =
            "none";

        desktop.style.display =
            "block";


        const soundEnabled =
            localStorage.getItem(
                "jainil-os-sound"
            ) !== "off";


        if (soundEnabled) {

            bootSound.volume = 0.25;

            bootSound.currentTime = 0;

            bootSound.play().catch(() => {

                console.log(
                    "Boot sound blocked."
                );

            });

        }

    }, 2200);


    /* =================================================
       CLOCK
    ================================================= */

    function updateClock() {

        const now = new Date();

        let hours =
            now.getHours();

        let minutes =
            now.getMinutes();

        const ampm =
            hours >= 12
                ? "PM"
                : "AM";


        hours =
            hours % 12;


        if (hours === 0) {

            hours = 12;

        }


        hours =
            String(hours)
                .padStart(2, "0");


        minutes =
            String(minutes)
                .padStart(2, "0");


        clock.textContent =
            `${hours}:${minutes} ${ampm}`;

    }


    updateClock();

    setInterval(
        updateClock,
        1000
    );


    /* =================================================
       WINDOW SYSTEM
    ================================================= */

    let highestZ = 100;

    const windows =
        document.querySelectorAll(".window");


    /* =================================================
       TASKBAR BUTTON
    ================================================= */

    function createTaskbarButton(
        windowElement
    ) {

        const appName =
            windowElement.dataset.app;


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


        button.className =
            "taskbar-app";


        button.dataset.task =
            appName;


        button.textContent =
            title;


        taskbarApps.appendChild(
            button
        );


        button.addEventListener(
            "click",
            () => {

                windowElement.style.display =
                    "block";

                windowElement.classList.remove(
                    "minimized"
                );

                highestZ++;

                windowElement.style.zIndex =
                    highestZ;

            }
        );

    }


    /* =================================================
       REMOVE TASKBAR BUTTON
    ================================================= */

    function removeTaskbarButton(
        windowElement
    ) {

        const appName =
            windowElement.dataset.app;


        const button =
            document.querySelector(
                `[data-task="${appName}"]`
            );


        if (button) {

            button.remove();

        }

    }


    /* =================================================
       WINDOW CONTROLS + DRAGGING
    ================================================= */

    windows.forEach(
        windowElement => {

            const header =
                windowElement.querySelector(
                    ".window-header"
                );


            const closeButton =
                windowElement.querySelector(
                    ".close-btn"
                );


            const minimizeButton =
                windowElement.querySelector(
                    ".minimize-btn"
                );


            const maximizeButton =
                windowElement.querySelector(
                    ".maximize-btn"
                );


            /* Bring to front */

            windowElement.addEventListener(
                "mousedown",
                () => {

                    highestZ++;

                    windowElement.style.zIndex =
                        highestZ;

                }
            );


            /* CLOSE */

            closeButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    windowElement.style.display =
                        "none";

                    windowElement.classList.remove(
                        "minimized"
                    );

                    windowElement.classList.remove(
                        "maximized"
                    );

                    removeTaskbarButton(
                        windowElement
                    );

                }
            );


            /* MINIMIZE */

            minimizeButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    windowElement.classList.add(
                        "minimized"
                    );

                    windowElement.style.display =
                        "none";

                    createTaskbarButton(
                        windowElement
                    );

                }
            );


            /* MAXIMIZE */

            maximizeButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    windowElement.classList.toggle(
                        "maximized"
                    );

                }
            );


            /* DRAGGING */

            let dragging = false;

            let offsetX = 0;

            let offsetY = 0;


            header.addEventListener(
                "mousedown",
                event => {

                    if (
                        event.target.closest(
                            ".window-controls"
                        )
                    ) {

                        return;

                    }


                    if (
                        windowElement.classList.contains(
                            "maximized"
                        )
                    ) {

                        return;

                    }


                    dragging = true;


                    const rect =
                        windowElement
                            .getBoundingClientRect();


                    offsetX =
                        event.clientX -
                        rect.left;


                    offsetY =
                        event.clientY -
                        rect.top;


                    highestZ++;

                    windowElement.style.zIndex =
                        highestZ;


                    event.preventDefault();

                }
            );


            document.addEventListener(
                "mousemove",
                event => {

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
                            Math.min(
                                newX,
                                maxX
                            )
                        );


                    newY =
                        Math.max(
                            0,
                            Math.min(
                                newY,
                                maxY - 70
                            )
                        );


                    windowElement.style.left =
                        `${newX}px`;


                    windowElement.style.top =
                        `${newY}px`;


                    windowElement.style.transform =
                        "none";

                }
            );


            document.addEventListener(
                "mouseup",
                () => {

                    dragging = false;

                }
            );

        }
    );


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


        windowElement.style.display =
            "block";


        windowElement.classList.remove(
            "minimized"
        );


        highestZ++;

        windowElement.style.zIndex =
            highestZ;


        removeTaskbarButton(
            windowElement
        );

    }


    /* =================================================
       DESKTOP ICONS
    ================================================= */

    document
        .querySelectorAll(".desktop-icon")
        .forEach(icon => {

            icon.addEventListener(
                "click",
                () => {

                    openApp(
                        icon.dataset.app
                    );

                }
            );

        });


    /* =================================================
       APP LAUNCHER
    ================================================= */

    menuButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            const isOpen =
                appLauncher.style.display ===
                "block";


            notificationCenter.style.display =
                "none";


            if (isOpen) {

                appLauncher.style.display =
                    "none";

                return;

            }


            appLauncher.style.display =
                "block";


            appSearch.value = "";


            document
                .querySelectorAll(
                    ".launcher-app"
                )
                .forEach(button => {

                    button.style.display =
                        "block";

                });


            appSearch.focus();

        }
    );


    /* LAUNCHER APPS */

    const launcherApps =
        document.querySelectorAll(
            ".launcher-app"
        );


    launcherApps.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    openApp(
                        button.dataset.app
                    );

                    appLauncher.style.display =
                        "none";

                }
            );

        }
    );


    /* SEARCH */

    appSearch.addEventListener(
        "input",
        () => {

            const search =
                appSearch.value
                    .toLowerCase()
                    .trim();


            launcherApps.forEach(
                button => {

                    const name =
                        button.textContent
                            .toLowerCase();


                    button.style.display =
                        name.includes(search)
                            ? "block"
                            : "none";

                }
            );

        }
    );


    /* =================================================
       FILE MANAGER
    ================================================= */

    const fileList =
        document.getElementById(
            "file-list"
        );


    const filePath =
        document.getElementById(
            "file-path"
        );


    const fileBack =
        document.getElementById(
            "file-back"
        );


    const fileHome =
        document.getElementById(
            "file-home"
        );


    const fileMessage =
        document.getElementById(
            "file-message"
        );


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


    let currentPath =
        ["Home"];


    function getCurrentFolder() {

        let folder =
            fileSystem;


        for (
            const part of currentPath
        ) {

            folder =
                part === "Home"
                    ? folder.Home
                    : folder.children[part];

        }


        return folder;

    }


    function getSavedContent(
        name,
        defaultContent
    ) {

        const saved =
            localStorage.getItem(
                `jainil-file-${name}`
            );


        return saved !== null
            ? saved
            : defaultContent;

    }


    function renderFiles() {

        const folder =
            getCurrentFolder();


        fileList.innerHTML =
            "";


        fileMessage.textContent =
            "";


        filePath.textContent =
            currentPath.join(
                " / "
            );


        Object.entries(
            folder.children
        ).forEach(
            ([name, item]) => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.className =
                    "file";


                button.textContent =
                    item.type === "folder"
                        ? `📁 ${name}`
                        : `📄 ${name}`;


                button.addEventListener(
                    "click",
                    () => {

                        if (
                            item.type ===
                            "folder"
                        ) {

                            currentPath.push(
                                name
                            );

                            renderFiles();

                        }

                        else {

                            openEditor(
                                name,
                                getSavedContent(
                                    name,
                                    item.content
                                )
                            );

                        }

                    }
                );


                fileList.appendChild(
                    button
                );

            }
        );

    }


    fileBack.addEventListener(
        "click",
        () => {

            if (
                currentPath.length > 1
            ) {

                currentPath.pop();

                renderFiles();

            }

        }
    );


    fileHome.addEventListener(
        "click",
        () => {

            currentPath =
                ["Home"];

            renderFiles();

        }
    );


    /* =================================================
       TEXT EDITOR
    ================================================= */

    const editorWindow =
        document.getElementById(
            "editor-window"
        );


    const editorArea =
        document.getElementById(
            "editor-area"
        );


    const editorFilename =
        document.getElementById(
            "editor-filename"
        );


    const saveFile =
        document.getElementById(
            "save-file"
        );


    let editingFile = null;


    function openEditor(
        name,
        content
    ) {

        editingFile =
            name;


        editorFilename.textContent =
            name;


        editorArea.value =
            content;


        editorWindow.style.display =
            "block";


        editorWindow.classList.remove(
            "minimized"
        );


        highestZ++;

        editorWindow.style.zIndex =
            highestZ;


        removeTaskbarButton(
            editorWindow
        );

    }


    saveFile.addEventListener(
        "click",
        () => {

            if (!editingFile) {

                return;

            }


            localStorage.setItem(
                `jainil-file-${editingFile}`,
                editorArea.value
            );


            fileMessage.textContent =
                `${editingFile} saved successfully.`;


            addNotification(
                "File Saved",
                `${editingFile} was saved.`
            );

        }
    );


    /* =================================================
       NOTES
    ================================================= */

    const savedNotes =
        localStorage.getItem(
            "jainil-os-notes"
        );


    if (
        savedNotes !== null
    ) {

        notesArea.value =
            savedNotes;

    }


    notesArea.addEventListener(
        "input",
        () => {

            localStorage.setItem(
                "jainil-os-notes",
                notesArea.value
            );

        }
    );


    /* =================================================
       TERMINAL
    ================================================= */

    const terminalHistory = [];

    let historyIndex = -1;


    terminalInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "ArrowUp"
            ) {

                if (
                    terminalHistory.length === 0
                ) {

                    return;

                }


                if (
                    historyIndex <
                    terminalHistory.length - 1
                ) {

                    historyIndex++;

                }


                terminalInput.value =
                    terminalHistory[
                        terminalHistory.length -
                        1 -
                        historyIndex
                    ];


                event.preventDefault();

                return;

            }


            if (
                event.key ===
                "ArrowDown"
            ) {

                if (
                    historyIndex > 0
                ) {

                    historyIndex--;

                    terminalInput.value =
                        terminalHistory[
                            terminalHistory.length -
                            1 -
                            historyIndex
                        ];

                }

                else {

                    historyIndex = -1;

                    terminalInput.value =
                        "";

                }


                event.preventDefault();

                return;

            }


            if (
                event.key !==
                "Enter"
            ) {

                return;

            }


            const command =
                terminalInput.value.trim();


            terminalInput.value =
                "";


            if (!command) {

                return;

            }


            terminalHistory.push(
                command
            );


            historyIndex = -1;


            const lowerCommand =
                command.toLowerCase();


            let output = "";


            if (
                lowerCommand ===
                "help"
            ) {

                output =
`Available commands:

help
clear
about
date
time
whoami
os
apps
pwd
ls
echo
neofetch`;

            }


            else if (
                lowerCommand ===
                "clear"
            ) {

                terminalOutput.textContent =
                    "";

                return;

            }


            else if (
                lowerCommand ===
                "about"
            ) {

                output =
                    "JAINIL OS — Web OS project by Jainil.";

            }


            else if (
                lowerCommand ===
                "date"
            ) {

                output =
                    new Date()
                        .toDateString();

            }


            else if (
                lowerCommand ===
                "time"
            ) {

                output =
                    new Date()
                        .toLocaleTimeString();

            }


            else if (
                lowerCommand ===
                "whoami"
            ) {

                output =
                    "jainil";

            }


            else if (
                lowerCommand ===
                "os"
            ) {

                output =
                    "JAINIL OS Web Desktop — Version 1.3";

            }


            else if (
                lowerCommand ===
                "apps"
            ) {

                output =
`Installed apps:

File Manager
Notes
Text Editor
Terminal
Settings`;

            }


            else if (
                lowerCommand ===
                "pwd"
            ) {

                output =
                    "/home/jainil";

            }


            else if (
                lowerCommand ===
                "ls"
            ) {

                output =
`Documents
Downloads
Pictures
README.txt`;

            }


            else if (
                lowerCommand.startsWith(
                    "echo "
                )
            ) {

                output =
                    command.substring(5);

            }


            else if (
                lowerCommand ===
                "neofetch"
            ) {

                output =
`JAINIL OS

OS: JAINIL OS
Version: 1.3
User: jainil
Shell: JAINIL Shell
Desktop: JAINIL Desktop
Apps: 5`;

            }


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

    function updateSoundButton() {

        const soundOff =
            localStorage.getItem(
                "jainil-os-sound"
            ) === "off";


        soundToggle.textContent =
            soundOff
                ? "Boot Sound: OFF"
                : "Boot Sound: ON";

    }


    soundToggle.addEventListener(
        "click",
        () => {

            const current =
                localStorage.getItem(
                    "jainil-os-sound"
                );


            if (
                current === "off"
            ) {

                localStorage.removeItem(
                    "jainil-os-sound"
                );

            }

            else {

                localStorage.setItem(
                    "jainil-os-sound",
                    "off"
                );

            }


            updateSoundButton();

        }
    );


    updateSoundButton();


    /* =================================================
       NOTIFICATION CENTER
    ================================================= */

    let notifications = [];


    function renderNotifications() {

        notificationList.innerHTML =
            "";


        if (
            notifications.length === 0
        ) {

            notificationList.innerHTML =
                `<div class="no-notifications">
                    No notifications
                </div>`;

            return;

        }


        notifications.forEach(
            notification => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "notification";


                const title =
                    document.createElement(
                        "div"
                    );

                title.className =
                    "notification-title";

                title.textContent =
                    notification.title;


                const message =
                    document.createElement(
                        "div"
                    );

                message.className =
                    "notification-message";

                message.textContent =
                    notification.message;


                const time =
                    document.createElement(
                        "div"
                    );

                time.className =
                    "notification-time";

                time.textContent =
                    notification.time;


                item.appendChild(
                    title
                );

                item.appendChild(
                    message
                );

                item.appendChild(
                    time
                );


                notificationList.appendChild(
                    item
                );

            }
        );

    }


    function addNotification(
        title,
        message
    ) {

        const now =
            new Date();


        const time =
            now.toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );


        notifications.unshift({

            title:
                title,

            message:
                message,

            time:
                time

        });


        renderNotifications();

    }


    /* NOTIFICATION BUTTON */

    notificationButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();


            appLauncher.style.display =
                "none";


            const isOpen =
                notificationCenter.style.display ===
                "block";


            notificationCenter.style.display =
                isOpen
                    ? "none"
                    : "block";

        }
    );


    /* CLEAR */

    clearNotifications.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            notifications = [];

            renderNotifications();

        }
    );


    /* =================================================
       OUTSIDE CLICK
    ================================================= */

    document.addEventListener(
        "click",
        event => {

            if (
                !appLauncher.contains(
                    event.target
                ) &&
                event.target !==
                    menuButton
            ) {

                appLauncher.style.display =
                    "none";

            }


            if (
                !notificationCenter.contains(
                    event.target
                ) &&
                event.target !==
                    notificationButton
            ) {

                notificationCenter.style.display =
                    "none";

            }

        }
    );


    /* =================================================
       STARTUP
    ================================================= */

    document.getElementById(
        "welcome-window"
    ).style.display =
        "block";


    renderFiles();

    renderNotifications();


    setTimeout(
        () => {

            addNotification(
                "Welcome to JAINIL OS",
                "Your desktop is ready."
            );

        },
        2500
    );

});