import FileUpload from "@/components/FileUpload";
import Menu from "@/components/Menu";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-[url('/my-durves.png')] bg-center bg-cover opacity-50" />
      
      <div className="relative text-white">
        <header>
          <Menu />
        </header>
        <FileUpload />
        <footer>
          <div className="flex h-[5vh] justify-center items-center h-16 border-gray-800 shadow-2xl bg-black bg-opacity-65  text-white">
            <p className="opacity-100 drop-shadow-xl">Data Visualise App | by Mikołaj Karla</p>
          </div>
        </footer>
      </div>
    </div>
  );
}