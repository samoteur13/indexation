import { Word } from "../models/Word.js"


export class Helper {
    //meo: static = methode uniquement utilisable par la classe ! pas par l'objet !
    static count(str) {

        let arraySubstring = []
        let nombredeMot = []
        let countsbString = 0
        let tab = str.split(/[^a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ]/)
        this.removeOcurence(tab, '')
        for (let i = 0; i < tab.length; i++) {
            for (let b = 0; b < tab.length; b++) {
                if (tab[i] === tab[b]) {
                    countsbString++
                }
            }
            nombredeMot.push(countsbString)
            let obj = new Word(tab[i], nombredeMot[i])
            this.removeOcurence(tab, tab[i])
            arraySubstring.push(obj)
            countsbString = 0
        }
        // console.table(arraySubstring)
        // console.console.log(Wordsoccurence[0]);
        return arraySubstring
    }

    static removeOcurence(array, letter) {
        //supprime les occurence d'un tableau
        for (let i = 0; i < array.length; i++) {
            if (array[i] == letter) {
                array.splice(i, 1);
                i--;
            }
        }
    }


}



