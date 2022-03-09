const i18next = require('i18next');

module.exports = async () => {
  await i18next.init({
    lng: 'en', // if you're using a language detector, do not define the lng option
    // debug: true,
    fallbackLng: 'en',
    resources: {
      en: {
        general: { not_available: 'Not Available' },
        commands: {
          credits: {
            general: {
              credits_one: '{{count}} credit',
              credits_other: '{{count}} credits',
            },
            addons: {
              balance: { embed: { title: 'Credits' } },
              gift: { embed: { title: 'Gift' } },
            },
          },
          reputation: {
            addons: {
              give: {
                version01: {
                  embed: {
                    title: 'Reputation',
                    description:
                      'You have given reputation within the last day, you can not repute now!',
                  },
                },
                version02: { embed: { title: 'Reputation', description: 'You have given {{user}} a {{type}} reputation!' } },
                version03: { embed: { title: 'Reputation', description: 'You can not repute yourself.' } },
              },
            },
          },
          profile: {
            addons: {
              view: {
                embed: {
                  title: 'Profile',
                  reputation: 'Reputation (Global)',
                  level: 'Level (Guild)',
                  points: 'Points (Guild)',
                  credits: 'Credits (Guild)',
                  language_code: 'Language Code (Global)',
                },
              },
              settings: {
                embed: {
                  title: 'Profile',
                  description: 'Following settings is set',
                  fields: { language: 'Language' },
                },
              },
            },
          },
        },
      },
      sv: {
        general: { not_available: 'Otillgänglig' },
        commands: {
          credits: {
            general: {
              credits_one: '{{count}} krona',
              credits_other: '{{count}} kronor',
            },
            addons: {
              balance: { embed: { title: 'Krediter' } },
              gift: { embed: { title: 'Gåva' } },
            },
          },
          reputation: {
            addons: {
              give: {
                version01: {
                  embed: {
                    title: 'Omdöme',
                    description:
                      'Du har redan gett omdöme inom den senaste dagen, du kan inte ge ett omdöme just nu!',
                  },
                },
                version02: { embed: { title: 'Omdöme', description: 'Du har gett {{user}} ett {{type}} omdöme!' } },
                version03: { embed: { title: 'Omdöme', description: 'Du kan inte ge dig själv ett omdöme.' } },
              },
            },
          },

          profile: {
            addons: {
              view: {
                embed: {
                  title: 'Profil',
                  reputation: 'Omdöme (Globalt)',
                  level: 'Nivå (Server)',
                  points: 'Poäng (Server)',
                  credits: 'Krediter (Server)',
                  language_code: 'Språkkod (Globalt)',
                },
              },
              settings: {
                embed: {
                  title: 'Profil',
                  description: 'Följande inställningar är satta',
                  fields: { language: 'Språk' },
                },
              },
            },
          },
        },
      },
    },
  });
};
