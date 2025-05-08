import { useState } from "react"
import { clsx } from "clsx"
import { languages } from "./languages"
import { useWindowSize } from 'react-use'
import { getFarewellText, getRandomWord } from "./utils"
//import { words, sortWords } from "./words"
import Confetti from "react-confetti"
import './index.css'

//sortWords(words)

export default function AssemblyEndgame() {
	// State values
	const [currentWord, setCurrentWord] = useState(() => getRandomWord())
	const [guessedLetters, setGuessedLetters] = useState([])

	// Derived values
	const numGuessesLeft = languages.length - 1
	const wrongGuessCount =
		guessedLetters.filter(letter => !currentWord.includes(letter)).length
	const isGameWon =
		currentWord.split("").every(letter => guessedLetters.includes(letter))
	const isGameLost = wrongGuessCount >= numGuessesLeft
	const isGameOver = isGameWon || isGameLost
	const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
	const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)
	const { width, height } = useWindowSize()

	// Static values
	const alphabet = "abcdefghijklmnopqrstuvwxyz"

	function addGuessedLetter(letter) {
		setGuessedLetters(prevLetters =>
			prevLetters.includes(letter) ?
				prevLetters :
				[...prevLetters, letter]
		)
	}

	function startNewGame() {
		setCurrentWord(getRandomWord())
		setGuessedLetters([])
	}

	const languageElements = languages.map((lang, index) => {
		const isLanguageLost = index < wrongGuessCount
		const styles = {
			backgroundColor: lang.backgroundColor,
			color: lang.color
		}
		const className = clsx("chip", isLanguageLost && "lost")
		return (
			<span
				className={className}
				style={styles}
				key={lang.name}
			>
				{lang.name}
			</span>
		)
	})

	const letterElements = currentWord.split("").map((letter, index) => {
		const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
		const letterClassName = clsx(
			isGameLost && !guessedLetters.includes(letter) && "missed-letter"
		)
		return (
			<span key={index} className={letterClassName}>
				{shouldRevealLetter ? letter.toUpperCase() : ""}
			</span>
		)
	})

	const keyboardElements = alphabet.split("").map(letter => {
		const isGuessed = guessedLetters.includes(letter)
		const isCorrect = isGuessed && currentWord.includes(letter)
		const isWrong = isGuessed && !currentWord.includes(letter)
		const className = clsx({
			correct: isCorrect,
			wrong: isWrong
		})

		return (
			<button
				className={className}
				key={letter}
				disabled={isGameOver}
				aria-disabled={guessedLetters.includes(letter)}
				aria-label={`Letter ${letter}`}
				onClick={() => addGuessedLetter(letter)}
			>
				{letter.toUpperCase()}
			</button>
		)
	})

	const gameStatusClass = clsx("game-status", {
		won: isGameWon,
		lost: isGameLost,
		farewell: !isGameOver && isLastGuessIncorrect
	})

	function renderGameStatus() {
		if (!isGameOver && isLastGuessIncorrect) {
			return (
				<p className="farewell-message">
					{getFarewellText(languages[wrongGuessCount - 1].name)}
				</p>
			)
		}

		if (isGameWon) {
			return (
				<>
					<h2>¡Ganaste!</h2>
					<p>bien hecho 🎉</p>
				</>
			)
		}
		if (isGameLost) {
			return (
				<>
					<h2>¡Se acabó!</h2>
					<p>Perdiste. Será mejor que empieces a aprender ensamblador 😭</p>
				</>
			)
		}

		return null
	}

	return (
		<main>
			<header>
				<h1>Assembly: Endgame</h1>
				<p>¡Adivina la palabra en menos de 8 intentos para mantener el mundo de la programación a salvo de Ensamblador!</p>
			</header>

			<section
				aria-live="polite"
				role="status"
				className={gameStatusClass}
			>
				{renderGameStatus()}
			</section>

			<section className="language-chips">
				{languageElements}
			</section>

			<section className="word">
				{letterElements}
			</section>

			{/* Combined visually-hidden aria-live region for status updates */}
			<section
				className="sr-only"
				aria-live="polite"
				role="status"
			>
				<p>
					{currentWord.includes(lastGuessedLetter) ?
						`Correcto! La letra ${lastGuessedLetter} está en la palabra.` :
						`Lo siento, la letra ${lastGuessedLetter} no está en la palabra.`
					}
					Te quedan {numGuessesLeft} intentos restantes.
				</p>
				<p>Palabra actual: {currentWord.split("").map(letter =>
					guessedLetters.includes(letter) ? letter + "." : "blank.")
					.join(" ")}</p>

			</section>

			<section className="keyboard">
				{keyboardElements}
			</section>

			{isGameOver &&
				<button
					className="new-game"
					onClick={startNewGame}
				>Jugar de nuevo</button>}

			{isGameWon &&
				<Confetti
					width={width}
					height={height}
				/>}
		</main>
	)
}
