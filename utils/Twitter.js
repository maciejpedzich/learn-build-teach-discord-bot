require('dotenv').config();
const Twitter = require('twitter');
const logger = require('../Logger');
var twitterClient = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
const axios = require('axios');

const sendTweet = async (status, imageUrl) => {
    if (!imageUrl) {
        await twitterClient.post('statuses/update', { status });
        logger.info('tweet sent', status);
        return;
    }
    const imageData = await getRemoteImageInB64(imageUrl);
    const media = await twitterClient.post('media/upload', {
        media_data: imageData,
    });

    var status = {
        status,
        media_ids: media.media_id_string,
    };
    await twitterClient.post('statuses/update', status);
    logger.info('Tweet sent', status);
};

const getRemoteImageInB64 = async (imageUrl) => {
    try {
        let image = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
        });
        let returnedB64 = Buffer.from(image.data).toString('base64');
        return returnedB64;
    } catch (err) {
        logger.error(err);
        return null;
    }
};

module.exports = { twitterClient, sendTweet };
