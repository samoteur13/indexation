import express, { text } from "express";
import bodyParser from 'body-parser' //permet de décoder une requette http et recupéré les donnée
import fetch from "node-fetch";
import Cheerio from "cheerio";
import { Helper } from "./helper/helper.js"
import fs, { readFile } from 'fs' //file system de node JS, permet d'interagir avec des fichiers
import { Page } from "./models/Page.js";


let filePath = "./bdr.json"
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]))
}

const app = express(); // initialisation de l'appli express
app.use(express.static('./assets')); //demande a express d'aller chercher les fichier static (image,css,js.) dans le dossier assets
app.use(bodyParser.urlencoded({ extended: true }))// 


app.listen(8082, () => {
    console.log("le serveur a demarrer");
})
// si une erreure survien alleé dans package.json et ecrire a la suite de / "main": "index.js",/  "type": "module", a la ligne


//http://localhost:8082/ pour retrouver sa page
app.get('/', async (req, res) => {
    let contentFile = JSON.parse(fs.readFileSync(filePath));
    let string = ""

    for (let i = 0; i < contentFile.length; i++) {
        string = string + "<p>" + contentFile[i].url + "</p>" // pour l'introduire un <p> plus tard dans indexation.html.twig
    }

    res.render('indexation.html.twig', {
        index: string, // introduit <p> mon url </p> dans indexation.html.twig
    })
})

//permet d'utilisé les contenue non dynamic
app.get('/main', async (req, res) => {
    res.render('./assets', {
    })
})

app.post('/', async (req, res) => {
    let dataUrl = []//stock mes donné dans un tableaux
    let contentFile = JSON.parse(fs.readFileSync(filePath));
    for (let i = 0; i < contentFile.length; i++) {
        dataUrl.push(contentFile[i].url)
    }

    const html = await (await fetch(req.body.url)).text()
    const indexation = Cheerio.load(html)
    const text = indexation('body').text()
    const title = indexation('title').text()
    let dataWord = Helper.count(text)

    if (!dataUrl.includes(req.body.url)) { // "body.url" pour recuperer seulement l'url / si l'url n'existe pas dans le urlTableau...
        let objPage = new Page(req.body.url, title, dataWord)
        contentFile.push(objPage)
        fs.writeFileSync(filePath, JSON.stringify(contentFile, null, 2))// transforme le fichier en string pour pouvoir remplire le Json  
    }

    res.redirect('/')
})




//lien vers une autre de mes page 
app.get('/search', async (req, res) => {
    res.render('search.html.twig', {

    })

})

app.post('/search', async (req, res) => {
    let newTable = []
    let meilleurSite = []
    let mot = req.body.text
    let contentFile = JSON.parse(fs.readFileSync(filePath));
    let site;
    for (let i = 0; i < contentFile.length; i++) {
        for (let b = 0; b < contentFile[i].words.length; b++) {
            if (mot === contentFile[i].words[b].mot) {
                let searchRes = {
                    url: contentFile[i].url,
                    mot: contentFile[i].words[b].mot,
                    compte: contentFile[i].words[b].nombreOccurence
                }
                newTable.push(searchRes)

            }
        }
    }

    newTable.sort(function (a, b) { //retourn le tableux par rapport au nombre
        return b.compte - a.compte;
    });

    for (let index = 0; index < newTable.length; index++) {
        site = '<p>' + "Dans le site : " + "<a href='" + newTable[index].url + " ' target=_blank >" +
            newTable[index].url + "</a> " + " Le mot :" +
            newTable[index].mot + " se trouve <span>" + newTable[index].compte + "</span> fois" + '</p>'
        meilleurSite.push(site)
    }

    res.render('search.html.twig', {
        pages: meilleurSite
    })

})





