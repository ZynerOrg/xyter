const axios = require('axios');
module.exports = async (interaction) => {
  try {
    const target = await interaction.options.getString('target');

    await axios
      .get(`http://ip-api.com/json/${target}`)
      .then(async (res) => {
        if (res.data.status === 'fail') {
          const embed = {
            title: 'Lookup',
            description: `${res.data.message}: ${res.data.query}`,
            color: __config.colors.error,
            timestamp: new Date(),
            footer: { iconURL: __config.footer.icon, text: __config.footer.text },
          };
          await interaction.editReply({ embeds: [embed] });
        } else if (res.data.status === 'success') {
          const embed = {
            title: 'Lookup',
            fields: [
              { name: 'AS', value: `${res.data.as || 'Not available'}` },
              { name: 'Country', value: `${res.data.country || 'Not available'}` },
              { name: 'Country Code', value: `${res.data.countryCode || 'Not available'}` },
              { name: 'Region', value: `${res.data.region || 'Not available'}` },
              { name: 'Region Name', value: `${res.data.regionName || 'Not available'}` },
              { name: 'City', value: `${res.data.city || 'Not available'}` },
              { name: 'ZIP Code', value: `${res.data.zip || 'Not available'}` },
              { name: 'Latitude', value: `${res.data.lat || 'Not available'}` },
              { name: 'Longitude', value: `${res.data.lon || 'Not available'}` },
              { name: 'Timezone', value: `${res.data.timezone || 'Not available'}` },
              { name: 'ISP', value: `${res.data.isp || 'Not available'}` },
              { name: 'Organization', value: `${res.data.org || 'Not available'}` },
            ],
            color: __config.colors.success,
            timestamp: new Date(),
            footer: { iconURL: __config.footer.icon, text: __config.footer.text },
          };
          await interaction.editReply({ embeds: [embed] });
        }
      })
      .catch(async (err) => {
        await logger.error(err);
      });
  } catch {
    async (err) => await logger.error(err);
  }
};
