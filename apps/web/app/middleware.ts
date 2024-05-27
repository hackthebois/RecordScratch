import { defineMiddleware, getContext, setContext } from "vinxi/http";

export default defineMiddleware({
	onRequest: (event) => {
		setContext(event, "help", { foo: "bar" });
	},
});
