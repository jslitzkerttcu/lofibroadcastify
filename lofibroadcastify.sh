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
function set_volume() {
    local SOCKET=$1
    local VOL=$2
    echo "set_property volume $VOL" | socat - UNIX-CONNECT:"$SOCKET"
}

[[ "${1:-}" == "update" ]] && updateinfo
echo "Playing: lo-fi playlist" >&2
mpv --input-ipc-server=/tmp/mpvsocket1 --no-ytdl --no-video --shuffle --loop-playlist $LOFI_MP3 --volume=50 > /dev/null 2>&1 & PID1=$!
echo "Playing: Joe's Broadcastify Stream" >&2
mpv --input-ipc-server=/tmp/mpvsocket2 --no-video --loop "http://broadcastify.cdnstream1.com/39207" --volume=50 > /dev/null 2>&1 & PID2=$!
sleep 1
set_volume /tmp/mpvsocket1 10
set_volume /tmp/mpvsocket2 100
echo "Enter volume levels for each stream in the format lofi=VOLUME1,radio=VOLUME2 (0-100) or q to quit"
while true; do
    read -p "> " input
    if [[ "$input" == "q" ]]; then
        cleanup
    elif [[ "$input" =~ ^lofi=([0-9]+),radio=([0-9]+)$ ]]; then
        vol1=${BASH_REMATCH[1]}
        vol2=${BASH_REMATCH[2]}
        if [[ "$vol1" -ge 0 && "$vol1" -le 100 && "$vol2" -ge 0 && "$vol2" -le 100 ]]; then
            echo "Setting volume: lo-fi=$vol1, radio=$vol2" >&2
            set_volume /tmp/mpvsocket1 $vol1
            set_volume /tmp/mpvsocket2 $vol2
        else
            echo "Invalid input. Enter volume levels in the format lofi=VOLUME1,radio=VOLUME2 (0-100), or q to quit" >&2
        fi
    else
        echo "Invalid input. Enter volume levels in the format lofi=VOLUME1,radio=VOLUME2 (0-100), or q to quit" >&2
    fi
done
