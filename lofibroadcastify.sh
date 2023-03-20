#!/bin/bash

LOFI_MP3=lofimp3.m3u

function cleanup() {
    echo "Cleaning up..." >&2
    pkill mpv
    exit
}

trap cleanup SIGINT

function updateinfo()
{
    echo "Updating stream information..." >&2

    CHUNK_URL="https://www.lofiatc.com$(curl https://www.lofiatc.com/ 2>/dev/null | grep -o '/static/js/main.[^.]\+.chunk.js')"

    # get mp3s as stored on lofiatc.com
    echo "mp3 URIs" >&2
    echo -e $(curl "$CHUNK_URL" 2>/dev/null) \
        | grep -o 'name:"[^"]\+",youtube' \
        | sed -e 's/name:"\([^"]\+\)",youtube/\1/' \
        | perl -MURI::Escape -wlne 'print uri_escape $_' \
        | sed -e 's/\(.*\)/https:\/\/www.lofiatc.com\/assets\/music\/\1.mp3/' \
        > $LOFI_MP3
    echo "DONE" >&2
}

[[ "${1:-}" == "update" ]] && updateinfo

echo "Playing: lo-fi playlist" >&2
mpv --no-ytdl --no-video --shuffle --loop-playlist $LOFI_MP3 & PID1=$!
echo "Playing: Joe's Broadcastify Stream" >&2
mpv --no-video --loop "http://broadcastify.cdnstream1.com/39207" & PID2=$!

wait $PID1 $PID2
