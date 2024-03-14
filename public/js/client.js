"use strict";

/*const markUp = (item) =>
  `<div>
    <h2>${item.title}</h2>
    <p>${item.description}</p>
    <p>${item.cost}$</p>
    <button data-id=${item._id} class=${
    item.joined ? "joined-button" : "join-button"
  }>${item.joined ? "Joined" : "Join"}</button>
  </div>`;

async function fetchData() {
  try {
    const response = await fetch("/api/courses");
    const data = await response.json();
    displayData(data.offeredCourses);
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

function displayData(data) {
  const container = document.getElementById("courseAPI");
  data.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.innerHTML = markUp(item);
    container.appendChild(itemElement);
  });
  addJoinEventListener();
}

function addJoinEventListener() {
  let buttons = document.getElementsByClassName("join-button");

  for (const button of buttons) {
    button.addEventListener("click", async (e) => {
      const target = e.target;
      const courseId = target.getAttribute("data-id");

      try {
        const response = await fetch(`/api/courses/${courseId}/join`);
        const result = await response.json();
        console.log(result);
        if (result && result.success) {
          // Modify the button element on success
          target.textContent = "Joined";
          target.classList.add("joined-button");
          target.classList.remove("join-button");
        } else {
          // Modify the button element on failure
          target.textContent = "Try again";
        }
      } catch (err) {
        console.error(err);
      }
    });
  }
}
document.addEventListener("DOMContentLoaded", fetchData);*/

const socket = io();

const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatElement = document.getElementById("chatBox");
const senderId = document.getElementById("senderId");
const usName = document.getElementById("senderName");
const chatIcon = document.getElementsByClassName("chatIcon")[0];

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  socket.emit("message", {
    content: chatInput.value,
    userName: usName.value,
    user: senderId.value
  });
  chatInput.value = "";
  return false;
});

socket.on("message", (message) => {
  displayMessage(message);
});

socket.on("new message", () => {
  chatIcon.classList.add("flashTwice");
  setTimeout(() => {
    chatIcon.classList.remove("flashTwice");
  }, 2500);
});

socket.on("load all messages", (messages) => {
  messages.forEach((message) => {
    displayMessage(message);
  });
});

socket.on("user disconnected", () => {
  displayMessage({
    userName: "Notice",
    content: "user left the chat"
  });
});

const getCurrentUserClass = (id) => {
  let userId = senderId.value;
  return userId === id ? "currentUser" : "";
};

const currentUser = (id) => {
  let userId = senderId.value;
  return userId === id ? "hidden" : "";
};

const displayMessage = (message) => {
  console.log(message);
  const listItem = document.createElement("li");
  listItem.innerHTML = `<div class="message ${getCurrentUserClass(
    message.user
  )}">
   <span class="${currentUser(message.user)}">${
    message.userName
  }:</span> <b> ${message.content} </b>
  </div>`;
  chatElement.insertBefore(listItem, chatElement.firstChild);
};
