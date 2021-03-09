(function(global, G) {

  if (!G) throw new Error('Requires Google maps api');

  const gMap = {
    map: {},
    infoWindow: {},
    directionsService: {},
    directionsRenderer: {},
    placesService: {},
    marker: {},

    calcDistance(ori, dest) {
      // 避免後續數學公式計算錯誤
      if ((ori.lat == dest.lat) && (ori.lng == dest.lng)) {
        return 0;
      }

      const EARTH_RADIUS = 6378.137;

      const radLat1 = Math.PI * ori.lat / 180;
      const radLat2 = Math.PI * dest.lat / 180;
      const latDiff = radLat1 - radLat2;

      const radLng1 = Math.PI * ori.lng / 180;
      const radLng2 = Math.PI * dest.lng / 180;
      const lngDiff = radLng1 - radLng2;

      let distance = 2 * Math.asin(
        Math.sqrt(
          Math.pow(Math.sin(latDiff/2), 2) +
          Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(lngDiff/2), 2)
        )
      );

      distance *= EARTH_RADIUS;
      distance = Math.round(distance * 10) / 10; // 取小數後一位

      return distance;
    },
  };

  /* ------- map start ------- */
  // constructor
  gMap.map.Create = function(selector, options) {

    return new gMap.map.init(selector, options);

  };

  // the actual object is created while calling constructor
  gMap.map.init = function(selector, options) {

    const self = this;

    self.instance = new google.maps.Map(selector, options);

  };

  // prototype methods
  gMap.map.prototype = {

    getInstance() {

      return this.instance;

    },

    getCenter() {

      return this.instance.getCenter();

    },

    addListener(e, handler) {

      google.maps.event.addListener(this.instance, e, handler);

      return this;

    },

    setOptions(options) {

      this.instance.setOptions(options);

      return this;

    },

  };

  gMap.map.init.prototype = gMap.map.prototype;
  /* ------- map end ------- */



  /* ------- infoWindow start ------- */
  // constructor
  gMap.infoWindow.Create = function(options) {

    return new gMap.infoWindow.init(options);

  };

  // the actual object is created while calling constructor
  gMap.infoWindow.init = function(options) {

    const self = this;

    self.instance = new google.maps.InfoWindow(options);

  };

  // prototype methods
  gMap.infoWindow.prototype = {

    setContent(content) {

      this.instance.setContent(content);

      return this;

    },

    open(map, marker) {

      this.instance.open(map, marker);

      return this;

    },

  };

  gMap.infoWindow.init.prototype = gMap.infoWindow.prototype;
  /* ------- infoWindow end ------- */



  /* ------- directionsService start ------- */
  // constructor
  gMap.directionsService.Create = function() {

    return new gMap.directionsService.init();

  };

  // the actual object is created while calling constructor
  gMap.directionsService.init = function() {

    const self = this;

    self.instance = new google.maps.DirectionsService();

  };

  // prototype methods
  gMap.directionsService.prototype = {

    route(req, callback) {

      this.instance.route(req, callback);

      return this;

    },

  };

  gMap.directionsService.init.prototype = gMap.directionsService.prototype;
  /* ------- directionsService end ------- */



  /* ------- directionsRenderer start ------- */
  // constructor
  gMap.directionsRenderer.Create = function() {

    return new gMap.directionsRenderer.init();

  };

  // the actual object is created while calling constructor
  gMap.directionsRenderer.init = function() {

    const self = this;

    self.instance = new google.maps.DirectionsRenderer();

  };

  // prototype methods
  gMap.directionsRenderer.prototype = {

    setMap(map) {

      this.instance.setMap(map);

      return this;

    },

    clearDirections() {

      this.instance.set('directions', null);

      return this;

    },

    setDirections(directions) {

      this.instance.setDirections(directions);

      return this;

    },

  };

  gMap.directionsRenderer.init.prototype = gMap.directionsRenderer.prototype;
  /* ------- directionsRenderer end ------- */



  /* ------- placesService start ------- */
  // constructor
  gMap.placesService.Create = function(map) {

    return new gMap.placesService.init(map);

  };

  // the actual object is created while calling constructor
  gMap.placesService.init = function(map) {

    const self = this;

    self.instance = new google.maps.places.PlacesService(map);

  };

  // prototype methods
  gMap.placesService.prototype = {

    nearbySearch(req, callback) {

      this.instance.nearbySearch(req, callback);

      return this;

    },

  };

  gMap.placesService.init.prototype = gMap.placesService.prototype;
  /* ------- placesService end ------- */



  /* ------- marker start ------- */
  // constructor
  gMap.marker.Create = function(options) {

    return new gMap.marker.init(options);

  };

  // the actual object is created while calling constructor
  gMap.marker.init = function(options) {

    const self = this;

    self.instance = new google.maps.Marker(options);

  };

  // prototype methods
  gMap.marker.prototype = {

    getInstance() {

      return this.instance;

    },

    setMap(map) {

      this.instance.setMap(map);

      return this;

    },

    addListener(e, handler) {

      this.instance.addListener(e, handler);

      return this;

    },

  };

  gMap.marker.init.prototype = gMap.marker.prototype;
  /* ------- marker end ------- */

  // export to global
  global.gMap = gMap;

})(window, google || undefined)
