let content = document.getElementById("statustext");
    let icon = document.getElementById("statusicon");
    // fa-brands fa-spotify
    // fa-solid fa-gamepad
    let webSocket = new WebSocket("wss://api.lanyard.rest/socket");
    let discordID = "889937921073881138";
    
    fetch("https://api.lanyard.rest/v1/users/"+discordID).then(response => response.json()).then(e => {
        /**
         * if(e.data["discord_user"]){
         * document.getElementById("avatar").src = `https://cdn.discordapp.com/avatars/${discordID}/${e.data["discord_user"].avatar}.png?size=4096`
        }
        **/

        if(e.data["listening_to_spotify"]){
            content.innerText = `${e.data.spotify.song} - ${e.data.spotify.artist}`;
            content.href = `https://open.spotify.com/track/${e.data.spotify.track_id}`;

        }else if(e.data["activities"].length > 0){
            icon.className="fa-solid fa-gamepad";
            content.innerText = `Playing ${e.data["activities"][0].name}`;
        }
    });

    
    webSocket.addEventListener('message', (event) => {
        data = JSON.parse(event.data)
        console.log(data)

        if(event.data == "{\"op\":1,\"d\":{\"heartbeat_interval\":30000}}"){
            webSocket.send(JSON.stringify({
                op: 2,
                d: {
                    subscribe_to_id: discordID
                }
            }))
            setInterval(() => {
                webSocket.send(JSON.stringify({
                    op: 3,
                    d: {
                        heartbeat_interval: 30000
                    }
                }))

            }, 30000)
        }
        if(data.t == "PRESENCE_UPDATE"){
            if(data.d.spotify){
                icon.className="fa-brands fa-spotify";
                content.innerText = `${data.d.spotify.song} - ${data.d.spotify.artist}`;
                content.href = `https://open.spotify.com/track/${data.d.spotify.track_id}`;

            }else if(data.d.activities.length > 0){
                icon.className="fa-solid fa-gamepad";
                content.innerText = `Playing ${data.d.activities[0].name}`;
                content.href = "";
            }else{
                icon.className="fa-brands fa-spotify";
                content.innerText = `i'm not listening to anything right now`;
                content.href = "";
            }
        }
        
    })