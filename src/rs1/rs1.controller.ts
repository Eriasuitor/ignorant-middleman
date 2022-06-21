import { Request, Response } from "express";
import { Method, RequestMapping } from "../app";

class Rs1 {
	@RequestMapping(Method.GET, '/hihi')
	get(req: Request, res: Response) {
		res.json({ a: 13 })
	}
}