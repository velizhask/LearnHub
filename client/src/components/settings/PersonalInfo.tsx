import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Camera, Save, Trash2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../ui/use-toast";

export const PersonalInfo = () => {
  const { user, updateProfile, deleteProfileImage } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [isLoading, setIsLoading] = useState(false);

  // Sync profile image with user state
  useEffect(() => {
    setProfileImage(user?.profileImage || "");
  }, [user?.profileImage]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set canvas size to square (200x200)
          const size = 200;
          canvas.width = size;
          canvas.height = size;
          
          // Calculate crop dimensions to maintain aspect ratio
          const minDim = Math.min(img.width, img.height);
          const cropX = (img.width - minDim) / 2;
          const cropY = (img.height - minDim) / 2;
          
          // Draw cropped and resized image
          ctx?.drawImage(img, cropX, cropY, minDim, minDim, 0, 0, size, size);
          
          // Convert to base64
          const resizedImage = canvas.toDataURL('image/jpeg', 0.8);
          setProfileImage(resizedImage);
          
          // Auto-save the new profile image
          handleSaveImage(resizedImage);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match!",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Only update name, profile image is handled separately
      await updateProfile(name, user?.profileImage);
      toast({
        title: "Success",
        description: "Profile information updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveImage = async (imageData: string) => {
    setIsLoading(true);
    try {
      await updateProfile(name, imageData);
      toast({
        title: "Success",
        description: "Profile image updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    setIsLoading(true);
    try {
      await deleteProfileImage();
      toast({
        title: "Success",
        description: "Profile image deleted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete profile image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={profileImage} />
            <AvatarFallback className="text-2xl bg-gradient-hero text-primary-foreground">
              {name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="profile-upload"
            />
            <Button asChild variant="outline">
              <label htmlFor="profile-upload" className="cursor-pointer">
                <Camera className="w-4 h-4 mr-2" />
                Change Photo
              </label>
            </Button>
            {(profileImage || user?.profileImage) && (
              <Button 
                variant="outline" 
                onClick={handleDeleteImage}
                disabled={isLoading}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full" disabled={isLoading}>
        <Save className="w-4 h-4 mr-2" />
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
};