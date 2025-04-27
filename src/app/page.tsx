import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Music, Film } from "lucide-react";

export default function HomePage() {
  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Music Quiz App</CardTitle>
          <CardDescription>
            Choose a quiz to test your knowledge
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <Link href="/movie-quiz">
            <Button
              variant="outline"
              className="h-24 text-lg justify-start w-full"
              size="lg"
            >
              <Film className="mr-4 h-6 w-6" />
              <div className="flex justify-start flex-col items-start">
                <span className="text-lg font-bold">Movie Music Quiz</span>
              </div>
            </Button>
          </Link>

          <Link href="/composer-quiz">
            <Button
              variant="outline"
              className="h-24 text-lg justify-start w-full"
              size="lg"
            >
              <Music className="mr-4 h-6 w-6" />
              <div className="flex flex-col items-start">
                <span className="text-lg font-bold">Composer Quiz</span>
              </div>
            </Button>
          </Link>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Select a quiz to begin testing your music knowledge
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
