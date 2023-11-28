"use client";
import { useEffect, useState } from "react";
import { Card, Input, Button } from "antd";
import { BsFillPersonFill } from "react-icons/bs";
import { AiFillLock } from "react-icons/ai";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Spin } from "antd";

const createLoginFormSchema: any = z.object({
  login: z.string().nonempty("O usuário é obrigatório!"),
  senha: z.string().nonempty("Você precisa digitar uma senha!"),
});

type CreateLoginFormSchema = z.infer<typeof createLoginFormSchema>;

export default function Login() {
  const router = useRouter();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { errors },
  } = useForm<CreateLoginFormSchema>({
    defaultValues: {
      login: "",
      senha: "",
    },
    resolver: zodResolver(createLoginFormSchema),
  });

  const logar = async (data: any) => {
    setLoading(true);
    console.log("DHUDE");
    console.log(data);
    // return;
    try {
      const response = await fetch("http://localhost:3001/users/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({ email: data.login, senha: data.senha }),
      });

      const res = await response.json();
      console.log(res);

      if (res.status == "200" && res.message == "User Found") {
        localStorage.setItem(
          "user",
          // JSON.stringify({ ...res.data.data, ...{ id } })
          JSON.stringify(res.data.data)
        );
        await router.push("/access");
      } else {
        setError(
          res.message == "User Not Found" ? "Senha Incorreta" : res.message
        );
        console.log("Error", res.message);
        setLoading(false);
        console.log("error - login");
        console.log(error);
      }
    } catch (error) {
      setLoading(false);
      console.log("error - login");
      console.log(error);
    }
  };

  return (
    <div
      className="h-screen flex justify-center items-center "
      style={{ backgroundImage: `url('/login.svg')` }}
    >
      <Card
        title="Fazer Login"
        headStyle={{ fontSize: 20 }}
        bordered={false}
        className="sm:w-1/3 md:w-3/12 text-center text-xl h-auto  shadow-xl bg-slate-100 "
      >
        {loading ? (
          <Spin />
        ) : (
          <>
            {error != "" ? (
              <h6
                style={{
                  color: "white",
                  borderRadius: "16px",
                  backgroundColor: "red",
                  padding: "2%",
                  marginBottom: "1%",
                }}
                className="transform transition-transform scale-110 animate-grow"
              >
                {error}
              </h6>
            ) : null}
            <form onSubmit={handleSubmit(logar)}>
              <Controller
                name="login"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      size="large"
                      className="m-1"
                      placeholder="usuário"
                      prefix={<BsFillPersonFill />}
                      value={field.value}
                      onChange={(e: any) => field.onChange(e)}
                      status={errors.login ? "error" : ""}
                    />
                    {errors.login && (
                      <p className="text-red-500 font-semibold text-sm">
                        {errors.login.message?.toString()}
                      </p>
                    )}
                  </>
                )}
              />
              <Controller
                name="senha"
                control={control}
                render={({ field }) => (
                  <>
                    <Input.Password
                      className="m-1"
                      type="password"
                      size="large"
                      placeholder="senha"
                      visibilityToggle={{
                        visible: passwordVisible,
                        onVisibleChange: setPasswordVisible,
                      }}
                      prefix={<AiFillLock />}
                      value={field.value}
                      onChange={(e: any) => field.onChange(e)}
                      status={errors.senha ? "error" : ""}
                    />
                    {errors.senha && (
                      <p className="text-red-500 font-semibold text-sm">
                        {errors.senha.message?.toString()}
                      </p>
                    )}
                  </>
                )}
              />

              <Button
                onClick={() => router.push("/register")}
                className="text-green-600 w-full m-1 hover:text-green-700"
                type="link"
              >
                Nãp possui cadastro?
              </Button>
              <Button
                htmlType="submit"
                className="bg-green-600 w-full m-1"
                type="primary"
              >
                Entrar
              </Button>
              <Button onClick={() => router.push("/")} className="w-full m-1">
                Voltar
              </Button>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}
