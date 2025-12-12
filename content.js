window.addEventListener('hashchange', () => {
    showContainerRegistryContents()
})

window.addEventListener('DOMContentLoaded', e => {
    showContainerRegistryContents()
})
showContainerRegistryContents()

function showContainerRegistryContents() {
    if (location.hash.startsWith("#!")) {
        if (location.hash.includes("#!/appliance/containerregistry-detail/id=")) {
            setTimeout(async () => {
                console.log("start showContainerRegistryContents");
                let hostname = null;
                const hostnameElements = document.getElementsByClassName("flagrate-form-field-text")
                for(let i = 0; i < hostnameElements.length; i++) {
                     if (hostnameElements[i].innerHTML.includes("sakuracr.jp")) {
                        hostname = hostnameElements[i].innerHTML
                    }
                }
                if (!hostname) {
                    console.log("not found hostname");
                    return
                }

                const storage = await chrome.storage.local.get(hostname)
                const tabBody = document.getElementsByClassName("flagrate-tab-body")[0]
                const form = tabBody.appendChild(document.createElement("form"));
                form.className = "flagrate flagrate-form";
                chrome.runtime.sendMessage(
                    {
                        type: "GET_REGISTRY_CATALOG",
                        username: storage[hostname].username,
                        password: storage[hostname].password,
                        hostname: hostname,
                    },
                    (response) => {
                        console.log("response from background:", response);
                        if (response && response.ok) {
                            response.result.forEach((r) => {
                                const div = form.appendChild(document.createElement("div"));
                                const divp = div.appendChild(document.createElement("div"));
                                const p = divp.appendChild(document.createElement("p"));
                                p.innerHTML = r;
                                p.className = "flagrate-form-field-text";
                            })

                        }
                    }
                );
            }, 3000)
        }
    }
}
