const githubUser = 'flpmartins'

let currentIndex = 0
let totalProjetos = 0
const projetosPorPagina = 3

async function buscarReposStarred() {
    const res = await fetch(`https://api.github.com/users/${githubUser}/repos`)
  
    if (res.status !== 200) {
      const err = await res.json()
      console.error('Erro ao buscar repositórios:', err.message)
      return
    }
  
    const repos = await res.json()
    const reposStarred = []
  
    repos.forEach(repo => {
      if (repo.stargazers_count > 0) {
        reposStarred.push({
          name: repo.name,
          html_url: repo.html_url
        })
      }
    })
  
    renderizarProjetos(reposStarred)
    buscarAvatar()
}

async function buscarAvatar() {
  const userRes = await fetch(`https://api.github.com/users/${githubUser}`)

  if (userRes.status !== 200) {
    const err = await userRes.json()
    console.error('Erro ao buscar perfil do GitHub:', err.message)
    return
  }

  const user = await userRes.json()

  const avatarElement = document.querySelector('.avatar')
  const avatarContainer = document.querySelector('.avatar') 
  
  avatarContainer.classList.add('invisible')
  
  avatarElement.src = user.avatar_url
  avatarElement.alt = `Avatar de ${user.name || githubUser}`
  
  
  if (avatarElement.complete) {
    avatarContainer.classList.remove('invisible')
    avatarContainer.classList.add('visible')
  }

  avatarElement.alt = `Avatar de ${user.name || githubUser}`
  const bioElement = document.querySelector('#sobre p.bio')
  bioElement.innerText = user.bio || 'Sem bio disponível'
}

function renderizarProjetos(projetos) {
  const container = document.querySelector('.projects-grid')
  container.innerHTML = '' 

  projetos.forEach(projeto => {
    const card = document.createElement('div')
    card.classList.add('project-card')

    card.innerHTML = `
      <h3>${projeto.name}</h3>
      <a href="${projeto.html_url}" target="_blank" style="text-decoration: none">
        <button>Ver no GitHub</button>
      </a>
    `

    container.appendChild(card)
  })

  totalProjetos = projetos.length
  const remainder = totalProjetos % projetosPorPagina

  if (remainder !== 0) {
    const fillerCardsCount = projetosPorPagina - remainder
    for (let i = 0; i < fillerCardsCount; i++) {
      const fillerCard = document.createElement('div')
      fillerCard.classList.add('project-card', 'invisible-card')
      container.appendChild(fillerCard)
    }
  }

  carouselController()
}


function carouselController() {
  const projetos = document.querySelectorAll('.project-card')
  
  projetos.forEach(card => {
    card.style.display = 'none'
  })

  let visibleCardsCount = 0
  for (let index = currentIndex; index < currentIndex + projetosPorPagina; index++) {
    if (index < totalProjetos) {
      projetos[index].style.display = 'block'
      projetos[index].classList.add('fade-in')
      visibleCardsCount++
    }
  }

  const fillerCardsCount = projetosPorPagina - visibleCardsCount
  for (let i = 0; i < fillerCardsCount; i++) {
    const fillerCard = document.createElement('div')
    fillerCard.classList.add('project-card', 'invisible-card')
    projetos[0].parentElement.appendChild(fillerCard)
  }
}


document.getElementById('prevBtn').addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex -= projetosPorPagina
    carouselController()
  }
})

document.getElementById('nextBtn').addEventListener('click', () => {
  if (currentIndex + projetosPorPagina < totalProjetos) {
    currentIndex += projetosPorPagina
    carouselController()
  }
})

buscarReposStarred()
