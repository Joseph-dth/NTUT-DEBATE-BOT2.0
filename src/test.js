const db = require('./database/memberDb')



async function test() {
    const result = await db.getMemberData('abcs')
    console.log(result)
    if (result.length > 0) {
        console.log('true')
    }
}

test()