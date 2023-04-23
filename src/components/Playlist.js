import React, { useState, useEffect } from "react";
// import { makeStyles } from "@mui/styles";
// import Modal from "@material-ui/core/Modal";
import {
  Modal,
  Button,
  CircularProgress,
  Fade,
  Backdrop,
  Paper,
  Typography,
  Box,
  Input,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { createPlaylist } from "../auth.js";
import SongRow from "./SongRow.js";

function Playlist({ token, songs }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [trackIds, setTrackIds] = useState([]);
  const [playlistCreated, setPlaylistCreated] = useState(false);
  const [tracks, setTracks] = useState([]);

  const handleOpen = () => {
    setOpen(true);
    setPlaylistCreated(true);
    fetchSongs();
  };

  const handleClose = () => {
    setOpen(false);
    setLoading(false);
    setPlaylistName("");
    setPlaylistDescription("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    const response = await createPlaylist(
      token,
      playlistName,
      playlistDescription,
      trackIds
    );
    console.log("response\n", response);

    if (response.status === 201 || response.status === 200) {
      setPlaylistCreated(true);
    }
    handleClose();
  };

  const fetchSongs = async () => {
    setLoading(true);
    console.log("songs\n", songs);

    // filter out songs that are null or undefined
    songs = songs.filter((song) => song !== null && song !== undefined);

    // Perform fetches for each song and update `songs` with the track objects
    const _tracks = await Promise.all(
      songs.map(async (song) => {
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=track:${song.title}%20artist:${song.artist}&type=track`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        console.log(`song ${song.title}`, data);
        return data.tracks.items.length > 0 ? data.tracks.items[0] : null;
      })
    );
    setLoading(false);
    // remove null values from tracks
    _tracks.filter((track) => track !== null && track !== undefined);
    console.log("tracks\n", _tracks);
    setTracks(_tracks);
    setTrackIds(_tracks.map((track) => track.id));
    // return tracks;
  };

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleOpen}
        disabled={playlistCreated}
      >
        {`${playlistCreated ? "Playlist Created" : "Create Playlist"}`}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "auto",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: ["90%", "50%", "50%"],
            height: "auto",
            minHeight: "50%",
            padding: "1rem",
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <Box>
              <Typography variant="h2">Create Playlist</Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  my: "1rem",
                }}
              >
                <TextField
                  required
                  id="outlined-basic"
                  label="Playlist Name"
                  variant="outlined"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                />
                <TextField
                  required
                  id="outlined-basic"
                  label="Playlist Description"
                  variant="outlined"
                  value={playlistDescription}
                  onChange={(e) => setPlaylistDescription(e.target.value)}
                />
              </Box>
              <Box>
                {tracks.map((track) => (
                  <SongRow track={track} />
                ))}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  sx={{ mb: "1rem" }}
                >
                  Create
                </Button>
                <Button
                  variant="contained"
                  onClick={handleClose}
                  sx={{
                    backgroundColor: "red",
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Modal>
    </>
  );
}

export default Playlist;
