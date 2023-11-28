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
  Select,
  Modal,
} from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { AiOutlineSearch, AiOutlineDelete } from "react-icons/ai";
import { GrEdit, GrAdd } from "react-icons/gr";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
type DataIndex = keyof any;
const createCrudFormSchema: any = z.object({
  Nome: z.string().nullable(),
  Id: z.string(),
  User: z.any().nullable(),
  Especialidade: z.string().nullable(),
  // senha: z.string().nonempty("Você precisa digitar uma senha!"),
});

type CreateCrudFormSchema = z.infer<typeof createCrudFormSchema>;

export default function Page() {
  const CARD_TITLE = "Gerenciamento de Médicos";
  const EMPTY_TABLE = "Não há médicos cadastrados";
  const ENDPOINT = "http://localhost:3001/medicos/getAllMedics";
  const REGISTER_ENDPOINT = "http://localhost:3001/medicos/createMedic";
  const DELETE_ENDPOINT = "http://localhost:3001/medicos/delete";
  const UPDATE_ENDPOINT = "http://localhost:3001/especialidade/update";
  const SUCCESS_REGISTER_MSG = "Médico adicionado com sucesso!";
  const SUCCESS_EDITING_MSG = "Médico editado com sucesso!";
  const SUCCESS_DELETING_MSG = "Médico deletado com sucesso!";
  const MODAL_TITLE = "Gerenciamento de Médico";
  const TABLE_SCROLL_SIZE = "40vh";

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);
  const [especialidades, setEspecialidades] = useState<any>([]);
  const [editData, setEditData] = useState<any>({
    Id: undefined,
    User: undefined,
    Especialidade: undefined,
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
          userId: data.User,
          espId: data.Especialidade,
        }),
      });

      const res = await response.json();
      console.log(res);

      if (res.status == "ok" && res.message == "Medic added") {
        message.success(SUCCESS_REGISTER_MSG);
        loadMedicos();
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
          id: data.idMed,
        }),
      });

      const res = await response.json();
      console.log(res);

      if (res.status == "ok" && res.message == "Medicos deleted") {
        message.success(SUCCESS_DELETING_MSG);
        loadMedicos();
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
        loadMedicos();
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
    handleSubmit(
      (data: any) => {
        console.log("here");
        if (editData?.Id != undefined) {
          console.log("update");
          data.Id = editData?.Id;
          console.log(data);
          return;
          updateData(data);
        }
        console.log(data);
        register(data);

        console.log("form");
        console.log(editData);
        console.log(data);
      },
      (e) => {
        console.log("eeor");
        console.log(e);
      }
    )();
    if (errors) {
      return;
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setValue("Id", undefined);
    setIsModalOpen(false);
  };

  const loadMedicos = async () => {
    setLoading(true);
    try {
      const esp = await fetch(ENDPOINT);
      if (!esp.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${esp.status}`);
      }
      const dt = await esp.json();
      setLoading(false);
      console.log(dt.data);
      setData(
        dt.data.map((item: any) => ({
          ...item.user,
          ...{
            Especialidade: item.specialty.Nome,
            idMed: item.medic.id,
            specialty: item.specialty,
          },
        }))
      );
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
  const loadUser = async () => {
    function transformKeys(arrayOfObjects: any) {
      return arrayOfObjects.map((obj: any) => ({
        label: obj.Nome,
        value: obj.id,
      }));
    }
    try {
      const esp = await fetch("http://localhost:3001/medicos/getAllNonMedics");
      if (!esp.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${esp.status}`);
      }
      const dt = await esp.json();
      setLoading(false);

      setUsers(transformKeys(dt.data));
      console.log(users);
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
  const loadEspecialidades = async () => {
    function transformKeys(arrayOfObjects: any) {
      return arrayOfObjects.map((obj: any) => ({
        label: obj.Nome,
        value: obj.id,
      }));
    }
    try {
      const esp = await fetch("http://localhost:3001/especialidade/getAll");
      if (!esp.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${esp.status}`);
      }
      const dt = await esp.json();
      setLoading(false);

      setEspecialidades(transformKeys(dt.data));
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
    loadEspecialidades();
    loadMedicos();
    loadUser();
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
  const saveMedico = async (idUser: any, idEsp: any) => {
    try {
      const esp = await fetch("http://localhost:3001/medicos/createMedic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          userId: idUser,
          espId: idEsp,
        }),
      });

      if (!esp.ok) {
        // Handle the error, for example by throwing an exception
        throw new Error(`HTTP error! Status: ${esp.status}`);
      }

      const dt = await esp.json();
      // setEvents((prev: any) => [
      //   ...prev,
      //   {
      //     start,
      //     end,
      //     title:
      //       findLabelById(especialidades, especialidade, "label") +
      //       " " +
      //       start.toLocaleDateString(),
      //   },

      // ]);

      // console.log(transformKeys(dt.data));
      // setEspecialidades(transformKeys(dt.data));
    } catch (error) {
      // Handle any errors that occurred during the fetch
      console.error("Error fetching data:", error);
    }
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
      title: "Nome",
      dataIndex: "Nome",
      key: "nomeMedico",
      width: "20%",
      sorter: (a: any, b: any) => a.Nome.localeCompare(b.Nome),
      ...getColumnSearchProps("Nome"),
    },
    {
      title: "Especialidade",
      dataIndex: "Especialidade",
      key: "especialidadeMedico",
      width: "20%",
      sorter: (a: any, b: any) =>
        a.Especialidade.localeCompare(b.Especialidade),
      ...getColumnSearchProps("Especialidade"),
    },

    {
      title: "Ações",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Tooltip placement="left" title={"Editar"}>
            <Button
              onClick={() => {
                setEditData((prev: any) => ({ ...prev, ...{ Id: record.id } }));
                setValue("Id", record.id);
                setValue("User", undefined);
                setValue("Nome", record.Nome);
                setValue("Especialidade", record.specialty.id);

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
          {JSON.stringify(getValues("Id"))}
          {getValues("Id") != undefined && getValues("Id") != "" ? (
            <Controller
              name="User"
              control={control}
              render={({ field }) => (
                <>
                  <Input
                    size="large"
                    className="m-1 w-full"
                    placeholder="Escolha um usuário"
                    value={getValues("Nome")}
                    onChange={(e: any) => field.onChange(e)}
                    status={errors.User ? "error" : ""}
                    disabled
                  />
                  {errors.User && (
                    <p className="text-red-500 font-semibold text-sm text-center">
                      {errors.User.message?.toString()}
                    </p>
                  )}
                </>
              )}
            />
          ) : (
            <Controller
              name="User"
              control={control}
              render={({ field }) => (
                <>
                  <Select
                    size="large"
                    className="m-1 w-full"
                    placeholder="Escolha um usuário"
                    value={field.value}
                    onChange={(e: any) => field.onChange(e)}
                    status={errors.User ? "error" : ""}
                    options={users}
                  />
                  {errors.User && (
                    <p className="text-red-500 font-semibold text-sm text-center">
                      {errors.User.message?.toString()}
                    </p>
                  )}
                </>
              )}
            />
          )}

          <Controller
            name="Especialidade"
            control={control}
            render={({ field }) => (
              <>
                <Select
                  size="large"
                  className="m-1 w-full"
                  placeholder="Escolha a especialidade do médico"
                  value={field.value}
                  onChange={(e: any) => field.onChange(e)}
                  status={errors.Especialidade ? "error" : ""}
                  options={especialidades}
                />
                {errors.Especialidade && (
                  <p className="text-red-500 font-semibold text-sm text-center">
                    {errors.Especialidade.message?.toString()}
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
            setValue("Especialidade", undefined);
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
