
import Imagekit, { toFile } from '@imagekit/nodejs'
import config from '../config/config.js'


const client = new Imagekit({
    privateKey: config.IMAGEKIT_PRIVATE_KEY
})

export const uploadFile = async (buffer, fileName) => {
    const response = await client.files.upload({
        file: await toFile(buffer),
        fileName: fileName,
        folder: 'snatch'
    })

    return response
}