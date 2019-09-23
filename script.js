

//the display of the board
const display = (()=>{
    const create = ()=>{
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
    update}


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
            game.turnCount = 0
        };
    const win = (val)=>{
            

            if (val === 0){console.log("p1"); 
            resultField.textContent =`Sorry, ${players.pTwo.name},  ${players.pOne.name} thinks you're a ${players.pOne.label} .`
        
        }
            if (val === 1){console.log("p2");
            if (players.isp2Human()===false){
                resultField.textContent = `The machine feels nothing towards you, ${players.pOne.name} .`

            }

            else resultField.textContent = `${players.pTwo.name} said you're quite a  ${players.pTwo.label}. You should try being less ${players.pTwo.label}, my dear ${players.pOne.name}.`}
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

//the state of the players (names, label, isp2human)
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




    return {
        pOne,
        pTwo,
        update,
        isp2Human
        }
    } 
    )()

//the state of the game (victorycheck, event listeners, IA, whose turn it is) , 

const game = (()=>{
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
        gameBoard.setTokenAt(iAchoice(),1);
                display.update();
                turn="p1";
                if (victoryCheck()!==-1){gameBoard.win(victoryCheck())}

    }
    
        





    
    
    function cellClick (){
        let celnum = this.getAttribute("number");
        if (gameBoard.getTokenAt(celnum)===-1){
            if (turnCount()===1){
                gameBoard.setTokenAt(celnum,0);
                display.update();
                turn = "p2";
                if (victoryCheck()!==-1){gameBoard.win(victoryCheck())}
                if (players.isp2Human()===false){iAplay()}

                }
            else if (turnCount()===2){
                gameBoard.setTokenAt(celnum,1);
                display.update();
                turn="p1";
                if (victoryCheck()!==-1){gameBoard.win(victoryCheck())}
            }
         
        }

        console.log("click!", celnum)
    }


    var turn = "p1";
    const turnCount = ()=>{
        
        if (turn ==="p1"){return 1}
        else if (turn ==="p2"){return 2}
    }
            
       
            

    
    const victoryCheck= ()=>{
        const a = gameBoard.showGrid();
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
        
       

        
        
        else {return -1}
        
        }
    




    return{cellClick,
        turnCount,
        victoryCheck,
        
        }


} 
)()

//the starting state ()
const upbut=document.querySelector(".update");
const resultField = document.querySelector(".result")
const clearbut=document.querySelector(".clear");
upbut.addEventListener("click",players.update)
clearbut.addEventListener("click",gameBoard.reset);
const iaButton = document.querySelector('#isIA');
iaButton.addEventListener("change", function(){
    if (iaButton.checked===true){
        document.querySelector('.p2name').value = "COMPUTER";
        document.querySelector('.p2label').value = "i have no feelings";
        document.querySelector('.p1name').value = "human being";
        document.querySelector('.p1label').value = "dumb robot"
        players.update()
    
        }
    else {document.querySelector('.p2name').value = "";
    document.querySelector('.p2label').value="";
    document.querySelector('.p1name').value = "";
    document.querySelector('.p1label').value = ""}
}
    
        )
/* 
    document.querySelector('.p2name').value = "COMPUTAH";
    
} */


display.create();

    








    








