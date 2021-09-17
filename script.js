let boardSize = 3;
let player = 'X'; // O | X
let arrayContainer = [];
function createBoard(size) {
	player = 'X';
	document.getElementsByClassName('winner')[0].classList.add('hide');
	document.getElementsByClassName('winner-id').innerHTML = null;
	document.getElementsByClassName('player-turn')[0].innerHTML = player;
	arrayContainer = [];
	document.getElementById('board').innerHTML = '';
	let html = '';
	const s = size * size;
	let idx = 0;
	for (let i = 1; i <= s; i++) {
		if(!(idx in arrayContainer)) arrayContainer.push([]);
		html += `<input type="text" class="item" id="t${idx}-${i}" onclick="assign(${idx},${i})" readonly />`;
		arrayContainer[idx].push(null);
		if(i < size) continue;
		if(i % size == 0) {
			idx++;
			html += `<br>`;
		}
	}
	document.getElementById('board').innerHTML = html;
}

function assign(hIdx, vIdx) {
	const v = document.getElementById(`t${hIdx}-${vIdx}`);
	if(v.value == ''){
		document.getElementById(`t${hIdx}-${vIdx}`).value = player;
		document.getElementById(`t${hIdx}-${vIdx}`).disabled = true;
		const verticalIdx = vIdx > boardSize ? (vIdx % boardSize == 0 ? boardSize : vIdx % boardSize) : vIdx;
		arrayContainer[hIdx][verticalIdx-1] = player;
		checkWinning(hIdx, verticalIdx -1);
		player = player == 'X' ? 'O' : 'X';
		document.getElementsByClassName('player-turn')[0].innerHTML = player;

		// *  check if tie
		if(arrayContainer.every(v => v.every(vv => vv))) {
			alert('Tie')
		}
	}
}

function checkWinning(hIdx, vIdx) {
	// * do check straigh left or right
	const currentContainer = arrayContainer[hIdx];
	const currentData = arrayContainer[hIdx][vIdx];
	let pivot = 0;
	for (let i = 0; i < currentContainer.length; i++) {
		// * check if empty then skip
		if(!currentContainer[i]) {
			pivot = 0;
			continue;
		}
		if(currentContainer[i] == currentData) pivot++; // if found same then assign to pivot
		else pivot--;
		// * we have a winner
		if(pivot == 3) break;
	}
	if(pivot == 3) return setWinner(currentData);

	// * do check vertical
	pivot = 0;
	for (let i = 0; i < arrayContainer.length; i++) {
		// * check if empty then skip
		if(!arrayContainer[i][vIdx]) {
			pivot = 0;
			continue;
		}
		if(arrayContainer[i][vIdx] == currentData) pivot++; // if found same then assign to pivot
		else pivot--;
		// * we have a winner
		if(pivot == 3) break;
	}
	if(pivot == 3) return setWinner(currentData);

	// * do check diagonal
	// TODO:nady -> still some bugs in this diagonal section
	pivot = 0;
	for (let i = 0; i < arrayContainer.length; i++) {
		let loop = arrayContainer[i];
		for (let ii = 0; ii < loop.length; ii++) {
			if(loop[ii] == currentData) {
				pivot = 1
				// * search on next row

				if(i-1 in arrayContainer && arrayContainer[i-1][ii-1] == currentData) pivot++;
				if(i-2 in arrayContainer && arrayContainer[i-2][ii-2] == currentData) pivot++;

				if(i+1 in arrayContainer && arrayContainer[i+1][ii+1] == currentData) pivot++;
				if(i+2 in arrayContainer && arrayContainer[i+2][ii+2] == currentData) pivot++;

				if(pivot == 3) return setWinner(currentData);
			}
		}
	}
	if(pivot == 3) return setWinner(currentData);
}

function checkloop(loop, currentData) {
	let pivot = 0;
	for (let ii = 0; ii < loop.length; ii++) {
		if(loop[ii] == currentData) {
			pivot++;
			if(ii + 2 < boardSize && loop[ii+1] == currentData) pivot++;
			if(ii + 2 < boardSize && loop[ii+2] == currentData) pivot++;
			console.log('ii', ii, pivot);
			break;
		}
	}
	return pivot;
}

function setWinner(player) {
	document.getElementsByClassName('winner')[0].classList.remove('hide');
	document.getElementsByClassName('winner-id')[0].innerHTML = player;
	var elements = document.getElementsByClassName('item');
	for (var i = 0, len = elements.length; i < len; ++i) {
		elements[i].classList.add("disabled");
	}
	alert('player ' + player + ' is the winner');
}

function reset(){
	createBoard(boardSize);
}

document.addEventListener('readystatechange', event => { 
    // When window loaded ( external resources are loaded too- `css`,`src`, etc...) 
    if (event.target.readyState === "complete") {
        createBoard(boardSize);
    }
});

function changeSize() {
	const size = document.getElementById('size').value;
	if(size >= 3) {
		boardSize = size;
	}
}