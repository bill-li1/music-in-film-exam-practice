"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, X, ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Sample movie data
const movieData = [
  {
    id: 1,
    title: "The War of the Worlds",
    year: 1938,
    composer: "Bernard Herrmann",
  },
  {
    id: 2,
    title: "Citizen Kane",
    year: 1941,
    composer: "Bernard Herrmann",
  },
  {
    id: 3,
    title: "The Day the Earth Stood Still",
    year: 1951,
    composer: "Bernard Herrmann",
  },
  {
    id: 4,
    title: "Vertigo",
    year: 1958,
    composer: "Bernard Herrmann",
  },
  {
    id: 5,
    title: "North by Northwest",
    year: 1959,
    composer: "Bernard Herrmann",
  },
  {
    id: 6,
    title: "Psycho",
    year: 1960,
    composer: "Bernard Herrmann",
  },
  {
    id: 7,
    title: "Torn Curtain",
    year: 1964,
    composer: "Bernard Herrmann",
  },
  {
    id: 8,
    title: "The Good, the Bad, and the Ugly",
    year: 1966,
    composer: "Ennio Morricone",
  },
  {
    id: 9,
    title: "Fahrenheit 451",
    year: 1966,
    composer: "Bernard Herrmann",
  },
  {
    id: 10,
    title: "Taxi Driver",
    year: 1975,
    composer: "Bernard Herrmann",
  },
  {
    id: 11,
    title: "Dr. No",
    year: 1962,
    composer: "John Barry",
  },
  {
    id: 12,
    title: "Patton",
    year: 1970,
    composer: "Jerry Goldsmith",
  },
  {
    id: 13,
    title: "Planet of the Apes",
    year: 1968,
    composer: "Jerry Goldsmith",
  },
  {
    id: 14,
    title: "The Omen",
    year: 1977,
    composer: "Jerry Goldsmith",
  },
  {
    id: 15,
    title: "The Sugarland Express",
    year: 1974,
    composer: "John Williams",
  },
  {
    id: 16,
    title: "Jaws",
    year: 1975,
    composer: "John Williams",
  },
  {
    id: 17,
    title: "Star Wars",
    year: 1977,
    composer: "John Williams",
  },
  {
    id: 18,
    title: "Back to the Future",
    year: 1985,
    composer: "Alan Silvestri",
  },
  {
    id: 19,
    title: "Titanic",
    year: 1997,
    composer: "James Horner",
  },
  {
    id: 20,
    title: "Glory",
    year: 1989,
    composer: "James Horner",
  },
  {
    id: 21,
    title: "Star Trek II: The Wrath of Khan",
    year: 1982,
    composer: "James Horner",
  },
  {
    id: 22,
    title: "The Forbidden Zone",
    year: 1979,
    composer: "Danny Elfman",
  },
  {
    id: 23,
    title: "Weird Science",
    year: 1985,
    composer: "Danny Elfman",
  },
  {
    id: 24,
    title: "Pee Wee’s Big Adventure",
    year: 1985,
    composer: "Danny Elfman",
  },
  {
    id: 25,
    title: "Beetlejuice",
    year: 1988,
    composer: "Danny Elfman",
  },
  {
    id: 26,
    title: "Edward Scissorhands",
    year: 1992,
    composer: "Danny Elfman",
  },
  {
    id: 27,
    title: "Rain Man",
    year: 1988,
    composer: "Hans Zimmer",
  },
  {
    id: 28,
    title: "The Thin Red Line",
    year: 1998,
    composer: "Hans Zimmer",
  },
  {
    id: 29,
    title: "Interstellar",
    year: 2014,
    composer: "Hans Zimmer",
  },
  {
    id: 30,
    title: "Inception",
    year: 2010,
    composer: "Hans Zimmer",
  },
  {
    id: 31,
    title: "High Noon",
    year: 1952,
    composer: "Dimitri Tiomkin",
  },
];

// Get all unique composers for multiple choice options
const allComposers = [...new Set(movieData.map((movie) => movie.composer))];

export default function MovieMusicQuiz() {
  const [yearAnswer, setYearAnswer] = useState("");
  const [composerAnswer, setComposerAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [answers, setAnswers] = useState<
    Array<{
      correct: boolean;
      question: string;
      userAnswer: string;
      correctAnswer: string;
    }>
  >([]);
  const [questionType, setQuestionType] = useState<"year" | "composer">("year");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(movieData[0]);
  const [yearOptions, setYearOptions] = useState<string[]>([]);
  const [composerOptions, setComposerOptions] = useState<string[]>([]);

  function getRandomMovie() {
    return movieData[Math.floor(Math.random() * movieData.length)];
  }

  useEffect(() => {
    setCurrentMovie(getRandomMovie());
  }, []);

  // Generate plausible wrong years that are close to the correct year
  function generateYearOptions(correctYear: number) {
    // Create an array with the correct year
    const years = [correctYear.toString()];

    // Generate 3 unique wrong years within +/- 5 years of the correct year
    while (years.length < 4) {
      // Generate a year within +/- 5 years, but not the same as the correct year
      const offset = Math.floor(Math.random() * 11) - 5; // -5 to +5
      const wrongYear = correctYear + offset;

      // Make sure the year is reasonable (not in the future) and unique
      if (
        wrongYear !== correctYear &&
        wrongYear <= new Date().getFullYear() &&
        wrongYear > 1900 &&
        !years.includes(wrongYear.toString())
      ) {
        years.push(wrongYear.toString());
      }
    }

    // Shuffle the array to randomize the position of the correct answer
    return years.sort(() => Math.random() - 0.5);
  }

  // Generate composer options (correct one + 3 random others)
  function generateComposerOptions(correctComposer: string) {
    // Create a copy of all composers and remove the correct one
    const otherComposers = allComposers.filter(
      (composer) => composer !== correctComposer
    );

    // Shuffle the other composers
    const shuffledOthers = [...otherComposers].sort(() => Math.random() - 0.5);

    // Take the first 3 other composers
    const selectedOthers = shuffledOthers.slice(0, 3);

    // Combine with the correct composer and shuffle again
    return [...selectedOthers, correctComposer].sort(() => Math.random() - 0.5);
  }

  // Generate options when the current movie changes
  useEffect(() => {
    if (currentMovie) {
      setYearOptions(generateYearOptions(currentMovie.year));
      setComposerOptions(generateComposerOptions(currentMovie.composer));
    }
  }, [currentMovie]);

  const checkYearAnswer = () => {
    const isCorrect = yearAnswer === currentMovie.year.toString();
    setIsCorrect(isCorrect);
    setIsAnswered(true);
    setTotalAnswered(totalAnswered + 1);

    if (isCorrect) {
      setScore(score + 1);
    }

    setAnswers([
      {
        correct: isCorrect,
        question: `What year was "${currentMovie.title}" released?`,
        userAnswer: yearAnswer,
        correctAnswer: currentMovie.year.toString(),
      },
      ...answers,
    ]);
  };

  const checkComposerAnswer = () => {
    const isCorrect = composerAnswer === currentMovie.composer;
    setIsCorrect(isCorrect);
    setIsAnswered(true);
    setTotalAnswered(totalAnswered + 1);

    if (isCorrect) {
      setScore(score + 1);
    }

    setAnswers([
      {
        correct: isCorrect,
        question: `Who composed the music for "${currentMovie.title}"?`,
        userAnswer: composerAnswer,
        correctAnswer: currentMovie.composer,
      },
      ...answers,
    ]);
  };

  const nextQuestion = () => {
    // Get a new random movie, making sure it's different from the current one
    let newMovie;
    do {
      newMovie = getRandomMovie();
    } while (newMovie.id === currentMovie.id && movieData.length > 1);

    setCurrentMovie(newMovie);
    setYearAnswer("");
    setComposerAnswer("");
    setIsAnswered(false);
    // Alternate between year and composer questions
    setQuestionType(questionType === "year" ? "composer" : "year");
  };

  const resetQuiz = () => {
    setYearAnswer("");
    setComposerAnswer("");
    setScore(0);
    setTotalAnswered(0);
    setAnswers([]);
    setQuestionType("year");
    setIsAnswered(false);
    setCurrentMovie(getRandomMovie());
  };

  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Link href="/" className="mr-4">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex flex-col gap-2">
              <CardTitle>Movie Music Quiz</CardTitle>
              <CardDescription className="flex justify-between">
                <span>
                  Score: {score}/{totalAnswered} (
                  {totalAnswered > 0
                    ? Math.round((score / totalAnswered) * 100)
                    : 0}
                  %)
                </span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {questionType === "year" ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                What year was "{currentMovie.title}" released?
              </h3>

              <RadioGroup
                value={yearAnswer}
                onValueChange={setYearAnswer}
                className="grid grid-cols-2 gap-4"
              >
                {yearOptions.map((year) => (
                  <div
                    key={year}
                    className={cn(
                      "flex items-center justify-center h-24 rounded-lg border-2 cursor-pointer transition-all",
                      yearAnswer === year
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                      isAnswered && "pointer-events-none",
                      isAnswered &&
                        year === currentMovie.year.toString() &&
                        "border-green-500 bg-green-50 text-green-700",
                      isAnswered &&
                        yearAnswer === year &&
                        year !== currentMovie.year.toString() &&
                        "border-red-500 bg-red-50 text-red-700"
                    )}
                    onClick={() => !isAnswered && setYearAnswer(year)}
                  >
                    <RadioGroupItem
                      value={year}
                      id={`year-${year}`}
                      className="sr-only"
                    />
                    <span className="text-xl font-bold">{year}</span>
                  </div>
                ))}
              </RadioGroup>

              {isAnswered && (
                <div
                  className={`p-3 rounded-md ${
                    isCorrect
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {isCorrect ? (
                    <div className="flex items-center gap-2">
                      <Check size={16} />
                      <span>Correct!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <X size={16} />
                      <span>
                        Incorrect. The correct year is {currentMovie.year}.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Who composed the music for "{currentMovie.title}"?
              </h3>

              <RadioGroup
                value={composerAnswer}
                onValueChange={setComposerAnswer}
                className="grid grid-cols-2 gap-4"
              >
                {composerOptions.map((composer) => (
                  <div
                    key={composer}
                    className={cn(
                      "flex items-center justify-center h-24 rounded-lg border-2 cursor-pointer transition-all p-2 text-center",
                      composerAnswer === composer
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                      isAnswered && "pointer-events-none",
                      isAnswered &&
                        composer === currentMovie.composer &&
                        "border-green-500 bg-green-50 text-green-700",
                      isAnswered &&
                        composerAnswer === composer &&
                        composer !== currentMovie.composer &&
                        "border-red-500 bg-red-50 text-red-700"
                    )}
                    onClick={() => !isAnswered && setComposerAnswer(composer)}
                  >
                    <RadioGroupItem
                      value={composer}
                      id={composer}
                      className="sr-only"
                    />
                    <span className="text-lg font-bold">{composer}</span>
                  </div>
                ))}
              </RadioGroup>

              {isAnswered && (
                <div
                  className={`p-3 rounded-md ${
                    isCorrect
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {isCorrect ? (
                    <div className="flex items-center gap-2">
                      <Check size={16} />
                      <span>Correct!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <X size={16} />
                      <span>
                        Incorrect. The correct composer is{" "}
                        {currentMovie.composer}.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {answers.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Recent Answers</h3>
              <ScrollArea className="h-[200px] rounded-md border p-2">
                <div className="space-y-2">
                  {answers.map((answer, index) => (
                    <div key={index} className="border rounded-lg p-3 text-sm">
                      <div className="flex items-start gap-2">
                        {answer.correct ? (
                          <Check
                            className="text-green-500 mt-0.5 flex-shrink-0"
                            size={14}
                          />
                        ) : (
                          <X
                            className="text-red-500 mt-0.5 flex-shrink-0"
                            size={14}
                          />
                        )}
                        <div>
                          <p className="font-medium text-xs">
                            {answer.question}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Your answer:{" "}
                            <span
                              className={
                                answer.correct
                                  ? "text-green-500"
                                  : "text-red-500"
                              }
                            >
                              {answer.userAnswer || "(no answer)"}
                            </span>
                          </p>
                          {!answer.correct && (
                            <p className="text-xs text-muted-foreground">
                              Correct answer:{" "}
                              <span className="text-green-500">
                                {answer.correctAnswer}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetQuiz}>
            Reset Quiz
          </Button>
          {!isAnswered ? (
            <Button
              onClick={
                questionType === "year" ? checkYearAnswer : checkComposerAnswer
              }
              disabled={questionType === "year" ? !yearAnswer : !composerAnswer}
            >
              Submit Answer
            </Button>
          ) : (
            <Button onClick={nextQuestion}>Next Question</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
