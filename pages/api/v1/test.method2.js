export default (req, res) => {
  const { method } = req;
  res.status(200).json({ method: method, endpoint: "Users" });
};
