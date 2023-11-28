"use client";
import { useState } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Input, Spin, Progress, Tooltip, Popconfirm } from "antd";
import { useRouter } from "next/navigation";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { SvgComponent } from "../assets/svg/RegisterSvg";
import {
  getPasswordStrength,
  formatCPF,
  formatPhoneNumber,
  validarCPF,
} from "../functions/Generic.functions";
const createRegisterFormSchema: any = z
  .object({
    Cpf: z
      .string()
      .nonempty("O CPF é obrigatório!")
      .transform((value) => value.replace(/\D/g, "")),
    Email: z.string().nonempty("Você precisa digitar um email!"),
    Nome: z.string().nonempty("Você precisa digitar seu nome!"),
    Senha: z.string().nonempty("Você precisa digitar uma senha!"),
    ConfirmarSenha: z.string().nonempty("Você precisa confirmar sua senha!"),
    Telefone: z
      .string()
      .nonempty("Você precisa digitar seu telefone!")
      .transform((value) => value.replace(/\D/g, "")),
  })
  .refine((schema) => schema.ConfirmarSenha === schema.Senha, {
    message: "As senha não são iguais!",
    path: ["ConfirmarSenha"],
  })
  .refine((schema) => !validarCPF(schema.Cpf), {
    message: "O CPF inserido é inválido!",
    path: ["Cpf"],
  });

type CreateRegisterFormSchema = z.infer<typeof createRegisterFormSchema>;

export default function Register() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [error, setError] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { errors },
  } = useForm<CreateRegisterFormSchema>({
    defaultValues: {
      Cpf: "",
      Email: "",
      Nome: "",
      Senha: "",
      Sexo: "",
      ConfirmarSenha: "",
      Telefone: "",
    },
    resolver: zodResolver(createRegisterFormSchema),
  });

  const registerAccount: any = async (data: any) => {
    setLoading(true);
    console.log("DHUDE");
    console.log(data);
    try {
      const response = await fetch("http://localhost:3001/users/register", {
        // Change the URL to the register route
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          email: data.Email,
          senha: data.Senha,
          cpf: data.Cpf,
          telefone: data.Telefone,
          nome: data.Nome,
          perfilFk: "6GDLTYAM609pUFxLTBCZ",
          sexo: "M",
        }),
      });

      const res = await response.json();
      console.log(res);

      if (res.status == "200" && res.message == "User Created") {
        await router.push("/");
      } else {
        setError(
          res.message == "User Not Found" ? "Senha Incorreta" : res.message
        );
        console.log("Error", res.message);
      }
    } catch (error) {
      setLoading(false);
      console.log("error - register");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setOpen(newOpen);
      return;
    }
    // Determining condition before show the popconfirm.
    if (Object.values(getValues()).filter((e) => e != "").length == 0) {
      router.push("/");
    } else {
      setOpen(newOpen);
    }
  };

  return (
    <div
      className="h-screen flex justify-center items-center "
      style={{
        backgroundImage: `url('/login.svg')`,
        backgroundPosition: "right",
      }}
    >
      <Card
        title="Formulário de Cadastro"
        bordered={false}
        className="sm:w-1/3 md:w-6/12 text-center text-xl h-auto  shadow-xl bg-slate-100"
      >
        {loading ? (
          <Spin />
        ) : (
          <div className="flex flex-row">
            <div className="w-1/2 border-r-2 border-gray overflow-none ">
              <SvgComponent />
            </div>
            <div className="w-1/2">
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
              <form onSubmit={handleSubmit(registerAccount)}>
                <Controller
                  name="Nome"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        addonBefore="Nome"
                        size="large"
                        className="m-1"
                        placeholder="Digite seu nome aqui..."
                        // prefix={<BsFillPersonFill />}
                        value={field.value}
                        onChange={(e: any) => field.onChange(e)}
                        status={errors.Nome ? "error" : ""}
                      />
                      {errors.Nome && (
                        <p className="text-red-500 font-semibold text-sm ">
                          {errors.Nome.message?.toString()}
                        </p>
                      )}
                    </>
                  )}
                />

                <Controller
                  name="Email"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        className="m-1"
                        addonBefore="Email"
                        type="email"
                        size="large"
                        placeholder="exemplo@ex.com"
                        // prefix={<AiFillLock />}
                        value={field.value}
                        onChange={(e: any) => field.onChange(e)}
                        status={errors.Email ? "error" : ""}
                      />
                      {errors.Email && (
                        <p className="text-red-500 font-semibold text-sm">
                          {errors.Email.message?.toString()}
                        </p>
                      )}
                    </>
                  )}
                />
                <Controller
                  name="Cpf"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        addonBefore="CPF"
                        className="m-1"
                        type="text"
                        size="large"
                        placeholder="000.000.000-00"
                        value={formatCPF(field.value)}
                        maxLength={14}
                        onChange={(e) => {
                          console.log(validarCPF(field.value));
                          field.onChange(formatCPF(e.target.value));
                        }}
                        status={errors.Cpf ? "error" : ""}
                      />
                      {errors.Cpf && (
                        <p className="text-red-500 font-semibold text-sm">
                          {errors.Cpf.message?.toString()}
                        </p>
                      )}
                    </>
                  )}
                />
                <Controller
                  name="Senha"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input.Password
                        addonBefore="Senha"
                        className="m-1"
                        type="password"
                        size="large"
                        placeholder="Digite sua senha aqui..."
                        visibilityToggle={{
                          visible: passwordVisible,
                          onVisibleChange: setPasswordVisible,
                        }}
                        addonAfter={
                          <Tooltip
                            placement="right"
                            title="Uma senha forte geralmente deve ter um comprimento mínimo, uma combinação de letras maiúsculas e minúsculas, números e caracteres especiais, para aumentar a segurança contra acessos não autorizados."
                          >
                            <AiOutlineQuestionCircle />
                          </Tooltip>
                        }
                        value={field.value}
                        onChange={(e: any) => field.onChange(e)}
                        status={errors.Senha ? "error" : ""}
                      />
                      {field.value.length > 0 ? (
                        <div className="flex flex-row justify-center items-center">
                          <Progress
                            className="ml-4"
                            percent={getPasswordStrength(field.value).point}
                            showInfo={false}
                            {...(getPasswordStrength(field.value).point < 60
                              ? { status: "exception" }
                              : {})}
                            {...(getPasswordStrength(field.value).point > 60
                              ? { status: "normal" }
                              : {})}
                            {...(getPasswordStrength(field.value).point >= 80
                              ? { status: "success" }
                              : {})}
                            size={"small"}
                          />
                          <p className="p-1 w-44 text-sm">
                            {getPasswordStrength(field.value).msg}
                          </p>
                        </div>
                      ) : null}
                      {errors.Senha && (
                        <p className="text-red-500 font-semibold text-sm">
                          {errors.Senha.message?.toString()}
                        </p>
                      )}
                    </>
                  )}
                />
                <Controller
                  name="ConfirmarSenha"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        addonBefore="Confirmar Senha"
                        className="m-1"
                        type="password"
                        size="large"
                        placeholder="Digite sua senha novamente neste campo..."
                        // prefix={<AiFillLock />}
                        value={field.value}
                        onChange={(e: any) => field.onChange(e)}
                        status={errors.ConfirmarSenha ? "error" : ""}
                      />
                      {errors.ConfirmarSenha && (
                        <p className="text-red-500 font-semibold text-sm">
                          {errors.ConfirmarSenha.message?.toString()}
                        </p>
                      )}
                    </>
                  )}
                />
                <Controller
                  name="Telefone"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        addonBefore="Telefone"
                        className="m-1"
                        type="text"
                        size="large"
                        placeholder="(00) 00000-0000"
                        // prefix={<AiFillLock />}
                        value={formatPhoneNumber(field.value)}
                        maxLength={15}
                        onChange={(e) =>
                          field.onChange(formatPhoneNumber(e.target.value))
                        }
                        status={errors.Telefone ? "error" : ""}
                      />
                      {errors.Telefone && (
                        <p className="text-red-500 font-semibold text-sm">
                          {errors.Telefone.message?.toString()}
                        </p>
                      )}
                    </>
                  )}
                />

                <Button
                  htmlType="submit"
                  className="bg-green-600 w-full m-1"
                  type="primary"
                >
                  Criar meu acesso
                </Button>
                <Popconfirm
                  title="Atenção"
                  description="Os dados serão perdido. Você tem certeza que quer voltar?"
                  onConfirm={() => router.push("/")}
                  onOpenChange={handleOpenChange}
                  onCancel={() => {}}
                  okText="Sim"
                  cancelText="Não"
                >
                  <Button className="w-full m-1">Voltar</Button>
                </Popconfirm>
              </form>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
