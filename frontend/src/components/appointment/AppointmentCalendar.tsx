import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";

import type { Appointment } from "../../types/appointment";
import { Tooltip } from "bootstrap";

interface Props {
  appointments: Appointment[];
  getClientName: (id: number) => string;
  getClientProjectType: (id: number) => string;
  getClientAddress: (id: number) => string;
  onEventClick: (appt: Appointment) => void;
  onDateClick: (date: string) => void;
  canEdit: (appt: Appointment) => boolean;
  canCreate: boolean;
  showCommercial: boolean;
}

type EventExtendedProps = {
  comment?: string;
  projectType?: string;
  address?: string;
  commercial?: string;

};

const AppointmentCalendar: React.FC<Props> = ({
  appointments,
  getClientName,
  getClientAddress,
  getClientProjectType,
  onEventClick,
  onDateClick,
  canEdit,
  canCreate,
  showCommercial,
}) => {
  // 🔹 sécurisation HTML (anti injection)
  const safe = (text?: string) =>
    text?.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // 🔹 transformation des RDV en events FullCalendar
  const events = appointments.map((appt) => ({
    id: appt.id.toString(),
    title: getClientName(appt.clientId),
    start: appt.date,

    extendedProps: {
      comment: appt.comment,
      projectType: getClientProjectType(appt.clientId),
      address: getClientAddress(appt.clientId),
      commercial: appt.user?.pseudo,
    },
  }));

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
            if (appt && canEdit(appt)) onEventClick(appt);
          }}

          // 🔹 clic sur une date
          dateClick={(info) => {
            if (canCreate) onDateClick(info.dateStr);
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

            const commercialLine =
              showCommercial && info.event.extendedProps.commercial
                ? `<div><i class="bi bi-person me-1 text-info"></i> ${safe(
                    info.event.extendedProps.commercial
                  )}</div>`
                : "";

            const tooltipContent = `
              <div class="d-flex flex-column gap-1">
                <strong class="mb-1">${safe(info.event.title)}</strong>

                <div><i class="bi bi-calendar-event me-1 text-primary"></i> ${formattedDate}</div>
                <div><i class="bi bi-geo-alt me-1 text-danger"></i> ${safe(address)}</div>
                <div><i class="bi bi-briefcase me-1 text-warning"></i> ${safe(projectType)}</div>

                ${commercialLine}
                
                <div><i class="bi bi-chat-left-text me-1 text-secondary"></i> ${
                  safe(comment) || "Pas de commentaire"
                }</div>
              </div>
            `;

            const tooltip = new Tooltip(info.el, {
              title: tooltipContent,
              html: true,
              placement: "top",
              trigger: "hover",
              customClass: "custom-tooltip",
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
