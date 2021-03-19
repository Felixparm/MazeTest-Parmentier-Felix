var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// Route contenant la logique de construction du labyrinthe 
router.post('/maze', function(req, res, next) {

  // Récupération des données du front end converties au format number
  var w=parseInt(req.body.width)
  var h=parseInt(req.body.height)
  
  // Initialisation du tableau de nombre 
  var mazeArray=[];
  // Initialisation des tableaux qui permettront la construction/destruction des murs du labyrinthe
  var buildHoriz=[]
  var buildVerti=[]
 
  // Initialisation des variables
  // mazeArray : chaque cellule aura un nombre unique (de 0 à w * h - 1)
  // buildHoriz & buildVerti seront fermés (true=mur présent & false=non présent)
   for(var i=0; i<h*w;i++){
     mazeArray.push(i)
     buildHoriz.push(true)
     buildVerti.push(true)
   }

  // création d'une fonction permettant de récupéré un nombre au hasard entre deux valeurs (min et max) en argument
   function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min;
  }
  
  // C'est à partir de la que nous construiront notre labyrinthe
  // While -> tant que l'ensemble des cellules de mazeArray n'est pas identique alors la boucle continura le calcul

  while(mazeArray.filter(e=>e===mazeArray[0]).length!=h*w){
    
    // Selection au hasard de la case dont nous allons casser le mur (ou non) (case selectionnée)
    var wallToBreak=getRandomIntInclusive(0,w*h-1)
    // Selection au hasard de la direction vers laquelle nous allons casser le mur (ou non) (case visée)
    var directionToBreak=getRandomIntInclusive(0,3)
    // Récupération d'un attribut de valeure 0 ou 1 (au hasard), celui-ci nous permmtra de savoir si
    // la case visée prend la valeure de la case ciblée ou l'inverse
    var randomAttribute=getRandomIntInclusive(0,1)

    // directionToBreak=0 -> la case à droite de la case selectionnée est visée 
    // On entre dans la condition si et seulement si la case selectionnée n'est pas située sur le bord droit
    // & si les cases visées et selectionnées ont des valeurs différentes
     if(directionToBreak===0 && (wallToBreak+1)%w!=0 && mazeArray[wallToBreak+1]!=mazeArray[wallToBreak]){
      // Une fois ces condition validées :
      // On peut 'casser' le mur entre les deux cases
        buildHoriz.splice(wallToBreak,1,false)
      // On fixe les valeurs des cases ciblées et visées grace à deux varibales 
        var valueOne=mazeArray[wallToBreak+1-randomAttribute]
        var valueTwo=mazeArray[wallToBreak+randomAttribute]
      // Ici l'ensemble des ValueOne du tableaux seront remplacées par des values Two
        mazeArray.forEach((e,i)=>{
         if(e===valueOne){
           mazeArray.splice(i,1,valueTwo)
         }
        })
      }  
    // directionToBreak=1 -> la case à gauche de la case selectionnée est visée 
    // On entre dans la condition si et seulement si la case selectionnée n'est pas située sur le bord gauche
    // & si les cases visées et selectionnées ont des valeurs différentes
    if(directionToBreak===1 && wallToBreak%w!=0 && mazeArray[wallToBreak-1]!=mazeArray[wallToBreak]){
      // Une fois ces condition validées :
      // On peut 'casser' le mur entre les deux cases
        buildHoriz.splice(wallToBreak-1,1,false)
      // On fixe les valeurs des cases ciblées et visées grace à deux varibales 
        var valueOne=mazeArray[wallToBreak-1+randomAttribute]
        var valueTwo=mazeArray[wallToBreak-randomAttribute]
      // Ici l'ensemble des ValueOne du tableaux seront remplacées par des values Two
         mazeArray.forEach((e,i)=>{
           if(e===valueOne){
            mazeArray.splice(i,1,valueTwo)
           }
         })
    }
    
    // directionToBreak=3 -> la case en bas de la case selectionnée est visée 
    // On entre dans la condition si et seulement si la case selectionnée n'est pas située sur la derniére ligne
    // & si les cases visées et selectionnées ont des valeurs différentes
    if(directionToBreak===3 && wallToBreak<(w*h-1)-w && mazeArray[wallToBreak+w]!= mazeArray[wallToBreak]){
      // Une fois ces condition validées :
      // On peut 'casser' le mur entre les deux cases
      buildVerti.splice(wallToBreak,1,false)
      // On fixe les valeurs des cases ciblées et visées grace à deux varibales
      var valueOne=mazeArray[wallToBreak+w*randomAttribute]
      var valueTwo=mazeArray[wallToBreak+w*(1-randomAttribute)]
      // Ici l'ensemble des ValueOne du tableaux seront remplacées par des values Two
      mazeArray.forEach((e,i)=>{
        if(e===valueOne){

          mazeArray.splice(i,1,valueTwo)
        }
      })
    }
    // directionToBreak=2 -> la case en haut de la case selectionnée est visée 
    // On entre dans la condition si et seulement si la case selectionnée n'est pas située sur la premiére ligne
    // & si les cases visées et selectionnées ont des valeurs différentes
    if(directionToBreak===2 && wallToBreak>w-1 && mazeArray[wallToBreak-w]!=mazeArray[wallToBreak]){
     // Une fois ces condition validées :
     // On peut 'casser' le mur entre les deux cases
      buildVerti.splice(wallToBreak-w,1,false)
      // On fixe les valeurs des cases ciblées et visées grace à deux varibales
      var valueOne=mazeArray[wallToBreak-w*randomAttribute]
      var valueTwo=mazeArray[wallToBreak-w*(1-randomAttribute)]
      mazeArray.forEach((e,i)=>{
        if(e===valueOne){
      // Ici l'ensemble des ValueOne du tableaux seront remplacées par des values Two
          mazeArray.splice(i,1,valueTwo)
        }
      })
    } 
  }
  
  // Initialisation des variables qui nous permettrons de modéliser noter labyrinthe final
  // buildMaze contiendra l'ensemble du labyrinthe 
  // subBuildMaze permmetra la construction du labyrinthe étage par étage 
  var buildMaze=[];
  var subBuildMaze=[];

// Initialisation des murs du haut déssinant le périmétre du labyrinthe
  for(var i=0;i<=w;i++){
    if(i===0){
      subBuildMaze.push('OO')
     }
    else{ 
    subBuildMaze.push('CO')
     }
  }
  buildMaze.push(subBuildMaze);
  // Construction du labyrinthe en fonction des tableaux buildHoriz et buildVerti
  // OO -> open/open , il n'y a pas de mur 
  // OC -> open/close il y'a un mur vertical
  // CO -> close/open, il y'a un mur horizontal
  // CC -> close/close, les deux murs sont fermés 

  subBuildMaze=[];
  for(var i=0;i<h*w;i++){
    if(i%w===0){
      subBuildMaze.push('OC')
    }
    if(buildHoriz[i]===false && buildVerti[i]===false){
      subBuildMaze.push('OO')
    }
    if(buildHoriz[i]===true && buildVerti[i]===false){
      subBuildMaze.push('OC')
    }
    if(buildHoriz[i]===false && buildVerti[i]===true){
      subBuildMaze.push('CO')
    }
    if(buildHoriz[i]===true && buildVerti[i]===true){
      subBuildMaze.push('CC')
    }
   if((i+1)%w===0){ 
   buildMaze.push(subBuildMaze)
   subBuildMaze=[];
   }
  }
   console.log(buildMaze)
   // Envoie du tableau contenant la modélisation au front end 
  res.render('maze',{buildMaze:buildMaze});
});


module.exports = router;
