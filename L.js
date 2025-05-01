class Ligevægt {
    constructor(t) {
        this.jernioner = [];
        this.thiocyanationer = [];
        this.jernthiocyanationer = [];
        this.t = t; 
        this.længdeJernioner = [0,0,0,0,0,0,0,0,0,0];
        this.længdeThiocyanationer = [0,0,0,0,0,0,0,0,0,0];
        this.længdeJernthiocyanationer = [0,0,0,0,0,0,0,0,0,0];
        this.længdeAlleioner;
        this.xValues = [1,2,3,4,5,6,7,8,9,10];
        
        this.chart = new Chart("myChart", { //Et chart af typen "line" defineres.
            type: "line", 
            data: {
              labels: "Tid", //X-aksen får stringen "Tid" som label. 
              datasets: [{
                fill: false,
                label: "Jernioner", 
                borderColor: "rgb(0, 255, 0)",
                data: this.længdeJernioner //En linje får arrayet this.længdeJernioner, som data på y-aksen.
              },{
                fill: false,
                label: "Thiocyanationer",
                borderColor: "rgb(255, 0, 0)",
                data: this.længdethiocyanationer //En linje får arrayet this.længdeJernthiocyanationer, som data på y-aksen.
              }, {
                fill: false,
                label: "Jernthiocyanationer",
                borderColor: "rgb(0, 0,255)",
                data: this.længdeJernthiocyanationer //En linje får arrayet this.længdeJernthiocyanationer, som data på y-aksen.
              }]
            },
            options: {
              legend: {display: true}, //De to linjer får forklaringer i toppen.
              animation: false, //Den indlagte animation fjernes.
              scales: {
                xAxes: [{
                    ticks: {
                      display: false //Ticks fjernes.
                    },
                    scaleLabel: {
                      display: true,
                      labelString: "Tid" //scaleLabel bliver "Tid".
                    }
                  }],
                yAxes: [{
                    ticks: {
                    min: 0, 
                    max: 400,
                    callback: function(value) {
                        return value + " molekyler";
                    } //Y-aksen går fra 0-300 med enheden molekyler.
                }}],
              }
            }
          });
    }

    updateT(nyT) {
        this.t = nyT; //this.t opdateres i ligevægt.

        for (let jern of this.jernioner) {
            jern.updateT(this.t);
        }
        for (let thiocyanat of this.thiocyanationer) {
            thiocyanat.updateT(this.t); 
        }
        for (let jernthiocyanat of this.jernthiocyanationer) {
            jernthiocyanat.updateT(this.t);
        }
        //this.t opdateres for hver ion.
    }

    update() {
        for (let i = 0; i < 100; i++) {
            this.jernioner.push(new Jernion(random(posX, posX + 400), random(posY, posY + 500), this.t))
        }
        for (let i = 0; i < 100; i++) {
            this.thiocyanationer.push(new Thiocyanation(random(posX, posX + 400), random(posY, posY + 500), this.t))
        }
        for (let i = 0; i < 100; i++) {
            this.jernthiocyanationer.push(new Jernthiocyanation(random(posX, posX + 400), random(posY, posY + 500), this.t))
        }
        //Til at starte tegnes der 100 af hver ion.
    }

    draw() {
        for (let jern of this.jernioner) {
            jern.update(); 
            jern.draw();
            jern.tjekKanter();
        }
        for (let thiocyanat of this.thiocyanationer) {
            thiocyanat.update();
            thiocyanat.draw();
            thiocyanat.tjekKanter();
        }
        for (let jernthiocyanat of this.jernthiocyanationer) {
            jernthiocyanat.update();
            jernthiocyanat.draw();
            jernthiocyanat.tjekKanter();
        }
        //Hver ions metoder fra molekyler køres.

        this.længdeAlleioner =  this.længdeJernioner[9] +  this.længdeThiocyanationer[9] +  this.længdeJernthiocyanationer[9]; //this.længdeAlleioner bliver det samlede antal ioner.
    }

    sammensætningHøjre() {
        if (this.jernthiocyanationer.length <= this.t * 100) { //Metoden kører kun, når der for mange jernthiocyanationer.
            for (let i = this.jernioner.length - 1; i >= 0; i--) { 
                let j = this.jernioner[i];
                for (let k = this.thiocyanationer.length - 1; k >= 0; k--) {
                    let tc = this.thiocyanationer[k];

                    //Der itereres baglæns igennem jern- og thiocyanationer for at undgå fejl.

                    let ax = tc.position.x - j.position.x; //Forskellen i x-aksen defineres.
                    let ay = tc.position.y - j.position.y; //Forskellen i y-aksen defineres.
                    let afstand = Math.sqrt(ax * ax + ay * ay); //Der anvendes pythagoras for at beregne afstanden mellem de to ioner.

                    if (afstand < 10 && frameCount - j.levetid > 30 && frameCount - tc.levetid > 30) {  //Molekylerne kolliderer, hvis afstanden er lille nok, og de er "gamle nok".
                        let nyX = j.position.x; //x-positionen gemmes
                        let nyY = j.position.y - 100; //y-positionen gemmes.

                        this.jernioner.splice(i, 1); //Jernionen fjernes.
                        this.thiocyanationer.splice(k, 1); //Thiocyanationen fjernes.

                        this.jernthiocyanationer.push(new Jernthiocyanation(nyX, nyY, this.t)); //Der tilføjes en jernthiocyanation.

                        break;
                    }
                }
            }
        }
    }

    reaktionHøjre() {
        let sandsynlighed = 1 - (1 / (1 + Math.exp((5 * (this.t - 1))))); //Reaktionen får en sandsynlighed mellem 0 og 1 afhængigt af t.
    
        for (let i = this.jernioner.length - 1; i >= 0; i--) { //Der løbes baglæns igennem jernionerner[] med indekset i.
            let j = this.jernioner[i];
            for (let k = this.thiocyanationer.length - 1; k >= 0; k--) { //Der løbes baglæng gennem tjiocyanationer[] med indekset k.
                let tc = this.thiocyanationer[k];
    
                let ax = tc.position.x - j.position.x; //Forskellen i x-aksen beregnes.
                let ay = tc.position.y - j.position.y; //Forskellen i y-aksen beregnes.
                let afstand = Math.sqrt(ax * ax + ay * ay); //Afstanden mellem de to molekyler beregnes med Pythagoras.
    
                if (afstand < 10 && frameCount - j.levetid > 30 && frameCount - tc.levetid > 30) { //Hvis modellerne er tæt nok på hinanden og "gamle nok" kan de kollidere.
    
                    if (random(0, 1) < sandsynlighed) { //Hvis sandsynlighed er større end et random tal mellem 0 og 1.
                        let nyX = j.position.x;
                        let nyY = j.position.y - 100; //x- og y-positionen gemmes.
    
                        this.jernioner.splice(i, 1); //Jernionen fjernes.
                        this.thiocyanationer.splice(k, 1); //Thiocyanationen fjernes.
    
                        this.jernthiocyanationer.push(new Jernthiocyanation(nyX, nyY, this.t)); //Der tilføjes en ny jernthiocyanation i den nye position.
                    } else { 
                        j.hastighed.mult(-1); //Jernionen vendes.
                        tc.hastighed.mult(-1); //Thiocyanationen vendes.

                        j.levetid = frameCount; //Levetiden for jernionen sættes til det nuværende frameCount.
                        tc.levetid = frameCount; //Levetiden for thuocyanationen sættes til det nuværende frameCount.
                    }
    
                    break;
                }
            }
        }
    }

    sammensætningVenstre() {
        if (this.jernthiocyanationer.length >= this.t * 100) //Metoden kører kun, når der er for få jernthiocyanationer.
            for (let i = this.jernthiocyanationer.length - 1; i >= 0; i--) {
                let jtc1 = this.jernthiocyanationer[i];

                for (let k = i - 1; k >= 0; k--) {  
                    let jtc2 = this.jernthiocyanationer[k];

                    //Der itereres baglæns igennem jernthiocyanationer for at undgå fejl. Den ene får er på pladsen bag den anden.

                    let dx = jtc2.position.x - jtc1.position.x; //Forskellen i x-aksen defineres.
                    let dy = jtc2.position.y - jtc1.position.y; //Forskellen i y-aksen defineres.
                    let afstand = Math.sqrt(dx * dx + dy * dy); //Der anvendes pythagoras for at beregne afstanden mellem de to ioner.

                    if (afstand < 10 && frameCount - jtc.levetid > 30) {  //Molekylerne kolliderer, hvis afstanden er lille nok, og de er "gamle nok".
                        let nyX = tc.position.x; //x-positionen gemmes
                        let nyY = tc.position.y - 100; //y-positionen gemmes.

                        this.jernthiocyanationer.splice(k, 1); //Den ene af jernthiocayantionerne fjernes.

                        this.jernioner.push(new Jernion(nyX, nyY, this.t)); //Der dannes en ny jernion i den gemte position.
                        this.thiocyanationer.push(new Thiocyanation(nyX, nyY, this.t)); //Der dannes en ny thiocyanation i den gemte position.

                        break;  
                    }
                }
            }
    }

    reaktionVenstre() { 
        let sandsynlighed = 1 / (1 + Math.exp(5 * (this.t - 1))); //Reaktionen får en sandsynlighed mellem 0 og 1 afhængigt af t.
    
        for (let i = this.jernthiocyanationer.length - 1; i >= 0; i--) { //Der løbes baglæns igennem jernithiocyanatonerner[] med indekset i.
            let jtc = this.jernthiocyanationer[i];
            for (let k = i - 1; k >= 0; k--) { 
                let jtc1 = this.jernthiocyanationer[k]; //Der løbes baglæng gennem tjiocyanationer[] med indekset k, som er i-1.
    
                let ax = jtc1.position.x - jtc.position.x; //Forskellen i x-aksen beregnes.
                let ay = jtc1.position.y - jtc.position.y; //Forskellen i y-aksen beregnes.
                let afstand = Math.sqrt(ax * ax + ay * ay); //Afstanden mellem de to molekyler beregnes med Pythagoras.
    
                if (afstand < 10 && frameCount - jtc.levetid > 30 && frameCount - jtc1.levetid > 30) {  //Hvis modellerne er tæt nok på hinanden og "gamle nok" kan de kollidere.
                    if (random(0, 1) < sandsynlighed) { //Hvis sandsynlighed er større end et random tal mellem 0 og 1.
                        let nyX = jtc.position.x; 
                        let nyY = jtc.position.y - 100; //x- og y-positionen gemmes.
    
                        this.jernthiocyanationer.splice(k, 1); //En af jernthiocyanaterne fjernes.
    
                        this.jernioner.push(new Jernion(nyX, nyY, this.t)); //Der tilføjes en jernion i den gemte position.
                        this.thiocyanationer.push(new Thiocyanation(nyX, nyY, this.t)); //Der tilføjes en thiocyanation i den gemte position,
                    } else {
                        jtc.hastighed.mult(-1); //Den ene jernthiocyanation vendes.
                        jtc1.hastighed.mult(-1); //Den anden jernthiocyanation vendes.

                        jtc.levetid = frameCount; //Den ene jernthiocyanations levetid sættes til den nuværende frameCount.
                        jtc1.levetid = frameCount; //Den anden jernthiocyanations levetid sættes til den nuværende frameCount.
                    }
    
                    break;
                }
            }
        }
    }

    internKollision() {
        for (let i = this.jernioner.length - 1; i >= 0; i--) { //Der itereres igennem jernioner med indekset i.
            let j = this.jernioner[i];
            for (let k = this.jernthiocyanationer.length - 1; k >= 0; k--) { //Der iteres igennem jernthiocyanationer med indekset k.
                let jtc = this.jernthiocyanationer[k]; 

                let dx = jtc.position.x - j.position.x; 
                let dy = jtc.position.y - j.position.y;
                let afstand = Math.sqrt(dx * dx + dy * dy); //Afstanden mellem de 2 ioner beregnes.

                if (afstand < 10 && frameCount - jtc.levetid > 30 && frameCount - j.levetid > 30) { //Hvis afstandene er lille nok, og ionerne er gamle nok, kan de støde samme.
                    j.hastighed = j.hastighed.mult(-1);
                    jtc.hastighed = jtc.hastighed.mult(-1);

                    //Hastighederne vendes.

                    j.levetid = frameCount;
                    jtc.levetid = frameCount;

                    //Levetiden sættes til det nuværende frameCount.

                    break;
                }
            }
        }
        
        for (let i = this.thiocyanationer.length - 1; i >= 0; i--) {  //Der itereres igennem thiocyanationer med indekset i.
            let tc = this.thiocyanationer[i];
            for (let k = this.jernthiocyanationer.length - 1; k >= 0; k--) { //Der iteres igennem jernthiocyanationer med indekset k.
                let jtc = this.jernthiocyanationer[k];

                let dx = jtc.position.x - tc.position.x;
                let dy = jtc.position.y - tc.position.y;
                let afstand = Math.sqrt(dx * dx + dy * dy); //Afstanden mellem de 2 ioner beregnes.

                if (afstand < 10 && frameCount - jtc.levetid > 30 && frameCount - tc.levetid > 30) { //Hvis afstandene er lille nok, og ionerne er gamle nok, kan de støde samme.
                    tc.hastighed = tc.hastighed.mult(-1);
                    jtc.hastighed = jtc.hastighed.mult(-1);

                    //Hastighederne vendes.

                    tc.levetid = frameCount;
                    jtc.levetid = frameCount;

                    //Levetiden sættes til det nuværende frameCount.

                    break;
                }
            }
        }
    }

    tegnDiagram() {
        this.xValues.push(this.xValues[9] + 1); //Der tilføjes nye værdier på x-aksen.
        this.længdeJernioner.push(this.jernioner.length); 
        this.længdeThiocyanationer.push(this.thiocyanationer.length);
        this.længdeJernthiocyanationer.push(this.jernthiocyanationer.length);

        //Den nuværende længde af det givne array pushes på.

        this.xValues.shift(); 
        this.længdeJernioner.shift();
        this.længdeThiocyanationer.shift();
        this.længdeJernthiocyanationer.shift();

        //Indeks [0] fjernes i de forskellige arrays.
    
        this.chart.data.labels = this.xValues; //Labels på x.aksen er xValues.
        this.chart.data.datasets[0].data = this.længdeJernioner; 
        this.chart.data.datasets[1].data = this.længdeThiocyanationer;
        this.chart.data.datasets[2].data = this.længdeJernthiocyanationer;

        //De forskellige datasæt på y-aksen defineres.

        this.chart.update(); //Chartet opdateres.
    }

    jernKnap() {
        let plusknap = createButton("+10"); //Der laves en htmlknap.
        plusknap.position(250,220); 
        plusknap.style("color", "green");
        plusknap.style("font-size", "20px")
        plusknap.mousePressed(() => this.tilføjJernioner()); //Hvis den trykkes tilføjes der ioner med metoden tilføjJernioner().
        

        let minusknap = createButton("-10");
        minusknap.position(300,220);
        minusknap.style("color", "green");
        minusknap.style("font-size", "20px")
        minusknap.mousePressed(() => this.fjernJernioner());
    }

    thiocyanatKnap() {
        let plusknap = createButton("+10");
        plusknap.position(350,220);
        plusknap.style("color", "red");
        plusknap.style("font-size", "20px")
        plusknap.mousePressed(() => this.tilføjThiocyanationer());
        

        let minusknap = createButton("-10");
        minusknap.position(400,220);
        minusknap.style("color", "red");
        minusknap.style("font-size", "20px")
        minusknap.mousePressed(() => this.fjernThiocyanationer());
    }

    jernthiocyanatKnap() {
        let plusknap = createButton("+10");
        plusknap.position(450,220);
        plusknap.style("color", "blue");
        plusknap.style("font-size", "20px")
        plusknap.mousePressed(() => this.tilføjJernthiocyanationer());
        

        let minusknap = createButton("-10");
        minusknap.position(500,220);
        minusknap.style("color", "blue");
        minusknap.style("font-size", "20px")
        minusknap.mousePressed(() => this.fjernJernthiocyanationer());
    }


    tilføjJernioner() {
        if (this.længdeAlleioner <= 400) { //Hvis der ikke er flere end 400 ioner i alt.
            for (let i = 0; i < 10; i++) { 
                this.jernioner.push(new Jernion(random(posX, posX + 400), random(posY, posY + 500), this.t)); //Der tilføjes 10 nye jernioner.
            }
        }
    }

    fjernJernioner() {
        if (this.længdeJernioner[9] >= 0) {
            for (let i = 0; i < 10; i++) {
                this.jernioner.shift();
            }
        }
    }

    tilføjThiocyanationer() {
        if (this.længdeAlleioner <= 400) {
            for (let i = 0; i < 10; i++) {
                this.thiocyanationer.push(new Thiocyanation(random(posX, posX + 400), random(posY, posY + 500), this.t));
            }
        }
    }

    fjernThiocyanationer() {
        if (this.thiocyanationer.length >= 0) {
            for (let i = 0; i < 10; i++) {
                this.thiocyanationer.shift();
            }
        }
    }

    tilføjJernthiocyanationer() {
        if (this.længdeAlleioner <= 400) {
            for (let i = 0; i < 10; i++) {
                this.jernthiocyanationer.push(new Jernthiocyanation(random(posX, posX + 400), random(posY, posY + 500), this.t));
            }
        }
    }

    fjernJernthiocyanationer() {
        if (this.jernthiocyanationer.length >= 0) {
            for (let i = 0; i < 10; i++) {
                this.jernthiocyanationer.shift();
            }
        }
    }
}
