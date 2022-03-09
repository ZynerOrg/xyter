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
            addons: { balance: { embed: { title: 'Credits' } }, gift: { embed: { title: 'Gift' } } },
          },
          profile: {
            addons: {
              view: {
                embed: {
                  title: 'Profile', reputation: 'Reputation (Global)', level: 'Level (Global)', points: 'Points (Global)', credits: 'Credits (Guild)', language_code: 'Language Code (Global)',
                },
              },
              settings: { embed: { title: 'Profile', description: 'Following settings is set', fields: { language: 'Language' } } },
            },
          },
        },
      },
      sv: {
        general: { not_available: 'Ej tillgängligt' },
        commands: {
          credits: {
            general: {
              credits_one: '{{count}} krona',
              credits_other: '{{count}} kronor',
            },
            addons: { balance: { embed: { title: 'Krediter' } }, gift: { embed: { title: 'Gåva' } } },
          },
          profile: {
            addons: {
              view: {
                embed: {
                  title: 'Profil', reputation: 'Omdöme (Globalt)', level: 'Nivå (Globalt)', points: 'Poäng (Globalt)', credits: 'Krediter (Server)', language_code: 'Språkkod (Globalt)',
                },
              },
              settings: { embed: { title: 'Profil', description: 'Följande inställningar är satta', fields: { language: 'Språk' } } },
            },
          },
        },
      },
    },
  });
};
