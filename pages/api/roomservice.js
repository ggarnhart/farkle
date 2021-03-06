const API_KEY = "okSk5uSDkV9Vp6zod3XEe";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default async (req, res) => {
  const body = req.body;
  const user = "some-user-" + getRandomInt(1, 200);

  const resources = [
    {
      object: "room",
      room: body.room,
      permission: "join",
    },
  ];

  const r = await fetch("https://super.roomservice.dev/provision", {
    method: "post",
    headers: {
      Authorization: `Bearer: ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: user,
      resources: resources,
    }),
  });

  const json = await r.json();
  res.json(json);
};
