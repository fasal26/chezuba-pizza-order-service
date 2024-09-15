import main_db from "../models"

export default class MongoCRUD {
    private db: any
    constructor() {
        this.db = main_db
    }
    public async save(model: keyof typeof main_db, data: object) {
        let result = await this.db[model].create(data)
        let resulObj = result.toJSON()
        return resulObj
    }
    public async find(model: keyof typeof main_db, filter: typeof main_db) {
        let result = await this.db[model].find(filter)
        return result
    }
    public async findOne(model: keyof typeof main_db, filter: typeof main_db) {
        let result = await this.db[model].findOne(filter)
        return result
    }
    public async findOneAndUpdate(model: keyof typeof main_db, filter: typeof main_db, data: object) {
        let result = await this.db[model].findOneAndUpdate(filter,data)
        return result
    }
}