import { fastify } from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { z } from "zod";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const data: { id: string; mensagem: string }[] = [];

app.post(
	"/webhook",
	{
		schema: {
			body: z.object({
				id: z.string(),
				mensagem: z.string(),
			}),
		},
	},
	(req, rep) => {
		const mensagem = req.body;
		data.push(mensagem);
		return rep.send(mensagem).status(201);
	},
);

app.get("/mensagens", (req, rep) => {
	return rep.send(data).status(200);
});

app.listen({ host: "localhost", port: 8080 });
