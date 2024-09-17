import { z } from 'zod';

export const OrderItemSchema = z.object({
    MENU_ID: z.string(),
    QUANTITY: z.number().min(1, { message: "QUANTITY must be greater than 0" }),
});

export const OrderPayloadSchema = z.object({
    ITEMS: z.array(OrderItemSchema),
});