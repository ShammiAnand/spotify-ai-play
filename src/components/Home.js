import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import { Configuration, OpenAIApi } from "openai";
import Playlist from "./Playlist";
import { Box, Button, Typography } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";

function Home({ token }) {
  const [inputValue, setInputValue] = useState("");
  const [generatedSongs, setGeneratedSongs] = useState([]);
  const [clicked, setClicked] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleButtonClick = () => {
    if (!clicked) {
      setClicked(true);
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
    Your task is to generate 10 similar songs based on the below songs.
    Output format: <song number>. "<song title>" by <artist> (<release year>).\n
    ${inputValue}`;

    // console.log("prompt\n", prompt);

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
        // console.log("response\n", response);
        // console.log("answer\n", response.data.choices[0].message.content);
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <QueueMusicIcon
          sx={{
            fontSize: "2rem",
            color: "white",
          }}
        />
        <Typography
          sx={{
            fontSize: "1rem",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Playlist.AI by Shammi
        </Typography>
      </Box>
      <Box
        sx={{
          width: "100vw",
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "30vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            mb: "2rem",
          }}
        >
          <TextField
            id="outlined-multiline-flexible"
            label="Playlist AI"
            multiline
            maxRows={10}
            value={inputValue}
            onChange={handleInputChange}
            placeholder="let us know some of your favorite songs and we'll generate some similar ones for you!"
            sx={{
              // width for mobile, tablet, desktop
              width: "[90%, 70%, 50%]",
              width: "75%",
              color: "white",
              // backgroundColor: "white",
              // borderRadius: "15px",
            }}
            InputLabelProps={{
              style: {
                color: "orange",
                fontWeight: "bold",
              },
            }}
          />
        </Box>
        <Box
          sx={{
            width: "[90%, 70%, 50%]",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: "2rem",
          }}
        >
          <LoadingButton
            variant="contained"
            sx={{
              backgroundColor: "black",
              color: "white",
              borderRadius: "15px",
              mr: "2rem",
            }}
            onClick={handleButtonClick}
            // stop loading after 10 seconds
            loading={clicked}
          >
            {" "}
            Generate Songs
          </LoadingButton>
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
              // mt: "2rem",
            }}
            onClick={() => {
              window.location.reload();
            }}
          >
            <ExitToAppIcon />
          </Button>
        </Box>
        <Box>
          {generatedSongs.length > 0 && (
            <Playlist token={token} songs={generatedSongs} />
          )}
        </Box>
      </Box>
    </div>
  );
}

export default Home;
