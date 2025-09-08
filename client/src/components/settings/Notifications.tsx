import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Bell, Mail, Smartphone } from "lucide-react";
import { notificationsAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

export const Notifications = () => {
  const { user } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [readingReminders, setReadingReminders] = useState(true);
  const [goalReminders, setGoalReminders] = useState(true);
  const [newBooks, setNewBooks] = useState(false);
  const [reminderTime, setReminderTime] = useState("19:00");
  const [reminderFrequency, setReminderFrequency] = useState("daily");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!user?.email) {
      alert("Please login to save notification settings.");
      return;
    }

    setIsLoading(true);
    try {
      await notificationsAPI.updateSettings({
        emailNotifications,
        pushNotifications,
        readingReminders
      });
      
      // Send test email if email notifications are enabled
      if (emailNotifications) {
        await notificationsAPI.sendEmail({
          to: user.email,
          subject: "LearnHub Notifications Enabled",
          message: "You have successfully enabled email notifications for your reading reminders and goals."
        });
      }
      
      alert("Notification settings saved successfully!");
    } catch (error) {
      alert("Failed to save notification settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-muted-foreground" />
              <div>
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Browser notifications</p>
              </div>
            </div>
            <Switch
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reading Reminders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Daily Reading Reminders</Label>
              <p className="text-sm text-muted-foreground">Get reminded to read daily</p>
            </div>
            <Switch
              checked={readingReminders}
              onCheckedChange={setReadingReminders}
            />
          </div>

          {readingReminders && (
            <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-primary/20">
              <div>
                <Label>Reminder Time</Label>
                <Select value={reminderTime} onValueChange={setReminderTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="08:00">8:00 AM</SelectItem>
                    <SelectItem value="12:00">12:00 PM</SelectItem>
                    <SelectItem value="18:00">6:00 PM</SelectItem>
                    <SelectItem value="19:00">7:00 PM</SelectItem>
                    <SelectItem value="20:00">8:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Frequency</Label>
                <Select value={reminderFrequency} onValueChange={setReminderFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekdays">Weekdays Only</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <Label>Goal Progress Reminders</Label>
              <p className="text-sm text-muted-foreground">Weekly progress updates</p>
            </div>
            <Switch
              checked={goalReminders}
              onCheckedChange={setGoalReminders}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>New Book Recommendations</Label>
              <p className="text-sm text-muted-foreground">Get notified about new books</p>
            </div>
            <Switch
              checked={newBooks}
              onCheckedChange={setNewBooks}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Notification Settings'}
      </Button>
    </div>
  );
};