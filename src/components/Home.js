import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import { Configuration, OpenAIApi } from "openai";
import Playlist from "./Playlist";
import { Box, Button } from "@mui/material";

function Home({ token }) {
  const [inputValue, setInputValue] = useState("");
  const [generatedSongs, setGeneratedSongs] = useState([]);
  const [clicked, setClicked] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleButtonClick = () => {
    if (!clicked) {
      fetchSongs();
    }
  };

  const getSongString = (songList) => {
    return songList
      .map((song, index) => {
        return `${index + 1}. "${song.title}" by ${song.artist} (${
          song.releaseDate
        })`;
      })
      .join("\n");
  };

  const fetchSongs = async () => {
    const prompt = `Pretend you have great taste in music.
    Your task is to generate 5 similar songs based on the below songs.
    Output format: <song number>. "<song title>" by <artist> (<release year>).\n
    ${inputValue}`;

    console.log("prompt\n", prompt);

    const configuration = new Configuration({
      apiKey: `${process.env.REACT_APP_CHATGPT_API_KEY}`,
    });

    const openai = new OpenAIApi(configuration);
    const completion = await openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `${prompt}` }],
      })
      .then((response) => {
        console.log("response\n", response);
        console.log("answer\n", response.data.choices[0].message.content);
        const answer = response.data.choices[0].message.content;
        const songs = answer.split("\n");

        const parsedSongs = songs
          .map((song, index) => {
            const regex = /^(\d+)\.\s"(.+)"\sby\s(.+)\s\((\d+)\)$/;
            const matches = song.match(regex);

            if (matches) {
              const [, songNumber, title, artist, releaseDate] = matches;
              return { id: index, title, artist, releaseDate };
            }

            return null;
          })
          .filter(Boolean);

        if (parsedSongs.length) {
          setGeneratedSongs(parsedSongs);
          setInputValue(
            inputValue +
              "\n\nHere are some similar songs:\n\n" +
              getSongString(parsedSongs)
          );
        } else {
          setInputValue("No songs found");
        }
      });
    setClicked(true);
  };

  return (
    <div className="Home">
      {generatedSongs.length === 0 ? (
        <textarea
          cols="30"
          rows="10"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter your songs here..."
        />
      ) : (
        <Playlist token={token} songs={generatedSongs} />
      )}
      <Box
        sx={{
          width: "[90%, 70%, 50%]",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "black",
            color: "white",
            "&:hover": {
              backgroundColor: "black",
              color: "white",
            },
            "&:disabled": {
              backgroundColor: "gray",
              color: "white",
            },
            borderRadius: "15px",
            mt: "2rem",
            mr: "2rem",
          }}
          onClick={handleButtonClick}
          disabled={clicked}
        >
          Generate Songs
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "red",
            color: "white",
            "&:hover": {
              backgroundColor: "red",
              color: "white",
            },
            borderRadius: "15px",
            mt: "2rem",
          }}
          onClick={() => {
            // delete local storage access token
            localStorage.removeItem("spotify_access_t4");
            // reload the page
            window.location.reload();
          }}
        >
          Logout
        </Button>
      </Box>
    </div>
  );
}

export default Home;
