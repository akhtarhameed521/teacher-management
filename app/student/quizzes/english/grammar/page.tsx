"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, Star, Zap, Trophy, Award, TrendingUp } from "lucide-react"
import confetti from "canvas-confetti"

const questions = [
  {
    id: 1,
    question: "Choose the correct form of the verb:",
    sentence: "She _____ to the store yesterday.",
    options: ["go", "goes", "went", "gone"],
    correctAnswer: "went",
    difficulty: "easy",
  },
  {
    id: 2,
    question: "Select the appropriate pronoun:",
    sentence: "_____ are going to the movies tonight.",
    options: ["Us", "We", "Them", "They"],
    correctAnswer: "We",
    difficulty: "easy",
  },
  {
    id: 3,
    question: "Pick the correct comparative adjective:",
    sentence: "This book is _____ than the one I read last week.",
    options: ["good", "better", "best", "more good"],
    correctAnswer: "better",
    difficulty: "medium",
  },
  {
    id: 4,
    question: "Choose the right preposition:",
    sentence: "The cat is hiding _____ the couch.",
    options: ["on", "in", "under", "over"],
    correctAnswer: "under",
    difficulty: "medium",
  },
  {
    id: 5,
    question: "Select the appropriate conjunction:",
    sentence: "I wanted to go to the party, _____ I had to study.",
    options: ["and", "but", "or", "so"],
    correctAnswer: "but",
    difficulty: "hard",
  },
]

const playSound = (sound: string) => {
  const audio = new Audio(`/sounds/${sound}.mp3`)
  audio.play()
}

const achievements = [
  {
    id: "first_correct",
    name: "First Step",
    description: "Answer your first question correctly",
    icon: <Star className="text-yellow-400" />,
  },
  {
    id: "perfect_score",
    name: "Perfect Score",
    description: "Answer all questions correctly",
    icon: <Trophy className="text-yellow-400" />,
  },
  {
    id: "speed_demon",
    name: "Speed Demon",
    description: "Answer a question in less than 5 seconds",
    icon: <Zap className="text-yellow-400" />,
  },
  {
    id: "streak_master",
    name: "Streak Master",
    description: "Get a streak of 3 or more",
    icon: <TrendingUp className="text-yellow-400" />,
  },
]

export default function EnglishGrammarQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15)
  const [isTimerActive, setIsTimerActive] = useState(true)
  const [level, setLevel] = useState(1)
  const [xp, setXp] = useState(0)
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([])
  const [showAchievement, setShowAchievement] = useState<string | null>(null)

  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswerClick(null)
    }
  }, [timeLeft, isTimerActive, isAnswered])

  const handleAnswerClick = (answer: string | null) => {
    if (isAnswered) return
    setSelectedAnswer(answer)
    setIsAnswered(true)
    setIsTimerActive(false)

    const isCorrect = answer === questions[currentQuestion].correctAnswer
    const timeTaken = 15 - timeLeft
    let pointsEarned = 0

    if (isCorrect) {
      pointsEarned = Math.max(10, 50 - timeTaken * 2)
      if (questions[currentQuestion].difficulty === "medium") pointsEarned *= 1.5
      if (questions[currentQuestion].difficulty === "hard") pointsEarned *= 2

      setScore(score + 1)
      setStreak(streak + 1)
      setXp(xp + pointsEarned)
      playSound("correct")

      // Check for achievements
      if (!unlockedAchievements.includes("first_correct")) {
        unlockAchievement("first_correct")
      }
      if (timeTaken < 5 && !unlockedAchievements.includes("speed_demon")) {
        unlockAchievement("speed_demon")
      }
      if (streak + 1 >= 3 && !unlockedAchievements.includes("streak_master")) {
        unlockAchievement("streak_master")
      }

      if (streak + 1 >= 3) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      }
    } else {
      setStreak(0)
      playSound("incorrect")
    }

    // Level up logic
    if (xp + pointsEarned >= level * 100) {
      setLevel(level + 1)
      playSound("levelup")
    }
  }

  const unlockAchievement = (achievementId: string) => {
    setUnlockedAchievements([...unlockedAchievements, achievementId])
    setShowAchievement(achievementId)
    setTimeout(() => setShowAchievement(null), 3000)
  }

  const handleNextQuestion = () => {
    setSelectedAnswer(null)
    setIsAnswered(false)
    setTimeLeft(15)
    setIsTimerActive(true)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResult(true)
      if (score === questions.length && !unlockedAchievements.includes("perfect_score")) {
        unlockAchievement("perfect_score")
      }
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setStreak(0)
    setShowResult(false)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setTimeLeft(15)
    setIsTimerActive(true)
    setXp(0)
    setLevel(1)
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <Card className="max-w-lg mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
          <CardContent className="p-6">
            <motion.h2 initial={{ y: -20 }} animate={{ y: 0 }} className="text-3xl font-bold mb-4 text-center">
              Quiz Completed!
            </motion.h2>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
              className="text-6xl font-bold text-center mb-6"
            >
              <Trophy className="inline-block mr-2" />
              {score}/{questions.length}
            </motion.div>
            <Progress value={(score / questions.length) * 100} className="mb-6" />
            <p className="text-xl mb-6 text-center">
              {score === questions.length
                ? "Perfect score! You're a grammar master!"
                : score >= questions.length * 0.8
                  ? "Great job! Keep practicing to achieve perfection!"
                  : score >= questions.length * 0.6
                    ? "Good effort! A little more practice and you'll be a pro!"
                    : "Nice try! Keep learning and you'll improve in no time!"}
            </p>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Achievements Unlocked:</h3>
              <div className="flex flex-wrap gap-2">
                {achievements
                  .filter((a) => unlockedAchievements.includes(a.id))
                  .map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center bg-white bg-opacity-20 rounded-full px-3 py-1"
                    >
                      {achievement.icon}
                      <span className="ml-2 text-sm">{achievement.name}</span>
                    </div>
                  ))}
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Your Stats:</h3>
              <p>Level: {level}</p>
              <p>XP: {xp}</p>
              <p>Highest Streak: {streak}</p>
            </div>
            <Button onClick={restartQuiz} className="w-full bg-white text-purple-600 hover:bg-purple-100">
              Play Again
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen">
      <Card className="max-w-2xl mx-auto overflow-hidden shadow-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-2xl font-bold text-purple-600">
              Question {currentQuestion + 1}/{questions.length}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="text-yellow-500 mr-1" />
                <span className="text-lg font-semibold">Level {level}</span>
              </div>
              <div className="flex items-center">
                <Award className="text-purple-500 mr-1" />
                <span className="text-lg font-semibold">{xp} XP</span>
              </div>
              <div className="flex items-center">
                <Zap className="text-yellow-500 mr-1" />
                <span className="text-lg font-semibold">{streak}</span>
              </div>
            </div>
          </div>
          <Progress value={progress} className="mb-6" />
          <motion.div
            key={currentQuestion}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">{questions[currentQuestion].question}</h2>
            <p className="text-xl mb-6 text-gray-700">{questions[currentQuestion].sentence}</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => handleAnswerClick(option)}
                    variant={
                      selectedAnswer === option
                        ? option === questions[currentQuestion].correctAnswer
                          ? "default"
                          : "destructive"
                        : "outline"
                    }
                    className={`w-full h-auto py-4 text-left justify-start text-lg ${isAnswered ? "cursor-default" : "hover:bg-purple-100"}`}
                    disabled={isAnswered}
                  >
                    {option}
                    {isAnswered && option === questions[currentQuestion].correctAnswer && (
                      <CheckCircle className="ml-auto text-green-500" />
                    )}
                    {isAnswered && selectedAnswer === option && option !== questions[currentQuestion].correctAnswer && (
                      <AlertCircle className="ml-auto text-red-500" />
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
          {isAnswered && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
              <p
                className={`text-xl font-semibold ${selectedAnswer === questions[currentQuestion].correctAnswer ? "text-green-500" : "text-red-500"}`}
              >
                {selectedAnswer === questions[currentQuestion].correctAnswer
                  ? "Correct!"
                  : "Incorrect. The correct answer is: " + questions[currentQuestion].correctAnswer}
              </p>
            </motion.div>
          )}
          {isAnswered && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Button onClick={handleNextQuestion} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
              </Button>
            </motion.div>
          )}
          {!isAnswered && (
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Time left:</span>
                <span className={`text-lg font-bold ${timeLeft <= 5 ? "text-red-500" : "text-gray-700"}`}>
                  {timeLeft}s
                </span>
              </div>
              <Progress value={(timeLeft / 15) * 100} className="mt-2" />
            </div>
          )}
        </CardContent>
      </Card>
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg"
          >
            <div className="flex items-center">
              {achievements.find((a) => a.id === showAchievement)?.icon}
              <div className="ml-2">
                <h3 className="font-bold">{achievements.find((a) => a.id === showAchievement)?.name}</h3>
                <p className="text-sm">{achievements.find((a) => a.id === showAchievement)?.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

