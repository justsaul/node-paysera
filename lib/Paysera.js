const payseraRequest = require('./util/payseraRequest');

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
        const encodedData = payseraRequest.encode(data, this._projectId, this._acceptUrl, 
                                             this._cancelUrl, this._callbackUrl, this._test);
        const sign = payseraRequest.sign(encodedData, this._projectPassword);
        return payseraRequest.composeUrl(encodedData, sign, this._payUrl);
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
     *      }
     * 
     * @param {request.ss2} is optional, this module implemented only ss1
     */
    getRequestData(request) {
        if (payseraRequest.check(request, this._projectPassword)) {
            return payseraRequest.decode(request.data);         
        } else {
            return null;
        }
    }
}

module.exports = Paysera; 