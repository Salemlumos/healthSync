"use client";
import { useEffect, useState, useRef } from "react";
import {
  Card,
  Table,
  Tag,
  Space,
  InputRef,
  Button,
  Input,
  Tooltip,
  Alert,
  message,
  Popconfirm,
  Progress,
  Radio,
  Modal,
} from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { AiOutlineSearch, AiOutlineDelete } from "react-icons/ai";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { GrEdit, GrAdd } from "react-icons/gr";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
  validarCPF,
  formatPhoneNumber,
  formatCPF,
  getPasswordStrength,
} from "@/app/functions/Generic.functions";
type DataIndex = keyof any;
const createCrudFormSchema: any = z
  .object({
    Cpf: z
      .string()
      .nonempty("O CPF é obrigatório!")
      .transform((value) => value.replace(/\D/g, "")),
    Email: z.string().nonempty("Você precisa digitar um email!"),
    Nome: z.string().nonempty("Você precisa digitar seu nome!"),
    // Senha: z.string().nonempty("Você precisa digitar uma senha!"),
    // ConfirmarSenha: z.string().nonempty("Você precisa confirmar sua senha!"),
    Telefone: z
      .string()
      .nonempty("Você precisa digitar seu telefone!")
      .transform((value) => value.replace(/\D/g, "")),
  })
  //   .refine((schema) => schema.ConfirmarSenha === schema.Senha, {
  //     message: "As senha não são iguais!",
  //     path: ["ConfirmarSenha"],
  //   })
  .refine((schema) => !validarCPF(schema.Cpf), {
    message: "O CPF inserido é inválido!",
    path: ["Cpf"],
  });

type CreateCrudFormSchema = z.infer<typeof createCrudFormSchema>;

export default function Page() {
  const CARD_TITLE = "Gerenciamento de Usuários";
  const EMPTY_TABLE = "Não há usuários cadastrados";
  const ENDPOINT = "http://localhost:3001/users/getAll";
  const REGISTER_ENDPOINT = "http://localhost:3001/especialidade/create";
  const DELETE_ENDPOINT = "http://localhost:3001/especialidade/delete";
  const UPDATE_ENDPOINT = "http://localhost:3001/especialidade/update";
  const SUCCESS_REGISTER_MSG = "Usuário adicionado com sucesso!";
  const SUCCESS_EDITING_MSG = "Usuário editado com sucesso!";
  const SUCCESS_DELETING_MSG = "Usuário deletado com sucesso!";
  const MODAL_TITLE = "Gerenciamento de Usuário";
  const TABLE_SCROLL_SIZE = "40vh";

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>([]);
  const [perfis, setPerfis] = useState<any>([]);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [editData, setEditData] = useState<any>({
    Cpf: "",
    Email: "",
    Nome: "",
    Senha: "",
    ConfirmarSenha: "",
    Telefone: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const register: any = async (data: any) => {
    setLoading(true);
    console.log(data);
    try {
      const response = await fetch(REGISTER_ENDPOINT, {
        // Change the URL to the register route
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          Nome: data.Nome,
        }),
      });

      const res = await response.json();
      console.log(res);

      if (res.status == "ok" && res.message == "Document added successfully") {
        message.success(SUCCESS_REGISTER_MSG);
        loadEspecialidade();
      } else {
        message.error("Falha ao registrar.");
        console.log("Error", res.message);
      }
    } catch (error) {
      setLoading(false);
      console.log("error - register");
      console.log(error);
    } finally {
      setIsModalOpen(false);
      setLoading(false);
    }
  };
  const deleteData: any = async (data: any) => {
    setLoading(true);
    console.log(data);
    try {
      const response = await fetch(DELETE_ENDPOINT, {
        // Change the URL to the register route
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          Id: data.id,
        }),
      });

      const res = await response.json();
      console.log(res);

      if (
        res.status == "ok" &&
        res.message == "Document deleted successfully"
      ) {
        message.success(SUCCESS_DELETING_MSG);
        loadEspecialidade();
      } else {
        message.error("Falha ao deletar.");
        console.log("Error", res.message);
      }
    } catch (error) {
      setLoading(false);
      console.log("error - register");
      console.log(error);
    } finally {
      setIsModalOpen(false);
      setLoading(false);
    }
  };
  const updateData: any = async (data: any) => {
    setLoading(true);
    console.log(data);
    try {
      const response = await fetch(UPDATE_ENDPOINT, {
        // Change the URL to the register route
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          Id: data.Id,
          Data: { Nome: data.Nome },
        }),
      });

      const res = await response.json();
      console.log(res);

      if (
        res.status == "ok" &&
        res.message == "Document updated successfully"
      ) {
        message.success(SUCCESS_EDITING_MSG);
        loadEspecialidade();
      } else {
        message.error("Falha ao Editar.");
        console.log("Error", res.message);
      }
    } catch (error) {
      setLoading(false);
      console.log("error - register");
      console.log(error);
    } finally {
      setIsModalOpen(false);
      setLoading(false);
    }
  };

  const {
    setValue,
    handleSubmit,
    getValues,
    control,
    trigger,
    formState: { errors },
  } = useForm<CreateCrudFormSchema>({
    defaultValues: editData,
    resolver: zodResolver(createCrudFormSchema),
  });

  const showModal = () => {
    if (getValues("Id") != undefined || getValues("Id") != "") {
      trigger();
    }
    setIsModalOpen(true);
  };

  const handleOk = () => {
    handleSubmit((data: any) => {
      if (editData?.id) {
        console.log("update");
        data.Id = editData?.id;
        updateData(data);
        return;
      }
      register(data);

      console.log("form");
      console.log(editData);
      console.log(data);
    })();
    if (errors) {
      return;
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const loadEspecialidade = async () => {
    try {
      const esp = await fetch(ENDPOINT);
      console.log(esp);
      if (!esp.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${esp.status}`);
      }
      const dt = await esp.json();

      console.log(dt);
      setLoading(false);

      setData(dt.data.data);
      //   setData(
      //     Array.from({ length: Math.ceil(300 / dt.data.length) }, () => [
      //       ...dt.data,
      //     ])
      //       .flat()
      //       .slice(0, 300)
      //   );
    } catch (error) {
      // Handle any errors that occurred during the fetch
      setLoading(false);

      console.error("Error fetching data:", error);
    }
  };
  function transformKeys(arrayOfObjects: any) {
    return arrayOfObjects.map((obj: any) => ({
      label: obj.Nome,
      value: obj.id,
    }));
  }
  const loadPerfis = async () => {
    try {
      const esp = await fetch("http://localhost:3001/perfil/getAll");
      console.log(esp);
      if (!esp.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${esp.status}`);
      }
      const dt = await esp.json();

      console.log(dt);
      setLoading(false);

      setData(transformKeys(dt.data.data));
      //   setData(
      //     Array.from({ length: Math.ceil(300 / dt.data.length) }, () => [
      //       ...dt.data,
      //     ])
      //       .flat()
      //       .slice(0, 300)
      //   );
    } catch (error) {
      // Handle any errors that occurred during the fetch
      setLoading(false);

      console.error("Error fetching data:", error);
    }
  };

  const confirm = (e: any) => {
    console.log(e);
    deleteData(e);
  };

  const cancel = (e: any) => {};

  useEffect(() => {
    loadEspecialidade();
    loadPerfis();
  }, []);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: any
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: any): ColumnType<any> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Pesquisar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<AiOutlineSearch />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Limpar
          </Button>
          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filtrar
          </Button> */}
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Fechar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <AiOutlineSearch style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: any[] = [
    {
      title: "Nome Usuário",
      dataIndex: "Nome",
      key: "NomeUsuario",
      width: "30%",
      sorter: (a: any, b: any) => a.Nome.localeCompare(b.Nome),
      ...getColumnSearchProps("Nome"),
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "EmailUsuario",
      width: "15%",
      //   sorter: (a: any, b: any) => a.Nome.localeCompare(b.Nome),
      ...getColumnSearchProps("Email"),
    },
    {
      title: "CPF",
      dataIndex: "Cpf",
      key: "CpfUsuario",
      width: "10%",
      //   sorter: (a: any, b: any) => a.Nome.localeCompare(b.Nome),
      ...getColumnSearchProps("Cpf"),
    },
    {
      title: "Sexo",
      dataIndex: "Sexo",
      key: "SexoUsuario",
      width: "5%",
      //   sorter: (a: any, b: any) => a.Nome.localeCompare(b.Nome),
      filters: [
        {
          text: "Masculino",
          value: "M",
        },
        {
          text: "Feminino",
          value: "F",
        },
        {
          text: "Outro",
          value: "O",
        },
      ],
      onFilter: (value: string, record: any) => record.Sexo == value,
    },
    {
      title: "Telefone",
      dataIndex: "Telefone",
      key: "TelefoneUsuario",
      width: "10%",
      //   sorter: (a: any, b: any) => a.Nome.localeCompare(b.Nome),
      ...getColumnSearchProps("Telefone"),
    },

    {
      title: "Ações",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Tooltip placement="left" title={"Editar"}>
            <Button
              onClick={() => {
                setEditData(record);
                setValue("Id", record.id);
                setValue("Nome", record.Nome);
                setValue("Email", record.Email);
                setValue("Cpf", record.Cpf);
                setValue("Sexo", record.Sexo);
                setValue("Telefone", record.Telefone);
                showModal();
                console.log(editData);
              }}
              icon={<GrEdit />}
            />
          </Tooltip>
          <Tooltip placement="right" title={"Deletar"}>
            <Popconfirm
              title="Apagar"
              description="Você tem certeza que quer apagar este registro?"
              onConfirm={() => {
                confirm(record);
              }}
              onCancel={cancel}
              okText="Sim"
              cancelText="Não"
            >
              <Button icon={<AiOutlineDelete />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card
      className="w-full m-9 overflow-auto"
      title={CARD_TITLE}
      bordered={true}
    >
      <Modal
        title={MODAL_TITLE}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={
          getValues("Id") == "" || getValues("Id") == undefined
            ? "Criar "
            : "Editar"
        }
        cancelText={"Cancelar"}
      >
        <form action="#">
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
          <Controller
            name="Sexo"
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
        </form>
      </Modal>
      <Space>
        <Alert message={"Total de registros: " + data.length} type="info" />
        <Button
          onClick={() => {
            setEditData({});
            setValue("Id", "");
            setValue("Nome", "");
            showModal();
          }}
          size="large"
          type="primary"
          icon={<GrAdd />}
        >
          Criar
        </Button>
      </Space>
      <Table
        style={{ height: "1rem" }}
        className="p-1 mb-2"
        locale={{
          triggerDesc: "Inverter ordenação alfabética",
          triggerAsc: "Fazer ordenação alfabética",
          cancelSort: "Cancelar ordenação",
          emptyText: EMPTY_TABLE,
        }}
        loading={loading}
        columns={columns}
        dataSource={data}
        scroll={{ y: TABLE_SCROLL_SIZE }}
      />
    </Card>
  );
}
