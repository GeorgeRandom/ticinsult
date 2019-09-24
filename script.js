//the intro
const intro = (()=>{
    const toForm2=()=>{
        players.update();
        if (players.pOne.name===""||players.pTwo.name===""){
            return
        }
        else{
            form1.style.display="none";
            form2.style.display="grid";
            
            
            

            if (players.isp2Human()===true){
                unbeatBut.style.display="none"
                document.querySelector(".unbeat").textContent=""
                
            }
            else {
                unbeatBut.style.display=""
                
                document.querySelector(".unbeat").textContent="unbeatable AI?"
            }
            document.querySelector("#showp1name").textContent=`${players.pOne.name}`
            document.querySelector("#showp2name").textContent=`${players.pTwo.name}`
        }
            


    }
    const toGame=()=>{
        players.update()
        if (players.pOne.label===""||players.pTwo.label===""){
            return}
        else{
        form2.style.display="none";
        players.update();
        display.create();
        gameBoard.reset()
    }
    }
    const restart=()=>{
        display.destroy();
        form1.style.display="grid";
        form2.style.display="none";
        let res=document.querySelector(".restart")
        res.removeChild(res.firstChild)
    }









return {
    toForm2,
    toGame,
    restart
    }

}





)()

//the display of the board
const display = (()=>{


    const destroy=()=>{
        const grid=document.querySelector(".grid")
        while(grid.hasChildNodes()) {  
            grid.removeChild(grid.firstChild);
            }
        while (resultField.hasChildNodes()){
            resultField.removeChild(resultField.firstChild)
            }
        allflowers.forEach((flower)=>
        flower.classList.add("hidden"))
        
        
        
           
    }








    const create = ()=>{
        document.querySelector(".toplay").textContent=`${players.pOne.name} to play`;
        const grid=document.querySelector(".grid")
        for (let i=0;i<9;i++){
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.setAttribute("number",`${i}`);
            cell.addEventListener("click", game.cellClick)
        
            grid.appendChild(cell)

        }
    }
    const update = ()=>{
        for (let i=0;i<9;i++){
            let cell=document.querySelector(`[number = "${i}"]`)
            if (gameBoard.getTokenAt(i) === 0){
            cell.textContent = `${players.pOne.label.toUpperCase()}!`
            cell.style.color ="blue"

                }
            else if (gameBoard.getTokenAt(i) === 1){
                cell.textContent = `${players.pTwo.label.toUpperCase()}!`
                cell.style.color ="red"
                } 
            else {cell.textContent = ``}

            }
        }
            

            

return {create,
    update,
    destroy
    }


})()


// the state of the board


const gameBoard = (()=>{
    const grid= [-1,-1,-1,-1,-1,-1,-1,-1,-1];
    const showGrid = () => grid;

    const getTokenAt = (pos) => { 
			return grid[pos]; 
		}

	const setTokenAt = (pos, token) => {
			grid[pos] = token;
		}

	const reset = () => {
            grid.fill(-1);
            display.update();
            game.turnCount = 1
        };
    const win = (val)=>{
        document.querySelector(".toplay").textContent=``;
            if (val=== 2 && players.isp2Human()===true){
                generateInsult();
                
                

            }
                
            
            if (val=== 2 && players.isp2Human()===false){
                resultField.textContent = ` NO. HARD. FEELINGS.`
            }
            

            if (val === 0){console.log("p1"); 
            resultField.textContent =`Sorry, ${players.pTwo.name},  ${players.pOne.name} thinks you're a ${players.pOne.label} .`
        
        }
            if (val === 1){console.log("p2");
            if (players.isp2Human()===false){
                resultField.textContent = `The machine feels nothing towards you, ${players.pOne.name} .`

            }

            else resultField.textContent = `${players.pTwo.name} said you're quite a  ${players.pTwo.label}. You should try being less ${players.pTwo.label}, my dear ${players.pOne.name}.`}
        
        const finalButton=document.createElement("button");
        finalButton.textContent="RESTART";
        allflowers.forEach((flower)=>
        flower.classList.remove("hidden"))
                finalButton.addEventListener("click",intro.restart);
                document.querySelector(".restart").appendChild(finalButton)
        
        }



  return {
      showGrid,
      getTokenAt,
      setTokenAt,
      reset,
      win
      }  
    }
    )() 

//the state of the players (names, label, isp2human, unbeatable)
//
const players = ( ()=>{
    const playerMaker = (name,label) =>{
        return {name,label}
        }
    const pOne = playerMaker('jean-jacques', 'foutriquet');
    const pTwo = playerMaker('jean-michel', 'mauviette');
    const updatePlist = () => {
        pOne.name = document.querySelector('.p1name').value;
        pTwo.name = document.querySelector('.p2name').value;
        isp2Human();
        }
    const updateLabel = () => {
        pOne.label = document.querySelector('.p1label').value;
        pTwo.label = document.querySelector('.p2label').value;
        }
    const update =()=>{
        updatePlist();
        updateLabel();
    }
    const isp2Human = ()=>{
        if (iaButton.checked ===true) {return false}  
        else return true }
    const isIaUnbeatable = ()=>{
        if (unbeatBut.checked ===true){return true}
        else return false
    }




    return {
        pOne,
        pTwo,
        update,
        isp2Human,
        isIaUnbeatable
        }
    } 
    )()

//the state of the game (victorycheck, event listeners, IA, whose turn it is) , 

const game = (()=>{

    function bestMove(player){
       let movearr = moveEval(player);
       movearr.sort((a, b) => (a.eval > b.eval) ? 1 : -1).reverse()
       if (player===1){return movearr[0].cell}
       if (player ===0){return movearr[movearr.length-1].cell}
       

        

    }

    function moveEval(player){
        
        

        const grid = gameBoard.showGrid();
        const available=getAvailableMoves(grid);
        const ratedmoves = available.map(
            (available)=>{
                let newgrid= [...grid];
                newgrid.splice(available,1,player);
                return {cell :available, 
                    eval : evaluate(newgrid,player)}
            

            
         }
        )
        
        return ratedmoves
    }

        





        function getAvailableMoves(grid){
            let available =[];
            for (let i=0;i<9;i++){
                if (grid[i]===-1){available.push(i)}
            }
            
            return available}
        

        function evaluate(oldgrid,token){
            

            if (game.victoryCheck(oldgrid)===2){return 0}
            if (game.victoryCheck(oldgrid)===1){return 10}
            if (game.victoryCheck(oldgrid)===0){return -10}

            else{let newtoken
                if (token===1){newtoken=0}
                if (token===0){newtoken=1}
                let available = getAvailableMoves(oldgrid);
                let scores=[]
                
                for (let i=0;i<available.length;i++){
                    
                    let newgrid= [...oldgrid];
                    newgrid.splice(available[i],1,newtoken);
                    scores[i]=evaluate(newgrid,newtoken);
                    
                    }
                    
                    
                if (newtoken ===0) {return Math.min( ...scores )}
                if (newtoken ===1) {return Math.max( ...scores )}
                
                
                    
                    
                 }
            
                
                
            }
      

    function iAchoice(){
        const grid = gameBoard.showGrid();
        let available =[];
        for (let i=0;i<9;i++){
            if (grid[i]===-1){available.push(i)}
        }
        let choice = Math.floor(Math.random() * available.length)
        return available[choice]
    }
    function iAplay(){
        if (players.isIaUnbeatable()===false){
            gameBoard.setTokenAt(iAchoice(),1);
        }
        else gameBoard.setTokenAt(bestMove(1),1);
                    
        

        display.update();
        turn="p1";
        document.querySelector(".toplay").textContent=`${players.pOne.name} to play`;
        if (victoryCheck(gameBoard.showGrid())!==-1){gameBoard.win(victoryCheck(gameBoard.showGrid()))}
    }
    
        





    
    
    function cellClick (){
        //c'est la que ca commence à partir en couille.
        
        
            let celnum = this.getAttribute("number");
            if (gameBoard.getTokenAt(celnum)===-1){
                if (turnCount()===1){
                    gameBoard.setTokenAt(celnum,0);
                    display.update();
                    turn = "p2";
                    document.querySelector(".toplay").textContent=`${players.pTwo.name} to play`;
                    
                    if (victoryCheck(gameBoard.showGrid())!==-1){gameBoard.win(victoryCheck(gameBoard.showGrid()))}
                    else if (players.isp2Human()===false){iAplay()}

                    }
                else if (turnCount()===2){
                    if (gameBoard.showGrid().every((a)=>a===-1)===false){
                    gameBoard.setTokenAt(celnum,1);
                    display.update();
                    turn="p1";
                    document.querySelector(".toplay").textContent=`${players.pOne.name} to play`;
                    
                    if (victoryCheck(gameBoard.showGrid())!==-1){gameBoard.win(victoryCheck(gameBoard.showGrid()))}
                    }
                
                    turn="p1"
                }
            
            }
        

        
    }

    //le machin qui compte les tours. Il marche, mais je sais pas pourquoi.
    let turn = "p1";
    const turnCount = ()=>{
        
        if (turn ==="p1"){
            
            return 1}
        else if (turn ==="p2"){
            
            return 2}
    }
            
       
            

    
    const victoryCheck= (a)=>{
        
        //rows//
        if(a[0]===a[1] && a[1]===a[2] ){return a[0]}
        if(a[3]===a[4] && a[4]===a[5] ){return a[3]}
        if(a[6]===a[7] && a[7]===a[8] ){return a[6]}
        //columns//
        if(a[0]===a[3] && a[3]===a[6] ){return a[0]}
        if(a[1]===a[4] && a[4]===a[7] ){return a[1]}
        if(a[2]===a[5] && a[5]===a[8] ){return a[2]}
        //diags//
        if(a[0]===a[4] && a[4]===a[8] ){return a[0]}
        if(a[2]===a[4] && a[4]===a[6] ){return a[2]}
        
       

        
        
        else {
            if (a.includes(-1)) return -1
            else {
                return 2}
            
            }
        
        }
    




    return{cellClick,
        turnCount,
        victoryCheck,
        moveEval,
        bestMove,
        
        
        
        
        }


} 
)()

//the starting state ()
const allflowers=document.querySelectorAll(".flower")
const upbut=document.querySelector(".update");
const resultField = document.querySelector(".result")
const clearbut=document.querySelector(".clear");

const okBut=document.querySelector('.ok1')
const iaButton = document.querySelector('#isIA');
const unbeatBut = document.querySelector('#unbeatable');
const form1=document.querySelector(".firstForm");
const form2=document.querySelector(".secondform");
const form2p1=document.querySelector(".form2p1");
const form2p2=document.querySelector(".form2p2")



okBut.addEventListener("click",intro.toForm2)



    


upbut.addEventListener("click",intro.toGame)

iaButton.addEventListener("change", function(){
    if (iaButton.checked===true){
        players.update()
        document.querySelector('.p2name').value = "COMPUTER";
        document.querySelector('.p2label').value = "i have no feelings";
        if (players.pOne.name===""){
             document.querySelector('.p1name').value = "human being"}
        if (players.pOne.label===""){
            document.querySelector('.p1label').value = "dumb robot"}
        players.update()
    
        }
    else {document.querySelector('.p2name').value = "";
    document.querySelector('.p2label').value="";
    document.querySelector('.p1name').value = "";
    document.querySelector('.p1label').value = ""}
}
    
        )



///fonds de poches
function generateInsult(){
    let insult1=["Boob","Slime","Table","Ostrich","Gazebo","Splice","Gum","Fountain","Bubble","Fucker","Turkish","Goggle","Very nice","Parrot","German"]
    let insult2=[" Sponges","swimmers"," Dogs","-sitters"," people","fuckers","Lickers","-repair-men"," food", " turnips"," snatchers"," functions", " tables"]
    let totalinsult= `${insult1[(Math.floor(Math.random() * 15))]}${insult2[(Math.floor(Math.random() * 13))]}`
                
    resultField.textContent = ` ${players.pOne.name}, ${players.pTwo.name}, you're both ${totalinsult}   `
    var waat = document.createElement("button");
                waat.textContent="whaaat?";
                waat.addEventListener("click",generateInsult);
                resultField.appendChild(waat)

}
    








    








