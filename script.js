const textArea = document.querySelector('.editor');
const genBigrams = document.getElementById('gen-bigram');
const modalBg = document.querySelector('.modal-bg');
const modalClose = document.querySelector('.modal-close');
const bigramsContainer = document.getElementById('bigrams');
const singleBigrams = document.querySelectorAll('bigram')
const sortDropDown = document.getElementById('sort')

// Sort Functions
const characterCount = string => {
  return string.length;
}
const characterCountNoWs = string => {
  return string.split(/\s/).join('').length;
}
const wordCount = string => {
  return string.split(/\s|[^a-z0-9-']/i).filter(word => word.length > 0).length;
}
const sentenceCount = string => {
  return string.split(/[.!?]|\n/).filter(sentence => sentence.length > 0).length;
}
const paragraphCount = string => {
  return string.split(/\n/g).filter(paragraph => paragraph.length > 0).length;
}
const createBigrams = string => {
  string = string.split(/[\s\n]|[^a-z0-9-']/i).filter(str => str.length > 0);
  let duo;
  let bigrams = {};
  let arr = [];
  for (let idx = 0; idx < string.length - 1; idx++) {
    duo = string[idx].toLowerCase() + " " + string[idx + 1].toLowerCase();
    bigrams[duo] = (bigrams[duo] || 0) + 1;
  }
  for (const bigram in bigrams) {
    arr.push({ couple: bigram, frequency: bigrams[bigram] });
  }
  return arr;
}

// Dom Stat updaters
const updateStats = () => {
  const characters = document.querySelector('.characters');
  const charactersNoWs = document.querySelector('.characters-nows');
  const words = document.querySelector('.words');
  const paragraphs = document.querySelector('.paragraphs');
  const sentences = document.querySelector('.sentences');
  const stats = document.querySelector('.stats')
  let selectedText = '';


  const listenerFunction = (e) => {
    const { value } = e.target;
    characters.innerText = characterCount(value);
    charactersNoWs.innerText = characterCountNoWs(value);
    sentences.innerText = sentenceCount(value);
    words.innerText = wordCount(value);
    paragraphs.innerText = paragraphCount(value);
    if (stats.firstChild.nodeName === "H3") stats.removeChild(stats.firstChild)
  }

  textArea.addEventListener('mouseup', (e) => listenerFunction(e))
  textArea.addEventListener('input', (e) => listenerFunction(e))
  
  document.addEventListener('mouseup', (e) => {
    if ((e.clientY > 119 && e.clientY < 600) && document.getSelection().toString().length > 0) {
      selectedText = document.getSelection().toString()
      characters.innerText = characterCount(selectedText);
      charactersNoWs.innerText = characterCountNoWs(selectedText);
      sentences.innerText = sentenceCount(selectedText);
      words.innerText = wordCount(selectedText);
      paragraphs.innerText = paragraphCount(selectedText);
      let msgNode = document.createElement('h3')
      let highlightMsg = document.createTextNode('Highlighted');
      msgNode.appendChild(highlightMsg)
      if (selectedText.length > 0 && stats.firstChild.nodeName !== 'H3') {
        stats.insertBefore(msgNode, stats.firstChild)
        console.log(stats.firstChild.nodeName)
      }
    }
  })
}

// All modal functions
const createBigram = (node) => {
  let newListEl = document.createElement('li');
  let bigramName = document.createTextNode(`${node.couple}: ${node.frequency}`);
  newListEl.appendChild(bigramName);
  newListEl.classList.add('bigram');
  bigramsContainer.appendChild(newListEl);
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
    while (parentNode.firstChild) parentNode.removeChild(parentNode.firstChild);
    newChildren.sort((a, b) => a.frequency - b.frequency);
    newChildren.forEach(node => createBigram(node));
  } else if (sortDropDown.value === 'sort-descending') {
    while (parentNode.firstChild) parentNode.removeChild(parentNode.firstChild);
    newChildren.sort((a, b) => b.frequency - a.frequency);
    newChildren.forEach(node => createBigram(node));
  }
})

modalClose.addEventListener('click', () => {
  modalBg.classList.remove('bg-active');
  bigramsContainer.innerHTML = '';
})

updateStats();