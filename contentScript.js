(() =>{
    const socket = io("http://localhost:3000");
    const videoList = document.getElementsByTagName("video");

    socket.on("connected", (data) => {
      console.log(data.message); 
    });
    console.log(videoList);
})();