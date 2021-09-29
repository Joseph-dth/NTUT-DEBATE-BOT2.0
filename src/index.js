const { withProps } = require('bottender');
const _ = require('lodash')

const handleActivitiesFlow = require('./handlers/activities_handler');
const handleMemberFlow = require('./handlers/member_handler')

const db = require('./database/memberDb')



const verifyMember = async(lineID) => {
    let record = await db.getMemberData(lineID)
    console.log(record)
    if (record.length > 0) {
        return record[0]
    } else {
        return false
    }
}

async function Unknown(context) {
    await context.sendText('P.S. 我是專屬於你的機器小編，聽不懂個別的訊息(>﹏<)\n如果有任何想詢問的請聯絡我們IG或FB的真人小編喔～～');
}



const member_info_handler = async(context) => {

    let record = await verifyMember(context.session.user.id)
    console.log('record:', record)
    if (record) {
        context.state.userInfo = {
            name: record.fields.name,
            department: record.fields.department,
            phone: record.fields.phone,
            lineID: context.session.user.id,
            member_type: record.fields.member_type
        }
        handleMemberFlow.member_detail_handler(context)
    } else {
        if (context.state.flow_status === '') {
            context.state.flow_status = 'member_register_name'
        }
        handleMemberFlow.memberHandler(context)
    }

}

const alter_member_handler = async(context) => {
    if (context.state.flow_status === '') {
        context.state.flow_status = 'member_update_name'
    }

    handleMemberFlow.updateMember(context)


}

const activities_handler = async(context) => {
    handleActivitiesFlow(context)
}

async function App(context) {
    if (context.event.isPayload) {
        if (_.startsWith(context.event.postback.data, 'member_info')) {
            context.state.flow_status = ''
            return member_info_handler


        }

        if (_.startsWith(context.event.postback.data, 'activities')) {
            context.state.flow_status = ''
            return activities_handler
        }
        if (_.startsWith(context.event.postback.data, 'alterMember')) {
            return alter_member_handler
        }

    }


    if (context.event.isText) {
        if (_.startsWith(context.state.flow_status, 'member_register')) {
            return member_info_handler
        }

        if (_.startsWith(context.state.flow_status, 'member_update')) {
            return alter_member_handler
        }


    }



    // if (context.state.flow == 'member') {
    //     return withProps(SayHi, { name: process.env.LINE_ACCESS_TOKEN });
    // }
    return Unknown;
}


module.exports = App