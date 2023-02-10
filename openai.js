const axios = require("axios");

const openAi = (prompt) =>
  new Promise((resolve, reject) => {
    axios
      .post(
        "https://api.openai.com/v1/completions",
        {
          prompt,
          model: "text-davinci-003",
          max_tokens: 3000,
          n: 1,
          temperature: 0.5,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
        }
      )
      .then((respon) => respon.data.choices[0].text)
      .then((res) => resolve(res.replace("\n\n", "")))
      .catch((err) => reject(err));
  });

module.exports = openAi;
