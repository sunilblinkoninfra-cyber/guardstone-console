// src/lib/actions.ts

import { api } from "@/lib/api";
import { User } from "@/types/auth";

export type AlertAction =
  | "FALSE_POSITIVE"
  | "CONFIRM_MALICIOUS"
  | "RELEASE"
  | "BLOCK_SENDER";

export async function actOnAlert(
  alertId: string,
  action: AlertAction,
  actor: User,
  notes?: string
) {
  return api.post(`/alerts/${alertId}/action`, {
    action,
    notes,
    acted_by: {
      user_id: actor.id,
      email: actor.email,
      role: actor.role,
    },
  });
}
