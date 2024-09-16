import MongoCRUD from "../../CRUD/mongo";
import axios from 'axios'

export default class Order {
    private mongo
    constructor(){
        this.mongo = new MongoCRUD()
    }
    public async createOrder(doc:any) {
        const payload = {
            // USER_ID: "USER005",
            STATUS : "Pending",
            ...doc
        }
        await this.updateItmsWithPrice(payload?.ITEMS)
        payload.AMOUNT = payload.ITEMS.reduce((acc: number,obj: any) => {
            return acc + obj.TOTAL
        }, 0)
        let menuItem = await this.mongo.save('Order',payload)
        if (menuItem?.ORDER_ID) {
            const response = await axios.post(`${process.env.CHEF_SERVICE_URL}/order/placed`, { order_id: menuItem?.ORDER_ID })
            if(response?.data?.data?.prep_time)  await this.updateOrder({ ORDER_ID: menuItem?.ORDER_ID }, { PREP_TIME: response.data.data.prep_time })
            return {status:201,data:{status:201,message:'order booked Successfully'}}
        }
        throw new Error('error while saving data')
    }
    public async getMenuList(doc:any) {
        const response = await this.mongo.find('Menu',doc)
        if(response) return {status:200,data:{status: 200,data: response}}
        throw new Error('error while getting data')
    }
    public async getMenuById(doc:any) {
        const response = await this.mongo.findOne('Menu',doc)
        if(response?._doc?.MENU_ID) return {status:200,data:{status: 200,data: (response._doc)}}
        throw new Error('error while getting data')
    }
    public async updateOrder(filter:any,doc: any) {
        const response = await this.mongo.findOneAndUpdate('Order',filter,doc)
        if (response?._doc?.ORDER_ID) return {status:200,data:{status: 200,message:'successfully updated menu'}}
        throw new Error('error while updating data')
    }
    public async updateItmsWithPrice(items: any) {
        for (let i = 0; i < items.length; i++) {
            try {
              const response = await this.getMenuById({ MENU_ID: items[i].MENU_ID });
              if(response?.status == 200){
                items[i].PRICE = response?.data?.data?.PRICE
                items[i].TOTAL = response?.data?.data?.PRICE * items[i].QUANTITY
              }
            } catch (error) {
              console.error(`Failed to fetch data for item ${items[i].id}:`, error);
              throw new Error(`Failed to fetch data for item ${items[i].id}:`)
            }
        }
        return 'OK'
    }
}