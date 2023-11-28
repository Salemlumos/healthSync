//@ts-nocheck
"use client";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Card,
  Button,
  Select,
  Modal,
  Alert,
  Space,
  message,
  Input,
  TimePicker,
  Popconfirm,
  notification,
} from "antd";
import dayjs from "dayjs";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { useCallback, useEffect, useState } from "react";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import ptBR from "date-fns/locale/pt-BR";
import { useRouter } from "next/navigation";
// import { AutoComplete, Input } from "antd";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

const locales = {
  "pt-BR": ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

dayjs.extend(utc);
dayjs.extend(timezone);

export default function Agendamento() {
  const [myEvents, setEvents] = useState<any>([]);
  const [userData, setUserData] = useState<any>();
  const [especialidades, setEspecialidades] = useState<any>([]);
  const [especialidade, setEspecialidade] = useState<any>("");
  const [modalMessage, setModalMessage] = useState<any>("");
  const [medicos, setMedicos] = useState<any>([]);

  const [sintomas, setSintomas] = useState<any>("");
  const [medico, setMedico] = useState<any>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const [agenHour, setAgenHour] = useState<any>(dayjs(new Date(), "hh:mm"));

  const router = useRouter();

  function transformKeys(arrayOfObjects) {
    return arrayOfObjects.map((obj) => ({
      label: obj.Nome,
      value: obj.id,
    }));
  }
  function findLabelById(array, id, key) {
    const foundItem = array.find((item) => item.value === id);

    if (foundItem) {
      return foundItem[key];
    } else {
      return null;
    }
  }

  const loadEspecialidade = async () => {
    try {
      const esp = await fetch("http://localhost:3001/especialidade/getAll");

      if (!esp.ok) {
        // Handle the error, for example by throwing an exception
        throw new Error(`HTTP error! Status: ${esp.status}`);
      }

      const dt = await esp.json();
      console.log(transformKeys(dt.data));
      setEspecialidades(transformKeys(dt.data));
    } catch (error) {
      // Handle any errors that occurred during the fetch
      console.error("Error fetching data:", error);
    }
  };
  const loadEvents = async (id) => {
    try {
      const esp = await fetch("http://localhost:3001/agendamento/getUserAgen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({ id }),
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
      function convertToDateObjects(dateArray) {
        // Ensure that dateArray is an array
        if (!Array.isArray(dateArray)) {
          throw new Error("Input must be an array");
        }

        // Map the array to create a new array of objects with Date objects
        const convertedArray = dateArray.map((dateObj) => {
          // Check if each object has 'start' and 'end' properties
          if (
            !dateObj.hasOwnProperty("start") ||
            !dateObj.hasOwnProperty("end")
          ) {
            throw new Error(
              'Each object must have both "start" and "end" properties'
            );
          }

          // Convert 'start' and 'end' properties to Date objects
          const startDate = new Date(dateObj.start);
          const endDate = new Date(dateObj.end);

          // Return a new object with Date objects and other key-values unchanged
          return {
            ...dateObj,
            start: startDate,
            end: endDate,
          };
        });

        return convertedArray;
      }
      console.log(convertToDateObjects(dt.data));
      setEvents(convertToDateObjects(dt.data));
      // console.log(transformKeys(dt.data));
      // setEspecialidades(transformKeys(dt.data));
    } catch (error) {
      // Handle any errors that occurred during the fetch
      console.error("Error fetching data:", error);
    }
  };

  const deleteEvents = async (id) => {
    try {
      const esp = await fetch("http://localhost:3001/agendamento/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({ id }),
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
      loadEvents(userData?.id);
      message.success("O agendamento foi cancelado");
    } catch (error) {
      // Handle any errors that occurred during the fetch
      console.error("Error fetching data:", error);
    }
  };
  const loadMedico = async (data: any) => {
    setEspecialidade(data);
    setLoading(true);
    if (data == "") {
      console.log("No especialidade");
      return;
    }
    try {
      const response = await fetch("http://localhost:3001/medicos/getAll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({ id: data }),
      });

      const res = await response.json();
      console.log(res);

      if (res.status == "ok") {
        // localStorage.setItem(
        //   "user",
        //   // JSON.stringify({ ...res.data.data, ...{ id } })
        //   JSON.stringify(res.data.data)
        // );
        // await router.push("/access");
        setMedicos(transformKeys(res.data));
      } else {
        // setError(
        //   res.message == "User Not Found" ? "Senha Incorreta" : res.message
        // );
        setMedicos([]);
        console.log("Error", res.message);
        setLoading(false);
        console.log("error - login");
      }
    } catch (error) {
      setLoading(false);
      console.log("error - medicos");
      console.log(error);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [modalEventData, setModalEventData] = useState({});

  const showModal = () => {
    setIsModalOpen(true);
  };
  const showEventModal = () => {
    setIsEventModalOpen(true);
  };

  const register: any = async (data: any) => {
    setLoading(true);
    console.log(data);
    try {
      const response = await fetch("http://localhost:3001/agendamento/create", {
        // Change the URL to the register route
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          agendamento: data,
        }),
      });

      const res = await response.json();
      console.log(res);

      if (res.status == "ok" && res.message == "Document added successfully") {
        message.success("O agendamento foi criado");
        loadEspecialidade();
        loadEvents(userData?.id);
      } else {
        message.error("Falha ao agendar.");
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

  const handleOk = () => {
    const { start, end, title } = modalData;
    console.log(modalData);
    console.log(sintomas);
    setEvents((prev: any) => [
      ...prev,
      {
        start,
        end,
        status: "Aguardando",
        title:
          findLabelById(especialidades, especialidade, "label") +
          " " +
          dayjs(start).format("DD/MM/YYYY - HH:mm"),
      },
    ]);
    {
      const data = {
        title:
          findLabelById(especialidades, especialidade, "label") +
          " " +
          dayjs(start).format("DD/MM/YYYY - HH:mm"),
        date: start,
        start: start,
        end: end,
        especialidade: findLabelById(especialidades, especialidade, "label"),
        userId: userData?.id,
        sintomas: sintomas,
        medico: medico,
        status: "Aguardando",
      };

      register(data);
      setEspecialidade("");
      setMedico(undefined);
      setSintomas("");
      setIsModalOpen(false);
      setModalMessage("");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };
  const handleEventCancel = () => {
    setIsEventModalOpen(false);
    // setModalMessage("");
  };

  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      const parsedData: any = JSON.parse(storedData);
      setUserData(parsedData);
      loadEvents(parsedData.id);
    }
    loadEspecialidade();
    // const storedData = localStorage.getItem("user");
    // if (storedData) {
    //   const parsedData: any = JSON.parse(storedData);
    //   loadPerfil(parsedData?.PerfilFk);
    //   setUserData(parsedData);
    // }
    // setLoading(false);
  }, []);

  const handleSelectSlot: any = useCallback(
    ({ start, end }: any) => {
      console.log(start);
      console.log(typeof start);
      // console.log(new Date().toISOString().split("T")[1]);
      console.log("Date with hour");
      start = dayjs(start.setHours(agenHour.hour(), agenHour.minute()))
        .tz("America/Sao_Paulo")
        .format();
      console.log(start);
      console.log(new Date(start));
      // end = dayjs(end.setHours(0, agenHour.minute()))
      //   .tz("America/Sao_Paulo")
      //   .format();

      // const fullDate =
      //   start.toISOString().split("T")[0] +
      //   "T" +
      //   new Date().toISOString().split("T")[1];
      // console.log(fullDate);
      // console.log(new Date(fullDate));

      // const nextDate = new Date(fullDate).setDate(
      //   new Date(fullDate).getMinutes() + 30
      // );
      // console.log(new Date(nextDate));

      // console.log(start);
      // console.log(dayjs(new Date(), "hh:mm"));
      // console.log("dia");
      // console.log(end);
      // console.log("comparisson");
      // console.log(
      //   start.toISOString().split("T")[0] <=
      //     new Date().toISOString().split("T")[0]
      // );

      // const [hours, minutes] = agenHour.toString().split(":");
      // console.log(hours);
      // console.log(minutes);
      // const date = new Date(start);
      // date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      // console.log(date);

      if (new Date().toISOString().split("T")[0] <= start.split("T")[0]) {
        setModalData({
          agendamento: "Agendar - " + dayjs(start).format("DD/MM/YYYY - HH:mm"),
          start: new Date(start),
          end,
          title:
            findLabelById(especialidades, especialidade, "label") +
            " " +
            dayjs(start).format("DD/MM/YYYY - HH:mm"),
        });
        showModal();
        return;
      } else {
        setModalData({
          agendamento: "Agendar - " + dayjs(start).format("DD/MM/YYYY - HH:mm"),
          title: "Agendar - " + dayjs(start).format("DD/MM/YYYY - HH:mm"),
        });
        showModal();
        setModalMessage(
          "Ops!!! Você não pode marcar consultas no passado, não é mesmo."
        );
      }

      // const title = window.prompt("New Event name");
      // if (title) {
      //   setEvents((prev: any) => [...prev, { start, end, title }]);
      // }
    },
    [setEvents]
  );

  const handleSelectEvent = useCallback((event: any) => {
    console.log(event);
    // window.alert(JSON.stringify(event));
    setModalEventData(event);
    showEventModal();
  }, []);
  return (
    <Card
      className="w-full m-9 overflow-y-scroll"
      style={{ height: "80vh" }}
      title="Agendamento"
      bordered={true}
    >
      <Alert
        className="m-1"
        message="Atenção você precisa selecionar uma especialidade antes de marcar um agendamento"
        type="info"
        showIcon
      />
      <div className="w-full">
        <Select
          allowClear
          className="m-1 w-full"
          showSearch
          style={{ width: "80%" }}
          notFoundContent={"Não há especialidades"}
          placeholder="Escolha a especialidade..."
          onChange={(e) => {
            console.log(medico);
            if (medico != undefined && medico != "") {
              console.log("cleaning");
              setMedico(undefined);
            }
            setModalMessage("");
            loadMedico(e);
          }}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").includes(input)
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? "")
              .toLowerCase()
              .localeCompare((optionB?.label ?? "").toLowerCase())
          }
          options={especialidades}
        />
        <Button style={{ width: "auto" }} className="m-1" onClick={() => {}}>
          Marcar Trigem
        </Button>
      </div>
      <Modal
        title={modalEventData.title}
        open={isEventModalOpen}
        onOk={handleOk}
        onCancel={handleEventCancel}
        footer={null}
        // {...(modalMessage != "" || medicos.length == 0 || especialidade == ""
        //   ? { footer: null }
        //   : {})}
      >
        <div className="">
          <p className="w-full">Situação:{modalEventData.status}</p>
          <p className="w-full">Sintomas:{modalEventData.sintomas}</p>
          <Button
            onClick={() => {
              router.push("/access/chat/" + modalEventData.medico);
            }}
          >
            Mandar Mensagem para o médico
          </Button>
          <Popconfirm
            title="Cancelar Agendamento"
            description="Você tem certeza que quer cancelar o agendamento?"
            onConfirm={() => {
              console.log(modalEventData.eventId);
              setIsEventModalOpen(false);
              deleteEvents(modalEventData.eventId);

              // confirm(record);
            }}
            // onCancel={cancel}
            okText="Sim"
            cancelText="Não"
          >
            <Button danger>Cancelar Agendamento</Button>
          </Popconfirm>
        </div>
      </Modal>

      <Modal
        title={modalData.agendamento}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText={"Cancelar"}
        okText={"Agendar Consulta"}
        {...(modalMessage != "" || medicos.length == 0 || especialidade == ""
          ? { footer: null }
          : {})}
      >
        {medicos && medicos.length > 0 && modalMessage == "" ? (
          <div className="mb-4">
            <div className="p-1 flex flex-row flex-wrap gap-1">
              <Select
                allowClear
                showSearch
                className="w-3/4"
                placeholder="Escolha o médico"
                value={medico}
                notFoundContent={"Nenhum médico encontrado..."}
                onChange={(e) => {
                  console.log(e);
                  setMedico(e);
                }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={medicos}
              />
              <TimePicker
                style={{ width: "24.13%" }}
                defaultValue={dayjs(dayjs(new Date()).add(1, "hour"), "hh:mm")}
                onChange={(e, formated) => {
                  console.log("hour");
                  console.log(e);
                  console.log(formated);
                  setAgenHour(formated);
                }}
                format={"hh:mm"}
              />
            </div>
            <Input.TextArea
              rows={10}
              showCount
              maxLength={1000}
              size="large"
              className="m-1"
              placeholder="Descreva aqui seus sintomas de forma clara..."
              style={{ resize: "none", marginBottom: "2%" }}
              value={sintomas}
              onChange={(e) => {
                setSintomas(e.target.value);
              }}
            />
          </div>
        ) : (
          <div>
            {(medico == "" || medico == undefined) &&
            modalMessage == "" &&
            especialidade == "" ? (
              <p>
                Você precisa escolher uma especialidade antes de agendar sua
                consulta
              </p>
            ) : (
              <p>
                {modalMessage != ""
                  ? modalMessage
                  : "Infelizmente não temos médicos disponiveis para esta especialide ou dia i-i"}
              </p>
            )}
          </div>
        )}
      </Modal>
      <div className="ml-1 mr-1 mt-1 overflow-hidden">
        <Calendar
          localizer={localizer}
          //   events={myEventsList}
          onSelectEvent={handleSelectEvent}
          startAccessor="start"
          onSelectSlot={handleSelectSlot}
          endAccessor="end"
          culture="pt-BR"
          events={myEvents}
          selectable
          style={{ height: 500 }}
          messages={{
            allDay: "O dia todo",
            next: "Próximo",
            previous: "Anterior",
            today: "Hoje",
            month: "Mês",
            week: "Semana",
            day: "Dia",
            date: "Data",
            time: "Hora",
            event: "Evento",
            noEventsInRange:
              "Parece que você não tem nenhuma consulta agendada!",
          }}
        />
      </div>
    </Card>
  );
}
