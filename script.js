const notes = JSON.parse(localStorage.getItem('notes'))
const textArea = document.querySelector('.editor')
const characters = document.querySelector('.characters')
const charactersNoWs = document.querySelector('.characters-nows')
const words = document.querySelector('.words')
const paragraphs = document.querySelector('.paragraphs')
const sentences = document.querySelector('.sentences')

// Count includes white spaces
const characterCount = body => {
  return body.length
}

// Count exludes white spaces, Empty strings are escaped when the array is joined back into a block of text.
const characterCountNoWs = body => {
  return body.split(/\s/).join('').length;
}

// Counts words split by spaces, on google docs hyphenated words are counted as 1. Escapes empty strings.
const wordCount = body => {
  return body.split(/\s|[!@#$%^&*()]/).filter(word => word.length > 0).length;
}

// Counts sentences split by periods, if the period is at the end of the paragraph it adds a space for some reason. Escapes empty strings.
const sentenceCount = body => {
  return body.split('.').filter(sentence => sentence.length > 0).length;
}

// Counts sentences split by paragraph, used for dom manipulation. Closing tags indicate the start of a new line, we then can count the paragraphs from this point.
const paragraphCount = body => {
  return body.split('</p>').filter(para => para.length > 0).length
}

const createBigram = body => {
  if (body.split(' ').length === 2) return {bigram: body, count: 1}

  let duo;
  let bigrams = {}
  body = body.split(' ')

  // For loop to create frequency counter
  for (let idx = 0; idx < body.length - 1; idx++) {
      duo = body[idx].toLowerCase() + " " + body[idx + 1].toLowerCase() // ignore casing
      bigrams[duo] = (bigrams[duo] || 0) + 1 // increase counter
  }

  let arr = [];
  for (const bigram in bigrams) {
    arr.push({ bigram: bigram, frequency: bigrams[bigram] })
  }

  return arr;
}




const updateTextArea = (text = '') => {
  textArea.addEventListener('input', (e) => {
    const { value } = e.target;
    characters.innerText = characterCount(value)
    charactersNoWs.innerText = characterCountNoWs(value)
    sentences.innerText = sentenceCount(value)
    words.innerText= wordCount(value)
    console.log(value.length)
  })
}

updateTextArea()