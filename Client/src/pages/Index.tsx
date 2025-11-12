import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ImageUpload } from "@/components/ImageUpload";
import { Video, Sparkles } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [productImages, setProductImages] = useState<File[]>([]);
  const [instagramImages, setInstagramImages] = useState<File[]>([]);
  const [productDescription, setProductDescription] = useState("");

  const canGenerate = productImages.length > 0 && instagramImages.length > 0;

  const handleGenerate = async () => {
    if (!canGenerate) return;

    const formData = new FormData();
    instagramImages.forEach(file => formData.append("images", file));
    const response = await fetch("http://localhost:3000/describe-image", {
      method: "POST",
      body: formData,
    });

    console.log(response);

    toast.success("Video generation started!", {
      description: "Your marketing video is being created. This may take a few moments.",
    });

    // Here you would call your video generation API
    console.log({
      productImages,
      instagramImages,
      productDescription,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary">
              <Video className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Video Marketing Generator</h1>
              <p className="text-sm text-muted-foreground">Create stunning marketing videos from Instagram posts</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-8">
          {/* Product Section */}
          <Card className="p-6 shadow-[var(--shadow-soft)] border-border/50">
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground">Product to Showcase</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload your product image and describe how you want it presented
                  </p>
                </div>
              </div>

              <ImageUpload
                label="Product Image"
                description="Upload a high-quality image of your product"
                maxFiles={1}
                onImagesChange={setProductImages}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Product Description
                </label>
                <Textarea
                  placeholder="Describe how you want to showcase your product in the video (e.g., 'Highlight the sleek design and premium materials, emphasizing luxury and quality')"
                  className="min-h-[120px] resize-none"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Instagram Posts Section */}
          <Card className="p-6 shadow-[var(--shadow-soft)] border-border/50">
            <ImageUpload
              label="Instagram Posts"
              description="Upload up to 6 images from your Instagram feed to create a personalized marketing video"
              maxFiles={6}
              onImagesChange={setInstagramImages}
            />
          </Card>

          {/* Generate Button */}
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={cn(
                "px-8 py-6 text-lg font-semibold shadow-[var(--shadow-medium)] transition-all duration-300",
                canGenerate
                  ? "bg-gradient-to-r from-primary to-secondary hover:shadow-[var(--shadow-medium)] hover:scale-105"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              <Video className="mr-2 h-5 w-5" />
              Generate Marketing Video
            </Button>
          </div>

          {!canGenerate && (
            <p className="text-center text-sm text-muted-foreground">
              Upload at least one product image and one Instagram post to generate your video
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

// Missing import for cn utility
import { cn } from "@/lib/utils";

export default Index;
