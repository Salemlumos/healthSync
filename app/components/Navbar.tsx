"use client";
import Link from "next/link";
import { Avatar } from "antd";
import {
  AiOutlineHome,
  AiFillHome,
  AiFillMedicineBox,
  AiOutlineMedicineBox,
} from "react-icons/ai";
import { HiMiniUsers, HiOutlineUsers } from "react-icons/hi2";
import { BsPersonBadgeFill, BsPersonBadge } from "react-icons/bs";
import { RiHotelBedFill, RiHotelBedLine } from "react-icons/ri";
import { FaUserDoctor } from "react-icons/fa6";
import { CgLogOut } from "react-icons/cg";
import { FaUserFriends } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { TbMedicalCross, TbMedicalCrossFilled } from "react-icons/tb";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
export default () => {
  const path = usePathname();
  const [perfilData, setPerfilData] = useState<any>();
  const [userData, setUserData] = useState<any>(null);

  const fetchPerfilData = async (cod: string) => {
    const response: any = await fetch("http://localhost:3001/perfil/code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ NomePerfil: "", Slug: "", Doc: cod }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    console.log("here");
    const data = await response.json(); //
    console.log(data);
    return data.data;
  };

  const setPefilDataFromFetch = async () => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      const parsedData: any = JSON.parse(storedData);
      if (parsedData?.Nome.length > 0) {
        console.log("Serching");
        const res = await fetchPerfilData(parsedData?.PerfilFk);
        setUserData(parsedData);
        setPerfilData(res);
      }
    }
  };
  useEffect(() => {
    setPefilDataFromFetch();
  }, []);

  const ICON_SIZE = 21;

  const routes = [
    {
      path: "/access",
      nome: "home",
      icon: <AiOutlineHome size={ICON_SIZE} />,
      iconActive: <AiFillHome size={ICON_SIZE} />,
      access: ["A", "P"],
    },
    {
      path: "/access/agendamento",
      nome: "Agendamento",
      icon: <AiOutlineMedicineBox size={ICON_SIZE} />,
      iconActive: <AiFillMedicineBox size={ICON_SIZE} />,
      access: ["A", "P"],
    },
    {
      path: "/access/perfil",
      nome: "Perfil",
      icon: <BsPersonBadge size={ICON_SIZE} />,
      iconActive: <BsPersonBadgeFill size={ICON_SIZE} />,
      access: ["A", "P", "M"],
    },
    {
      // path: "/access/chat",
      path: "/access/pacientes",
      nome: "Pacientes",
      icon: <RiHotelBedLine size={ICON_SIZE} />,
      iconActive: <RiHotelBedFill size={ICON_SIZE} />,
      access: ["A", "M"],
    },

    {
      path: "/access/medicos",
      nome: "Médicos",
      icon: <FaUserDoctor size={ICON_SIZE} />,
      iconActive: <FaUserDoctor size={ICON_SIZE} />,
      access: ["A"],
    },

    {
      path: "/access/especialidades",
      nome: "Especialidades Médicas",
      icon: <TbMedicalCross size={ICON_SIZE} />,
      iconActive: <TbMedicalCrossFilled size={ICON_SIZE} />,
      access: ["A"],
    },
    {
      path: "/access/usuarios",
      nome: "Usuários",
      icon: <FiUsers size={ICON_SIZE} />,
      iconActive: <FaUserFriends size={ICON_SIZE} />,
      access: ["A"],
    },

    {
      path: "/",
      nome: "Sair",
      icon: <CgLogOut size={ICON_SIZE} />,
      iconActive: <CgLogOut size={ICON_SIZE} />,
      access: ["A", "P", "M"],
    },
  ];
  return (
    <div
      className="group  h-screen bg-green-400 transition-all duration-500  
                ease-out hover:w-2/12"
    >
      {/* {JSON.stringify(userData)} */}
      {/* {JSON.stringify(perfilData)} */}

      {routes.map((r: any, idx) => {
        if (!r.access.includes(perfilData?.Slug)) {
          return null;
        }
        return (
          <Link
            key={idx}
            {...(r.nome == "Sair"
              ? { onClick: () => localStorage.setItem("user", "") }
              : {})}
            className={`link m-2 flex transition items-center  rounded-2xl p-2 active:bg-green-700 active:text-green-300  hover:text-black ${
              path == r.path
                ? "bg-green-300 text-green-800"
                : "hover:text-white"
            }`}
            href={r.path}
          >
            <div className=" p-1 transition flex text-4xl items-center ">
              {path == r.path ? r.iconActive : r.icon}
              <p className={` text-sm`}>
                <span className="ml-1 hidden  group-hover:block ">
                  {r.nome}
                </span>
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
