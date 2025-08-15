

import FileUpload from "@/components/FileUpload";
import NavbarAuth from "@/components/Navbar";

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <NavbarAuth />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <FileUpload />
        </div>
      </main>
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <p className="text-sm text-muted-foreground font-medium">
              Data Visualise App • Created by{" "}
              <span className="text-primary font-semibold">Mikołaj Karla</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}