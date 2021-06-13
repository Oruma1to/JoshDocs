// const savedText = localStorage.getItem('textArea')
const textArea = document.querySelector('.editor')
const characters = document.querySelector('.characters')
const charactersNoWs = document.querySelector('.characters-nows')
const words = document.querySelector('.words')
const paragraphs = document.querySelector('.paragraphs')
const sentences = document.querySelector('.sentences')
const genBigrams = document.querySelector('#gen-bigram')
const allBigrams = document.querySelectorAll('.bigram')
const modalBg = document.querySelector('.modal-bg')
const modalClose = document.querySelector('.modal-close')
const modalBigram = document.querySelector('.modal-bigram')
const modalBigrams = document.querySelector('#bigrams')


// Count includes white spaces, simple length of entered string.
const characterCount = string => {
  return string.length
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
  return string.split(/[.!]/).filter(sentence => sentence.match(/[a-z0-9]/i)).length;
}

// Counts sentences split by paragraph. I run a simple split by regex line break, then i filter the array of results to only include paragraphs with lengths greater than 0 in order to ignore empty spaces being counted as a paragraph.
const paragraphCount = string => {
  return string.split(/\n/g).filter(paragraph => paragraph.length > 0).length
}

const createBigram = string => {
  let duo;
  let bigrams = {}
  string = string.split(/[\s\n]|[^a-z0-9-']/i).filter(str => str.length > 0)

  // For loop to create frequency counter
  for (let idx = 0; idx < string.length - 1; idx++) {
      duo = string[idx].toLowerCase() + " " + string[idx + 1].toLowerCase() // ignore casing
      bigrams[duo] = (bigrams[duo] || 0) + 1 // increase counter
  }

  let arr = [];
  for (const bigram in bigrams) {
    arr.push({ couple: bigram, frequency: bigrams[bigram] })
  }

  return arr;
}


const updateStats = () => {
  textArea.addEventListener('input', (e) => {
    const { value } = e.target;
    characters.innerText = characterCount(value)
    charactersNoWs.innerText = characterCountNoWs(value)
    sentences.innerText = sentenceCount(value)
    words.innerText = wordCount(value)
    paragraphs.innerText = paragraphCount(value)
  })
}



genBigrams.addEventListener('click', () => {
  modalBg.classList.add('bg-active')
  let bigrams = createBigram(textArea.value)
  bigrams.sort((a,b)=> b.frequency - a.frequency)
  const totalBigrams = document.querySelector('.total-bigrams')
  totalBigrams.innerText = bigrams.length
  bigrams.forEach(bigram => {
    let newP = document.createElement('li')
    let bigramData = document.createTextNode(`${bigram.couple}: ${bigram.frequency}`)
    newP.appendChild(bigramData)
    newP.classList.add('bigram')
    modalBigrams.appendChild(newP)
  })
})

modalClose.addEventListener('click', () => {
  modalBg.classList.remove('bg-active')
  modalBigrams.innerHTML= ''
})

//TODO - save to local storage

// let autoSave = setInterval(() => {
//   localStorage.setItem('textArea', JSON.stringify(textArea.value))
//   console.log(textArea.value)
// },2000)

updateStats()