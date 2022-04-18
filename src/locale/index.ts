import i18next from "i18next";
import logger from "@logger";

export default async () => {
  await i18next
    .init({
      // lng: "en", // if you're using a language detector, do not define the lng option
      // debug: true,
      fallbackLng: "en",
      resources: {
        en: {
          plugins: {
            reputation: {
              modules: {
                give: {
                  general: { title: "[:loudspeaker:] Reputation (Give)" },
                  error01: {
                    description:
                      "You cannot give reputation while on timeout, please wait {{timeout}} seconds.",
                  },
                  error02: {
                    description: "You cannot give reputation to yourself.",
                  },
                  error03: {
                    description:
                      "We can not find your requested to user in our database!",
                  },
                  success01: {
                    description:
                      "You have given reputation to <@{{optionTarget}}>",
                  },
                },
              },
            },
            credits: {
              modules: {
                balance: { general: { title: "[:dollar:] Credits (Balance)" } },
                gift: { general: { title: "[:dollar:] Credits (Gift)" } },
                top: { general: { title: "[:dollar:] Credits (Top)" } },
                work: {
                  general: { title: "[:dollar:] Credits (Work)" },
                  success01: {
                    description: "You worked and earned {{amount}} credits",
                  },
                  error01: {
                    description:
                      "You can not work while on timeout, please wait {{timeout}} seconds.",
                  },
                },
              },
            },
          },
        },
        sv: {
          plugins: {
            credits: {
              modules: {
                balance: { general: { title: "[:dollar:] Krediter (Balans)" } },
              },
            },
          },
        },
      },
    })
    .then(async () => {
      logger.debug(`i18next initialized`);
    })
    .catch(async (error) => {
      logger.error(`i18next failed to initialize: ${error}`);
    });
};
