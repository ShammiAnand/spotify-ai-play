import React from "react";
import "../styles/SongRow.css";
import { Typography } from "@mui/material";

function SongRow({ track }) {
  return (
    <div className="songRow">
      <img className="songRow__album" src={track.album.images[0].url} alt="" />
      <div className="songRow__info">
        <Typography
          sx={{
            fontWeight: "bold",
          }}
        >
          {track.name}
        </Typography>
        <Typography>
          {track.artists.map((artist) => artist.name).join(", ")} -{" "}
          {track.album.name}
        </Typography>
      </div>
    </div>
  );
}

export default SongRow;
