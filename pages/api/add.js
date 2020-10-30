import Joi, { string } from "joi";
import validate from "next-joi";

const schema = Joi.object({
  title: Joi.string().required(),
  url: Joi.string().uri().required(),
  points: Joi.number().integer().required(),
  subjects: Joi.array().unique().items(Joi.string())
})

export default validate({ body: schema }, async (req, res) => {
  if (req.method !== 'POST') {
    res.status(404).end();
    return;
  }

  const item = {
    title: req.body.title,
    url: req.body.url,
    subjects: req.body.subjects || [],
    points: req.body.points
  };

  const result = await createItem(item);

  console.log(item);
  console.log(result);
  res.status(result.successful ? 200 : 500).json({message: result.value});
});
