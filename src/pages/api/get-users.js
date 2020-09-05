const handler = async (req, res) => {
  try {
    const response = await fetch(`${process.env.SLACK_URI}/users.list`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
      },
    });
    const data = await response.json();

    if (data.ok) {
      res.json(data.members);
    } else {
      res.status(500).end();
    }
  } catch (error) {
    res.status(500).end();
  }
};

module.exports = handler;
