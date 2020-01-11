//All HTML stuff
const btn = document.querySelector(".talk");
const chatBoxElement = document.getElementById("chat-box");
const user = document.querySelector(".user");
const bot = document.querySelector(".bot");

var long;
var lat;
var temp, humid, currentSummary, uvindex, windspeed, location, dailySummary;

var userText = "";
var botText = "";
var para, node;
var weather = "";

//weather related stuff loaded in the beginning
window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      long = position.coords.longitude;
      lat = position.coords.latitude;
      const proxy = "https://cors-anywhere.herokuapp.com/";
      const api = `${proxy}https://api.darksky.net/forecast/a3c5b392bca13d466effc339af07f32e/${lat},${long}`;

      fetch(api)
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data);
          temp = data.currently.temperature;
          humid = data.currently.humidity;
          currentSummary = data.currently.summary;
          uvindex = data.currently.uvIndex;
          windspeed = data.currently.windSpeed;
          dailySummary = data.daily.summary;
          console.log(
            temp,
            humid,
            currentSummary,
            uvindex,
            windspeed,
            dailySummary
          );
        });
    });
  }
});

const greetings = [
  "I'm good. Thank you for asking.",
  "Hey! Just a little confused. My builder did not program me to answer so many questions.",
  "I'm upset. Siri, Alexa and Google Assistant are bullying me."
];

const creator = [
  "Adheesh Shenoy is my creator. He is still working on me.",
  "Adheesh Shenoy is my master. He is a computer science major.",
  "Nobody owns me or created me. I am a strong independent bot."
];

const thank = [
  "You're welcome.",
  "Bow down when talking to me, puny human.",
  "You owe me big time.",
  "Alright now take me back to area 51."
];

window.addEventListener("mouseover", () => {
  document.getElementById("intro").innerHTML =
    "Hello human! I am a simple bot created by Adheesh Shenoy. I am a work in progress so please be easy on me.";
});

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.onstart = function() {
  console.log("voice is activated");
};

recognition.onspeechend = function() {
  console.log("speech has ended");
};

recognition.onresult = function(event) {
  console.log(event);
  const current = event.resultIndex;
  console.log(current);
  const transcript = event.results[current][0].transcript;
  userText += transcript;
  insertUserText(userText);
  readOutLoud(userText);
  userText = "";
};

btn.addEventListener("click", () => {
  chatBoxElement.classList.add("chat-box");
  recognition.start();
  window.scrollBy(0, document.body.scrollHeight);
});

function readOutLoud(message) {
  const speech = new SpeechSynthesisUtterance();

  //Greetings
  if (
    message.includes("how are you") ||
    message.includes("how you doing") ||
    message.includes("whats up") ||
    message.includes("hello how are you") ||
    message.includes("are you doing today") ||
    message.includes("hello") ||
    message.includes("howdy") ||
    message.includes("hey") ||
    message.includes("what's up")
  ) {
    botText = greetings[Math.floor(Math.random() * greetings.length)];
    insertBotText(botText);
    speech.text = botText;
  }

  //Weather related responses
  else if (
    message.includes("temperature") ||
    message.includes("hot") ||
    message.includes("sunny") ||
    message.includes("sunscreen")
  ) {
    botText = "The outside temperature is " + temp + "°F.";
    if (temp >= 90) {
      botText += " Yup. Global warming is real!";
    }
    if (uvindex > 5) {
      botText +=
        " Also the UV index is " + uvindex + ". Better put on your sunscreen";
    } else if (uvindex < 5 && message.includes("sunscreen")) {
      botText += " The UV index is " + uvindex + ". You don't need sunscreen.";
    }
    insertBotText(botText);
    speech.text = botText;
  } else if (message.includes("weather")) {
    botText += "It looks like it's going to be " + currentSummary;
    insertBotText(botText);
    speech.text = botText;
  } else if (message.includes("humid")) {
    botText += "Humidity is about " + humid * 100 + "%";
    insertBotText(botText);
    speech.text = botText;
  } else if (message.includes("rain") || message.includes("umbrella")) {
    botText += "Humidity is about " + humid * 100 + "%.";
    if (dailySummary.includes("rain")) {
      botText +=
        " The forcast predicts " +
        dailySummary +
        ". I'd carry an umbrella if I were you.";
    } else {
      botText += " The forcast predicts " + dailySummary;
    }
    insertBotText(botText);
    speech.text = botText;
  } else if (
    message.includes("to snow") ||
    message.includes(" snowing") ||
    message.includes("jacket") ||
    message.includes("it cold")
  ) {
    botText += "Wind speed is about " + windspeed + " mph.";
    if (dailySummary.includes("snow") || temp <= 57) {
      botText +=
        " The forcast predicts " +
        dailySummary +
        ". I'd carry a jacket. It is freezing outside.";
    } else {
      botText +=
        " The outside temperature is " +
        temp +
        "°F. It won't snow, but it is chilly. So please grab a light jacket.";
    }
    insertBotText(botText);
    speech.text = botText;
  }

  //dumb responses
  else if (
    message.includes("your creator") ||
    message.includes("your father") ||
    message.includes("made you") ||
    message.includes("created")
  ) {
    botText += creator[Math.floor(Math.random() * creator.length)];
    insertBotText(botText);
    speech.text = botText;
  } else if (message.includes("how to") || message.includes("where")) {
    botText +=
      "I do not know the answer to this question! This is what google returned.";
    insertBotText(botText);
    speech.text = botText;
    window.open("http://google.com/search?q=" + message, "_blank");
  } else if (message.includes("thank")) {
    botText += thank[Math.floor(Math.random() * thank.length)];
    insertBotText(botText);
    speech.text = botText;
  } else {
    botText +=
      "Sorry, I am just a simple bot. I can only perform certain instructions. This is what a google search returned.";
    insertBotText(botText);
    speech.text = botText;
    window.open("http://google.com/search?q=" + message, "_blank");
  }
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;
  window.speechSynthesis.speak(speech);
  botText = "";
}

function insertUserText(userText) {
  para = document.createElement("p");
  para.textContent = userText;
  para.classList.add("user");
  chatBoxElement.appendChild(para);
}

function insertBotText(botText) {
  para = document.createElement("p");
  para.textContent = botText;
  para.classList.add("bot");
  chatBoxElement.appendChild(para);
}
