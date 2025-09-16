const frases = [
  "Then I had this interaction I've been thinkin' 'bout for like five weeks ",
  "If the sun refused to shine, baby, would I still be your lover? ",
  "If the moon went dark tonight and if it all ended tomorrow, would I be the one on your mind? ",
  "Boy, just turn the music up ",
  "One more sleepless night ",
  "I don't wanna fuck with your head ",
  "But you didn't even try, when you finally did, it was at the wrong time ",
  "When we're all born, Saturn's somewhere ",
  'Saturn comes along and hits you over the head, and says, "Wake up” ',
  "It's time for you to get real about life and sort out who you really are ",
  "I don't care what people say, we both know I couldn't change you ",
  "I've never seen someone lie like you do ",
  "So now we play our separate scenes ",
  "I'll be the first to say, \"I'm sorry” ",
  "You're just my eternal sunshine ",
  "I'd rather forget than know, know for sure, What we could've fought through behind this door ",
  "You're just my eternal sunshine ",
  "This love's possessin' me, but I don't mind at all ",
  "Don't want nobody else around me, just need you right here ",
  "You're like the only thing that I see, It's crystal-clear ",
  "It's like supernatural ",
  "Need your hands all up on my body, like the moon needs thе stars ",
  "Boy, let's go too far ",
  "This is a true story about all the lies ",
  "This is a true story about all the games I know you play ",
  "But I'll play whatever part you need me to ",
  "Somethin' about him is made for somebody like me ",
  "And God knows I'm tryin', but there's just no use in denying ",
  "The boy is mine ",
  "The stars, they aligned ",
  "There's gotta be a reason why ",
  "Well, everybody's tired, and healin' from somebody ",
  "Yes, and? ",
  "I didn't think you'd understand me, how could you ever even try? ",
  "Just wanna let this story die, and I'll be alright ",
  "We can't be friends ",
  "Wait for your love ",
  "Me and my truth, we sit in silence ",
  "I don't like how you paint me, yet I'm still here hanging ",
  "I'll wait for your love ",
  "Hoping life brings you no new pain ",
  "I rearrange my memories ",
  "But no matter how I try to ",
  "And no matter how I want to ",
  "And no matter how easy things could be if I did ",
  "And no matter how guilty I still feel saying it ",
  "I wish I hated you ",
  "Wish there was worse to you ",
  "Just two different endings, you learn to repair ",
  "So close and yet so far, If only we had known from the start ",
  "But I'll hold your hurt in the box here beside me ",
  "How could we know, We'd rearrange all the cosmos? ",
  "We crashed and we burned ",
  "Imperfect for you ",
  "But I'm not like that since I met you ",
  "Let's go tonight 'causе there's just a few sеconds left 'til tomorrow ",
  "We have all that we need ",
  "How could we know that this was a happy disaster? ",
  "I'm glad we crashed and burned ",
  "Hypothetically, we could do anything that we like ",
  "We could hang out at the Louvre all night if you want to ",
  "No ordinary things with you ",
  "Would you still be here pretending you still like me? ",
  "I broke your heart because you broke mine ",
  "I wish I could un-need ya, so I did ",
  "Did I dream the whole thing? ",
  "Was I just a nightmare? ",
  "Stuck in the twilight zone ",
  "And it's not like I'm still not over you ",
  "It's so strange, this I never do ",
  "Not that I miss you, I don't ",
  "Sometimes, I just can't believe you happened ",
  "It's not like I'd ever change a thing ",
  "'Cause I'm right here where I'm meant to be ",
  "Not that I'd call you, I won't ",
  "Sometimes, I just can't believe you happened ",
  "Were we just mistaken? ",
  "Why do I still protect you? ",
  "Pretend these songs aren't about you ",
  "If you dare, meet me there ",
  "But it's warmer in your arms ",
  "Will you love me like it's truе? Am I just on your to-do-list? ",
  "These other boys, they're one and the same ",
  "I'm tryna say I want you to stay ",
  "I got what you need ",
  "You can get anything you'd like ",
  "Boy, just don't blow this, got me like, \"What's your wish list?” ",
  "'Cause, boy, come what may, I'm here on my knees ",
  "So just leave it here with me, let's get dirty ",
  "Woke up with a ghost by my side ",
  "Kissed by the passing of time ",
  "A moth to a flame, I didn't think, I just flew ",
  "Rhythms of the night consume my body ",
  "Just let the music confiscate my soul ",
  "Well, maybe I'm the stranger after all ",
  "Always wondered what would happen if I let you lose me ",
  "Always wondered what would happen if I let myself need more ",
  "Now I'm fine to leave you in a past life ",
  "Phased me just like the moon ",
  "You think I'm lost, but that's just how you found me ",
  "Well, maybe I'm the stranger after all ",
  "Threw away my reputation, but saved us more heartache ",
  "Yes, I know it seems fucked up and you're right ",
  "But I find something sweet in your peculiar behavior ",
  "'Cause I think to be so dumb must be nice ",
  "What's wrong with a little bit of poison? ",
  "I would rather feel everything than nothing every time ",
  "I'd rather be seen and alive than dying by your point of view ",
  "I don't remember too much of the last year but I knew who I was when I got here ",
  "I can’t imagine wanting so badly to be right ",
  "Guess I'm forever on your mind ",
];

// helper: garante que existe um wrapper .quotes-background dentro do #app-content
function getQuotesContainer() {
  const app = document.getElementById("app-content");
  if (!app) return document.body; // fallback

  let container = app.querySelector(".quotes-background");
  if (!container) {
    container = document.createElement("div");
    container.className = "quotes-background";
    app.insertBefore(container, app.firstChild); // fica atrás do login
  }

  // estilos mínimos
  container.style.position = "absolute";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.overflow = "hidden";
  container.style.zIndex = "1"; // atrás do login
  return container;
}

function criarFrase() {
  const container = getQuotesContainer();

  const texto = frases[Math.floor(Math.random() * frases.length)];
  const frase = document.createElement("div");
  frase.className = "phrase";
  frase.textContent = ""; // começa vazio

  // profundidade simulada (mais longe = menor + transparente)
  const depthLevel = Math.random(); // 0 = longe, 1 = perto
  const fontSize = 40 + Math.floor(depthLevel * 40); // 30px a 70px
  const opacity = 0.4 + depthLevel * 0.6; // 0.4 a 1.0

  frase.style.fontSize = fontSize + "px";
  frase.style.opacity = opacity;

  container.appendChild(frase);

  // medir largura
  frase.style.visibility = "hidden";
  frase.textContent = texto;
  let fraseWidth = frase.getBoundingClientRect().width;
  const containerWidth = container.clientWidth;
  const margin = 16;

  let currentFontSize = fontSize;
  while (fraseWidth > containerWidth - 2 * margin && currentFontSize > 12) {
    currentFontSize -= 2; // reduz gradualmente
    frase.style.fontSize = currentFontSize + "px";
    fraseWidth = frase.getBoundingClientRect().width;
  }

  frase.textContent = "";
  frase.style.visibility = "visible";

  // posição aleatória
  const maxLeft = Math.max(containerWidth - fraseWidth - margin, 0);
  frase.style.left = Math.round(margin + Math.random() * maxLeft) + "px";

  const containerHeight = container.clientHeight;
  const maxTop = Math.max(containerHeight - fontSize - margin, 0);
  frase.style.top = Math.round(margin + Math.random() * maxTop) + "px";

  // escrita letra a letra
  let index = 0;
  let lastTime = null;
  const baseMs = 90;
  const variability = 10;

  function escrever(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const delta = timestamp - lastTime;

    if (!frase._nextDelay) {
      frase._nextDelay = baseMs + Math.random() * variability;
    }

    if (delta >= frase._nextDelay) {
      frase.textContent += texto[index];
      index++;
      lastTime = timestamp;
      frase._nextDelay = baseMs + Math.random() * variability;
    }

    if (index < texto.length) {
      requestAnimationFrame(escrever);
    } else {
      delete frase._nextDelay;
      setTimeout(() => {
        frase.style.transition = "opacity 5s ease";
        frase.style.opacity = "0";
        setTimeout(() => frase.remove(), 5000);
      }, 600);
    }
  }

  requestAnimationFrame(escrever);
}

setInterval(criarFrase, 2000);

/*
const quotesBg = document.querySelector(".quotes-background");
let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;

document.addEventListener("mousemove", (e) => {
  targetX = (window.innerWidth / 2 - e.clientX) / 40;
  targetY = (window.innerHeight / 2 - e.clientY) / 40;
});

function animateBg() {
  currentX += (targetX - currentX) * 0.010; // suavidade
  currentY += (targetY - currentY) * 0.010;
  
  quotesBg.style.transform = `rotateY(${currentX}deg) rotateX(${currentY}deg)`;
  
  requestAnimationFrame(animateBg);
}

requestAnimationFrame(animateBg);
*/
