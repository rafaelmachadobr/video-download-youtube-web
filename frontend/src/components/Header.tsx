import Logo from "../assets/logo.jpeg";

function Header() {
  return (
    <h1 className="text-2xl font-bold text-center mb-4">
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-primary">
        <div className="text-center md:text-left">
          Baixador de vídeos do YouTube
          <div className="text-sm text-accent mt-2 md:mt-0 md:text-center">
            v1.0.0
          </div>
        </div>
        <div className="animate-bounce p-2 rounded-full flex justify-center items-center w-32 h-32">
          <img
            src={Logo}
            alt="Logo"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      </div>
    </h1>
  );
}

export default Header;
