// This selects all links EXCEPT those in the sidebar
document.querySelectorAll('a:not(.sidebar a)').forEach(link => {
    link.setAttribute('target', '_blank');
});

function updateVideo() {
    let videoFrame = document.getElementById("videoFrame");
    let songSelector = document.getElementById("songSelector");
    let selectedVideoId = songSelector.value;

    // Update iframe src with the new video ID
    videoFrame.src = `https://www.youtube.com/embed/${selectedVideoId}`;
}