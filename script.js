const lastfm_username = "erdempro"
const lastfm_apikey = "a4d9e1faeba3226927c76ccf9d5316da"
let content = document.getElementById("statustext");

function fetchtrack(){
    fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastfm_username}&api_key=${lastfm_apikey}&format=json`).then(response => response.json()).then(e => {
    if(e["recenttracks"]){
        if (!e.recenttracks.track[0]["@attr"]){
            content.innerText = "i'm not listening to anything right now"
            content.href = "https://www.last.fm/user/erdempro"
            return;
        }
        content.innerText = `${e.recenttracks.track[0].name} - ${e.recenttracks.track[0].artist["#text"]}`
        content.href = e.recenttracks.track[0].url
    }else{
        content.innerText = `last track listened to could not be fetched from last.fm`
    }
})
}

fetchtrack()
setInterval(fetchtrack, 4000);