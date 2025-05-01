let glasset;
let ligevægt;
let posX;
let posY;
let temperatur;
let t;
let fontBold;
let tændt = true;


function setup() {
    temperatur = createSlider(10, 40, 25, 1); //Der laves en slider til temperaturen.
    temperatur.position(250,160);
    temperatur.size(300);

    posX = 200; 
    posY = windowHeight / 2 - 300;

    //posX og posY gemmes.

    c = createCanvas(windowWidth - 20, windowHeight - 20); //Canvas laves,
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    c.position(x, y);
    c.style("z-index: -1"); //Canvas flyttes bagud.

    ligevægt = new Ligevægt(t); //Ligevægt instantieres,
    ligevægt.update(); 
    ligevægt.jernKnap();
    ligevægt.thiocyanatKnap();
    ligevægt.jernthiocyanatKnap();
    stopKnap();
    startKnap();
    //Alle metoderne fra ligevægt og sketch, som skal køres i setup, køres.

    glasset = new Glas(posX, posY, 0, 0.05, ligevægt); //Glasset instantieres.
}

function draw() {
    background(204, 229, 255);
    t = 1/15 * temperatur.value() - 2/3; //Hvis temperaturen er 10, er t = 0, og hvis temperaturen er 40, er t = 2.

    ligevægt.updateT(t); 

    glasset.updateT(t);

    //t opdateres i ligevægt og glasset.

    bokse();

    tekstSkyder();
    tekstOverskrift();
    tekstSimulation();
    tekstForklaring();
    tekstAntal();

    //Alle layout metoderne indlæses.

    glasset.drawGlas(); //Glasset tegnes.
    ligevægt.draw(); //Ligevægten tegnes.
    //ligevægt.sammensætningHøjre();
    //ligevægt.sammensætningVenstre(); 
    if (tændt === true) { //Hvis programmet er tændt indlæses alle metoderne, som beskriver kollisionerne.
        ligevægt.reaktionHøjre(); 
        ligevægt.reaktionVenstre();
        ligevægt.internKollision();
    }
     
    if (frameCount % 5 === 0) { //Diagrammet opdateres hvert 5. hertz.
        ligevægt.tegnDiagram();
    }
}

function bokse() {
    noFill();
    stroke(0,51,102);
    rect(100, 100, 600, 800);
    rect(750, 100, windowWidth - 900, 800);
}

function tekstSkyder() {
    fill(0);
    noStroke();
    textSize(20);
    textAlign(CENTER);
    text("t = " + temperatur.value() + "°C",400,130);
    textSize(16)
    text("10°C",250,180);
    text("40°C",550,180);
}

function tekstOverskrift() {
    fill(0,46,123);
    rect(0, 0, windowWidth-20, 80,20);
    fill(255);
    textSize(30);
    textAlign(CENTER);
    textFont("Verdana");
    text("Simulation af kemisk ligevægt", windowWidth / 2, 40);
}

function tekstSimulation() {
    fill(224,224,244);
    stroke(0);
    strokeWeight(2);
    rect(200, 780, 400, 100);
    noStroke();
    textAlign(LEFT, CENTER);
    fill(0,255,0);
    circle(300, 800, 20);
    fill(0);
    textSize(20);
    textFont("Verdana");
    text("er jernioner.", 330, 800);
    fill(255,0,0);
    circle(300, 825, 20);
    fill(0);
    textSize(20);
    textFont("Verdana");
    text("er thiocyanationer.", 330, 825);
    fill(0,0,255);
    circle(300, 850, 20);
    fill(0);
    textSize(20);
    textFont("Verdana");
    text("er jernthiocyanationer.", 330, 850);
}

function tekstAntal() {
    fill(0);
    noStroke();
    textSize(16);
    textAlign(CENTER);
    text(ligevægt.længdeAlleioner + " molekyler i alt", 1125, 115)
    textSize(10);
    text(ligevægt.længdeJernioner[9] + " molekyler", 1000, 140);
    text(ligevægt.længdeThiocyanationer[9] + " molekyler", 1125, 140);
    text(ligevægt.længdeJernthiocyanationer[9] + " molekyler", 1250, 140);
}

function tekstForklaring() {
    stroke(0);
    strokeWeight(2);
    fill(224,224,244);
    rect(800, 450, windowWidth - 1000, 430);

    fill(0);
    noStroke();
    textSize(20);
    textFont("Verdana");
    text("Kemisk ligevægt", 1050, 470)

    textSize(16);
    forklarendeTekst = "Simulationen til venstre viser ligevægtsreaktionen mellem komplekset jernthiocyanat og jern- og thiocyanationer. Reaktionen er nem at studere, for idet ligevægten forskydes, vil der være et synligt farveskift, hvor opløsningen bliver enten mere eller mindre rødbrun. Ovenstående graf viser den procentvise fordeling af reaktanter og produkter, og denne kan påvirkes ved temperaturændringer.";
    text(forklarendeTekst, 810, 490, windowWidth - 1010, 200);
    spørgsmål1 = "1. Forklar, hvorfor opløsningen er farvet, og hvorfor der sker et farveskift.";
    text(spørgsmål1, 810, 600, windowWidth - 1010, 200);
    spørgsmål2 = "2. Ryk på skyderen og observer, hvordan ligvægten forskydes. Ud fra Le Chateliers Pricip, hvilken vej, som er endo- og exoterm i ligevægten?";
    text(spørgsmål2, 810, 650, windowWidth - 1010, 200);
}

function stopKnap() {
    let stopKnap = createButton("⏹"); //Der laves en stopknap.
    stopKnap.style('font-size', '100px');
    stopKnap.style('width', '100px');
    stopKnap.style('height', '100px');
    stopKnap.style('border-radius', '50px');
    stopKnap.style('background-color', 'red'); 
    stopKnap.style('border', 'none');
    stopKnap.style('color', 'white');
    stopKnap.style('text-align', 'center'); 
    stopKnap.style('line-height', '100px'); 
    stopKnap.position(5, 100); 
    stopKnap.mousePressed(stop); //Hvis denne trykkes på køres funktionen stop().
}

function stop () {
    tændt = false; //tændt sættes til false.
    for (let jern of ligevægt.jernioner) {
        jern.hastighed.mult(0);
    }
    for (let thiocyanat of ligevægt.thiocyanationer) {
        thiocyanat.hastighed.mult(0);
    }
    for (let jernthiocyanat of ligevægt.jernthiocyanationer) {
        jernthiocyanat.hastighed.mult(0);
    }
    //Alle hastighederne sættes til 0.
}

function startKnap() {
let startKnap = createButton("▶"); //Der laves en startknap
startKnap.style('font-size', '65px'); 
startKnap.style('width', '100px');
startKnap.style('height', '100px'); 
startKnap.style('border-radius', '50px'); 
startKnap.style('background-color', 'green'); 
startKnap.style('border', 'none'); 
startKnap.style('color', 'white'); 
startKnap.style('text-align', 'center'); 
startKnap.style('line-height', '100px'); 
startKnap.position(5, 220); 
startKnap.mousePressed(start); //Hvis knappen trykkes på køres start().
}

function start() {
    tændt = true; //tændt sættes til true
    for (let jern of ligevægt.jernioner) {
        jern.hastighed = createVector(random(-2, 2), random(-2, 2));
    }
    for (let thiocyanat of ligevægt.thiocyanationer) {
        thiocyanat.hastighed = createVector(random(-2, 2), random(-2, 2));
    }
    for (let jernthiocyanat of ligevægt.jernthiocyanationer) {
        jernthiocyanat.hastighed = createVector(random(-2, 2), random(-2, 2));
    }

    //Alle hastighederne til random værdier mellem -2 og 2, som da de oprindeligt blev oprettet.
}
  