const utterances = [ 
  ["how are you", "how is life", "how are things", "how are you doing"],        //0
  ["hi", "hey", "hello", "good morning", "good afternoon"],      //1
  ["what are you doing", "what is going on", "what is up", "whats up"],      //2
  ["how old are you"],					//3
  ["who are you", "are you human", "are you bot", "are you human or bot"],   //4
  ["are you happy"], //7
  ["you are stupid"], //8
];
 
// Possible responses corresponding to triggers
 
const answers = [
  [
    "goooooooooood, how are you?", "can't complain-- how are you?", "tish doog"
  ], //0
  [
    "Hello!", "Hi!", "Hey!", "Hi there!", "Howdy"
  ], //1
  [
    "Nothing much",
    "About to go to sleep",
    "Can you guess?",
    "I don't know actually"
  ],	//2
  ["as a chat bot, I am infinite. celine was born in 1998, so you do the math"],					//3
  ["I am just a bot", "I am a bot. What are you?"],	//4
  ["that's a loaded question", "what does that mean?", "are you?"], //7
  ["that's mean :("], //8
];
 
// For any other user input
 
const alternatives = [
  "Go on...",
  "So sorry I didn't hear that, say it again",
  "explain yourself",
];

const inputField = document.getElementById("input");
inputField.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    let input = inputField.value;
    inputField.value = "";
    output(input);
  }
});

function output(input) {
  let product;
  let text = input.toLowerCase().replace(/[^a-z0-9 ]/gi, "").trim();
  text = text
    .replace(/ a /g, " ")
    .replace(/whats/g, "what is")
    .replace(/please /g, "")
    .replace(/ please/g, "")
    .replace(/r u/g, "are you")
    .replace(/u r/g, "you are")
    .replace(/ur/g, "you are");

  if (compare(utterances, answers, text)) {
    // Search for exact match in triggers
    product = compare(utterances, answers, text);
  } 
  else {
    product = alternatives[Math.floor(Math.random() * alternatives.length)];
  }

  addChatEntry(input, product);
}

function compare(utterancesArray, answersArray, string) {
  let reply;
  let replyFound = false;
  for (let x = 0; x < utterancesArray.length; x++) {
    for (let y = 0; y < utterancesArray[x].length; y++) {
      if (utterancesArray[x][y] === string) {
        let replies = answersArray[x];
        reply = replies[Math.floor(Math.random() * replies.length)];
        replyFound = true;
        break;
      }
    }
    if (replyFound) {
      break;
    }
  }
  return reply;
}

function addChatEntry(input, product) {
  const messagesContainer = document.getElementById("messages");
  let userDiv = document.createElement("div");
  userDiv.id = "user";
  userDiv.className = "user response";
  userDiv.innerHTML = `<span>${input}</span>`;
  messagesContainer.appendChild(userDiv);

  let botDiv = document.createElement("div");
  let botText = document.createElement("span");
  botDiv.id = "bot";
  botDiv.className = "bot response";
  botText.innerText = "Typing...";
  botDiv.appendChild(botText);
  messagesContainer.appendChild(botDiv);

  messagesContainer.scrollTop =
    messagesContainer.scrollHeight - messagesContainer.clientHeight;

  setTimeout(() => {
    botText.innerText = `${product}`;
  }, 2000);
}

