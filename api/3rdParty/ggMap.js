const request                                  = require('request-promise');
const { GOOGLE_API_URL, GOOGLE_API_API_KEY }   = process.env;
const LIMIT_NUM = 2; /** I limited because it's a demo and not real and 20km to much things **/

class ggMap {
  place() {
    return {
      result: [],
      count: 0,
      pageToken: null,
      reset() {
        this.result = [];
        this.count = 0;
      },
      initD(lat, lng, radius, type) {
        this.lat = lat;
        this.lng = lng;
        this.radius = radius;
        this.type = type;
        return this;
      },
      async callNear(lat, lng, radius, type, pageToken) {
        let uri = GOOGLE_API_URL + `place/nearbysearch/json?location=` + lat + ',' + lng + `&radius=` + radius + `&type=` + type + `&key=` + GOOGLE_API_API_KEY + `&pagetoken=`;
        if (pageToken) {
          uri = uri + pageToken;
        }
        console.log('============================= uri ===========================================');
        console.log(uri);
        console.log('============================= uri ===========================================');
        const options = {
          method: 'GET',
          uri,
          headers: {
            'Content-Type': 'application/json'
          }
        }
        const response = await request(options);
        return JSON.parse(response);
      },

      async searchNearBy() {
        console.log(' this ', this);
        const dt = await this.callNear(this.lat, this.lng, this.radius, this.type, this.pageToken);

        if (dt.status !== 'OK') {
          /** Re-calling **/
          return await this.searchNearBy();
        }

        if (dt.results) {
          console.log('SAVE DATA  ===> ', this.count, dt.results.length);
          this.result = [...dt.results, ...this.result];
        }

        if (dt.next_page_token) {
          this.pageToken = dt.next_page_token;
          this.count++;
          console.log('              this.count   ', this.count);
          if (this.count === LIMIT_NUM) {
            console.log('============================= DONE ===========================================');
            console.log('break done get data !!!! ', this.type);
            console.log('============================= DONE ===========================================');
            const data = this.result;
            this.reset();
            return data;
          }
          return await this.searchNearBy();
        }

        return this.result;
      },
      searchText() {

      }
    }
  };
};

module.exports = ggMap;