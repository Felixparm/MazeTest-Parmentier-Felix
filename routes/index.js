var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/maze', function(req, res, next) {
// Récupération des données du FRONT END saisies par l'utilisateur (w-> la largeure du labyrinthe, h-> la hauteure du labyrinte)
  var w=req.body.width
  var h=req.body.height
// Définition de tableau vide qui nous aiderons à construire notre labyrinte en deux parties
// mazeArray1 pour la partie du dessus
// mazeArray2 pour la partie du dessous

  var mazeArray1=[]
  var mazeArray2=[]
// Nous construirons notre labyrinthe par niveau de hauteur
// Level correspond au niveau de construction 
  var level=0;

  for(var i=0;i<h;i++){
    level++;
     // Pour chaque niveau du labirynthe , nous utiliserons des 'sous tableaux' que nous remplirons en fonction de plusieurs paramétres
    var subMazeArray1=[];
    var subMazeArray2=[];
    // Si le nombre de ligne créées (level) a atteint la moitié de la hauteure du lab alors on construit une intermédiére     
    if(level>h/2){
       for(var f=0;f<w;f++){ 
          if(f<h/2 || f>=w-h/2){    
             if(w===h && f===Math.ceil(w/2) && w%2!=0){ 
                 subMazeArray1.push('0')
             }
             else{
                 subMazeArray1.push('2')
             }
           }
          else{
             subMazeArray1.push('0') 
           }
    }
         mazeArray1.push(subMazeArray1) 
     // Une fois cette ligne construite on sort de la boucle for et on interrompt le processus de construction
     break; 
    }
 // Si le nombre de ligne créées (level) a atteint la moitié de la largeure du lab alors on construit une/ou plusieurs lignes intermédiére
 // Ce nombre de ligne correspond à la différence h-w 
    if(level>=w/2){
      for(var i=0;i<h-w;i++){
        for(var j=0;j<w;j++){
          if(w%2!=0 && j===Math.floor(w/2) && i===Math.floor((h-w)/2)){
               subMazeArray1.push('0')
          }
          else{ 
               subMazeArray1.push('2')
          }
        }
      mazeArray1.push(subMazeArray1)
      subMazeArray1=[];
       }
  // Une fois les lignes construites on sort de la boucle for et on interrompt le processus de construction
     break;
     }
   // Régles de construction
   // 0 : espace vide
   // 1 : ligne horizontale
   // 2 : ligne verticale
   // C1,C2,C3,C4 -> types de coins 

   for(var j=0;j<w;j++){
      if(j<level){
      subMazeArray1.push('2')
      }
      if(j<level-1){
      subMazeArray2.push('2')
      }
      if(j===level){
      subMazeArray1.push('C1')
      }
      if(j===level-1){
      subMazeArray2.push('C3')
      }
      if(j>level && j<w-level){
      subMazeArray1.push('1')
      }
      if(j>level-1 && j<w-level-1){
      subMazeArray2.push('1')
      }
      if(j===w-level){
      subMazeArray1.push('C2')
      subMazeArray2.push('C4')
      }
      if(j>w-level){
      subMazeArray1.push('2')
      }
      if(j>w-level-1){
      subMazeArray2.push('2')
      }
    }
   // Une fois les lignes construites, elles sont ajoutées à leurs tableaux respectif
   mazeArray1.push(subMazeArray1)    
   mazeArray2.unshift(subMazeArray2)
  }
  // Concaténation des deux tableaux qui formera le notre tableau labyrinte
  var mazeArray=mazeArray1.concat(mazeArray2)

  res.render('maze',{mazeArray});
});


module.exports = router;
