import { DB, Model } from "../lib";
import { pattern } from "./schema-spec";

export const userDataObject = Model.formatPattern({
    data : {
        id: 1,
        uuid : DB.generateUUID(),
        email: 'test01@example.com',
        name : 'name:test01',
        username: 'test01',
        password: 'xxxxxxxxxx',
        status : Math.random() < 0.5,
        createdAt:  new Date(),
        updatedAt: new Date(),
        deletedAt: null
    },
    pattern 
})

export const userDataArray = [2,3,4,5,6].map(i => {
    return Model.formatPattern({
        data : {
            id: i,
            uuid : DB.generateUUID(),
            email: `test0${i}@example.com`,
            name : `name:test0${i}`,
            username: `test0${i}`,
            password: 'xxxxxxxxxx',
            status : Math.random() < 0.5,
            createdAt:  new Date(),
            updatedAt: new Date(),
            deletedAt: null
        },
        pattern 
    })
})

export const postDataObject = Model.formatPattern({
   data : {
    id: 1,
    uuid : DB.generateUUID(),
    userId : 1,
    title: 'title:01',
    subtitle : 'subtitle:test01',
    description: 'test01',
    createdAt:  new Date(),
    updatedAt: new Date(),
    deletedAt: null
   },
   pattern
})

export const postDataArray = [2,3,4,5,6].map(i => {
    return Model.formatPattern({
        data : {
            id: i,
            uuid : DB.generateUUID(),
            userId : i === 4 ? null : i,
            title: `title:0${i}`,
            subtitle : `subtitle:test0${i}`,
            description: `test0${i}`,
            createdAt:  new Date(),
            updatedAt: new Date(),
            deletedAt: null
        },
        pattern 
    })
})