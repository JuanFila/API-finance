let transactions = []

function createTransactionContainer(id) {
    const container = document.createElement('div')
    container.classList.add('transaction')
    container.id = `transaction-${id}`
    return container
  }
  
  function createTransactionTitle(name) {
    const title = document.createElement('span')
    title.classList.add('transaction-title')
    title.textContent = name
    return title
  }

function createTransactionAmount(amount) {
    const span = document.createElement('span')
    span.classList.add('transaction-amount')
    const formater = Intl.NumberFormat('pt-BR', {
      compactDisplay: 'long',
      currency: 'BRL',
      style: 'currency',
    })
    const formatedAmount = formater.format(amount)
    if (amount > 0) {
      span.textContent = `${formatedAmount} C`
      span.classList.add('credit')
    } else {
      span.textContent = `${formatedAmount} D`
      span.classList.add('debit')
    }
    return span
  }


function renderTransaction(transaction) {
    const container = createTransactionContainer(transaction.id)
    const title = createTransactionTitle(transaction.name)
    const amount = createTransactionAmount(transaction.amount)
  
    document.querySelector('#transactions').append(container)
    container.append(title, amount)
  }


  async function fetchTransactions() {
    return await fetch('http://localhost:3000/transaction').then(res => res.json())
  }

  function updateBalance() {
    const balanceSpan = document.querySelector('#balance')
    const balance = transactions.reduce((sum, transaction) => sum + transaction.amount, 0)
    const formater = Intl.NumberFormat('pt-BR', {
      compactDisplay: 'long',
      currency: 'BRL',
      style: 'currency'
    })
    balanceSpan.textContent = formater.format(balance)
  }

  async function setup() {
    const results = await fetchTransactions()
    transactions.push(...results)
    transactions.forEach(renderTransaction)
    updateBalance()
  }
  
async function saveTransaction(ev) {
    ev.preventDefault()
  
    const name = document.querySelector('#name').value
    const amount = parseFloat(document.querySelector('#amount').value)
  
    const response = await fetch('http://localhost:3000/transaction', {
      method: 'POST',
      body: JSON.stringify({ name, amount }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const transaction = await response.json()
    transactions.push(transaction)
    renderTransaction(transaction)
  
    ev.target.reset()
    updateBalance()
  }

  
  document.addEventListener('DOMContentLoaded', setup)
  document.querySelector('form').addEventListener('submit', saveTransaction)
