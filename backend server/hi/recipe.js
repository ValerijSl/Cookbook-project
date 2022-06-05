const textDisplay = document.querySelector("#text-box")

fetch("http://localhost: 3000", {
    mode: "cors"
})
    .then(response => {return response.json()})
    .then(data => {
        data.forEach(article => {
            const title = `<h3>` + article.title +`</h3>`
            textDisplay.insertAdjacentElement("beforeend", title)
        })
    })
    .catch(err => console.log(err))
