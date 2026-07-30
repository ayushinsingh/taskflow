import type { InvitationsResponse } from "../types/api/invitation.types";
import api from "./api";

export const invitationService = {
  getInvitations: async (): Promise<InvitationsResponse> => {
    const response = await api.get("/api/invitations");
    return response.data;
  },
  // Both mutations return only { message: "Success" }, so the caller has to
  // remember which id it acted on -- the thunks return the id for the reducer.
  acceptInvitation: async (invitationId: string) => {
    const response = await api.post(`/api/invitations/${invitationId}/accept`);
    return response.data;
  },
  declineInvitation: async (invitationId: string) => {
    const response = await api.post(`/api/invitations/${invitationId}/decline`);
    return response.data;
  },
};
