// https://developer.spotify.com/documentation/web-playback-sdk/quick-start/#
export const authEndpoint = "https://accounts.spotify.com/authorize";

// Replace with your app's client ID, redirect URI and desired scopes
// use cliend id from env

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
// use vercel for deployment
// make the redirectUri the deployed url

const redirectUri = "https://playlist-ai-zeta.vercel.app/";
// const redirectUriLocal = "http://localhost:3000/";

const scopes = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-read-playback-state",
  "user-top-read",
  "user-modify-playback-state",
  "user-library-modify",
  "playlist-modify-public",
  "playlist-modify-private",
];

export const getTokenFromResponse = () => {
  return window.location.hash
    .substring(1)
    .split("&")
    .reduce((initial, item) => {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);

      return initial;
    }, {});
};

export const createPlaylist = async (
  token,
  playlistName,
  playlistDescription,
  trackIds
) => {
  const userResponse = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const userData = await userResponse.json();
  const userId = userData.id;

  // console.log("user_fetched\n", userData);

  const playlistResponse = await fetch(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: playlistName,
        description: playlistDescription,
        public: false,
      }),
    }
  );
  const playlistData = await playlistResponse.json();
  const playlistId = playlistData.id;

  // console.log("playlist_fetched\n", playlistData);

  await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uris: trackIds.map((id) => `spotify:track:${id}`),
    }),
  });

  return playlistData;
};

export const accessUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
  "%20"
)}&response_type=token&show_dialog=true`;
