import {Controller, Req, Res, Post, UseBefore, Get} from "routing-controllers";
// import { CONTACTS_SERVICE } from "../services";
// import { ContactValidation } from "./Contact.validation";
import { Request, Response } from "express";
import ORDER_SERVICE from "../services/user/order";

@Controller("/user")
export class UserController{
    @Get("/menu-list")
    async menuList(@Req() req: Request, @Res() res: Response) {
        try {
            let { status, data } = await new ORDER_SERVICE().getMenuList({ STATUS: true })
            return res
                .status(status)
                .json(data);

        } catch (err: any) {
            console.log(err);
            if (err.name = 'ZodError') {
                let i = err.issues[err.issues.length-1]
                return res
                    .status(400)
                    .json({ msg: i.message || 'something went wrong' });
            } else
                return res
                    .status(404)
                    .json({ msg: 'something went wrong' });
        }
    }
    @Post("/order")
    async book(@Req() req: Request, @Res() res: Response) {
        try {
            let { status, data } = await new ORDER_SERVICE().createOrder(req?.body)
            return res
                .status(status)
                .json(data);

        } catch (err: any) {
            console.log(err);
            if (err.name = 'ZodError') {
                let i = err.issues[err.issues.length-1]
                return res
                    .status(400)
                    .json({ msg: i.message || 'something went wrong' });
            } else
                return res
                    .status(404)
                    .json({ msg: 'something went wrong' });
        }
    }
}