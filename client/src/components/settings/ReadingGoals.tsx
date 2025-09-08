import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Progress } from "../ui/progress";
import { Target, Calendar, BookOpen, TrendingUp } from "lucide-react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Book, ReadingStatus } from "../BookCard";

interface LibraryBook extends Book {
  readingStatus: ReadingStatus;
  addedDate: string;
}

export const ReadingGoals = () => {
  const [library] = useLocalStorage<LibraryBook[]>("learnhub-library", []);
  const [yearlyGoal, setYearlyGoal] = useLocalStorage("yearlyGoal", "24");
  const [monthlyGoal, setMonthlyGoal] = useLocalStorage("monthlyGoal", "2");
  const [dailyGoal, setDailyGoal] = useLocalStorage("dailyGoal", "30");
  const [goalType, setGoalType] = useLocalStorage("goalType", "books");
  
  // Calculate real progress from library
  const completedBooks = library.filter(book => book.readingStatus === "completed").length;
  const currentProgress = completedBooks;

  const handleSave = () => {
    alert("Reading goals updated and saved!");
  };

  // Calculate monthly average
  const currentMonth = new Date().getMonth() + 1;
  const monthlyAverage = currentMonth > 0 ? (currentProgress / currentMonth).toFixed(1) : '0';

  const progressPercentage = (currentProgress / parseInt(yearlyGoal)) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Current Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">2024 Reading Goal</span>
              <span className="text-sm text-muted-foreground">
                {currentProgress} of {yearlyGoal} books
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{currentProgress}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">{Math.max(0, parseInt(yearlyGoal) - currentProgress)}</div>
                <div className="text-xs text-muted-foreground">Remaining</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">{Math.round(progressPercentage)}%</div>
                <div className="text-xs text-muted-foreground">Progress</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Set Reading Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Goal Type</Label>
            <Select value={goalType} onValueChange={setGoalType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="books">Number of Books</SelectItem>
                <SelectItem value="pages">Number of Pages</SelectItem>
                <SelectItem value="minutes">Reading Minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="yearly">Yearly Goal</Label>
              <div className="relative">
                <Input
                  id="yearly"
                  value={yearlyGoal}
                  onChange={(e) => setYearlyGoal(e.target.value)}
                  type="number"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {goalType === "books" ? "books" : goalType === "pages" ? "pages" : "min"}
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="monthly">Monthly Goal</Label>
              <div className="relative">
                <Input
                  id="monthly"
                  value={monthlyGoal}
                  onChange={(e) => setMonthlyGoal(e.target.value)}
                  type="number"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {goalType === "books" ? "books" : goalType === "pages" ? "pages" : "min"}
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="daily">Daily Goal</Label>
              <div className="relative">
                <Input
                  id="daily"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(e.target.value)}
                  type="number"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {goalType === "books" ? "books" : goalType === "pages" ? "pages" : "min"}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Goal Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-primary/5 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="font-medium">Average per Month</span>
              </div>
              <div className="text-2xl font-bold">{monthlyAverage}</div>
              <div className="text-sm text-muted-foreground">books completed</div>
            </div>
            <div className="p-4 bg-success/5 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-success" />
                <span className="font-medium">Days Ahead/Behind</span>
              </div>
              <div className="text-2xl font-bold text-success">+5</div>
              <div className="text-sm text-muted-foreground">ahead of schedule</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full">
        Update Reading Goals
      </Button>
    </div>
  );
};