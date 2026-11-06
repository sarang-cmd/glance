import type { ReleaseStore } from "./release-store";
import type { sendEmail } from "./email";
import { ipKey, unsubscribeToken } from "./release";

export function createReleaseService(
  store: ReleaseStore,
  send: typeof sendEmail,
  site: string,
  secret: string,
) {
  return {
    async signup(email: string, ip: string) {
      if (
        !(await store.rateLimit(`ip:${ipKey(ip, secret)}`)) ||
        !(await store.rateLimit(`email:${ipKey(email, secret)}`, 3))
      )
        return { kind: "limited" as const };
      await store.cleanRateLimits();
      const signup = await store.requestSignup(email, secret);
      if (signup)
        await send(
          email,
          "confirm",
          `${site}/confirm?token=${signup.token}`,
          `${site}/unsubscribe?token=${signup.unsubscribeToken}`,
          signup.token,
        );
      return { kind: "ok" as const };
    },
    async confirm(token: string) {
      const result = await store.confirm(token);
      if (result.kind === "confirmed") {
        try {
          await send(
            result.email,
            "welcome",
            "https://github.com/sarang-cmd/glance",
            `${site}/unsubscribe?token=${unsubscribeToken(result.id, secret)}`,
            result.id,
          );
          await store.markWelcomeSent(result.id);
        } catch {
          return {
            kind: "confirmed" as const,
            notice:
              "Your subscription is confirmed. The welcome email could not be delivered.",
          };
        }
      }
      return result;
    },
    unsubscribe: store.unsubscribe,
  };
}
