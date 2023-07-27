let content = document.getElementById("statustext");
let icon = document.getElementById("statusicon");
let webSocket = new WebSocket("wss://api.lanyard.rest/socket");
let discordID = "889937921073881138";

fetch(`https://api.lanyard.rest/v1/users/${discordID}`)
  .then((response) => response.json())
  .then((e) => {
    if (e.data["listening_to_spotify"]) {
      content.innerText = `${e.data.spotify.song} - ${e.data.spotify.artist}`;
      content.href = `https://open.spotify.com/track/${e.data.spotify.track_id}`;
    }
  });

webSocket.addEventListener("message", (event) => {
  data = JSON.parse(event.data);

  if (event.data == '{"op":1,"d":{"heartbeat_interval":30000}}') {
    webSocket.send(
      JSON.stringify({
        op: 2,
        d: {
          subscribe_to_id: discordID,
        },
      }),
    );
    setInterval(() => {
      webSocket.send(
        JSON.stringify({
          op: 3,
          d: {
            heartbeat_interval: 30000,
          },
        }),
      );
    }, 30000);
  }
  if (data.t == "PRESENCE_UPDATE") {
    if (data.d.spotify) {
      icon.className = "fa-brands fa-spotify";
      content.innerText = `${data.d.spotify.song} - ${data.d.spotify.artist}`;
      content.href = `https://open.spotify.com/track/${data.d.spotify.track_id}`;
    } else {
      icon.className = "fa-brands fa-spotify";
      content.innerText = `i'm not listening to anything right now`;
      content.href = "https://open.spotify.com/user/xxtvgl8ffahtg5s22hu1l7squ";
    }
  }
});
