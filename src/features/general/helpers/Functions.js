// A function that returns an array of indexes corresponding the slots that are part of a winning streak
// on a two dimensionnal board, whatever the (reasonable) size
// (previous) and (current) are arrays representing the two dimensionnal board at different steps
// (scoreTarget) is the INT number of slots of the same value in line needed to win
// (rowLength) is the INT number of slots in a single row of the board
export function calculateWinner(previous, current, scoreTarget, rowLength) {
  let winSlots = [];
  let finalWinSlots = [];

  // We look for the differences between the current and previous board
  let indexes = [];
  for(const i in current) {
    if(current[i] !== previous[i]) indexes.push(parseInt(i));
  }

  // console.log(indexes);
  // We loop through each of these slots, as potential part of a winning streak
  for (let j = indexes.length - 1; j >= 0; j--) {
    const index = indexes[j];
    // We dont run the check if the current index is already marked as part of a streak
    if(!finalWinSlots.includes(index)) {
      const currentValue = current[index];
      // We search for streaks of the same value on all 4 axes and 8 directions, starting from the current index
      // Horizontal axis
      let streakL = 0;
      for(let i = index; i > index - scoreTarget; i--) {
        if(current[i-1] && current[i-1] === currentValue && i % rowLength !== 0) {
          streakL++;
          winSlots.push(i-1);
        } else {
          break;
        }
      }
      let streakR = 0;
      for(let i = index; i < index + scoreTarget; i++) {
        if(current[i+1] && current[i+1] === currentValue && (i+1) % rowLength !== 0) {
          streakR++;
          winSlots.push(i+1);
        } else {
          break;
        }
      }
      // We add the streak of both direction together, and check if it reaches the required score
      const isWinHoriz = (streakL + streakR) >= scoreTarget - 1 ? true : false;
      // console.log(streakL);
      // console.log(streakR);
      // console.log("WIN HORIZ:", isWinHoriz);
      
      // If it does, we add the current index to our work variable as part of the streak,
      // then add the whole thing to our return variable
      if(isWinHoriz) {
        winSlots.push(index);   
        finalWinSlots = finalWinSlots.concat(winSlots);
      }     
      winSlots = [];

      // Vertical axis
      let streakT = 0;
      for(let i = index; i > index - (scoreTarget * rowLength); i -= rowLength) {
        if(current[i-rowLength] && current[i-rowLength] === currentValue) {
          streakT++;
          winSlots.push(i-rowLength);      
        } else {
          break;
        }
      }
      let streakB = 0;
      for(let i = index; i < index + (scoreTarget * rowLength); i += rowLength) {
        if(current[i+rowLength] && current[i+rowLength] === currentValue) {
          streakB++;
          winSlots.push(i+rowLength);      
        } else {
          break;
        }
      }
      const isWinVert = (streakT + streakB) >= scoreTarget - 1 ? true : false;
      // console.log(streakT);
      // console.log(streakB);
      // console.log("WIN VERT:", isWinVert);

      if(isWinVert) {
        winSlots.push(index);
        finalWinSlots = finalWinSlots.concat(winSlots);
      }
      winSlots = [];

      // Top diagonal axis
      let streakTL = 0;
      for(let i = index; i > index - scoreTarget * (rowLength + 1); i -= (rowLength + 1)) {
        if(current[i-rowLength-1] && current[i-rowLength-1] === currentValue && i % rowLength !== 0) {
          streakTL++;
          winSlots.push(i-rowLength-1);      
        } else {
          break;
        }
      }
      let streakBR = 0;
      for(let i = index; i < index + scoreTarget * (rowLength + 1); i += (rowLength + 1)) {
        if(current[i+rowLength+1] && current[i+rowLength+1] === currentValue && (i+1) % rowLength !== 0) {
          streakBR++;
          winSlots.push(i+rowLength+1);      
        } else {
          break;
        }
      }  
      const isWinDiagT = (streakTL + streakBR) >= scoreTarget - 1 ? true : false;
      // console.log(streakTL);
      // console.log(streakBR);
      // console.log("WIN DIAGT:", isWinDiagT);

      if(isWinDiagT) {
        winSlots.push(index);
        finalWinSlots = finalWinSlots.concat(winSlots);
      }
      winSlots = [];

      // Bottom diagonal axis
      let streakTR = 0;
      for(let i = index; i > index - scoreTarget * (rowLength - 1); i -= (rowLength - 1)) {
        if(current[i-rowLength+1] && current[i-rowLength+1] === currentValue && (i+1) % rowLength !== 0) {
          streakTR++;
          winSlots.push(i-rowLength+1);      
        } else {
          break;
        }
      }  
      let streakBL = 0;
      for(let i = index; i < index + scoreTarget * (rowLength - 1); i += (rowLength - 1)) {
        if(current[i+rowLength-1] && current[i+rowLength-1] === currentValue && i % rowLength !== 0) {
          streakBL++;
          winSlots.push(i+rowLength-1);      
        } else {
          break;
        }
      }
      const isWinDiagB = (streakTR + streakBL) >= scoreTarget - 1 ? true : false;
      // console.log(streakTR);
      // console.log(streakBL);
      // console.log("WIN DIAGB:", isWinDiagB);

      if(isWinDiagB) {
        winSlots.push(index);
        finalWinSlots = finalWinSlots.concat(winSlots);
      }
      winSlots = [];
    }
  } 

  // console.log(finalWinSlots);  
  return finalWinSlots;
}

////////////////////////////////////////////////////////////////////////////////////////////////////