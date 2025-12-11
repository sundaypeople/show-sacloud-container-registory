chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const {type,username,password,hostname} = message;
    if(type === "GET_REGISTRY_CATALOG") {
        console.log("message", type);
        (async() => {
            try {
                const tokenResponse = await fetch(`https://auth.sakuracr.jp/token/?service=${hostname}&scope=registry:catalog:*`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Basic " + btoa(`${username}:${password}`)
                        }
                    }
                )
                if(!tokenResponse.ok) {
                    sendResponse({error:"failed to fetch token",message:tokenResponse.status});
                    return
                }
                const tokenJson = await tokenResponse.json();
                console.log("tokenJson", tokenJson);
                const catalogResponse = await fetch(`https://${hostname}/v2/_catalog`,
                {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${tokenJson.token}`,
                        }
                    }
                )
                console.log(catalogResponse)
                if (!catalogResponse.ok) {
                    sendResponse({error:"failed to fetch catalog",message:catalogResponse.status});
                    return
                }
                const catalogJson = await catalogResponse.json();
                const result = []
                console.log("catalogJson", catalogJson.repositories);
                for(let i = 0; i< catalogJson.repositories.length -1; i++) {
                    const tokenResponse = await fetch(`https://auth.sakuracr.jp/token/?service=${hostname}&scope=repository:${catalogJson.repositories[i]}:*`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Basic " + btoa(`${username}:${password}`)
                            }
                        }
                    )
                    if(!tokenResponse.ok) {
                        sendResponse({error:"failed to fetch token",message:tokenResponse.status});
                        return
                    }
                    const tokenJson = await tokenResponse.json();
                    console.log("tokenJson", tokenJson);
                    const tagResponse = await fetch(`https://${hostname}/v2/${catalogJson.repositories[i]}/tags/list`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${tokenJson.token}`,
                            }
                        }
                    )
                    console.log(tagResponse)
                    const tagJson = await tagResponse.json();
                    for(let j = 0;j < tagJson.tags.length; j++) {
                        result.push(`${hostname}/${catalogJson.repositories[i]}:${tagJson.tags[j]}`)
                    }
                    console.log(tagJson)
                }
                catalogJson.repositories.forEach(catalog => async () => {

                })
                console.log(catalogJson);
                sendResponse({ok:true,result: result});
            }catch(err) {
                console.error(err);
                sendResponse({error:"exception",message:String(err)})
            }
        })();
        return true;
    }
});