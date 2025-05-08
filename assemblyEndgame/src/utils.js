import { words } from "./words"

export function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length)
    return words[randomIndex]
}

export function getFarewellText(language) {
    const options = [
        `Adiós, ${language}`,
        `Goodbye, ${language}`,
        `R.I.P., ${language}`,
        `Te vamos a extrañar, ${language}`,
        `Oh no, ¡no ${language}!`,
        `${language} ha mordido el polvo`,
        `Ido pero no olvidado, ${language}`,
        `El fin de ${language} como lo conocemos`,
        `${language} se va hacia el atardecer`,
        `${language}, ha sido un placer`,
        `${language}, tu guardia ha terminado`,
        `${language} ha dejado el edificio`,
		`${language}, ha hecho Ctrl + Alt + Del`,
		`${language} ha salido del grupo`,
		`Error 404: ${language} no encontrado`,
		`Hasta la vista, ${language}`,
		`Compiló su última línea, ${language}`,
    ];

    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
}