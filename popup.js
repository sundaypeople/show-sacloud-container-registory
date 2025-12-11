window.addEventListener('DOMContentLoaded', () => {
    const inputHostname = document.getElementById('hostname');
    const inputUsername = document.getElementById('username');
    const inputPassword = document.getElementById('password');
    const saveButton = document.getElementById('save');
    chrome.storage.local.get(['tmpHostname','tmpUsername','tmpPassword'], (result) => {
        console.log(result.tmpHostname);
        if (result.tmpHostname) {
            inputHostname.value = result.tmpHostname;
        }
        if (result.tmpUsername) {
            inputUsername.value = result.tmpUsername;
        }
        if (result.tmpPassword) {
            inputPassword.value = result.tmpPassword;
        }
    })
    inputHostname.addEventListener('change', () => {
        chrome.storage.local.set({"tmpHostname":inputHostname.value});
    })
    inputUsername.addEventListener('change', () => {
        chrome.storage.local.set({"tmpUsername":inputUsername.value});
    })
    inputPassword.addEventListener('change', () => {
        chrome.storage.local.set({"tmpPassword":inputPassword.value});
    })
    saveButton.addEventListener('click', () => {
        console.log("save")
        chrome.storage.local.set({[inputHostname.value]:{"username":inputUsername.value,"password":inputPassword.value}});
    })
})

