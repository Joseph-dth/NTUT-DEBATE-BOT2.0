var Airtable = require('airtable');
var base = new Airtable({ apiKey: process.env.AIR_TABLE_KEY }).base('appvWmZ9TJlWoLfNc');
const _ = require('lodash')



const getEventsData = async() => {
    return new Promise((resolve, reject) => {
        base('product').select({
            // Selecting the first 3 records in Grid view:
            maxRecords: 10,
            view: "Grid view"
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

const toColumn = record => {
    return {
        thumbnailImageUrl: record.fields.images[0].url,
        title: record.fields.name,
        text: record.fields.detail,
        actions: [{
            type: 'uri',
            label: record.fields.action_text,
            uri: record.fields.url,
        }, ],
    }
}



const activitiesHandler = async(context) => {
    let events = await getEventsData()
    let columns = _.map(events, toColumn)




    const altText = '近期活動';
    await context.sendCarouselTemplate(altText, columns);

}

module.exports = activitiesHandler