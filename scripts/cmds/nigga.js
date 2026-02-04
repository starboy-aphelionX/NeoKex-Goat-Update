const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "nigga",
    aliases: [],
    version: "1.3",
    author: "nexo_here",
    countDown: 2,
    role: 0,
    description: "Send a roast image using UID (mention / reply / self)",
    category: "fun",
    guide: {
      en: "{pn} @mention\n{pn} (by reply)\n{pn} (for yourself)"
    }
  },

  onStart: async function({ api, args, message, event, usersData }) {
      const senderData = await usersData.get(event.senderID);

if (!senderData || senderData.money < 500) {
  return api.sendMessage(
    "Oy Goribs Cmd use er jonno 500tk lagbe 😾",
    event.threadID,
    event.messageID
  );
}

// Deduct 500 money
await usersData.set(event.senderID, {
  money: senderData.money - 500
});
    try {
      let targetUID;

      // If user replied to a message
      if (event.type === "message_reply") {
        targetUID = event.messageReply.senderID;
      }
      // If user mentioned someone
      else if (event.mentions && Object.keys(event.mentions).length > 0) {
        targetUID = Object.keys(event.mentions)[0];
      }
      // Otherwise use self
      else {
        targetUID = event.senderID;
      }

      const url = `https://betadash-api-swordslush-production.up.railway.app/nigga?userid=${targetUID}`;
      const response = await axios.get(url, { responseType: "arraybuffer" });

      const filePath = path.join(__dirname, "cache", `roast_${targetUID}.jpg`);
      fs.writeFileSync(filePath, Buffer.from(response.data, "binary"));

      api.sendMessage(
        {
          body: `Look I found a nigga 😂`,
          attachment: fs.createReadStream(filePath),
        },
        event.threadID,
        () => fs.unlinkSync(filePath),
        event.messageID
      );

    } catch (e) {
      console.error("Error:", e.message);
      api.sendMessage(
        "❌ Couldn't generate image. Try again later.",
        event.threadID,
        event.messageID
      );
    }
  },
};
