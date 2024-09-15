import MongoCRUD from "../../CRUD/mongo";

export default class Order {
    private mongo
    constructor(){
        this.mongo = new MongoCRUD()
    }
    public async createMenu(doc:any) {
        let menuItem = await this.mongo.save('Menu',doc)
        if (menuItem?.MENU_ID) return {status:201,data:{status:201,message:'successfully added menu'}}
        throw new Error('error while saving data')
    }
    public async getMenuList(doc:any) {
        const response = await this.mongo.find('Menu',doc)
        if(response) return {status:200,data:{status: 200,data: response}}
        throw new Error('error while getting data')
    }
    public async getMenuById(doc:any) {
        const response = await this.mongo.findOne('Menu',doc)
        if(response?._doc?.MENU_ID) return {status:200,data:{status: 200,data: response._doc}}
        throw new Error('error while getting data')
    }
    public async updateMenu(filter:any,doc: any) {
        const response = await this.mongo.findOneAndUpdate('Menu',filter,doc)
        if (response?._doc?.MENU_ID) return {status:200,data:{status: 200,message:'successfully updated menu'}}
        throw new Error('error while updating data')
    }
}