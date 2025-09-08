import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Book, ReadingStatus } from "../components/BookCard";
import { PersonalInfo } from "../components/settings/PersonalInfo";
import { Notifications } from "../components/settings/Notifications";
import { ReadingGoals } from "../components/settings/ReadingGoals";
import { Appearance } from "../components/settings/Appearance";
import { useAuth } from "../contexts/AuthContext";
import { 
  BookOpen, 
  Target, 
  Calendar, 
  TrendingUp, 
  Award,
  Settings,
  User,
  Bell,
  Palette
} from "lucide-react";

interface LibraryBook extends Book {
  readingStatus: ReadingStatus;
  addedDate: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [library] = useLocalStorage<LibraryBook[]>("learnhub-library", []);
  const [activeSection, setActiveSection] = useState("overview");
  const [yearlyGoal] = useLocalStorage("yearlyGoal", "24");
  
  // Check URL params for section
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, []);

  // Calculate reading statistics
  const totalBooks = library.length;
  const completedBooks = library.filter(book => book.readingStatus === "completed").length;
  const readingBooks = library.filter(book => book.readingStatus === "reading").length;
  const notStartedBooks = library.filter(book => book.readingStatus === "not-started").length;
  
  const completionRate = totalBooks > 0 ? Math.round((completedBooks / totalBooks) * 100) : 0;

  // Get reading goals and achievements
  const currentYear = new Date().getFullYear();
  const readingGoal = parseInt(yearlyGoal); // Use saved goal
  const progressTowardsGoal = Math.round((completedBooks / readingGoal) * 100);

  // Mock recent activity
  const recentBooks = library
    .filter(book => book.readingStatus === "completed")
    .slice(0, 3);

  const achievements = [
    { title: "First Book", description: "Completed your first book", earned: completedBooks >= 1 },
    { title: "Bookworm", description: "Read 5 books", earned: completedBooks >= 5 },
    { title: "Scholar", description: "Read 10 books", earned: completedBooks >= 10 },
    { title: "Reading Streak", description: "Read for 7 days straight", earned: false },
  ];

  const profileSections = [
    { id: "overview", icon: User, title: "Overview", description: "View your reading statistics" },
    { id: "personal-info", icon: User, title: "Personal Info", description: "Update your profile information" },
    { id: "notifications", icon: Bell, title: "Notifications", description: "Manage your reading reminders" },
    { id: "reading-goals", icon: Target, title: "Reading Goals", description: "Set and track your reading targets" },
    { id: "appearance", icon: Palette, title: "Appearance", description: "Customize your interface" },
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case "personal-info":
        return <PersonalInfo />;
      case "notifications":
        return <Notifications />;
      case "reading-goals":
        return <ReadingGoals />;
      case "appearance":
        return <Appearance />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <Card className="bg-gradient-card shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Reading Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalBooks}</div>
              <div className="text-sm text-muted-foreground">Total Books</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{completedBooks}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{readingBooks}</div>
              <div className="text-sm text-muted-foreground">Reading</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">{completionRate}%</div>
              <div className="text-sm text-muted-foreground">Completion</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reading Goal */}
      <Card className="bg-gradient-card shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            {currentYear} Reading Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Progress: {completedBooks} of {readingGoal} books</span>
              <span className="text-sm font-medium">{progressTowardsGoal}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-gradient-hero h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressTowardsGoal, 100)}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {readingGoal - completedBooks > 0 
                ? `${readingGoal - completedBooks} more books to reach your goal!`
                : "Congratulations! You've reached your reading goal!"
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-gradient-card shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentBooks.length > 0 ? (
            <div className="space-y-3">
              {recentBooks.map((book, index) => (
                <div key={book.id} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                  <div className="w-12 h-16 bg-primary/10 rounded flex items-center justify-center">
                    {book.imageLinks?.thumbnail ? (
                      <img 
                        src={book.imageLinks.thumbnail} 
                        alt={book.title}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <BookOpen className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{book.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {book.authors?.join(", ")}
                    </p>
                    <Badge variant="outline" className="text-xs mt-1">
                      Completed
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No recent activity</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-primary/20">
            <AvatarImage src={user?.profileImage} alt="Profile" />
            <AvatarFallback className="text-2xl bg-gradient-hero text-primary-foreground">
              {user?.name?.charAt(0).toUpperCase() || 'LH'}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold mb-2">{user?.name || 'Learning Explorer'}</h1>
          <p className="text-muted-foreground mb-4">
            Member since {currentYear - 1} • Passionate Reader
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="outline">Science Enthusiast</Badge>
            <Badge variant="outline">Tech Learner</Badge>
            <Badge variant="outline">Philosophy Reader</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-card shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {profileSections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <Button
                        key={section.id}
                        variant={activeSection === section.id ? "default" : "ghost"}
                        className="w-full justify-start h-auto p-3"
                        onClick={() => setActiveSection(section.id)}
                      >
                        <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                        <div className="text-left">
                          <div className="font-medium text-sm">{section.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {section.description}
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  );
}