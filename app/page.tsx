"use client";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();

  const goToHome = () => {
    router.push("/access");
  };
  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      const parsedData: any = JSON.parse(storedData);
      if (parsedData?.Nome.length > 0) {
        goToHome();
      }
    }
  }, []);
  return (
    <main className="h-screen bg-slate-200">
      <div id="topbar" className="flex justify-center  w-full fixed z-10">
        <div className="flex shadow-xl w-full p-4 md:mx-10 mt-5 md:rounded-xl bg-slate-200">
          <div className="hidden  text-white font-semibold md:flex w-full">
            <Image
              src={"/logo.png"}
              alt={"HealthSync"}
              width={200}
              height={100}
            />
          </div>
          <nav className="flex gap-3 flex-row w-3/5  items-center">
            <a href="#sobrenos">
              <button className="border-b-2 transition-all ease-out hover:opacity-70 hover:border-b-2 hover:border-black active:text-green-600 active:border-green-600">
                Marcar Consulta
              </button>
            </a>
            <a href="#sobrenos">
              <button className="border-b-2 transition-all ease-out hover:opacity-70 hover:border-b-2 hover:border-black active:text-green-600 active:border-green-600">
                {" "}
                Trabalhe Conosco
              </button>
            </a>
            <a href="#sobrenos">
              <button className="border-b-2 transition-all ease-out hover:opacity-70 hover:border-b-2 hover:border-black active:text-green-600 active:border-green-600">
                {" "}
                Sobre Nós
              </button>
            </a>
            <a href="" className="select-none">
              <div className="flex items-center">|</div>
            </a>
            <Link href="/register">
              <button className="text-green-600 hover:text-green-800">
                {" "}
                Fazer Cadastro
              </button>
            </Link>
            <Link href="/login">
              <button className="bg-green-600 p-2 rounded-lg text-white hover:bg-green-800">
                {" "}
                Entrar
              </button>
            </Link>
          </nav>
        </div>
      </div>
      <div
        id="agendamento"
        className="flex w-full  bg-slate-200 pt-46 justify-center overflow-x-hidden"
      >
        <div className=" w-full">
          <div className="pt-60 text-black text-4xl text-center h-auto ">
            <div>Agende a sua consulta agora!</div>
            <Link href="/register/quick">
              <button className="bg-green-600 p-2 rounded-lg text-white text-xl mt-10 hover:bg-green-800">
                Agendar
              </button>
            </Link>
          </div>
          <svg
            className="bg-blue"
            xmlns="http://www.w3.org/2000/svg"
            id="visual"
            viewBox="0 200 1920 100"
            width="100%"
            height="150"
            version="1.1"
          >
            <path
              d="M0 302L32 305.5C64 309 128 316 192 312.3C256 308.7 320 294.3 384 285.3C448 276.3 512 272.7 576 280.2C640 287.7 704 306.3 768 308.5C832 310.7 896 296.3 960 287.5C1024 278.7 1088 275.3 1152 274C1216 272.7 1280 273.3 1344 274C1408 274.7 1472 275.3 1536 281.7C1600 288 1664 300 1728 303.8C1792 307.7 1856 303.3 1888 301.2L1920 299L1920 401L1888 401C1856 401 1792 401 1728 401C1664 401 1600 401 1536 401C1472 401 1408 401 1344 401C1280 401 1216 401 1152 401C1088 401 1024 401 960 401C896 401 832 401 768 401C704 401 640 401 576 401C512 401 448 401 384 401C320 401 256 401 192 401C128 401 64 401 32 401L0 401Z"
              fill="#16a34a"
            />
          </svg>
        </div>
      </div>
      <div className="bg-green-600 h-3/6">
        <div className="pt-96" id="sobrenos">
          Sobre nos
        </div>
      </div>
    </main>
  );
}
