var Airtable = require('airtable');
const { reject } = require('lodash');

// var base = new Airtable({ apiKey: process.env.AIR_TABLE_KEY }).base('appvWmZ9TJlWoLfNc');
var base = new Airtable({ apiKey: 'keyn0kScq3m53ynDm' }).base('appvWmZ9TJlWoLfNc');

const _ = require('lodash')





const getMemberData = async(lineID) => {

    const filterOption = "{line_id} = '" + lineID + "'"
        // const filterOption = "{no} = '" + "friend_of_club" + "'"

    console.log(filterOption)
    return new Promise((resolve, reject) => {
        base('member').select({
            // Selecting the first 3 records in Grid view:
            maxRecords: 10,
            filterByFormula: filterOption,
            // filterByFormula: "NOT({no} = '')",

            view: "Grid view",
        }).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.

            records.forEach(function(record) {
                console.log('Retrieved', record.fields);
            });

            // To fetch the next page of records, call `fetchNextPage`.
            // If there are more records, `page` will get called again.
            // If there are no more records, `done` will get called.
            fetchNextPage();
            resolve(records)

        }, function done(err) {
            if (err) { console.error(err); return; }
        });

    })
}




const createMember = async(userInfo) => {
    return new Promise((resolve, reject) => {
        base('member').create([{
            "fields": {
                "name": userInfo.name,
                "phone": userInfo.phone,
                "department": userInfo.department,
                "line_id": userInfo.lineID,
                "member_type": "friend_of_club"
            }
        }], function(err, records) {
            if (err) {
                console.error(err);
                return;
            }
            records.forEach(function(record) {
                console.log(record.getId());
            });
            resolve(records[0]);
        });
    })
}

const updateMember = async(userInfo) => {
    const record = await getMemberData(userInfo.lineID)
    return new Promise((resolve, reject) => {
        base('member').update([{
            "id": record[0].getId(),
            "fields": {
                "name": userInfo.name,
                "phone": userInfo.phone,
                "department": userInfo.department,
            }
        }], function(err, records) {
            if (err) {
                console.error(err);
                return;
            }
            // records.forEach(function(record) {
            //   console.log(record.get('no'));
            // });
            resolve(records[0])
        });
    })
}

module.exports = {
    createMember: createMember,
    getMemberData: getMemberData,
    updateMember: updateMember
}