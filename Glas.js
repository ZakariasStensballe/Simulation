class Glas {
    constructor(posX, posY, startVinkel, deltaVinkel, ligevægt, t) {
        this.posX = posX;
        this.posY = posY;
        this.startVinkel = startVinkel;
        this.deltaVinkel = deltaVinkel;
        this.ligevægt = ligevægt;
        this.t = t;
    }
    
    updateT(nyT) {
        this.t = nyT; //this.t opdateres for hver gang, koden kører.
    }
    
    drawGlas() {
        let a = map(this.ligevægt.jernthiocyanationer.length, 0, 300, 0, 300); //a defineres som en lineær sammenhng med mængden af jernthiocyanationer.

        let vinkel = this.startVinkel; //Vinken, der øges sættes til startvinklen.
        let radius = 10; //Radius af kuglerne, der danner bølgen defineres.
        let vandNiveau = this.posY + 100; //Vandniveauet, hvor bølgen er defineres.
    
        noStroke();
        fill(255, 204 - a, 153 - a, 100); //Farven på opløsningen afhænger af a.
        rect(this.posX, vandNiveau, 400, 500); //Opløsningen tegens.
    
        for (let x = this.posX + radius / 1.5; x <= this.posX + 400 - radius / 2; x += 3) { //Et forloop kører gennem kuglernes postion på x-aksen.
            let y = map(sin(vinkel), -1, 1, vandNiveau - 2, vandNiveau + 2); //y-aksen bølger afhængigt af vinklen.
            noStroke();
            fill(255, 204 - a, 153 - a, 50); //Bølgen får samme farve som opløsningen.
            circle(x, y, radius); //Der tegnes cirkler.
            vinkel += this.deltaVinkel; //Vinklen øges med deltaVinkel, så næste kugle tegnes forskudt.
        }
        this.startVinkel += t * 0.1 + 0.05; //Når bølgen er tegnet defineres øges startvinklen, så bølgen bevæger sig.
    
        stroke(0);
        strokeWeight(5);
        line(this.posX, this.posY, this.posX, this.posY + 600);
        line(this.posX, this.posY + 600, this.posX + 400, this.posY + 600);
        line(this.posX + 400, this.posY + 600, this.posX + 400, this.posY); //Kanterne på glasset tegnes.
    }
}