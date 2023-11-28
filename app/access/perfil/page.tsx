"use client";
import { Card, Tabs } from "antd";
import { TabsProps, Button, Modal, Input, Radio } from "antd";
import { useEffect, useState } from "react";

import { HiPencil } from "react-icons/hi2";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiFillLock } from "react-icons/ai";

const createEditProfileFormSchema: any = z.object({
  nome: z.string().nonempty("O nome é obrigatório!"),
  email: z.string().nonempty("Você precisa digitar um email!"),
  telefone: z.string().nonempty("Você precisa um número de telefone"),
  cpf: z.string().nonempty("Você precisa digitar seu CPF"),
  sexo: z.string().nonempty("Você precisa informar seu sexo"),
  senha: z.string().nonempty("Você precisa confirmar sua senha"),
});

type CreateEditProfileFormSchema = z.infer<typeof createEditProfileFormSchema>;

export default function Perfil() {
  const [userData, setUserData] = useState<any>();
  const [currentTab, setCurrentTab] = useState<any>(1);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [perfil, setPerfil] = useState<any>({});

  const loadPerfil = async (docId: any) => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/perfil/code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          NomePerfil: "",
          Slug: "",
          Doc: docId,
        }),
      });

      const res = await response.json();
      console.log(res);

      if (res.status == 200) {
        setPerfil(res.data);
      } else {
        setPerfil({});
        console.log("Error", res.message);
        setLoading(false);
        console.log("error - perfil");
      }
    } catch (error) {
      setLoading(false);
      console.log("error - perfil");
      console.log(error);
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      const parsedData: any = JSON.parse(storedData);
      loadPerfil(parsedData?.PerfilFk);
      setUserData(parsedData);
    }
    setLoading(false);
  }, []);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateEditProfileFormSchema>({
    resolver: zodResolver(createEditProfileFormSchema),
  });

  const salvarEdit = async (data: any) => {
    data.id = userData?.id;
    data.perfilFk = userData?.PerfilFk;
    setLoading(true);
    console.log("DHUDE");
    console.log(data);
    // return;
    try {
      const response = await fetch("http://localhost:3001/users/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(data),
      });

      const res = await response.json();
      console.log(res);
      setEditMode(false);

      if (res.status == "200" && res.message == "User Updated") {
        const userObj = {
          PerfilFk: data.perfilFk,
          Telefone: data.telefone,
          Cpf: data.cpf,
          Email: data.email,
          Nome: data.nome,
          Sexo: data.sexo,
          id: data.id,
        };
        localStorage.setItem(
          "user",
          // JSON.stringify({ ...res.data.data, ...{ id } })
          JSON.stringify({ ...userData, ...{ userObj } })
        );
        setUserData(userObj);
        setLoading(false);
      } else {
        // setError(
        //   res.message == "User Not Found" ? "Senha Incorreta" : res.message
        // );
        console.log("Error", res.message);
        setLoading(false);
        console.log("error - login");
        // console.log(error);
      }
    } catch (error) {
      setLoading(false);
      console.log("error - login");
      console.log(error);
    }
  };

  const onErrorSalvarEdit = async (formErrors: any) => {
    console.log(formErrors);
  };

  const handleOk = () => {
    console.log("hdehdeu");
    handleSubmit(salvarEdit)();
    if (errors != undefined) {
      return;
    }
    console.log("closing");
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const PersonalInfo = (userData: any) => (
    <>
      <div>
        <h2>Nome: {userData?.Nome}</h2>
        <h2>Perfil: {perfil?.NomePerfil}</h2>
        <h2>Telefone: {userData?.Telefone}</h2>
        <h2>Email: {userData?.Email}</h2>
        <h2>CPF: {userData?.Cpf}</h2>
      </div>
    </>
  );

  const EditInformation = () =>
    currentTab == 1 ? (
      <Button
        type="primary"
        className="bg-green-700"
        loading={loading}
        onClick={() => setEditMode(!editMode)}
        icon={<HiPencil />}
      >
        Editar
      </Button>
    ) : null;

  const items: any["items"] = [
    {
      key: "1",
      label: "Informações",
      children: PersonalInfo(userData),
    },
    {
      key: "2",
      label: "Prescrições",
      children: "Content of Tab Pane 2",
    },
    {
      key: "3",
      label: "Histórico",
      children: "Content of Tab Pane 3",
    },
  ];

  return (
    <Card className="w-full m-9" title="Meu Perfil" bordered={true}>
      {!loading ? (
        <Modal
          okText="Salvar"
          cancelText="Cancelar"
          title="Editar Informações"
          open={editMode}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <form>
            <Controller
              name="nome"
              defaultValue={userData?.Nome}
              control={control}
              render={({ field }) => (
                <>
                  <Input
                    size="large"
                    className="m-1"
                    placeholder="Nome"
                    // prefix={<BsFillPersonFill />}
                    value={field.value}
                    onChange={(e: any) => field.onChange(e)}
                    status={errors.nome ? "error" : ""}
                  />
                  {errors.nome && (
                    <p className="text-red-500 font-semibold text-sm">
                      {errors.nome.message?.toString()}
                    </p>
                  )}
                </>
              )}
            />
            <Controller
              name="email"
              defaultValue={userData?.Email}
              control={control}
              render={({ field }) => (
                <>
                  <Input
                    className="m-1"
                    size="large"
                    placeholder="email"
                    type="email"
                    // visibilityToggle={{
                    //   visible: passwordVisible,
                    //   onVisibleChange: setPasswordVisible,
                    // }}
                    // prefix={<AiFillLock />}
                    value={field.value}
                    onChange={(e: any) => field.onChange(e)}
                    status={errors.email ? "error" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 font-semibold text-sm">
                      {errors.email.message?.toString()}
                    </p>
                  )}
                </>
              )}
            />
            <Controller
              name="telefone"
              defaultValue={userData?.Telefone}
              control={control}
              render={({ field }) => (
                <>
                  <Input
                    className="m-1"
                    size="large"
                    placeholder="telefone"
                    type="text"
                    // visibilityToggle={{
                    //   visible: passwordVisible,
                    //   onVisibleChange: setPasswordVisible,
                    // }}
                    // prefix={<AiFillLock />}
                    value={field.value}
                    onChange={(e: any) => field.onChange(e)}
                    status={errors.telefone ? "error" : ""}
                  />
                  {errors.telefone && (
                    <p className="text-red-500 font-semibold text-sm">
                      {errors.telefone.message?.toString()}
                    </p>
                  )}
                </>
              )}
            />
            <Controller
              name="cpf"
              defaultValue={userData?.Cpf}
              control={control}
              render={({ field }) => (
                <>
                  <Input
                    className="m-1"
                    size="large"
                    placeholder="cpf"
                    type="text"
                    // visibilityToggle={{
                    //   visible: passwordVisible,
                    //   onVisibleChange: setPasswordVisible,
                    // }}
                    // prefix={<AiFillLock />}
                    value={field.value}
                    onChange={(e: any) => field.onChange(e)}
                    status={errors.cpf ? "error" : ""}
                  />
                  {errors.cpf && (
                    <p className="text-red-500 font-semibold text-sm">
                      {errors.cpf.message?.toString()}
                    </p>
                  )}
                </>
              )}
            />
            <Controller
              name="sexo"
              defaultValue={userData?.Sexo}
              control={control}
              render={({ field }) => (
                <>
                  <div className="m-1 p-1">
                    <span>Sexo: </span>
                    <Radio.Group
                      onChange={(e: any) => field.onChange(e)}
                      value={field.value}
                    >
                      <Radio value={"M"}>Masculino</Radio>
                      <Radio value={"F"}>Feminino</Radio>
                      <Radio value={"O"}>Outro</Radio>
                    </Radio.Group>
                  </div>
                  {errors.sexo && (
                    <p className="text-red-500 font-semibold text-sm">
                      {errors.sexo.message?.toString()}
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
                    placeholder="Confirm a sua senha"
                    visibilityToggle={{
                      visible: passwordVisible,
                      onVisibleChange: setPasswordVisible,
                    }}
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
          </form>
        </Modal>
      ) : null}

      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={(key) => {
          setCurrentTab(key);
        }}
        tabBarExtraContent={{
          right: currentTab == 1 ? EditInformation() : null,
        }}
      />
    </Card>
  );
}
