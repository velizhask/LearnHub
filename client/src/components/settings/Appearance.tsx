import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Palette, Monitor, Moon, Sun, Type, Layout } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

export const Appearance = () => {
  const {
    theme,
    colorScheme,
    fontSize,
    compactMode,
    animations,
    setTheme,
    setColorScheme,
    setFontSize,
    setCompactMode,
    setAnimations
  } = useTheme();

  const handleSave = () => {
    alert("Appearance settings saved!");
  };

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  const colorOptions = [
    { value: "blue", label: "Blue", color: "bg-blue-500" },
    { value: "green", label: "Green", color: "bg-green-500" },
    { value: "purple", label: "Purple", color: "bg-purple-500" },
    { value: "orange", label: "Orange", color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Theme Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Theme Mode</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
  key={option.value}
  variant={theme === option.value ? "default" : "outline"}
  onClick={() => setTheme(option.value as "light" | "dark" | "system")}
  className="flex flex-col gap-2 h-auto py-4"
>
  <Icon className="w-5 h-5" />
  <span className="text-sm">{option.label}</span>
</Button>
                );
              })}
            </div>
          </div>

          <div>
            <Label>Color Scheme</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {colorOptions.map((option) => (
                <Button
  key={option.value}
  variant={colorScheme === option.value ? "default" : "outline"}
  onClick={() => setColorScheme(option.value as "blue" | "green" | "purple" | "orange")}
  className="flex flex-col gap-2 h-auto py-4"
>
  <div className={`w-6 h-6 rounded-full ${option.color}`} />
  <span className="text-sm">{option.label}</span>
</Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="w-5 h-5" />
            Typography & Layout
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Font Size</Label>
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="extra-large">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Layout className="w-4 h-4 text-muted-foreground" />
              <div>
                <Label>Compact Mode</Label>
                <p className="text-sm text-muted-foreground">Reduce spacing and padding</p>
              </div>
            </div>
            <Switch
              checked={compactMode}
              onCheckedChange={setCompactMode}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Animations</Label>
              <p className="text-sm text-muted-foreground">Enable smooth transitions</p>
            </div>
            <Switch
              checked={animations}
              onCheckedChange={setAnimations}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-lg bg-gradient-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">LH</span>
              </div>
              <div>
                <h3 className="font-semibold">LearnHub Preview</h3>
                <p className="text-sm text-muted-foreground">This is how your interface will look</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-primary/20 rounded-full">
                <div className="h-2 bg-primary rounded-full w-3/4"></div>
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">Reading</div>
                <div className="px-3 py-1 bg-success/10 text-success rounded-full text-xs">Completed</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full">
        Settings Applied Automatically
      </Button>
    </div>
  );
};