// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading.
document.addEventListener('DOMContentLoaded', function(){
	console.log('connected')
	getAllQuote();

	const form = document.querySelector('form')
	form.addEventListener('submit', submitForm)
})

function submitForm(e){
	e.preventDefault();
	postNewQuote();
	e.target.reset();
}

function getAllQuote(){
	fetch('http://localhost:3000/quotes')
		.then(res => res.json())
		.then(quotes => {
			quotes.forEach(quote => {
				renderQuote(quote)
			})
		})
}

function renderQuote(quote){
	const showQuote = document.querySelector('#quote-list')

	const quoteList = document.createElement('li')
	quoteList.classList.add('quote-card')
	quoteList.id = `quote-${quote.id}`
	showQuote.appendChild(quoteList)

	const quoteBlock = document.createElement('blockquote')
	quoteBlock.classList.add('blockquote')
	quoteList.appendChild(quoteBlock)

	const quotePtag = document.createElement('p')
	quotePtag.classList.add('mb-0')
	quotePtag.innerText = quote.quote
	quoteBlock.appendChild(quotePtag)

	const quoteFooter = document.createElement('footer')
	quoteFooter.classList.add('blockquote-footer')
	quoteFooter.innerText = quote.author
	quoteBlock.appendChild(quoteFooter)

	const quoteBr = document.createElement('br')
	quoteBlock.appendChild(quoteBr)

	const likeBtn = document.createElement('button')
	likeBtn.classList.add('btn-success')
	likeBtn.innerText = `Likes: ${quote.likes} `
	quoteBlock.appendChild(likeBtn)

	likeBtn.addEventListener('click', () => {
		increaseLikes(quote)
	})


	const deleteBtn = document.createElement('button')
	deleteBtn.classList.add('btn-danger')
	deleteBtn.innerText = 'Delete'
	quoteBlock.appendChild(deleteBtn)

	deleteBtn.addEventListener('click', () => {
		deleteQuote(quote)
	});

}

// function newQuote(){
// 	return document.querySelector('#new-quote')
// }

// function authorField(){
// 	return document.querySelector('#author')
// }

function postNewQuote(quote){

	const addQuote = document.querySelector('#new-quote').value
	const addAuthor = document.querySelector('#author').value

	let data = {'quote': addQuote, 'author': addAuthor, 'likes': 0}

	fetch('http://localhost:3000/quotes', {
		method: 'POST',
		headers: {
			"Content-Type": "application/json",
  			"Accept": "application/json"
		},
		body: JSON.stringify(data)
	})
	.then(res => res.json())
	.then(quote => {
		
		renderQuote(quote)
	})
}

function deleteQuote(quote){
	fetch(`http://localhost:3000/quotes/${quote.id}`, {
		method: 'DELETE'
	})
	.then(res => res.json())
	.then(() => {
		document.querySelector(`#quote-${quote.id}`).remove()

	})
}

function increaseLikes(quote){
	debugger
	fetch(`http://localhost:3000/quotes/${quote.id}`, {
		method: 'PATCH',
		headers: {
			"Content-Type": "application/json",
  			"Accept": "application/json"
		},
		body: JSON.stringify({
			likes: ++quote.likes
		})
	}).then(res => res.json())
	.then(updateQuote => {
		debugger
		document.querySelector(`#quote-${updateQuote.id} > blockquote > .btn-success`).innerText = `Likes: ${updateQuote.likes} `
	})
}



