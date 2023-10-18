// Função para iniciar o jogo
function startGame() {
  //substitui o botão Iniciar jogo por uma contagem regressiva e dps cria um botao para chamar a promisse player
  const gameContainer = document.getElementById("game-container");
  const startButton = document.getElementById("start-game");
  const playerButton = document.getElementById("play-music");
  const lblResposta = document.getElementById("lbl-resposta");
  const resposta = document.getElementById("resposta");
  const btnResposta = document.getElementById("btn-resposta");
  startButton.remove();
  const countdown = document.createElement("h1");
  countdown.innerText = "";
  gameContainer.appendChild(countdown);
  setTimeout(() => {
    countdown.innerText = "";
    setTimeout(() => {
      countdown.innerText = "";
      setTimeout(() => {
        countdown.remove();
        playerButton.classList.remove("hidden");
        resposta.classList.remove("hidden");
        lblResposta.classList.remove("hidden");
        btnResposta.classList.remove("hidden");  

      }, 1300);
    }, 1300);
  }, 1300);
}
let player;
let trackName;

window.onSpotifyWebPlaybackSDKReady = () => {
  //Trocar o token abaixo a cada hora, precisa estar logado, através do link https://developer.spotify.com/documentation/web-playback-sdk/tutorials/getting-started 
  const token ="BQDBFbKPJ_5QPaxDWxQrRH82asyIQI2oLciWDhiHmF-XkFAVLqhx9vmdqf7CzgX5I-QmJQzZaZ8WeTmCKWN7F6YEutHCmI9_m6Cs5iKFtzYtNE2DI7eL2yMtvCI3LlbmX8zRS88wEWXdRJLtWS79dlqDuVh3gvdD88DFcaBiwRMg_Mg2b36x-tlxWWoPTvd23DkUSX7HdVtF0NpJ1Mhc0H9Z"
    player = new Spotify.Player({
    name: "Web Playback SDK Quick Start Player",
    getOAuthToken: (cb) => {
      cb(token);
    },
    volume: 0.5,
  });
  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
    const connect_to_device = () => {
      let album_uri = "spotify:playlist:0F5kWsnZ31YzTHGq4Xicc9"
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
        method: "PUT",
        body: JSON.stringify({
          context_uri: album_uri,
          play: false,
        }),
        headers: new Headers({
            "Authorization": "Bearer " + token,
        }),
    }).then(response => console.log(response))
    .then(data => {
      // Adicionar listener para o evento de mudança de estado de reprodução
      player.addListener('player_state_changed', ({
        track_window
      }) => {
        trackName = track_window.current_track.name;
        trackName = trackName.toLowerCase();
        console.log('Current Track:', trackName);
      });})}
    connect_to_device();
  });

//botão play music para tocar a musica por 13 segundos
document.getElementById("play-music").addEventListener('click',() => {
  player.connect();
  player.togglePlay();
    setTimeout(() => {
      player.pause();
    }, 13000);
    player.connect();  

  });
  
  const pontos = 0;
//botão resposta para verificar se a resposta está correta apagar a resposta e mudar a musica do play-music para a proxima
 document.getElementById("btn-resposta").addEventListener('click',(event) => {
  event.preventDefault();
  let resposta = document.getElementById("resposta").value;
  resposta = resposta.toLowerCase();
  if (resposta == trackName) {
    alert("Você Acertou, Parabéns!");
    pontos = pontos + 10;
    document.getElementById("resposta").value = "";
        player.nextTrack();
        setTimeout(() => {
        player.pause();
        }, 1300);
      } else {
        alert("Você errou, tente novamente!");
        pontos = pontos - 5;
      }
    });
  player.connect();  
};
