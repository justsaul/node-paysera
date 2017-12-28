const querystring = require('querystring');
const crypto = require('crypto');

class Paysera {
    constructor(projectId, projectPassword, acceptUrl, cancelUrl, callbackUrl, test) {
        this._projectId = projectId;
        this._projectPassword = projectPassword;
        this._acceptUrl = acceptUrl;
        this._cancelUrl = cancelUrl;
        this._callbackUrl = callbackUrl;
        this._test = test;
        this._payUrl = 'https://www.paysera.com/pay/';
    }

    getRequestUrl(data) {
        const encodedData = _request._encode(data, this._projectId, this._acceptUrl, 
                                             this._cancelUrl, this._callbackUrl, this._test);
        const sign = _request._sign(encodedData, this._projectPassword);
        return _request._composeUrl(encodedData, sign, this._payUrl);
    }

    /**
     * Form an object from paysera request that contains data and ss1.
     * you can take data and ss1 from paysera query by doing this: 
     *      {
     *          data: req.query.data, 
     *          ss1: req.query.ss1
     *      }
     * 
     * Passed object to getRequestData must look like this: 
     *      request {
     *          data,
     *          ss1,
     *          ss2
     *      }
     * 
     * @param {request.ss2} is optional, this module implemented only ss1
     */
    getRequestData(request) {
        if (_request._check(request, this._projectPassword)) {
            return _request._decode(request.data);         
        } else {
            return null;
        }
    }
}

const _request = {
    _encode(data, projectId, acceptUrl, cancelUrl, callbackUrl, test) {
        _request._appendValues(data, projectId, acceptUrl, cancelUrl, callbackUrl, test);
        const stringifiedData = querystring.stringify(data);
        const base64Data = new Buffer(stringifiedData).toString('base64');
        return base64Data.replace('/', '_').replace('+', '-');
    },
    
    _decode(encodedData) {
        const prettifiedData = encodedData.replace('_', '/').replace('-', '+');
        const decodedData = new Buffer(prettifiedData, 'base64').toString('ascii');
        return querystring.parse(decodedData);
    },

    _sign(data, projectPassword) {
        return crypto.createHash('md5').update(data + projectPassword).digest('hex');
    },

    _composeUrl(data, sign, payUrl) {
        return payUrl + '?data=' + data + '&sign=' + sign;
    },

    _check(request, projectPassword) {
        const realSs1 = _request._sign(request.data, projectPassword);
        return request.ss1 == realSs1;
    },
    
    _appendValues(data, projectId, acceptUrl, cancelUrl, callbackUrl, test) {
        data.projectid = projectId;
        data.accepturl = acceptUrl;
        data.cancelurl = cancelUrl;
        data.callbackurl = callbackUrl;
        if (test) {
            data.test = 1;
        }
    }
};

module.exports = Paysera; 