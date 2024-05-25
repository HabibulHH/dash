ffmpeg -i video.mp4 -map 0 -b:v 2400k -s:v 1920x1080 -c:v libx264 -an -f dash video/video.mpd
 