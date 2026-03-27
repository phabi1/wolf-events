import { createHashRouter } from "react-router";
import DetailsEventPage from "../pages/events/DetailsEventPage";
import ListEventPage from "../pages/events/ListEventPage";
import { lazy } from "react";

export const router = createHashRouter([
  {
    path: "/",
    Component: ListEventPage,
  },
  {
    path: "/:eventId",
    Component: DetailsEventPage,
    children: [
      {
        path: "participants/new",
        Component: lazy(
          () => import("../pages/participants/NewParticipantPage"),
        ),
      },
      {
        path: "participants/import",
        Component: lazy(
          () => import("../pages/participants/ImportParticipantsPage"),
        ),
      },
      {
        path: "participants/:participantId/edit",
        Component: lazy(
          () => import("../pages/participants/EditParticipantPage"),
        ),
      },
      {
        path: "participants/:participantId/delete",
        Component: lazy(
          () => import("../pages/participants/DeleteParticipantPage"),
        ),
      },
    ],
  },
  {
    path: '/:eventId/edit',
    Component: lazy(() => import("../pages/events/EditEventPage")),
  }
]);
