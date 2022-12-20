
const database = {
  'active number': ['0'],
  'active operand one': '0',
  'active operand two': '',
  'active operator': '',
  'operation record': [],
}

const display = document.querySelector('#display');
const operationDisplay = document.querySelector('#display-operation');

display.textContent = database['active number'].join('');

function CreateOprtnObj(operandOne, operandTwo, operator) {
  this.operandOne = operandOne;
  this.operandTwo = operandTwo;
  this.operator = operator;
}

function add(num1, num2) {
  return (+(+(num1) + +(num2)).toFixed(2)).toString();
}

function subtract(num1, num2) {
  return (+(+(num1) - +(num2)).toFixed(2)).toString();
}

function multiply(num1, num2) {
  return (+(+(num1) * +(num2)).toFixed(2)).toString();
}

function divide(num1, num2) {
  return (+(+(num1) / +(num2)).toFixed(2)).toString();
}

function operateObj(obj) {

  const operandOne = obj['operandOne'];
  const operandTwo = obj['operandTwo'];
  const operator = obj['operator'];

  if (operator === '+') {

    return add(operandOne, operandTwo);

  } else if (operator === '−') {

    return subtract(operandOne, operandTwo);

  } else if (operator === '×') {

    return multiply(operandOne, operandTwo);

  } else if (operator === '÷' && operandTwo !== '0') {

    return divide(operandOne, operandTwo);

  } else if (operator === '÷' && operandTwo === '0') {
    
    alert("Non sequitur. There's no logic to division by zero.. \nMust analyze...ana..l..y..ze...");
    clear();
  }
}

function storeDigit(selected) {

  const isDecimalExist = checkDecimal(database['active number']);

  const activeNum = addNumIf(database['active number'], selected, isDecimalExist);

  database['active number'] = activeNum;

  const joinActiveNum = activeNum.join('');

  displaySepNum(joinActiveNum);

  (!database['active operator'])
    ? database['active operand one'] = joinActiveNum
    : database['active operand two'] = joinActiveNum;

}

function addNumIf(array, num, decimal) {

  if (array[0] === '0' && array.length === 1 && num !== '.') { 
    // when a digit is selected and not the decimal point, the first array item is removed only when zero was the only item in the array

    array.splice(0, 1);
    array.push(num);

    return array;

  } else if (array.length === 0 && num === '.') {
    // add zero before decimal point when array was empty

    array = [0];
    array.push(num);

    return array;

  } else if (num === '.' && !decimal) {
    // if num = '.' then check for existing decimal point

    array.push(num);

    return array;

  } else if (num !== '.') {

    array.push(num);

    return array;

  } else {

    return array;
  }

}

function runOperation(selected) {

  const activeOperandOne = database['active operand one'];
  const activeOperandTwo = database['active operand two'];
  const activeOperator = database['active operator'];

  if (activeOperandOne !== '-' && !activeOperandTwo && selected) {

    displayOperation(activeOperandOne, selected);

    database['active operator'] = selected;

    database['active number'] = []; 
    // empty active number is nested inside every condition incase when runOperator is executed but no condition is met

  } else if (activeOperandTwo && selected) {

    database['operation record'].push(new CreateOprtnObj(activeOperandOne, activeOperandTwo, activeOperator));

    const tempSolution = operateObj(database['operation record'][database['operation record'].length - 1]);

    database['active operand one'] = tempSolution;
    database['active operand two'] = '';
    database['active operator'] = selected;

    displayOperation(tempSolution, selected);
    displaySepNum(tempSolution);

    addLiveHistory();

    database['active number'] = [];
    
  } else if (activeOperandTwo && !selected) { 

    database['operation record'].push(new CreateOprtnObj(activeOperandOne, activeOperandTwo, activeOperator));

    const tempSolution = operateObj(database['operation record'][database['operation record'].length - 1]);

    database['active operand one'] = tempSolution;
    database['active operand two'] = '';
    database['active operator'] = '';

    displayOperation(activeOperandOne, activeOperator, activeOperandTwo);
    displaySepNum(tempSolution);

    addLiveHistory();

    database['active number'] = [];
  }
}

function displayOperation(num1, operator, num2) {

  if (!num2) {

    const tempCommaOperandOne = addCommaSeperator(num1);

    operationDisplay.textContent = `${tempCommaOperandOne} ${operator}`

  } else {

    const tempCommaOperandOne = addCommaSeperator(num1);
    const tempCommaOperandTwo = addCommaSeperator(num2);

    operationDisplay.textContent = `${tempCommaOperandOne} ${operator} ${tempCommaOperandTwo} =`;
  }

}

function displaySepNum(num) {

  const tempCommaSolution = addCommaSeperator(num);

  display.textContent = tempCommaSolution;

}

function addCommaSeperator(string) {
  const checkLastDecimal = string.split('');
  const commaArray = [];
  const splitPoint = string.split('.');
  const reverseWholeNum = splitPoint[0].split('').reverse();

  for (let i = 0; i < reverseWholeNum.length; i++) {

    commaArray.unshift(reverseWholeNum[i]);

    if ((i + 1) % 3 === 0 && !(i === reverseWholeNum.length - 1) && reverseWholeNum[i + 1] !== '-') {
      // comma seperator is added only when item index is divisible by 3 but not if it is the last index and not when the preceeding item is '-'

      commaArray.unshift(',');
    }
  }

  const joinWholeNumber = commaArray.join('');

  if (splitPoint[1]) {

    return `${joinWholeNumber}.${splitPoint[1]}`;

  } else if (checkLastDecimal[checkLastDecimal.length - 1] === '.'){

    return `${joinWholeNumber}.`;

  } else {

    return joinWholeNumber;

  }
}

function addLiveHistory() {

  const historyBody = document.querySelector('.history-body');

  if (historyBody) {

    addHistoryContent(database['operation record'], database['operation record'].length - 1);
  }
}

function activateObj(item) {
  
  const tempOpRecord = database['operation record'];

  database['active operand one'] = operateObj(tempOpRecord[item]);

  displayOperation(tempOpRecord[item]['operandOne'], tempOpRecord[item]['operator'], tempOpRecord[item]['operandTwo']);
  displaySepNum(database['active operand one']);

}

function clear() {

  database['active number'] = ['0'];
  database['active operand one'] = database['active number'][0];
  database['active operand two'] = '';
  database['active operator'] = '';
  database['operation record'] = [];
  operationDisplay.textContent = '';
  display.textContent = database['active number'].join('');

  const historyBody = document.querySelector('.history-body');

  if (historyBody) {

    while (historyBody.hasChildNodes()) {

    clearHistory(historyBody);
    
    }
  }
}

function clearEntry() {

  database['active number'] = ['0'];
  database['active operand one'] = database['active number'][0];
  database['active operand two'] = '';
  database['active operator'] = '';
  operationDisplay.textContent = '';
  display.textContent = database['active number'].join('');

}

function backspace(array, firstNum, secondNum, activeOp) {

  if (!secondNum && !activeOp) {

    array = firstNum.split(''); // array needs to be reassigned since it may be empty after passing the first condition of runOperation
    array.splice(-1,1);
    firstNum = array.join('');

    database['active operand one'] = firstNum;

  } else {

    array.splice(-1,1);
    secondNum = array.join('');

    database['active operand two'] = secondNum;
  }

  database['active number'] = array;

  const tempJoinArray = array.join('');

  displaySepNum(tempJoinArray, array[array.length - 1]);

}

function toggleHistory() {

  const oprtnRecord = database['operation record'];

  const appBody = document.querySelector('#calc-container');
  const calculatorBody = document.querySelector('#calculator');
  const historyContainer = document.querySelector('#history');
  const historyBody = document.querySelector('#list-container');
  
  appBody.classList.toggle('calc-container-history');
  historyContainer.classList.toggle('history-container');
  calculatorBody.classList.toggle('calculator-history');
  historyBody.classList.toggle('history-body');

  if (historyBody.classList.contains('history-body')) {

    for (let i = 0; i < oprtnRecord.length; i++) {

      addHistoryContent(oprtnRecord, i);
    }

  } else {

    while (historyBody.hasChildNodes()) {
      clearHistory(historyBody);
    }
  }
}

function addHistoryContent(array, arrayItem) {

  const historyBody = document.querySelector('#list-container');

  const divContainer = document.createElement('div');
  const divOperation = document.createElement('div');
  const divSolution = document.createElement('div');

  divContainer.classList.add(`item-container`);
  divContainer.setAttribute('data-item', arrayItem);
  divOperation.classList.add(`history-operation`);
  divOperation.setAttribute('data-item', arrayItem);
  divSolution.classList.add(`history-solution`);
  divSolution.setAttribute('data-item', arrayItem);

  const tempSolution = operateObj(array[arrayItem]);

  const tempCommaOperandOne = addCommaSeperator(array[arrayItem]['operandOne']);
  const tempCommaOperandTwo = addCommaSeperator(array[arrayItem]['operandTwo']);
  const tempCommaSolution = addCommaSeperator(tempSolution);

  divOperation.textContent = `${tempCommaOperandOne} ${array[arrayItem]['operator']} ${tempCommaOperandTwo} = `;
  divSolution.textContent = `${tempCommaSolution}`;

  historyBody.appendChild(divContainer);
  divContainer.appendChild(divOperation);
  divContainer.appendChild(divSolution);

}

function clearHistory(parentNode) {

  parentNode.removeChild(parentNode.firstChild);

}

function checkDecimal(array) {

  return array.includes('.');

}


const selectContents = document.querySelectorAll('span');

Array.from(selectContents).forEach((content) => {

  const getClassList = Array.from(content.classList);

  if (getClassList.includes('num')) {

    content.addEventListener('click', () => {

      storeDigit(content.textContent);

    });
  } else if (getClassList.includes('oprtor')) {

    content.addEventListener('click', () => {

      runOperation(content.textContent);

    });
  } else if (getClassList.includes('oprte')) {

    content.addEventListener('click', () => {

      runOperation();

    });
  } else if (getClassList.includes('clear-entry')) {

    content.addEventListener('click', () => {

      clearEntry();

    });
  } else if (getClassList.includes('clear')) {

    content.addEventListener('click', () => {

      clear();

    });
  } else if (getClassList.includes('delete')) {

    content.addEventListener('click', () => {

      backspace(database['active number'], database['active operand one'], database['active operator']);

    });
  } else if (getClassList.includes('history')) {

    content.addEventListener('click', () => {

      toggleHistory();

    });
  } 
});


window.addEventListener('click', passLiveClick); // for the live history list

function passLiveClick(e) {

  if (e.target.dataset.item) {
    
    activateObj(e.target.dataset.item);
  }

}

window.addEventListener('keydown', passLiveKeyDown);
window.addEventListener('keyup', passLiveKeyUp);

function passLiveKeyDown(e) {

  (e.shiftKey)

     ? passDownWithShift(e)
     : passDownNoShift(e);

}

function passDownWithShift(e) {

  const liveKeyCode = e.keyCode;
  const selectNode = document.querySelectorAll(`span[data-code="${liveKeyCode}"]`);

  Array.from(selectNode).forEach((content) => {

    const getClassList = Array.from(content.classList);

    if (getClassList.includes('oprtor')) {

      content.style.backgroundColor = '#262626';
      runOperation(content.textContent);
    }
  });

}

function passDownNoShift(e) {

  const liveKeyCode = e.keyCode;
  const selectNode = document.querySelector(`span[data-code="${liveKeyCode}"]`);

  const activeEl = document.activeElement; // when there is an active/focused element, assign it to a variable

  if (liveKeyCode >= 48 && liveKeyCode <= 57 || liveKeyCode === 190) {
    
    selectNode.style.backgroundColor = '#262626';
    storeDigit(selectNode.textContent);

  } else if (liveKeyCode === 189 || liveKeyCode === 191) {
    
    selectNode.style.backgroundColor = '#262626';
    runOperation(selectNode.textContent);

  } else if (liveKeyCode === 187) {

    selectNode.style.backgroundColor = '#002c28';
    runOperation();

  } else if (liveKeyCode === 8) {

    selectNode.style.backgroundColor = '#262626';
    backspace(database['active number'], database['active operand one'], database['active operator']);

  } else if (liveKeyCode === 13) {

    passEnterKeyDown(activeEl);

  }
}

function passEnterKeyDown(activeEl) {

  const getActiveElClass = activeEl.getAttribute('class');
  const childSpan = activeEl.firstElementChild;

  if (getActiveElClass === 'digit btn' || getActiveElClass === 'symbol btn') { // when a digit is focused, run enterkey as clicking the focused button

    childSpan.style.backgroundColor = '#262626';
    storeDigit(childSpan.textContent);
    
  } else if (getActiveElClass === 'operator btn') {

    childSpan.style.backgroundColor = '#262626';
    runOperation(childSpan.textContent);

  } else if (getActiveElClass === 'operate btn') {

    childSpan.style.backgroundColor = '#002c28';
    runOperation();

  } else if (getActiveElClass === 'clear btn') {

    childSpan.style.backgroundColor = '#262626';
    clear();

  } else if (getActiveElClass === 'clear-entry btn') {

    childSpan.style.backgroundColor = '#262626';
    clearEntry();

  } else if (getActiveElClass === 'delete btn') {

    childSpan.style.backgroundColor = '#262626';
    backspace(database['active number'], database['active operand one'], database['active operand two'], database['active operator']);

  } else if (getActiveElClass === 'history btn') {

    childSpan.style.backgroundColor = '#262626';
    toggleHistory();

  } else { // when no activeEL, execute runOperator with no parameter

    const assignKey = document.querySelector(`.oprte`);

    assignKey.style.backgroundColor = '#002c28';
    runOperation();
    
  }
}

function passLiveKeyUp(e) {

  const liveKeyCode = e.keyCode;
  const selectNode = document.querySelectorAll(`span[data-code="${liveKeyCode}"]`);
  const activeEl = document.activeElement;

  Array.from(selectNode).forEach((content) => {

    const getClassList = Array.from(content.classList);

    if (getClassList.includes('num')) {

      content.style.backgroundColor = '#494848';

    } else if (
      getClassList.includes('oprtor') 
      || getClassList.includes('history')
      || getClassList.includes('clear')
      || getClassList.includes('clear-entry')
      || getClassList.includes('delete')) {

      content.style.backgroundColor = '#363636';

    } else if (getClassList.includes('oprte')) {

      content.style.backgroundColor = '#00564d';

    } 
  });

  if (liveKeyCode === 13) {
      
    passEnterKeyUp(activeEl);

  }
}

function passEnterKeyUp(activeEl) {

  const getActiveElClass = activeEl.getAttribute('class');
  const childSpan = activeEl.firstElementChild;

  if (getActiveElClass === 'digit btn' || getActiveElClass === 'symbol btn') { // when a digit is focused, run enterkey as clicking the focused button

    childSpan.style.backgroundColor = '#494848';
    
  } else if (
    getActiveElClass === 'operator btn'
    || getActiveElClass === 'clear btn'
    || getActiveElClass === 'clear-entry btn'
    || getActiveElClass === 'delete btn'
    || getActiveElClass === 'history btn'
    ) {

    childSpan.style.backgroundColor = '#363636';

  } else if (getActiveElClass === 'operate btn') {

    childSpan.style.backgroundColor = '#00564d';

  } else {

    const assignKey = document.querySelector(`.oprte`);

    assignKey.style.backgroundColor = '#00564d';
    
  }
}
