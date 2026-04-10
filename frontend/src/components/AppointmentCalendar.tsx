import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";

import type { Appointment } from "../types/appointment";
import type { Client } from "../types/client";
import { Tooltip } from "bootstrap";

interface Props {
  appointments: Appointment[];
  clients: Client[];
  getClientName: (id: number) => string;
  onEventClick: (appt: Appointment) => void;
  onDateClick: (date: string) => void;
}

type EventExtendedProps = {
  comment?: string;
  projectType?: string;
  address?: string;
};

const AppointmentCalendar: React.FC<Props> = ({
  appointments,
  clients,
  getClientName,
  onEventClick,
  onDateClick,
}) => {
  // 🔹 sécurisation HTML (anti injection)
  const safe = (text?: string) =>
    text?.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // 🔹 transformation des RDV en events FullCalendar
  const events = appointments.map((appt) => {
    const client = clients.find((c) => c.id === appt.clientId);

    return {
      id: appt.id.toString(),
      title: getClientName(appt.clientId),
      start: appt.date,

      extendedProps: {
        comment: appt.comment,
        projectType: client?.projectType || "Non défini",
        address: client?.address || "Non renseignée",
      },
    };
  });

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          locale={frLocale}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek",
          }}
          events={events}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          titleFormat={{
            year: "numeric",
            month: "long",
          }}
          slotMinTime="09:00:00"
          slotMaxTime="20:00:00"
          scrollTime={new Date().toTimeString().slice(0, 5)}

          // 🔹 clic sur un event
          eventClick={(info) => {
            const appt = appointments.find(
              (a) => a.id === Number(info.event.id)
            );
            if (appt) onEventClick(appt);
          }}

          // 🔹 clic sur une date
          dateClick={(info) => {
            onDateClick(info.dateStr);
          }}

          // 🔥 TOOLTIP AU HOVER
          eventDidMount={(info) => {
            const { address, projectType, comment } =
              info.event.extendedProps as EventExtendedProps;

            const date = new Date(info.event.start!);

            const formattedDate = date.toLocaleString("fr-FR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });

            const tooltipContent = `
              <div>
                <strong>${safe(info.event.title)}</strong><br/>
                📅 ${formattedDate}<br/>
                📍 ${safe(address)}<br/>
                🏗️ ${safe(projectType)}<br/>
                📝 ${safe(comment) || "Pas de commentaire"}
              </div>
            `;

            const tooltip = new Tooltip(info.el, {
              title: tooltipContent,
              html: true,
              placement: "top",
              trigger: "hover",
            });

            // 🔥 nettoyage mémoire
            return () => {
              tooltip.dispose();
            };
          }}
        />
      </div>
    </div>
  );
};

export default AppointmentCalendar;