const db = require('../database/memberDb')


const handleMembername = async(context) => {
    context.state.flow_status = 'member_register_department'
    await context.sendText('Ops～您似乎還沒註冊過唷，可能要麻煩您留一下您的聯絡資訊喔!')
    await context.sendText('請問該怎麼稱呼您呢？')
}

const handleDepartment = async(context) => {
    context.state.userInfo.name = context.event.message.text
    context.state.flow_status = 'member_register_phone'
    let text = context.event.message.text + '你好呀～'
    await context.sendText(text)
    await context.sendText('方便請教你的學校系級嗎？(Ex.北科智動一)')

}

const handlePhone = async(context) => {
    context.state.userInfo.department = context.event.message.text
    context.state.flow_status = 'member_register_completed'

    await context.sendText('收到～')
    await context.sendText('最後一步了！想請問你的手機號碼是？')

}

const handleRegister = async(context) => {

    context.state.userInfo.phone = context.event.message.text
    context.state.userInfo.lineID = context.session.user.id
    console.log(context.state.userInfo)

    const record = await db.createMember(context.state.userInfo)
    console.log(record)


    await context.sendText('註冊完成囉～')
    await context.sendText('點擊社員資料即可修改或查看社員等級')
}



const memberHandler = async(context) => {
    if (context.state.flow_status === 'member_register_name') {
        handleMembername(context)
    } else if (context.state.flow_status === 'member_register_department') {
        handleDepartment(context)
    } else if (context.state.flow_status === 'member_register_phone') {
        handlePhone(context)
    } else if (context.state.flow_status === 'member_register_completed') {
        handleRegister(context)
    }

}

const member_detail_handler = async(context) => {
    const userInfo = context.state.userInfo
    let imageUrl = ''
    let infoText = '系級：' + userInfo.department + '\n' + '電話：' + userInfo.phone + '\n'
    if (context.state.userInfo.member_type === 'friend_of_club') {
        imageUrl = 'https://i.imgur.com/Vex26OT.jpg'
        infoText = infoText + '等級：' + '正言之友'
    } else if (context.state.userInfo.member_type === 'staff') {
        imageUrl = 'https://i.imgur.com/4YMlQ4X.jpg'
        infoText = infoText + '等級：' + '優秀幹部'
    } else if (context.state.userInfo.member_type === 'member') {
        imageUrl = 'https://i.imgur.com/iAjF1FV.jpg'
        infoText = infoText + '等級：' + '優質社員'
    }

    const template = {
        thumbnailImageUrl: imageUrl,
        mageBackgroundColor: '#FFFFFF',
        title: userInfo.name,
        text: infoText,
        actions: [{
            type: 'postback',
            label: '修改社員資訊',
            displayText: '修改社員資訊',
            data: 'alterMember',
        }, ]
    }

    const altText = '社員資訊';
    await context.sendButtonTemplate(altText, template);
}



//Update Member

const updateMembername = async(context) => {
    context.state.flow_status = 'member_update_department'
    await context.sendText('想換成什麼名字呢嘿嘿？')
}

const updateDepartment = async(context) => {
    context.state.userInfo.name = context.event.message.text
    context.state.flow_status = 'member_update_phone'
    let text = context.event.message.text + '你好呀～'
    await context.sendText(text)
    await context.sendText('你的學校系級是？(Ex.北科智動一)')

}

const updatePhone = async(context) => {
    context.state.userInfo.department = context.event.message.text
    context.state.flow_status = 'member_update_completed'

    await context.sendText('收到～')
    await context.sendText('最後一步了！想請問你的手機號碼是？')

}

const updateRecord = async(context) => {

    context.state.userInfo.phone = context.event.message.text
    context.state.userInfo.lineID = context.session.user.id
    console.log(context.state.userInfo)

    const record = await db.updateMember(context.state.userInfo)
    console.log(record)


    // await context.sendText('更新完成囉～')
    // await context.sendText('點擊社員資料即可修改或查看社員等級')
    await context.send([{
            type: 'text',
            text: '更新完成囉～',
        },
        {
            type: 'text',
            text: '點擊社員資料即可修改或查看社員等級',
        },
    ]);
}




const updateMember = async(context) => {
    if (context.state.flow_status === 'member_update_name') {
        updateMembername(context)
    } else if (context.state.flow_status === 'member_update_department') {
        updateDepartment(context)
    } else if (context.state.flow_status === 'member_update_phone') {
        updatePhone(context)
    } else if (context.state.flow_status === 'member_update_completed') {
        updateRecord(context)
    }
}


module.exports = { memberHandler: memberHandler, member_detail_handler: member_detail_handler, updateMember: updateMember }