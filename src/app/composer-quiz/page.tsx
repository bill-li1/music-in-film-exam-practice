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

// Sample composer data
const composerData = [
  {
    id: 1,
    name: "Bernard Herrmann",
    birthYear: 1911,
    birthPlace: "New York City, USA",
  },
  {
    id: 2,
    name: "Ennio Morricone",
    birthYear: 1928,
    birthPlace: "Rome, Italy",
  },
  {
    id: 3,
    name: "John Barry",
    birthYear: 1933,
    birthPlace: "York, England",
  },
  {
    id: 4,
    name: "Jerry Goldsmith",
    birthYear: 1929,
    birthPlace: "Los Angeles, USA",
  },
  {
    id: 5,
    name: "John Williams",
    birthYear: 1932,
    birthPlace: "Floral Park, New York, USA",
  },
  {
    id: 6,
    name: "Alan Silvestri",
    birthYear: 1950,
    birthPlace: "New York City, USA",
  },
  {
    id: 7,
    name: "James Horner",
    birthYear: 1953,
    birthPlace: "Los Angeles, USA",
  },
  {
    id: 8,
    name: "Danny Elfman",
    birthYear: 1953,
    birthPlace: "Los Angeles, USA",
  },
  {
    id: 9,
    name: "Hans Zimmer",
    birthYear: 1957,
    birthPlace: "Frankfurt, Germany",
  },
  {
    id: 10,
    name: "Dimitri Tiomkin",
    birthYear: 1894,
    birthPlace: "St. Petersburg, Russia",
  },
];

// Get all unique birth places for multiple choice options
const allBirthPlaces = [
  ...new Set(composerData.map((composer) => composer.birthPlace)),
];

export default function ComposerQuiz() {
  const [yearAnswer, setYearAnswer] = useState("");
  const [birthPlaceAnswer, setBirthPlaceAnswer] = useState("");
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
  const [questionType, setQuestionType] = useState<"year" | "birthPlace">(
    "year"
  );
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentComposer, setCurrentComposer] = useState(composerData[0]);
  const [yearOptions, setYearOptions] = useState<string[]>([]);
  const [birthPlaceOptions, setBirthPlaceOptions] = useState<string[]>([]);

  function getRandomComposer() {
    return composerData[Math.floor(Math.random() * composerData.length)];
  }

  useEffect(() => {
    setCurrentComposer(getRandomComposer());
  }, []);

  // Generate plausible wrong years that are close to the correct year
  function generateYearOptions(correctYear: number) {
    // Create an array with the correct year
    const years = [correctYear.toString()];

    // Generate 3 unique wrong years within +/- 20 years of the correct year
    while (years.length < 4) {
      // Generate a year within +/- 20 years, but not the same as the correct year
      const offset = Math.floor(Math.random() * 41) - 20; // -20 to +20
      const wrongYear = correctYear + offset;

      // Make sure the year is reasonable and unique
      if (
        wrongYear !== correctYear &&
        wrongYear > 1600 &&
        wrongYear < 2000 &&
        !years.includes(wrongYear.toString())
      ) {
        years.push(wrongYear.toString());
      }
    }

    // Shuffle the array to randomize the position of the correct answer
    return years.sort(() => Math.random() - 0.5);
  }

  // Generate birth place options (correct one + 3 random others)
  function generateBirthPlaceOptions(correctBirthPlace: string) {
    // Create a copy of all birth places and remove the correct one
    const otherBirthPlaces = allBirthPlaces.filter(
      (place) => place !== correctBirthPlace
    );

    // Shuffle the other birth places
    const shuffledOthers = [...otherBirthPlaces].sort(
      () => Math.random() - 0.5
    );

    // Take the first 3 other birth places
    const selectedOthers = shuffledOthers.slice(0, 3);

    // Combine with the correct birth place and shuffle again
    return [...selectedOthers, correctBirthPlace].sort(
      () => Math.random() - 0.5
    );
  }

  // Generate options when the current composer changes
  useEffect(() => {
    if (currentComposer) {
      setYearOptions(generateYearOptions(currentComposer.birthYear));
      setBirthPlaceOptions(
        generateBirthPlaceOptions(currentComposer.birthPlace)
      );
    }
  }, [currentComposer]);

  const checkYearAnswer = () => {
    const isCorrect = yearAnswer === currentComposer.birthYear.toString();
    setIsCorrect(isCorrect);
    setIsAnswered(true);
    setTotalAnswered(totalAnswered + 1);

    if (isCorrect) {
      setScore(score + 1);
    }

    setAnswers([
      {
        correct: isCorrect,
        question: `When was ${currentComposer.name} born?`,
        userAnswer: yearAnswer,
        correctAnswer: currentComposer.birthYear.toString(),
      },
      ...answers,
    ]);
  };

  const checkBirthPlaceAnswer = () => {
    const isCorrect = birthPlaceAnswer === currentComposer.birthPlace;
    setIsCorrect(isCorrect);
    setIsAnswered(true);
    setTotalAnswered(totalAnswered + 1);

    if (isCorrect) {
      setScore(score + 1);
    }

    setAnswers([
      {
        correct: isCorrect,
        question: `Where was ${currentComposer.name} born?`,
        userAnswer: birthPlaceAnswer,
        correctAnswer: currentComposer.birthPlace,
      },
      ...answers,
    ]);
  };

  const nextQuestion = () => {
    // Get a new random composer, making sure it's different from the current one
    let newComposer;
    do {
      newComposer = getRandomComposer();
    } while (newComposer.id === currentComposer.id && composerData.length > 1);

    setCurrentComposer(newComposer);
    setYearAnswer("");
    setBirthPlaceAnswer("");
    setIsAnswered(false);
    // Alternate between year and birth place questions
    setQuestionType(questionType === "year" ? "birthPlace" : "year");
  };

  const resetQuiz = () => {
    setYearAnswer("");
    setBirthPlaceAnswer("");
    setScore(0);
    setTotalAnswered(0);
    setAnswers([]);
    setQuestionType("year");
    setIsAnswered(false);
    setCurrentComposer(getRandomComposer());
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
              <CardTitle>Composer Quiz</CardTitle>
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
                When was {currentComposer.name} born?
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
                        year === currentComposer.birthYear.toString() &&
                        "border-green-500 bg-green-50 text-green-700",
                      isAnswered &&
                        yearAnswer === year &&
                        year !== currentComposer.birthYear.toString() &&
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
                        Incorrect. {currentComposer.name} was born in{" "}
                        {currentComposer.birthYear}.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Where was {currentComposer.name} born?
              </h3>

              <RadioGroup
                value={birthPlaceAnswer}
                onValueChange={setBirthPlaceAnswer}
                className="grid grid-cols-2 gap-4"
              >
                {birthPlaceOptions.map((place) => (
                  <div
                    key={place}
                    className={cn(
                      "flex items-center justify-center h-24 rounded-lg border-2 cursor-pointer transition-all p-2 text-center",
                      birthPlaceAnswer === place
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                      isAnswered && "pointer-events-none",
                      isAnswered &&
                        place === currentComposer.birthPlace &&
                        "border-green-500 bg-green-50 text-green-700",
                      isAnswered &&
                        birthPlaceAnswer === place &&
                        place !== currentComposer.birthPlace &&
                        "border-red-500 bg-red-50 text-red-700"
                    )}
                    onClick={() => !isAnswered && setBirthPlaceAnswer(place)}
                  >
                    <RadioGroupItem
                      value={place}
                      id={place}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{place}</span>
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
                        Incorrect. {currentComposer.name} was born in{" "}
                        {currentComposer.birthPlace}.
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
                questionType === "year"
                  ? checkYearAnswer
                  : checkBirthPlaceAnswer
              }
              disabled={
                questionType === "year" ? !yearAnswer : !birthPlaceAnswer
              }
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
