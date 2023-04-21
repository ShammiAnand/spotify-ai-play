import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import { Configuration, OpenAIApi } from "openai";

function Home({ token }) {
  const [inputValue, setInputValue] = useState("");
  const [generatedSongs, setGeneratedSongs] = useState([]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleButtonClick = () => {
    const prompt = `Pretend you have great taste in music. Generate 5 similar songs including artist, title, and release year.: ${inputValue}`;

    console.log("prompt", prompt);

    const configuration = new Configuration({
      apiKey: "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",
    });

    const openai = new OpenAIApi(configuration);

    if (inputValue) {
      openai
        .createCompletion({
          model: "text-davinci-002",
          prompt,
          temperature: 0.7,
          maxTokens: 50,
          n: 5,
        })
        .then((response) => {
          const songs = response.choices.map((choice) => {
            return {
              artist: choice.text.split(" - ")[0],
              title: choice.text.split(" - ")[1],
              releaseYear: choice.text.split("(")[1].split(")")[0],
              trackID: choice.text.split(" ")[0],
            };
          });
          console.log("generated_songs", songs);
          setGeneratedSongs(songs);
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="Home">
      <textarea
        cols="30"
        rows="10"
        value={inputValue}
        onChange={handleInputChange}
      />
      <button className="GenerateSongsButton" onClick={handleButtonClick}>
        Generate Songs
      </button>
      <div className="GeneratedSongs">
        {generatedSongs.map((song, index) => (
          <div key={index}>
            {song.title} by {song.artist} ({song.releaseYear})
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
