// const savedText = JSON.parse(localStorage.getItem('textArea'))
const textArea = document.querySelector('.editor');
const genBigrams = document.getElementById('gen-bigram');
const modalBg = document.querySelector('.modal-bg');
const modalClose = document.querySelector('.modal-close');
const bigramsContainer = document.getElementById('bigrams');
const singleBigrams = document.querySelectorAll('bigram')
const sortDropDown = document.getElementById('sort')


// if(savedText) textArea.innerText = savedText

// Count includes white spaces, simple length of entered string.
const characterCount = string => {
  return string.length;
}

// Count exludes white spaces, Empty strings are escaped when the array is joined back into a block of text and the length is returned.
const characterCountNoWs = string => {
  return string.split(/\s/).join('').length;
}

// Counts words split by regexp of all non alpha-numeric characters or whitespaces, on google docs hyphenated words are counted as 1. Escapes empty strings.
const wordCount = string => {
  return string.split(/\s|[^a-z0-9-']/i).filter(word => word.length > 0).length;
}

// Counts sentences split by periods or exclamation point!, if the period is at the end of the paragraph it adds a space for some reason. Escapes empty strings.
const sentenceCount = string => {
  return string.split(/[.!?]|\n/).filter(sentence => sentence.length > 0).length;
}

// Counts sentences split by paragraph. I run a simple split by regex line break, then i filter the array of results to only include paragraphs with lengths greater than 0 in order to ignore empty spaces being counted as a paragraph.
const paragraphCount = string => {
  return string.split(/\n/g).filter(paragraph => paragraph.length > 0).length;
}

const createBigrams = string => {
  string = string.split(/[\s\n]|[^a-z0-9-']/i).filter(str => str.length > 0);
  let duo;
  let bigrams = {};
  let arr = [];
  // For loop to create frequency counter
  for (let idx = 0; idx < string.length - 1; idx++) {
    duo = string[idx].toLowerCase() + " " + string[idx + 1].toLowerCase(); // ignore casing
    bigrams[duo] = (bigrams[duo] || 0) + 1; // increase counter
  }

  for (const bigram in bigrams) {
    arr.push({ couple: bigram, frequency: bigrams[bigram] });
  }
  return arr;
}


// const updateLS = () => {
//   const docText = document.querySelector('textarea')
//   localStorage.setItem('doc', JSON.stringify(docText))
// }

// setInterval(() => updateLS(), 2000)


const updateStats = () => {
  const characters = document.querySelector('.characters');
  const charactersNoWs = document.querySelector('.characters-nows');
  const words = document.querySelector('.words');
  const paragraphs = document.querySelector('.paragraphs');
  const sentences = document.querySelector('.sentences');

  textArea.addEventListener('input', (e) => {
    const { value } = e.target;
    characters.innerText = characterCount(value);
    charactersNoWs.innerText = characterCountNoWs(value);
    sentences.innerText = sentenceCount(value);
    words.innerText = wordCount(value);
    paragraphs.innerText = paragraphCount(value);
    // savedText.innerText = value
  })
}

const createBigram = (node) => {
  let newP = document.createElement('li');
  let bigramName = document.createTextNode(`${node.couple}: ${node.frequency}`);
  newP.appendChild(bigramName);
  newP.classList.add('bigram');
  bigramsContainer.appendChild(newP);
}

genBigrams.addEventListener('click', () => {
  const bigrams = createBigrams(textArea.value);
  const totalBigrams = document.querySelector('.total-bigrams');
  modalBg.classList.add('bg-active');
  totalBigrams.innerText = bigrams.length;
  bigrams.forEach(bigram => {
    createBigram(bigram)
  })
})

sortDropDown.addEventListener('change', () => {
  const parentNode = bigramsContainer;
  const newChildren = createBigrams(textArea.value);
  if (sortDropDown.value === 'sort-ascending') {
    while (parentNode.firstChild) parentNode.removeChild(parentNode.firstChild)
    newChildren.sort((a, b) => a.frequency - b.frequency)
    newChildren.forEach(node => createBigram(node))
  } else if (sortDropDown.value === 'sort-descending') {
    while (parentNode.firstChild) parentNode.removeChild(parentNode.firstChild)
    newChildren.sort((a, b) => b.frequency - a.frequency)
    newChildren.forEach(node => createBigram(node))
  }
})

  modalClose.addEventListener('click', () => {
    modalBg.classList.remove('bg-active');
    bigramsContainer.innerHTML = '';
  })



//TODO - save to local storage

// let autoSave = setInterval(() => {
//   localStorage.setItem('textArea', JSON.stringify(textArea.value))
//   console.log(textArea.value)
// },2000)

updateStats();