"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import "./loader.css";
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const path = usePathname();

  const [hasPermition, setHasPermition] = useState<any>(undefined);
  // let hasPermition;
  useEffect(() => {
    const storedData: any = localStorage.getItem("user");
    console.log("AUTH");
    console.log(storedData == "");
    console.log(path);
    if (storedData == "") {
      setHasPermition(false);
      router.push("/");
      return;
    }
    if (storedData != "") {
      const parsedData: any = JSON.parse(storedData);
      if (
        parsedData != null &&
        parsedData != "" &&
        parsedData?.Nome.length > 0
      ) {
        // hasPermition = true;
        setHasPermition(true);
      } else {
        // hasPermition = false;
        router.push("/");
        setHasPermition(false);
      }
    }
  }, [localStorage.getItem("user")]);

  //   if (hasPermition == undefined) {
  //     return <h2>{JSON.stringify(localStorage.getItem("user"))} -Loading</h2>;
  //   }

  if (
    !hasPermition &&
    (path == "/" || path == "/login" || path == "/register")
  ) {
    return children;
  }

  if (hasPermition) {
    return children;
  } else {
    // router.push("/");

    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          justifyContent: "center",
          textAlign: "center",
          paddingTop: "20%",
        }}
      >
        <div
          className="loading"
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2 className="loadertt">Verificando sua sessão</h2>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }
};
