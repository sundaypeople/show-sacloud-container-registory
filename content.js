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
            console.log("details");
            setTimeout(async () => {
                const hostnameElement = document.getElementsByClassName("flagrate-form-field-text")[3]

                const storage = await chrome.storage.local.get(hostnameElement.innerHTML)
                const tabBody = document.getElementsByClassName("flagrate-tab-body")[0]
                const form = tabBody.appendChild(document.createElement("form"));
                form.className = "flagrate flagrate-form";
                chrome.runtime.sendMessage(
                    {
                        type: "GET_REGISTRY_CATALOG",
                        username: storage[hostnameElement.innerHTML].username,
                        password: storage[hostnameElement.innerHTML].password,
                        hostname: hostnameElement.innerHTML,
                    },
                    (response) => {
                        console.log("response from background:", response);
                        if (response && response.ok) {
                            console.log("catalog:", response.result);
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
