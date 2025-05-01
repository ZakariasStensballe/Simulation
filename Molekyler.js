class Molekyler {
    constructor(posX, posY, farve, t) {
        this.hastighed = createVector(random(-2,2), random(-2,2)); 
        this.position = createVector(posX, posY + 100);
        this.farve = farve;
        this.levetid = frameCount;
        this.t = t; 
    }

    updateT(nyT) {
        this.t = nyT; //this.t opdateres for hver gang, koden kører.
    }

    update() {
        let a = 0.5 * this.t + 1; //a afhænger af this.t.
        let tempHastighed = this.hastighed.copy().mult(a); //tempHastighed defineres, som er hastigheden afhængig af temperaturen.
        this.position.add(tempHastighed); //tempHastughed lægges til positionen.
    }

    draw() {
        noStroke();
        fill(this.farve); //Molekylernes farve bliver this.farve.
        circle(this.position.x, this.position.y, 8); //Molekylerne bliver cirkler, som tegnes i positionen.
    }

    tjekKanter() {
        if (this.position.x < 200) {
            this.position.x = 200; 
            this.hastighed.x *= -1; //Tjekker kanter i venstre side. 
        } else if (this.position.x > 400 + 200) {
            this.position.x = 400 + 200;  
            this.hastighed.x *= -1; //Tjekker kanter i højre side. 
        }
    
        if (this.position.y < windowHeight / 2 - 200) {
            this.position.y = windowHeight / 2 - 200;  
            this.hastighed.y *= -1; //Tjekker kanter oppe.
        } else if (this.position.y > windowHeight / 2 + 300) {
            this.position.y = windowHeight / 2 + 300;  
            this.hastighed.y *= -1; //Tjekker kanter nede.
        }
    }
}