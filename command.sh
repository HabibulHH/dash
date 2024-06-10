ffmpeg -i video.mp4 -map 0 -b:v 2400k -s:v 1920x1080 -c:v libx264 -an -f dash video/video.mpd
 

 ffmpeg -i video.mp4 \
-map 0 \
-b:v 2400k \
-s:v 1920x1080 \
-c:v libx264 \
-an \
-f dash \
-seg_duration 4 \          # Sets segment duration to 4 seconds
-video_chunk_duration 4 \  # Sets the chunk duration for video segments
-init_seg_name init-\$RepresentationID\$.m4s \
-media_seg_name chunk-\$RepresentationID\$-\$Number%05d\$.m4s \
video/video.mpd
