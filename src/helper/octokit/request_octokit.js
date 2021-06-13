const octokit = require('../../core/octokit');
let requestOctokit = function () {
    let setLocation = function (place) {
        return place.replace(' ', '_').toLowerCase();
    }
    let setQuery = function (location) {
        let query = '';
        for (const place of location) {
            query = query + `location:${setLocation(place)} `;
        }
        return query;
    }
    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    const setDelay = function(timeout){
        console.log(`delay ${timeout} ms`)
        return new Promise(res => setTimeout(res, timeout));
    }
    let request = async function (AUTH_KEY,
                                  MAXIMUM_ITERATIONS,
                                  MAXIMUM_ERROR_ITERATIONS,
                                  location) {
        let hasNextPage = true;
        let cursor = null;
        let array = [];
        let iterations = 0;
        let errors = 0;
        for (; hasNextPage;) {
            let octokitResponseModel = await octokit.request(AUTH_KEY, setQuery(location), cursor);
            if(octokitResponseModel.status){
                hasNextPage = octokitResponseModel.pageInfo.hasNextPage;
                cursor = octokitResponseModel.pageInfo.endCursor;
                for(const userDataModel of octokitResponseModel.node){
                    console.log(userDataModel.login, userDataModel.followers)
                    array.push(userDataModel)
                }
                await setDelay(randomIntFromInterval(1000, 5000));
                iterations ++;
            } else {
                await setDelay(60000);
                errors ++;
            }
            if(iterations >= MAXIMUM_ITERATIONS || errors >= MAXIMUM_ERROR_ITERATIONS) hasNextPage = false;
        }
        return array;
    }
    return {
        request: request
    };
}();
module.exports = requestOctokit;