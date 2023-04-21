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
    fetchSongs();
  };

  const fetchSongs = async () => {
    const prompt = `Pretend you have great taste in music. Generate 5 similar songs including artist, title, and release year: ${inputValue}`;

    console.log("prompt", prompt);

    const configuration = new Configuration({
      apiKey: "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",
    });

    const openai = new OpenAIApi(configuration);
    const completion = await openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `${prompt}` }],
      })
      .then((response) => {
        console.log("response", response);
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

        if (parsedSongs.length) setGeneratedSongs(parsedSongs);
      });
  };

  useEffect(() => {
    console.log("generatedSongs", generatedSongs);
  }, [generatedSongs]);

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
      {generatedSongs.length > 0 && (
        <div className="GeneratedSongs">
          {generatedSongs.map((song, index) => (
            <div key={index} className="song">
              {song.title} by {song.artist} - {song.releaseDate}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
