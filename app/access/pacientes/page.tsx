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
import { BsChatText } from "react-icons/bs";
import z from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { IoInformationCircleOutline } from "react-icons/io5";
type DataIndex = keyof any;
const createCrudFormSchema: any = z.object({
  status: z.string().nullable(),
  observacoes: z.string().nullable(),
  // senha: z.string().nonempty("Você precisa digitar uma senha!"),
});

type CreateCrudFormSchema = z.infer<typeof createCrudFormSchema>;

export default function Page() {
  const CARD_TITLE = "Agendamentos Marcados Comigo";
  const EMPTY_TABLE = "Não há Agendamentos";
  const ENDPOINT = "http://localhost:3001/agendamento/getMedicAgen";
  const REGISTER_ENDPOINT = "http://localhost:3001/especialidade/create";
  const DELETE_ENDPOINT = "http://localhost:3001/agendamento/delete";
  const UPDATE_ENDPOINT = "http://localhost:3001/agendamento/update";
  const SUCCESS_REGISTER_MSG = "Especialidade adicionada com sucesso!";
  const SUCCESS_EDITING_MSG = "A consulta foi editada com sucesso!";
  const SUCCESS_DELETING_MSG = "A consulta foi deletada com sucesso!";
  const MODAL_TITLE = "Consulta - Informaçoes";
  const TABLE_SCROLL_SIZE = "40vh";

  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const [editData, setEditData] = useState<any>({
    Id: "",
    status: undefined,
    observacoes: undefined,
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
        loadEspecialidade(userData.id);
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
          Id: data.eventId,
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
          Id: data.eventId,
          Data: data,
        }),
      });

      const res = await response.json();
      console.log(res);

      if (
        res.status == "ok" &&
        res.message == "Document updated successfully"
      ) {
        message.success(SUCCESS_EDITING_MSG);
        loadEspecialidade(userData.id);
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
      console.log("update");

      if (getValues("Id") != undefined) {
        console.log("update");
        data.Id = editData?.eventId;
        console.log({
          ...editData,
          ...{ status: data.status, observacoes: data.observacoes },
        });
        updateData({
          ...editData,
          ...{ status: data.status, observacoes: data.observacoes },
        });
      }
      // register(data);

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

  const loadEspecialidade = async (id = "") => {
    try {
      const esp = await fetch(ENDPOINT, {
        // Change the URL to the register route
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          id: id,
        }),
      });
      if (!esp.ok) {
        setLoading(false);
        throw new Error(`HTTP error! Status: ${esp.status}`);
      }
      const dt = await esp.json();
      setLoading(false);

      setData(dt.data);
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

  const router = useRouter();

  const cancel = (e: any) => {};

  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      const parsedData: any = JSON.parse(storedData);
      setUserData(parsedData);
      loadEspecialidade(parsedData?.id);
    }
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
      title: "Agendamento",
      dataIndex: "title",
      key: "titleAgen",
      width: "70%",
      sorter: (a: any, b: any) => a.Nome.localeCompare(b.Nome),
      ...getColumnSearchProps("title"),
    },

    {
      title: "Ações",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Tooltip placement="left" title={"Chat"}>
            <Button
              onClick={() => {
                router.push("/access/chat/" + userData?.id);

                // setEditData(record);
                // setValue("Id", record.id);
                // setValue("Nome", record.Nome);
                // showModal();
                // console.log(editData);
              }}
              icon={<BsChatText />}
            />
          </Tooltip>
          <Tooltip placement="left" title={"Detalhes"}>
            <Button
              onClick={() => {
                setEditData(record);
                setValue("Id", undefined);
                // setValue("Id", record.id);
                // setValue("Nome", record.Nome);
                showModal();
                // console.log(editData);
              }}
              icon={<IoInformationCircleOutline />}
            />
          </Tooltip>
          <Tooltip placement="left" title={"Editar"}>
            <Button
              onClick={() => {
                setEditData(record);
                setValue("Id", record.eventId);
                setValue("status", record.status);
                setValue("observacoes", record.observacoes);
                showModal();
                console.log(editData);
              }}
              icon={<GrEdit />}
            />
          </Tooltip>
          {/* <Tooltip placement="right" title={"Deletar"}>
            <Popconfirm
              title="Apagar"
              description="Você tem certeza que quer apagar este registro?"
              onConfirm={() => {
                console.log(record);
                return;
                confirm(record);
              }}
              onCancel={cancel}
              okText="Sim"
              cancelText="Não"
            >
              <Button icon={<AiOutlineDelete />} />
            </Popconfirm>
          </Tooltip> */}
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
        {...(getValues("Id") == undefined ? { footer: null } : {})}
        okText={
          getValues("Id") == "" || getValues("Id") == undefined
            ? "ok "
            : "Salvar Consulta"
        }
        cancelText={"Cancelar"}
      >
        {/* <form action="#">
          <Controller
            name="Nome"
            control={control}
            render={({ field }) => (
              <>
                <Input
                  size="large"
                  className="m-1"
                  placeholder="Digite o nome da especialidade"
                  value={field.value}
                  onChange={(e: any) => field.onChange(e)}
                  status={errors.Nome ? "error" : ""}
                />
                {errors.Nome && (
                  <p className="text-red-500 font-semibold text-sm text-center">
                    {errors.Nome.message?.toString()}
                  </p>
                )}
              </>
            )}
          />
        </form> */}
        {getValues("Id") != undefined ? (
          <div className="px-2">
            <Select
              defaultValue={getValues("status")}
              className="w-full py-2"
              onChange={(e: any) => setValue("status", e)}
              options={[
                { value: "Aguardando", label: "Aguardando" },
                { value: "Finalizado", label: "Finalizado" },
              ]}
            />
            <Input.TextArea
              defaultValue={getValues("observacoes")}
              placeholder="Escreva aqui suas observações..."
              onChange={(e: any) => setValue("observacoes", e.target.value)}
            />
          </div>
        ) : (
          <span>Sintomas:{editData.sintomas}</span>
        )}
      </Modal>
      <Space>
        <Alert message={"Total de registros: " + data.length} type="info" />
        {/* <Button
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
        </Button> */}
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
