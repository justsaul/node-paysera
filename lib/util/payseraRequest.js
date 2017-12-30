const querystring = require('querystring');
const crypto = require('crypto');

module.exports = {
    encode(data, projectId, acceptUrl, cancelUrl, callbackUrl, test) {
        _appendValues(data, projectId, acceptUrl, cancelUrl, callbackUrl, test);
        const stringifiedData = querystring.stringify(data);
        const base64Data = new Buffer(stringifiedData).toString('base64');
        return base64Data.replace('/', '_').replace('+', '-');
    },

    decode(encodedData) {
        const prettifiedData = encodedData.replace('_', '/').replace('-', '+');
        const decodedData = new Buffer(prettifiedData, 'base64').toString('ascii');
        return querystring.parse(decodedData);
    },

    sign(data, projectPassword) {
        return crypto.createHash('md5').update(data + projectPassword).digest('hex');
    },

    composeUrl(data, sign, payUrl) {
        return payUrl + '?data=' + data + '&sign=' + sign;
    },

    check(request, projectPassword) {
        const realSs1 = this.sign(request.data, projectPassword);
        return request.ss1 == realSs1;
    }
};

function _appendValues(data, projectId, acceptUrl, cancelUrl, callbackUrl, test) {
    data.projectid = projectId;
    data.accepturl = acceptUrl;
    data.cancelurl = cancelUrl;
    data.callbackurl = callbackUrl;
    if (test) {
        data.test = 1;
    }
}