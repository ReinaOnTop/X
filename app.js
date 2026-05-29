const socket = io("http://localhost:3000");

const joinScreen = document.getElementById("joinScreen");
const chatScreen = document.getElementById("chatScreen");

const joinBtn = document.getElementById("joinBtn");
const sendBtn = document.getElementById("sendBtn");

const messages = document.getElementById("messages");

let userName = "";
let roomCode = "";

joinBtn.addEventListener("click", () => {

    userName = document.getElementById("name").value;
    roomCode = document.getElementById("room").value;

    if (!userName || !roomCode) {
        return alert("Fill everything");
    }

    socket.emit("join-room", {
        room: roomCode,
        name: userName
    });

});

socket.on("room-full", () => {
    alert("Room is full");
});

socket.on("room-users", () => {

    joinScreen.classList.add("hidden");
    chatScreen.classList.remove("hidden");

});

sendBtn.addEventListener("click", () => {

    const text = document.getElementById("messageInput").value;

    const imageInput = document.getElementById("imageInput");

    const file = imageInput.files[0];

    if (file) {

        const reader = new FileReader();

        reader.onload = () => {

            socket.emit("send-message", {
                name: userName,
                text,
                image: reader.result
            });

        };

        reader.readAsDataURL(file);

    } else {

        socket.emit("send-message", {
            name: userName,
            text
        });

    }

    document.getElementById("messageInput").value = "";
    imageInput.value = "";

});

socket.on("receive-message", (data) => {

    const div = document.createElement("div");

    div.classList.add("message");

    div.innerHTML = `
        <strong>${data.name}</strong>
        <p>${data.text || ""}</p>
        ${
            data.image
            ? `<img src="${data.image}">`
            : ""
        }
    `;

    messages.appendChild(div);

    messages.scrollTop = messages.scrollHeight;

});
