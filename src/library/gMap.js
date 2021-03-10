(function(global, G) {

  if (!G) throw new Error('Requires Google maps api');

  const gMap = {
    map: {},
    infoWindow: {},
    directionsService: {},
    directionsRenderer: {},
    placesService: {},
    marker: {},

    setLocation(defaultLocation) {
      if (navigator.geolocation) {
        return new Promise(resolve => {
          navigator.geolocation.getCurrentPosition(
            pos => {
              resolve({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              });
            },
            err => {
              // 使用者不允許時使用預設位置
              resolve(defaultLocation);
            }
          );
        });
      }

      // 使用預設位置
      return defaultLocation;
    },
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
    self.isHideBusiness = false;
    self.themeMode = 'day'; // 'day' || 'night'
    self.hideBusinessStyles = [{
      featureType: 'poi.business',
      stylers: [{
        visibility: 'off',
      }],
    }];
    self.nightModeStyles = [ // https://developers.google.com/maps/documentation/javascript/examples/style-array
      { elementType: 'geometry', stylers: [{color: '#242f3e'}] },
      { elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}] },
      { elementType: 'labels.text.fill', stylers: [{color: '#746855'}] },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{color: '#263c3f'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{color: '#6b9a76'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{color: '#38414e'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{color: '#212a37'}]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{color: '#9ca5b3'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{color: '#746855'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{color: '#1f2835'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{color: '#f3d19c'}]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{color: '#2f3948'}]
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{color: '#17263c'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{color: '#515c6d'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{color: '#17263c'}]
      }
    ];

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

    setType(type) {

      this.instance.setOptions({
        mapTypeId: type,
      });

      return this;

    },

    setThemeMode(mode) {

      const hideBusinessStyles = this.isHideBusiness ? this.hideBusinessStyles : [];
      const nightModeStyles = mode === 'night' ? this.nightModeStyles : [];

      this.themeMode = mode;
      this.instance.setOptions({
        styles: [ ...hideBusinessStyles, ...nightModeStyles],
      });

      return this;

    },

    hideBusiness(bool) {

      const hideBusinessStyles = bool ? this.hideBusinessStyles : [];
      const nightModeStyles = this.themeMode === 'night' ? this.nightModeStyles : [];

      this.isHideBusiness = bool;
      this.instance.setOptions({
        styles: [ ...hideBusinessStyles, ...nightModeStyles],
      });

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

    getPosition() {

      return this.instance.position;

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
